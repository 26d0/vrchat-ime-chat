package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "vrchat-ime-chat",
		Width:  400,
		Height: 600,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 31, G: 31, B: 31, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WindowIsTranslucent:  false,
			WebviewIsTransparent: false,
			DisableWindowIcon:    true,
			Theme:                windows.Dark,
			CustomTheme: &windows.ThemeSettings{
				DarkModeTitleBar: 1,
			},
			DisableFramelessWindowDecorations: true,
		},
		AlwaysOnTop: true,
		Frameless:   true,
		MinWidth:    400,
		MinHeight:   600,
		MaxWidth:    400,
		MaxHeight:   600,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
