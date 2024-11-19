import { useState, useEffect } from "react";

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const item = localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
            } catch (error) {
                console.error(`Error reading localStorage key "${key}":`, error);
            }
        }
    }, [key]);

    const setValue = (value: T) => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(key, JSON.stringify(value));
            }
            setStoredValue(value);
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
