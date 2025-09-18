// A standard structure for Server Action return values
export type ActionResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// Shared type for a chat message
export interface Message {
  sender: "system" | "you";
  text: string;
}

/**
 * Represents a message in the physical examination chat modal.
 */
export type ExaminationMessage = {
  sender: 'USER' | 'AI' | 'SYSTEM';
  text: string;
};
