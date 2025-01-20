"""VRChat用のIME対応フローティングチャットウィンドウ."""

from __future__ import annotations

import signal
import sys
import types
from tkinter import Event
from typing import NoReturn

import customtkinter as ctk
from pythonosc import udp_client


class VRChatIME(ctk.CTk):
    """VRChatのチャットボックスにテキストを送信するためのGUIアプリケーション."""

    def __init__(self) -> None:
        """アプリケーションの初期化とGUI要素のセットアップを行う."""
        super().__init__()
        self.title("VRChat IME Tool")
        ctk.set_appearance_mode("dark")
        self.attributes("-topmost", True)
        self.geometry("400x200")

        # 終了時の処理を設定
        self.protocol("WM_DELETE_WINDOW", self.on_closing)
        signal.signal(signal.SIGINT, self.signal_handler)

        self.osc_client = udp_client.SimpleUDPClient("127.0.0.1", 9000)

        self.text_input = ctk.CTkTextbox(self, height=140, font=("Yu Gothic UI", 14))
        self.text_input.pack(padx=10, pady=10, fill="x")
        self.text_input.bind("<Return>", self.on_enter)

        self.send_button = ctk.CTkButton(
            self, text="Send to VRChat", command=self.send_message, height=35
        )
        self.send_button.pack(padx=10, pady=5)

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
        if message:
            self.osc_client.send_message("/chatbox/input", [message, True])
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
