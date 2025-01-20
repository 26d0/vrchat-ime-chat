#![windows_subsystem = "windows"]
use eframe::egui::{self, ViewportBuilder, FontFamily, FontDefinitions, FontData, Color32, Rounding, Stroke};
use std::sync::Arc;
use rosc::{OscMessage, OscPacket, OscType};
use std::net::UdpSocket;
use crossbeam_channel::{bounded, Sender};
use std::thread;

const LOGO_BYTES: &[u8] = include_bytes!("logo.png");

const VRCHAT_ADDRESS: &str = "127.0.0.1:9000"; // VRChatのデフォルトOSCポート

fn main() -> eframe::Result<()> {
    let mut options = eframe::NativeOptions::default();
    options.viewport = ViewportBuilder::default()
        .with_inner_size([400.0, 300.0])
        .with_min_inner_size([320.0, 200.0])
        .with_always_on_top()
        .with_decorations(true)
        .with_transparent(true);

    let logo_image = image::load_from_memory(LOGO_BYTES).unwrap().to_rgba8();
    let (width, height) = (logo_image.width(), logo_image.height());
    let pixels = logo_image.into_raw();
    options.icon_data = Some(Arc::new(egui::IconData {
        rgba: pixels,
        width,
        height,
    }));

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        std::process::Command::new(std::env::current_exe().unwrap())
            .creation_flags(winapi::um::winbase::CREATE_NO_WINDOW)
            .spawn()
            .ok();
    }

    let (tx, rx) = bounded::<String>(100);
    
    // OSC送信用スレッドの起動
    thread::spawn(move || {
        let socket = UdpSocket::bind("127.0.0.1:0").expect("Failed to bind UDP socket");
        
        while let Ok(message) = rx.recv() {
            let osc_msg = OscPacket::Message(OscMessage {
                addr: "/chatbox/input".to_string(),
                args: vec![
                    OscType::String(message),
                    OscType::Bool(true), // トリガーとして即座に送信
                ],
            });
            
            let packet = rosc::encoder::encode(&osc_msg).expect("Failed to encode OSC message");
            socket.send_to(&packet, VRCHAT_ADDRESS).expect("Failed to send OSC message");
        }
    });

    eframe::run_native(
        "VIC",
        options,
        Box::new(|cc| {
            // フォント設定
            let mut fonts = FontDefinitions::default();
            
            // Meiryo UIフォントを追加
            fonts.font_data.insert(
                "meiryo".to_owned(),
                FontData::from_static(include_bytes!("C:\\Windows\\Fonts\\meiryo.ttc")).into(),
            );

            // フォントファミリーにMeiryoを追加
            fonts.families
                .get_mut(&FontFamily::Proportional)
                .unwrap()
                .insert(0, "meiryo".to_owned());

            // スタイル設定
            let mut style = (*cc.egui_ctx.style()).clone();
            style.visuals.window_rounding = Rounding::same(10.0);
            style.visuals.widgets.noninteractive.rounding = Rounding::same(5.0);
            style.visuals.widgets.inactive.rounding = Rounding::same(5.0);
            style.visuals.widgets.active.rounding = Rounding::same(5.0);
            style.visuals.widgets.hovered.rounding = Rounding::same(5.0);

            let app = ChatApp::new(tx);
            let colors = &app.colors;

            // カラーテーマ
            style.visuals.override_text_color = Some(colors.text_color);
            style.visuals.widgets.noninteractive.bg_fill = colors.widget_bg;
            style.visuals.widgets.inactive.bg_fill = colors.widget_active_bg;
            style.visuals.window_fill = colors.window_bg;

            cc.egui_ctx.set_style(style);
            cc.egui_ctx.set_fonts(fonts);
            
            Ok(Box::new(app))
        }),
    )
}

#[derive(Clone)]
struct AppColors {
    text_color: Color32,
    widget_bg: Color32,
    widget_active_bg: Color32,
    window_bg: Color32,
    button_bg: Color32,
    button_hover_bg: Color32,
    button_active_bg: Color32,
    hint_text_color: Color32,
    char_count_color: Color32,
}

impl Default for AppColors {
    fn default() -> Self {
        Self {
            text_color: Color32::from_hex("#a9b1d6").unwrap_or(Color32::WHITE),
            widget_bg: Color32::from_hex("#F5F6FA").unwrap_or(Color32::DARK_GRAY),
            widget_active_bg: Color32::from_hex("#E8E9F3").unwrap_or(Color32::GRAY),
            window_bg: Color32::from_hex("#FFFFFF").unwrap_or(Color32::BLACK),
            button_bg: Color32::from_hex("#3498DB").unwrap_or(Color32::BLUE),
            button_hover_bg: Color32::from_hex("#2980B9").unwrap_or(Color32::LIGHT_BLUE),
            button_active_bg: Color32::from_hex("#2472A4").unwrap_or(Color32::DARK_BLUE),
            hint_text_color: Color32::from_hex("#95A5A6").unwrap_or(Color32::GRAY),
            char_count_color: Color32::from_hex("#BDC3C7").unwrap_or(Color32::LIGHT_GRAY),
        }
    }
}

