"""VRChat OSC通信モジュール."""

from __future__ import annotations

from pythonosc import udp_client


class VRChatOSC:
    """VRChatとのOSC通信を管理するクラス."""

    def __init__(self, host: str = "127.0.0.1", port: int = 9000) -> None:
        """OSCクライアントを初期化する.

        Args:
            host: 接続先ホスト
            port: 接続先ポート
        """
        self.client = udp_client.SimpleUDPClient(host, port)

    def send_chat_message(self, message: str) -> None:
        """チャットメッセージを送信する.

        Args:
            message: 送信するメッセージ
        """
        if message:
            self.client.send_message("/chatbox/input", [message, True])
