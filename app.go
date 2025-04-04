package main

import (
	"context"
	"net"
	"strings"
	"time"
	"unsafe"

	"github.com/hypebeast/go-osc/osc"
	"golang.org/x/sys/windows"
)

// App struct
type App struct {
	ctx    context.Context
	client *osc.Client
}

// SendResponse represents the response from SendChatMessage
type SendResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		// VRChat uses port 9000 for OSC by default
		client: osc.NewClient("127.0.0.1", 9000),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// isVRChatProcessRunning checks if VRChat.exe is running
func (a *App) isVRChatProcessRunning() bool {
	h, err := windows.CreateToolhelp32Snapshot(windows.TH32CS_SNAPPROCESS, 0)
	if err != nil {
		return false
	}
	defer windows.CloseHandle(h)

	var entry windows.ProcessEntry32
	entry.Size = uint32(unsafe.Sizeof(entry))

	// Get first process
	err = windows.Process32First(h, &entry)
	if err != nil {
		return false
	}

	for {
		if strings.EqualFold(windows.UTF16ToString(entry.ExeFile[:]), "VRChat.exe") {
			return true
		}

		err = windows.Process32Next(h, &entry)
		if err != nil {
			return false
		}
	}
}

// checkVRChatConnection attempts to check if VRChat is listening
func (a *App) checkVRChatConnection() bool {
	// First check if VRChat process is running
	if !a.isVRChatProcessRunning() {
		return false
	}

	// Then check if the OSC port is accessible
	conn, err := net.DialTimeout("udp", "127.0.0.1:9000", 100*time.Millisecond)
	if err != nil {
		return false
	}
	conn.Close()
	return true
}

// IsVRChatRunning checks if VRChat is running and listening on OSC port
func (a *App) IsVRChatRunning() bool {
	return a.checkVRChatConnection()
}

// SendTypingStatus sends a typing indicator status to VRChat via OSC
func (a *App) SendTypingStatus(isTyping bool) SendResponse {
	// First check if VRChat is running and listening
	if !a.checkVRChatConnection() {
		return SendResponse{
			Success: false,
			Error:   "VRChat is not running or not listening on port 9000",
		}
	}

	// Send typing status
	msg := osc.NewMessage("/chatbox/typing")
	msg.Append(isTyping)

	// Try sending up to 3 times
	for i := 0; i < 3; i++ {
		if err := a.client.Send(msg); err != nil {
			if i == 2 {
				return SendResponse{
					Success: false,
					Error:   "Failed to send typing status: " + err.Error(),
				}
			}
			continue
		}
		// Successfully sent typing status
		return SendResponse{
			Success: true,
		}
	}

	// This shouldn't be reached due to the loop above, but added for completeness
	return SendResponse{
		Success: false,
		Error:   "Failed to send typing status after 3 attempts",
	}
}

// SendChatMessage sends a chat message to VRChat via OSC and confirms it was sent
func (a *App) SendChatMessage(message string) SendResponse {
	// First check if VRChat is running and listening
	if !a.checkVRChatConnection() {
		return SendResponse{
			Success: false,
			Message: message,
			Error:   "VRChat is not running or not listening on port 9000",
		}
	}

	// First send sync message to ensure clean state
	syncMsg := osc.NewMessage("/chatbox/input")
	syncMsg.Append("")
	syncMsg.Append(true)
	if err := a.client.Send(syncMsg); err != nil {
		return SendResponse{
			Success: false,
			Message: message,
			Error:   "Failed to sync chatbox: " + err.Error(),
		}
	}

	// Send actual message
	msg := osc.NewMessage("/chatbox/input")
	msg.Append(message)
	msg.Append(true)

	// Clear typing indicator
	a.SendTypingStatus(false)

	// Try sending up to 3 times
	for i := 0; i < 3; i++ {
		if err := a.client.Send(msg); err != nil {
			if i == 2 {
				return SendResponse{
					Success: false,
					Message: message,
					Error:   "Failed to send message: " + err.Error(),
				}
			}
			continue
		}
		// Successfully sent message
		return SendResponse{
			Success: true,
			Message: message,
		}
	}

	// This shouldn't be reached due to the loop above, but added for completeness
	return SendResponse{
		Success: false,
		Message: message,
		Error:   "Failed to send message after 3 attempts",
	}
}
