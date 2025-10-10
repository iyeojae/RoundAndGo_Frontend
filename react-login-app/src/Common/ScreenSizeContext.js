import React, { createContext, useState, useEffect } from 'react';

export const ScreenSizeContext = createContext();

export function ScreenSizeProvider({ children }) {
    const [isTablet, setIsTablet] = useState(() => {
        const width = window.innerWidth;
        return width <= 1366 && width > 768;
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsTablet(width <= 1366 && width > 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <ScreenSizeContext.Provider value={{ isTablet }}>
            {children}
        </ScreenSizeContext.Provider>
    );
}
