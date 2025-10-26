import React, {createContext, useEffect, useRef, useState} from "react";

export const ScrollContext = createContext();

export function ScrollProvider({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const mainRef = useRef(null);

    useEffect(() => {
        const mainElement = mainRef.current;
        if (!mainElement) return;

        const handleScroll = () => {
            if (mainElement.scrollTop > 30) setIsScrolled(true);
            else setIsScrolled(false);
        };

        mainElement.addEventListener('scroll', handleScroll);
        return () => mainElement.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <ScrollContext.Provider value={{ isScrolled, mainRef }}>
            {children}
        </ScrollContext.Provider>
    );
}