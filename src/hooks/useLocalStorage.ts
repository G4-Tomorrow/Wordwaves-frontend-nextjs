import { useState, useEffect } from 'react';

// Tạo hook sử dụng localStorage trong môi trường client
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        }
    }, [key]);

    const setValue = (value: T) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
        setStoredValue(value);
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
