"""VRChat IME の設定管理モジュール."""

from __future__ import annotations
import json
from pathlib import Path
from typing import Literal, TypedDict


class ConfigDict(TypedDict):
    """設定の型定義."""
    theme: Literal["dark", "light"]
    window_position: list[int] | None


class Settings:
    """アプリケーション設定の管理クラス."""

    CONFIG_PATH = Path.home() / ".vrchat_ime_config.json"
    DEFAULT_CONFIG: ConfigDict = {
        "theme": "dark",
        "window_position": None,
    }

    def __init__(self) -> None:
        """設定を初期化する."""
        self.config = self.load_config()

    def load_config(self) -> ConfigDict:
        """設定ファイルを読み込む.
        
        Returns:
            ConfigDict: 読み込んだ設定
        """
        try:
            if self.CONFIG_PATH.exists():
                with open(self.CONFIG_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
            else:
                self.save_config(self.DEFAULT_CONFIG)
                return self.DEFAULT_CONFIG.copy()
        except Exception as e:
            print(f"設定の読み込みに失敗しました: {e}")
            return self.DEFAULT_CONFIG.copy()

    def save_config(self, config: ConfigDict) -> None:
        """設定をファイルに保存する.
        
        Args:
            config: 保存する設定
        """
        try:
            with open(self.CONFIG_PATH, "w", encoding="utf-8") as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            self.config = config
        except Exception as e:
            print(f"設定の保存に失敗しました: {e}")