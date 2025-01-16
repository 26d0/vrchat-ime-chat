# VRChat-IME-Chat

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OSC](https://img.shields.io/badge/VRChat-OSC-green.svg)](https://docs.vrchat.com/docs/osc-overview)

VRChatで使える、IME（Input Method Editor）対応のフローティングチャットウィンドウを提供するPythonアプリケーションです。あらゆる言語でシームレスなテキスト入力が可能です。

## 📑 目次

- [主な機能](#主な機能)
- [インストール方法](#インストール方法)
- [使い方](#使い方)
- [開発者向け情報](#開発者向け情報)
- [トラブルシューティング](#トラブルシューティング)
- [ライセンス](#ライセンス)
- [コントリビューション](#コントリビューション)

## ✨ 主な機能

- 常に最前面に表示されるフローティングウィンドウ
- 多言語入力に対応した完全なIMEサポート（日本語、中国語、韓国語など）
- ダークモードインターフェース
- VRChatとのOSC連携
- キーボードショートカットによる素早い送信（Enterキー）
- Shift+Enterで複数行の入力が可能

## 🚀 インストール方法

1. Python 3.8以上がインストールされていることを確認してください
2. リポジトリをクローンします：
```shell
git clone https://github.com/26d0/vrchat-ime-chat
cd vrchat-ime-chat
```
3. Ryeを使用して依存関係をインストールします：
```shell
rye sync
```

### 📦 必要な依存パッケージ（Ryeで管理）

- **customtkinter** (>=5.2.2)
  - モダンなGUIインターフェースの実現に使用
- **python-osc** (>=1.9.3)
  - VRChatとのOSC通信に使用
- **nuitka** (>=2.5.9)
  - スタンドアロン実行ファイルのビルドに使用

## 💫 使い方

アプリケーションの起動：

```shell
rye run python src/main.py
```

起動すると、常に最前面に表示されるフローティングウィンドウが開きます。

### 🎮 基本操作

1. システムのIMEを使用して、任意の言語でメッセージを入力
2. 以下のいずれかの方法でVRChatにメッセージを送信：
   - Enterキーを押す
   - 「Send to VRChat」ボタンをクリック
3. 複数行の入力が必要な場合は、Shift+Enterを使用

※ VRChatとの通信はOSCプロトコルを使用し、localhost:9000で行われます。

## 👨‍💻 開発者向け情報

### 🔧 開発環境のセットアップ

1. Ryeをインストールしていない場合は、以下のコマンドでインストール：
```shell
curl -sSf https://rye-up.com/get | bash
```

2. Ryeでプロジェクト環境をセットアップ：
```shell
rye sync
```

### 📁 プロジェクト構成

```
vrchat-ime-chat/
├── src/
│   └── main.py        # メインアプリケーションコード
├── pyproject.toml     # プロジェクト設定
├── requirements.lock  # 本番環境の依存関係
└── requirements-dev.lock  # 開発環境の依存関係
```

### 🧪 テスト実行

Ryeを使用してテストを実行：

```shell
rye run test
```

### 📦 ビルド方法

Ryeスクリプトを通じてNuitkaを使用し、スタンドアロン実行ファイルを作成できます：

```shell
# 実行ファイルのビルド
rye run build

# ビルド成果物のクリーンアップ
rye run clean
```

#### ビルドの特徴

- Python環境不要のスタンドアロン実行ファイルを作成
- Windows環境ではコンソールウィンドウを非表示に設定
- 全ての依存関係を単一ファイルにパッケージング

## 📜 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能開発用のブランチを作成：
```shell
git checkout -b feature/amazing-feature
```
3. 変更をコミット：
```shell
git commit -m 'feat: 素晴らしい機能'
```
4. ブランチにプッシュ：
```shell
git push origin feature/amazing-feature
```
5. プルリクエストを作成

## ❓ トラブルシューティング

よくある問題と解決方法：

### VRChatにメッセージが送信されない
- ✅ VRChatのOSC設定が有効になっているか確認
- ✅ ファイアウォールでポート9000が開放されているか確認

### IMEが正しく動作しない
- ✅ システムのIME設定を確認
- ✅ 最新バージョンのアプリケーションを使用しているか確認

### ウィンドウが表示されない
- ✅ タスクマネージャーでプロセスが実行中か確認
- ✅ 他のウィンドウの裏に隠れていないか確認
