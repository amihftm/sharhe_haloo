'use server';

import { prompts } from '@/lib/prompts';
import { ChatMessage } from '@prisma/client';
import { getGenerativeModel } from '../services/gemini';
import { db } from '../db';
import { JsonObject } from '@prisma/client/runtime/library';

/**
 * Generates a response from the AI patient based on the current conversation.
 * @param attemptId The ID of the current case attempt.
 * @returns The AI's generated text response.
 */
export async function getPatientResponse(attemptId: string) {
  try {
    // 1. Fetch the case attempt with its full history and the base case details.
    const attempt = await db.caseAttempt.findUnique({
      where: { id: attemptId },
      include: {
        case: true, // Include the parent Case object
        messages: { // Include all messages for this attempt
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!attempt) {
      throw new Error('Case attempt not found.');
    }

    // 2. Prepare the context for the AI model.
    const model = getGenerativeModel();
    const {
      title,
      description,
      systemPrompt: caseSystemPrompt,
    } = attempt.case;

    // Use our centralized prompt template to create the initial system instruction.
    const systemInstruction = prompts.historyTaking.initializePatient({
      title,
      description,
      systemPrompt: caseSystemPrompt as JsonObject,
    });
    if (!systemInstruction) {
      throw new Error('No Prompt generated.');
    }


    // Format the existing chat history for the model.
    const history = attempt.messages.map((msg: ChatMessage) => ({
      role: msg.role === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // 3. Start a chat session with the model, providing the system prompt and history.
    const chat = model.startChat({
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemInstruction }],
      },
      history,
    });


    // The last message is the user's most recent query.
    const lastMessage = attempt.messages[attempt.messages.length - 1]?.content;
    if (!lastMessage) {
      throw new Error('No user message found to respond to.');
    }

    // 4. Send the latest message to the model and get the response.
    const result = await chat.sendMessage(lastMessage);
    const response = result.response;
    const text = response.text();
    const json_data = JSON.parse(text) as {"dialogue": string, "emotional_state": string}

    return { success: true, data: json_data };
  } catch (error) {
    console.error('Error getting patient response:', error);
    return { success: false, error: (error as Error).message };
  }
}
