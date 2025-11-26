/**
 * SSE (Server-Sent Events) Parser Utility
 * Parses streaming events from the agent service
 */

import { StreamEventType } from '../types';

export interface StreamEvent {
    type: StreamEventType;
    data: any;
}

/**
 * Parse SSE stream from agent service
 *
 * @param reader ReadableStreamDefaultReader from fetch response
 * @param onEvent Callback for each parsed event
 * @param signal Optional AbortSignal for cancellation
 */
export async function parseSSE(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onEvent: (event: StreamEvent) => void,
    signal?: AbortSignal
): Promise<void> {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            // Check if cancelled
            if (signal?.aborted) {
                reader.cancel();
                throw new DOMException('Stream cancelled', 'AbortError');
            }

            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            // Decode chunk and add to buffer
            buffer += decoder.decode(value, { stream: true });

            // Split by newlines
            const lines = buffer.split('\n');

            // Keep last incomplete line in buffer
            buffer = lines.pop() || '';

            // Process complete lines
            let currentEvent: string | null = null;
            let currentData: string | null = null;

            for (const line of lines) {
                // Skip empty lines and comments
                if (line.trim() === '' || line.startsWith(':')) {
                    continue;
                }

                // Parse event type
                if (line.startsWith('event: ')) {
                    currentEvent = line.substring(7).trim();
                    continue;
                }

                // Parse data
                if (line.startsWith('data: ')) {
                    currentData = line.substring(6).trim();

                    // If we have both event and data, emit the event
                    if (currentEvent && currentData) {
                        try {
                            const parsedData = JSON.parse(currentData);
                            onEvent({
                                type: currentEvent as StreamEventType,
                                data: parsedData,
                            });
                        } catch (error) {
                            console.error('Failed to parse SSE data:', currentData, error);
                        }

                        // Reset for next event
                        currentEvent = null;
                        currentData = null;
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

/**
 * Async generator that yields SSE events
 * More ergonomic API using for-await-of
 *
 * @example
 * ```typescript
 * for await (const event of streamSSE(response)) {
 *   if (event.type === 'token') {
 *     console.log(event.data.token);
 *   }
 * }
 * ```
 */
export async function* streamSSE(
    response: Response,
    signal?: AbortSignal
): AsyncGenerator<StreamEvent, void, unknown> {
    if (!response.body) {
        throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            if (signal?.aborted) {
                reader.cancel();
                throw new DOMException('Stream cancelled', 'AbortError');
            }

            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            let currentEvent: string | null = null;
            let currentData: string | null = null;

            for (const line of lines) {
                if (line.trim() === '' || line.startsWith(':')) {
                    continue;
                }

                if (line.startsWith('event: ')) {
                    currentEvent = line.substring(7).trim();
                    continue;
                }

                if (line.startsWith('data: ')) {
                    currentData = line.substring(6).trim();

                    if (currentEvent && currentData) {
                        try {
                            const parsedData = JSON.parse(currentData);
                            yield {
                                type: currentEvent as StreamEventType,
                                data: parsedData,
                            };
                        } catch (error) {
                            console.error('Failed to parse SSE data:', currentData, error);
                        }

                        currentEvent = null;
                        currentData = null;
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}
