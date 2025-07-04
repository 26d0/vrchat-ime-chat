use std::net::UdpSocket;
use tauri::command;
use rosc::{OscMessage, OscPacket, OscType};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct OscSendResult {
    success: bool,
    message: String,
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
    .invoke_handler(tauri::generate_handler![send_osc_message])
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
