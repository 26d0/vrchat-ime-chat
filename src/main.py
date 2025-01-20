"""VRChat用のIME対応フローティングチャットウィンドウ."""

from __future__ import annotations

import platform
import signal
import sys
import types
from pathlib import Path
from tkinter import Event
from typing import NoReturn

import customtkinter as ctk
from PIL import Image
from PIL import ImageTk

from osc_client import VRChatOSC
from settings import Settings
from settings_window import SettingsWindow


class VRChatIME(ctk.CTk):
    """VRChatのチャットボックスにテキストを送信するためのGUIアプリケーション."""

    def __init__(self) -> None:
        """アプリケーションの初期化とGUI要素のセットアップを行う."""
        super().__init__()
        self.title("VRChat IME")

        # コンポーネントの初期化
        self.settings = Settings()
        self.settings_window = None
        self.osc_client = VRChatOSC()

        # テーマを適用
        ctk.set_appearance_mode(self.settings.config["theme"])

        self.setup_window()
        self.setup_ui()

    def setup_window(self) -> None:
        """ウィンドウの基本設定を行う."""
        self.attributes("-topmost", True)
        self.geometry("400x180")
        self.configure(fg_color=("gray95", "gray10"))

        # ウィンドウアイコンを設定
        try:
            logo_png = Path(__file__).parent / "logo.png"
            logo_ico = Path(__file__).parent / "logo.ico"

            base_path = getattr(sys, '_MEIPASS', str(Path(__file__).parent))
            logo_png = Path(base_path) / "logo.png"
            logo_ico = Path(base_path) / "logo.ico"

            if platform.system() == "Windows":
                # Windows環境ではicoファイルを使用
                if not logo_ico.exists() and logo_png.exists():
                    # PNGからICOを生成（複数サイズ対応）
                    img = Image.open(str(logo_png))
                    # Windowsでよく使用されるサイズを全て含める（小さい順）
                    sizes = [
                        (16, 16), (24, 24), (32, 32),
                        (48, 48), (64, 64), (128, 128),
                        (256, 256)
                    ]
                    icons = []
                    for size in sizes:
                        scaled_img = img.resize(size, Image.Resampling.LANCZOS)
                        icons.append(scaled_img)
                    icons[0].save(
                        str(logo_ico),
                        format="ICO",
                        append_images=icons[1:],
                        sizes=sizes,
                        quality=95,
                        optimize=True
                    )

                # 実行ファイル化時とソースコード実行時の両方に対応
                try:
                    if logo_ico.exists():
                        self.iconbitmap(str(logo_ico))
                    elif logo_png.exists():
                        # icoファイルが見つからない場合はPNGから直接設定
                        icon_image = Image.open(str(logo_png))
                        icon_photo = ImageTk.PhotoImage(icon_image)
                        self.wm_iconphoto(True, icon_photo)
                        self._icon_photo = icon_photo
                except Exception as e:
                    print(f"Windowsアイコン設定エラー: {e}")
            else:
                # その他の環境ではPNGを直接使用
                try:
                    if logo_png.exists():
                        icon_image = Image.open(str(logo_png))
                        icon_photo = ImageTk.PhotoImage(icon_image)
                        self.wm_iconphoto(True, icon_photo)
                        self._icon_photo = icon_photo
                except Exception as e:
                    print(f"アイコン設定エラー: {e}")
        except Exception as e:
            print(f"アイコンの設定に失敗しました: {e}")

        # 終了時の処理を設定
        self.protocol("WM_DELETE_WINDOW", self.on_closing)
        signal.signal(signal.SIGINT, self.signal_handler)

    def setup_ui(self) -> None:
        """UIコンポーネントをセットアップする."""
        # メインのテキスト入力エリア
        self.text_input = ctk.CTkTextbox(
            self,
            height=120,
            font=("Yu Gothic UI", 14),
            border_width=1,
            border_color=("gray70", "gray30"),
            fg_color=("white", "gray13"),
        )
        self.text_input.pack(padx=12, pady=(12, 8), fill="x")
        self.text_input.bind("<Return>", self.on_enter)

        # ボタンを配置するフレーム
        button_frame = ctk.CTkFrame(self, fg_color="transparent")
        button_frame.pack(padx=12, pady=(0, 12), fill="x")

        # 送信ボタン
        self.send_button = ctk.CTkButton(
            button_frame,
            text="送信",
            command=self.send_message,
            height=32,
            font=("Yu Gothic UI", 13),
            corner_radius=6,
        )
        self.send_button.pack(side="left", padx=(0, 6), fill="x", expand=True)

        # 設定ボタン
        self.settings_button = ctk.CTkButton(
            button_frame,
            text="設定",
            command=self.show_settings,
            width=60,
            height=32,
            corner_radius=6,
            fg_color=("gray55", "gray25"),  # ライトモードの色を暗めに変更
            hover_color=("gray45", "gray35"),  # ホバー時の色も調整
            font=("Yu Gothic UI", 13),
            text_color=("white", "white"),  # テキストを常に白に
        )
        self.settings_button.pack(side="right")

    def show_settings(self) -> None:
        """設定ダイアログを表示する."""
        if self.settings_window is not None and self.settings_window.winfo_exists():
            self.settings_window.focus_force()
            return

        self.settings_window = SettingsWindow(
            self,
            self.settings.config,
            self.change_theme,
            self.on_settings_close
        )

    def on_settings_close(self) -> None:
        """設定ウィンドウが閉じられた時の処理."""
        self.settings_window = None

    def change_theme(self, theme: str) -> None:
        """テーマを変更する.

        Args:
            theme: 設定するテーマ（"dark" または "light"）
        """
        if theme == self.settings.config["theme"]:
            return

        self.settings.config["theme"] = theme
        ctk.set_appearance_mode(theme)
        self.settings.save_config(self.settings.config)

    def on_closing(self) -> NoReturn:
        """ウィンドウの×ボタンやAlt+F4での終了処理を行う."""
        print("VRChat IME Toolを終了します。")
        self.quit()
        sys.exit(0)

    def signal_handler(self, sig: int, frame: types.FrameType | None) -> NoReturn:
        """Ctrl+Cでの終了処理を行う."""
        print("\nプログラムを終了します。")
        self.quit()
        sys.exit(0)

    def send_message(self) -> None:
        """テキストボックスの内容をVRChatのチャットボックスに送信する."""
        message = self.text_input.get("1.0", "end-1c")
        self.osc_client.send_chat_message(message)
        self.text_input.delete("1.0", "end")

    def on_enter(self, event: Event) -> str | None:
        """Enterキーが押された時のイベントハンドラ.

        Args:
            event: キーボードイベント

        Returns:
            str | None: "break"を返して通常の改行を防ぐ、またはNone
        """
        if not event.state & 0x1:  # Shiftが押されてないとき
            self.send_message()
            return "break"  # 通常の改行を防ぐ
        return None

if __name__ == "__main__":
    app = VRChatIME()
    app.mainloop()