struct ChatApp {
    input_text: String,
    tx: Sender<String>,
    should_send: bool,
    colors: AppColors,
}

impl ChatApp {
    fn new(tx: Sender<String>) -> Self {
        Self {
            input_text: String::new(),
            tx,
            should_send: false,
            colors: AppColors::default(),
        }
    }

    fn send_message(&mut self) {
        if !self.input_text.trim().is_empty() {
            if let Err(e) = self.tx.send(self.input_text.clone()) {
                eprintln!("Failed to send message: {}", e);
            }
            self.input_text.clear();
        }
    }
}

impl eframe::App for ChatApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        let bottom_panel_height = 60.0;
        const MAX_CHARS: usize = 144; // VRChatのチャットボックス制限

        // 中央パネル（入力フィールド用）
        egui::CentralPanel::default().show(ctx, |ui| {
            // 上部マージン
            ui.add_space(8.0);
            
            // 利用可能な高さから下部パネルとマージンを引く
            let available_height = ui.available_height() - bottom_panel_height - 16.0;
            
            // 入力フィールドを配置するコンテナ
            ui.allocate_ui_with_layout(
                egui::vec2(ui.available_width(), available_height),
                egui::Layout::top_down(egui::Align::Center),
                |ui| {
                    let text_edit = egui::TextEdit::multiline(&mut self.input_text)
                        .hint_text(egui::RichText::new("メッセージを入力...")
                            .color(self.colors.hint_text_color))
                        .text_color(self.colors.text_color)
                        .frame(true)
                        .margin(egui::vec2(8.0, 6.0))
                        .desired_width(ui.available_width() - 16.0);

                    let response = ui.add_sized(
                        [ui.available_width() - 16.0, available_height],
                        text_edit
                    );

                // Enterキー処理（Shift+Enterは改行）
                    if response.lost_focus() && ui.input(|i| i.key_pressed(egui::Key::Enter) && !i.modifiers.shift) {
                        self.should_send = true;
                    }
                }
            );

            // 文字数制限の適用
            if self.input_text.chars().count() > MAX_CHARS {
                self.input_text = self.input_text.chars().take(MAX_CHARS).collect();
            }
        });

        // 下部パネル（送信ボタンと文字数カウンター）
        egui::TopBottomPanel::bottom("bottom_panel").show(ctx, |ui| {
            ui.add_space(12.0);
            
            ui.horizontal(|ui| {
                ui.add_space(8.0);
                
                // 文字数カウンター
                let char_count = self.input_text.chars().count();
                ui.colored_label(
                    self.colors.char_count_color,
                    format!("{}/{}", char_count, MAX_CHARS)
                );
                
                ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                    ui.add_space(8.0);
                    
                    // 送信ボタン
                    let mut button_color = self.colors.button_bg;
                    let text_color = Color32::WHITE;
                    
                    // ボタンの作成と配置
                    let button = egui::Button::new(
                        egui::RichText::new("送信")
                            .size(14.0)
                            .color(text_color)
                    )
                    .fill(button_color)
                    .rounding(Rounding::same(4.0))
                    .stroke(Stroke::NONE);
                    
                    let response = ui.add_sized([90.0, 32.0], button);
                    
                    // クリック処理
                    if response.clicked() {
                        self.should_send = true;
                    }
                    
                    // ホバーとアクティブ状態の視覚的フィードバック
                    if response.is_pointer_button_down_on() {
                        button_color = self.colors.button_active_bg;
                    } else if response.hovered() {
                        button_color = self.colors.button_hover_bg;
                    }
                    
                    // 更新された色でボタンを再描画
                    ui.painter().rect_filled(
                        response.rect,
                        Rounding::same(4.0),
                        button_color
                    );
                    
                    // テキストを再描画
                    let text_pos = response.rect.center();
                    ui.painter().text(
                        text_pos,
                        egui::Align2::CENTER_CENTER,
                        "送信",
                        egui::FontId::new(14.0, egui::FontFamily::Proportional),
                        text_color
                    );
                });
            });
            
            ui.add_space(12.0);
        });

        // メッセージ送信の処理
        if self.should_send {
            self.send_message();
            self.should_send = false;
            
            // 送信後にフォーカスを入力フィールドに戻す
            ctx.request_repaint();
        }
    }
}
