import { invoke } from '@tauri-apps/api/core';

export interface OscSendResult {
  success: boolean;
  message: string;
}

/**
 * Send a message to VRChat via OSC
 * @param text - The message text to send
 * @returns Promise<OscSendResult> - Result of the OSC send operation
 */
export async function sendOscMessage(text: string): Promise<OscSendResult> {
  try {
    const result = await invoke<OscSendResult>('send_osc_message', { text });
    return result;
  } catch (error) {
    console.error('Failed to send OSC message:', error);
    return {
      success: false,
      message: `Failed to send OSC message: ${error}`,
    };
  }
}
