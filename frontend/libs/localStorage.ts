type StorageKeys = 'tgs-page-completion';

export type TgsLocallyStoredData = {
    [key: string | number]: {
        stepsCompleted: {
            [key: string]: boolean;
        };
    };
};

export function retrieveLocallyStoredValue<T>(key: StorageKeys): T | undefined {
    try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return undefined
        return item ? (JSON.parse(decodeURI(item)) as T) : undefined;
    } catch (error: any) {
        // If error also return initialValue
        console.log(error);
        return undefined;
    }
}

export function setLocallyStoredValue<T>(key: StorageKeys, value: T | (() => T)): void {
    try {
        // Allow value to be a function
        const valueToStore = value instanceof Function ? value() : value;
        // Save to local storage
        window.localStorage.setItem(key, encodeURI(JSON.stringify(valueToStore)));
    } catch (error: any) {
        // A more advanced implementation would handle the error case
        console.log(error);
    }
}

export function removeLocallyStoredValue(key: StorageKeys): void {
    try {
        // Save to local storage
        window.localStorage.removeItem(key);
    } catch (error: any) {
        // A more advanced implementation would handle the error case
        console.log(error);
    }
}
