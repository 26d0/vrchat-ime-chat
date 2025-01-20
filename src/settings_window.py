"""設定ウィンドウモジュール."""

from __future__ import annotations
from typing import TYPE_CHECKING, Callable, Literal

import customtkinter as ctk

if TYPE_CHECKING:
    from settings import ConfigDict

THEMES = Literal["dark", "light"]

class SettingsWindow(ctk.CTkToplevel):
    """設定ウィンドウクラス."""

    def __init__(
        self,
        parent: ctk.CTk,
        current_config: ConfigDict,
        on_theme_change: Callable[[THEMES], None],
        on_close: Callable[[], None],
    ) -> None:
        """設定ウィンドウを初期化する.
        
        Args:
            parent: 親ウィンドウ
            current_config: 現在の設定
            on_theme_change: テーマ変更時のコールバック
            on_close: ウィンドウを閉じる時のコールバック
        """
        super().__init__(parent)
        self.title("設定")
        self.geometry("280x180")  # 高さを180pxに増やす
        self.resizable(False, False)
        self.transient(parent)
        self.current_config = current_config
        self.on_theme_change = on_theme_change
        self.on_close = on_close
        self._selected_theme = current_config["theme"]
        
        # 必要なUIが構築されるまで少し待つ
        self.after(100, lambda: self._setup_window())

    def _setup_window(self) -> None:
        """ウィンドウのUIをセットアップする."""
        self.configure(fg_color=("gray95", "gray10"))
        self.protocol("WM_DELETE_WINDOW", self._on_close)
        self.grab_set()

        # メインフレーム
        main_frame = ctk.CTkFrame(self, fg_color="transparent")
        main_frame.pack(padx=16, pady=16, fill="both", expand=True)

        # テーマ選択セクション
        theme_label = ctk.CTkLabel(
            main_frame,
            text="アプリケーションテーマ",
            font=("Yu Gothic UI", 13, "bold"),
            anchor="w"
        )
        theme_label.pack(fill="x", pady=(0, 8))

        # ラジオボタンを配置するフレーム
        radio_frame = ctk.CTkFrame(main_frame, fg_color="transparent")
        radio_frame.pack(fill="x", pady=(0, 16))  # 下部の余白を増やす

        theme_var = ctk.StringVar(value=self.current_config["theme"])
        
        # テーマ選択ラジオボタン
        for theme, label in [("light", "ライト"), ("dark", "ダーク")]:
            radio = ctk.CTkRadioButton(
                radio_frame,
                text=label,
                variable=theme_var,
                value=theme,
                command=lambda t=theme: self._on_theme_select(t),
                font=("Yu Gothic UI", 13),
            )
            radio.pack(anchor="w", pady=(0, 4))

        # OKボタンを追加
        ok_button = ctk.CTkButton(
            main_frame,
            text="OK",
            command=self._on_ok,
            width=100,  # 幅を広げる
            height=32,
            corner_radius=6,
            font=("Yu Gothic UI", 13),
            fg_color=("gray55", "gray25"),  # メインの設定ボタンと同じスタイル
            hover_color=("gray45", "gray35"),
            text_color=("white", "white"),
        )
        ok_button.pack(pady=(0, 0))

    def _on_theme_select(self, theme: THEMES) -> None:
        """テーマが選択された時の処理.
        
        Args:
            theme: 選択されたテーマ
        """
        self._selected_theme = theme

    def _on_ok(self) -> None:
        """OKボタンが押された時の処理."""
        if self._selected_theme != self.current_config["theme"]:
            self.grab_release()
            self.destroy()
            self.after(100, lambda: self.on_theme_change(self._selected_theme))
            self.after(200, self.on_close)
        else:
            self._on_close()

    def _on_close(self) -> None:
        """ウィンドウが閉じられたときの処理."""
        self.grab_release()
        self.destroy()
        self.on_close()