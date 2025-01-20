# VRChat-IME-Chat

[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OSC](https://img.shields.io/badge/VRChat-OSC-green.svg)](https://docs.vrchat.com/docs/osc-overview)

VRChatで使える、IME（Input Method Editor）対応のフローティングチャットウィンドウを提供するPythonアプリケーションです。あらゆる言語でシームレスなテキスト入力が可能です。

## ✨ 主な機能

- 常に最前面に表示されるフローティングウィンドウ
- 多言語入力に対応した完全なIMEサポート（日本語、中国語、韓国語など）
- ダークモードインターフェース
- VRChatとのOSC連携
- キーボードショートカットによる素早い送信（Enterキー）
- Shift+Enterで複数行の入力が可能
- 設定ウィンドウでの詳細なカスタマイズ

## 🚀 インストール方法

1. uvをインストールしていない場合は、以下のコマンドでインストール：
```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. リポジトリをクローンします：
```shell
git clone https://github.com/26d0/vrchat-ime-chat
cd vrchat-ime-chat
```

3. 依存関係をインストールします：
```shell
uv venv
source .venv/bin/activate  # Linuxの場合
.venv\Scripts\activate     # Windowsの場合
uv sync
```

### 📦 必要な依存パッケージ

- **customtkinter** (>=5.2.2)
  - モダンなGUIインターフェースの実現に使用
- **python-osc** (>=1.9.3)
  - VRChatとのOSC通信に使用
- **pillow** (>=11.1.0)
  - 画像処理とアイコンの表示に使用
- **nuitka** (>=2.5.9)
  - スタンドアロン実行ファイルのビルドに使用

## 💫 使い方

アプリケーションの起動：

```shell
python src/main.py
```

起動すると、常に最前面に表示されるフローティングウィンドウが開きます。

### 🎮 基本操作

1. システムのIMEを使用して、任意の言語でメッセージを入力
2. 以下のいずれかの方法でVRChatにメッセージを送信：
   - Enterキーを押す
   - 「Send to VRChat」ボタンをクリック
3. 複数行の入力が必要な場合は、Shift+Enterを使用
4. 設定アイコンをクリックして、フォントサイズやウィンドウの透明度などをカスタマイズ

※ VRChatとの通信はOSCプロトコルを使用し、localhost:9000で行われます。

## 📁 プロジェクト構成

```
vrchat-ime-chat/
├── src/
│   ├── main.py           # メインアプリケーションコード
│   ├── osc_client.py     # OSC通信処理
│   ├── settings.py       # 設定管理
│   ├── settings_window.py # 設定ウィンドウUI
│   ├── logo.ico         # アプリケーションアイコン
│   └── logo.png         # ロゴ画像
├── pyproject.toml        # プロジェクト設定
├── Taskfile.yaml        # ビルドタスク定義
├── requirements.lock     # 本番環境の依存関係
└── README.md            # プロジェクトドキュメント
```

## 📦 ビルド方法
```shell
uv run task make
```

### ビルドの特徴

- Python環境不要のスタンドアロン実行ファイルを作成
- Windows環境ではコンソールウィンドウを非表示に設定
- 全ての依存関係を単一ファイルにパッケージング
- カスタムアイコンを使用したWindows実行ファイル

## ❓ トラブルシューティング

よくある問題と解決方法：

### VRChatにメッセージが送信されない
- ✅ VRChatのOSC設定が有効になっているか確認
- ✅ ファイアウォールでポート9000が開放されているか確認
- ✅ VRChatが起動しているか確認

### IMEが正しく動作しない
- ✅ システムのIME設定を確認
- ✅ 最新バージョンのアプリケーションを使用しているか確認
- ✅ 他のアプリケーションでIMEが正常に動作するか確認

### 設定が保存されない
- ✅ アプリケーションが書き込み権限を持つディレクトリで実行されているか確認
- ✅ 設定ファイルが破損していないか確認

## 📜 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。
