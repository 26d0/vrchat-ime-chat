# VRChat IME Chat

A Python application that provides a floating chat window with IME (Input Method Editor) support for VRChat, allowing seamless input of text in any language.

## Description

This project provides an enhanced chat interface for VRChat with the following features:
- Floating window that stays on top of other windows
- Full IME support for typing in any language (Japanese, Chinese, Korean, etc.)
- Dark mode interface
- OSC integration with VRChat
- Keyboard shortcuts for quick sending (Enter key)
- Shift+Enter for multiline input

## Installation

1. Ensure you have Python 3.8 or higher installed on your system
2. Clone this repository:
```bash
git clone https://github.com/yourusername/vrchat-ime-chat.git
cd vrchat-ime-chat
```
3. Install dependencies using Rye:
```bash
rye sync
```

Required dependencies (managed by Rye):
- customtkinter (>=5.2.2): For the modern GUI interface
- python-osc (>=1.9.3): For VRChat OSC communication
- nuitka (>=2.5.9): For building standalone executables

## Usage

Run the application:

```bash
rye run python src/main.py
```

The application will open a floating window that stays on top of other windows. To use:

1. Type your message in any language using your system's IME
2. Send the message to VRChat either by:
   - Pressing Enter
   - Clicking the "Send to VRChat" button
3. Use Shift+Enter for multiline input

The application communicates with VRChat using OSC protocol on localhost:9000.

## Development

### Setup Development Environment

1. Install Rye if you haven't already:
```bash
curl -sSf https://rye-up.com/get | bash
```

2. Let Rye set up the project environment:
```bash
rye sync
```

### Project Structure

- `src/main.py`: Main application code implementing the GUI and VRChat OSC communication
- `pyproject.toml`: Python project configuration
- `requirements.lock`: Locked production dependencies
- `requirements-dev.lock`: Locked development dependencies

## Testing

Tests can be run through Rye:

```bash
rye run test
```

## Building

The project can be built into a standalone executable using Nuitka through Rye scripts:

```bash
# Build the executable
rye run build

# Clean build artifacts
rye run clean
```

This will create a single executable file in the `build` directory. The build process:
- Creates a standalone executable that doesn't require Python installation
- Disables console window on Windows
- Packages all dependencies into a single file

## License

[Add your license information here]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
