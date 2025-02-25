# VRChat IME Chat

A lightweight, always-on-top chat application that allows sending messages to VRChat using the OSC protocol.

![VRChat IME Chat](build/appicon.png)

## Features

- **Lightweight Chat Interface**: Simple, focused UI for typing and sending messages to VRChat
- **Always On Top**: Window stays above other applications for easy access while in VRChat
- **Message History**: Recall and reuse previously sent messages
- **Character Counter**: Ensures messages stay within VRChat's 144 character limit
- **VRChat Connection Status**: Shows whether VRChat is running and ready to receive messages
- **Customizable Send Shortcuts**: Configure keyboard shortcuts for sending messages
- **Multilingual Support**: Available in English, Japanese, and "Kipper" languages
- **Appearance Customization**: Adjustable theme and font size settings
- **Frameless Design**: Modern, minimal UI with custom window controls

## Requirements

- Windows OS
- VRChat must be running with OSC enabled (enabled by default on port 9000)

## Installation

1. Download the latest release from the [releases page](https://github.com/yourusername/vrchat-ime-chat/releases)
2. Run the installer and follow the instructions
3. Start VRChat IME Chat from the Start Menu or desktop shortcut

## Usage

1. Make sure VRChat is running
2. Type your message in the input field
3. Press Enter or your configured send shortcut to send the message to VRChat
4. The message will appear in your VRChat chatbox

## Development

This application is built using [Wails](https://wails.io/) (Go + React).

### Prerequisites

- [Go 1.18+](https://golang.org/dl/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Wails CLI](https://wails.io/docs/getting-started/installation)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vrchat-ime-chat.git
   cd vrchat-ime-chat
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

3. Run in development mode:
   ```bash
   wails dev
   ```

### Building

To build a production version:

```bash
wails build
```

## Configuration

The application stores user settings locally, including:
- Message history
- UI theme preference
- Font size
- Custom send shortcuts
- Language preference

## License

[Your chosen license]

## Acknowledgments

- Built with [Wails](https://wails.io/)
- Uses [go-osc](https://github.com/hypebeast/go-osc) for OSC communication with VRChat
