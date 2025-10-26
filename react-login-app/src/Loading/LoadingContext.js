import React, { createContext, useState, useContext } from 'react';

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Loading...");

    // 로딩 시작 함수
    const startLoading = (msg = "Loading...") => {
        setMessage(msg);
        setLoading(true);
    };

    // 로딩 종료 함수
    const stopLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, startLoading, stopLoading, message }}>
            {children}
        </LoadingContext.Provider>
    );
}

// 간편하게 가져다 쓰기
export const useLoading = () => useContext(LoadingContext);
