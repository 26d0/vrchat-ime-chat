# VRChat IME Chat

A lightweight desktop application that provides an improved chat interface for VRChat with IME (Input Method Editor) support, enabling seamless Japanese and other non-Latin text input.

## Features

- **Native IME Support**: Full support for Japanese, Korean, Chinese, and other IME-based input methods
- **Always On Top**: Chat window stays visible while playing VRChat
- **Message History**: Keeps track of your sent messages with search functionality
- **OSC Integration**: Sends messages directly to VRChat using the OSC (Open Sound Control) protocol
- **Modern UI**: Clean, responsive interface built with Svelte and Tailwind CSS
- **Persistent Storage**: Messages are saved locally and persist between sessions
- **Quick Search**: Fuzzy search through your message history
- **Lightweight**: Built with Tauri for minimal resource usage

## Requirements

- **Operating System**: Windows, macOS, or Linux
- **VRChat**: Must be running with OSC enabled (default port 9000)
- **Disk Space**: ~50MB for installation

## Installation

### Option 1: Download Release (Recommended)
1. Go to the [Releases](https://github.com/26d0/vrchat-ime-chat/releases) page
2. Download the appropriate installer for your operating system
3. Run the installer and follow the setup instructions

### Option 2: Build from Source
See the [Development](#development) section below.

## Usage

1. **Start VRChat**: Make sure VRChat is running
2. **Launch IME Chat**: Open the VRChat IME Chat application
3. **Enable OSC in VRChat** (if not already enabled):
   - In VRChat, go to Settings → OSC
   - Make sure OSC is enabled on port 9000
4. **Type your message**: Use the input field to type your message with full IME support
5. **Send**: Press Enter or click the send button to send your message to VRChat
6. **Search History**: Use the search function to find and reuse previous messages

## Development

This application is built using [Tauri](https://tauri.app/) with a Svelte frontend and Rust backend.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (latest stable)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites/)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/26d0/vrchat-ime-chat.git
   cd vrchat-ime-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run tauri dev
   ```

### Building

To create a production build:

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/`.

### Available Scripts

- `npm run dev` - Start Svelte development server
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run check` - Run TypeScript type checking
- `npm run tauri dev` - Run the full application in development mode
- `npm run tauri build` - Build the application for production

## Configuration

The application automatically stores your settings and message history locally. No manual configuration is required.

## OSC Protocol

The application communicates with VRChat using the OSC protocol on the `/chatbox/input` endpoint. Messages are sent to `127.0.0.1:9000` by default.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Tauri](https://tauri.app/) for the cross-platform desktop framework
- Uses [rosc](https://github.com/klingtnet/rosc) for OSC communication with VRChat
- UI powered by [Svelte](https://svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/)
