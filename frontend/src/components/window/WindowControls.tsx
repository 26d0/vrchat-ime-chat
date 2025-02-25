import { WindowMinimise, WindowMaximise, Quit } from "../../../wailsjs/runtime/runtime";
import { SettingsButton } from "../settings/SettingsDialog";

export function WindowControls() {
  return (
    <div className="fixed top-0 right-0 flex items-center h-8 bg-transparent titlebar-no-drag z-10">
      <div className="px-2">
        <SettingsButton />
      </div>
      <div className="flex items-center px-2 space-x-2">
        <button
          onClick={() => WindowMinimise()}
          className="p-1 hover:bg-gray-700 rounded"
          aria-label="Minimize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect width="10" height="1" x="1" y="5.5" fill="currentColor" />
          </svg>
        </button>
        {/* <button
          onClick={() => WindowMaximise()}
          className="p-1 hover:bg-gray-700 rounded"
          aria-label="Maximize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect width="10" height="10" x="1" y="1" fill="none" stroke="currentColor" />
          </svg>
        </button> */}
        <button
          onClick={() => Quit()}
          className="p-1 hover:bg-red-600 rounded"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M 2,2 L 10,10 M 10,2 L 2,10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}