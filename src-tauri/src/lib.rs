use std::net::UdpSocket;
use tauri::command;
use rosc::{OscMessage, OscPacket, OscType};
use serde::{Deserialize, Serialize};
use fuzzy_matcher::FuzzyMatcher;
use fuzzy_matcher::skim::SkimMatcherV2;

#[derive(Debug, Serialize, Deserialize)]
pub struct OscSendResult {
    success: bool,
    message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatMessage {
    text: String,
    timestamp: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResult {
    messages: Vec<ChatMessage>,
    query: String,
    total_count: usize,
    has_more: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedResult {
    messages: Vec<ChatMessage>,
    total_count: usize,
    has_more: bool,
    page: usize,
    page_size: usize,
}

#[command]
async fn search_messages(messages: Vec<ChatMessage>, query: String, page: Option<usize>, page_size: Option<usize>) -> Result<SearchResult, String> {
    let page = page.unwrap_or(0);
    let page_size = page_size.unwrap_or(50); // Default page size
    
    if query.trim().is_empty() {
        let total_count = messages.len();
        let start = page * page_size;
        let end = std::cmp::min(start + page_size, total_count);
        
        let paginated_messages = if start < total_count {
            messages[start..end].to_vec()
        } else {
            Vec::new()
        };
        
        return Ok(SearchResult {
            messages: paginated_messages,
            query,
            total_count,
            has_more: end < total_count,
        });
    }

    let matcher = SkimMatcherV2::default();
    let mut scored_messages: Vec<(ChatMessage, i64)> = messages
        .into_iter()
        .filter_map(|msg| {
            // Try fuzzy matching on the message text
            if let Some(score) = matcher.fuzzy_match(&msg.text, &query) {
                Some((msg, score))
            } else {
                None
            }
        })
        .collect();

    // Sort by score (higher is better)
    scored_messages.sort_by(|a, b| b.1.cmp(&a.1));

    let total_count = scored_messages.len();
    let start = page * page_size;
    let end = std::cmp::min(start + page_size, total_count);
    
    // Extract messages only, keeping the sorted order
    let filtered_messages: Vec<ChatMessage> = if start < total_count {
        scored_messages[start..end]
            .iter()
            .map(|(msg, _)| msg.clone())
            .collect()
    } else {
        Vec::new()
    };

    Ok(SearchResult {
        messages: filtered_messages,
        query,
        total_count,
        has_more: end < total_count,
    })
}

#[command]
async fn get_messages_paginated(messages: Vec<ChatMessage>, page: usize, page_size: usize) -> Result<PaginatedResult, String> {
    let total_count = messages.len();
    let start = page * page_size;
    let end = std::cmp::min(start + page_size, total_count);
    
    let paginated_messages = if start < total_count {
        messages[start..end].to_vec()
    } else {
        Vec::new()
    };
    
    Ok(PaginatedResult {
        messages: paginated_messages,
        total_count,
        has_more: end < total_count,
        page,
        page_size,
    })
}

#[command]
async fn send_osc_message(text: String) -> Result<OscSendResult, String> {
    let socket = UdpSocket::bind("127.0.0.1:0").map_err(|e| e.to_string())?;
    
    // VRChat's default OSC port is 9000
    let vrchat_addr = "127.0.0.1:9000";
    
    // Create OSC message for VRChat chatbox
    let osc_msg = OscMessage {
        addr: "/chatbox/input".to_string(),
        args: vec![
            OscType::String(text.clone()),
            OscType::Bool(true), // Send immediately
        ],
    };
    
    let packet = OscPacket::Message(osc_msg);
    let encoded = rosc::encoder::encode(&packet).map_err(|e| e.to_string())?;
    
    match socket.send_to(&encoded, vrchat_addr) {
        Ok(_) => {
            log::info!("OSC message sent successfully: {}", text);
            Ok(OscSendResult {
                success: true,
                message: format!("Message sent to VRChat: {}", text),
            })
        }
        Err(e) => {
            log::error!("Failed to send OSC message: {}", e);
            Err(format!("Failed to send OSC message: {}", e))
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![send_osc_message, search_messages, get_messages_paginated])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
