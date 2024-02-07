import type { ErrorData } from '../types';

export function logError(e: ErrorData | string) {
    console.log(e);
    // CAPTURE ERROR HERE
}

export function createErrorString(e?: ErrorData, fallback?: string) {
    if (e) return `${e.name}: ${e.message}`;
    return fallback || '';
}
