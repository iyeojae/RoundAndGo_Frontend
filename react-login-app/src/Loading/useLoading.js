import { useState, useEffect } from 'react';

/**
 * 로딩 상태를 관리하는 커스텀 훅
 * @param {number} initialDelay - 초기 로딩 지연 시간 (ms)
 * @param {number} minLoadingTime - 최소 로딩 시간 (ms)
 * @returns {Object} { isLoading, setLoading, loadingMessage, setLoadingMessage }
 */
export const useLoading = (initialDelay = 0, minLoadingTime = 1000) => {
  const [isLoading, setIsLoading] = useState(initialDelay > 0);
  const [loadingMessage, setLoadingMessage] = useState('로딩 중...');
  const [startTime, setStartTime] = useState(null);

  // 초기 지연 시간 처리
  useEffect(() => {
    if (initialDelay > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, initialDelay);
      return () => clearTimeout(timer);
    }
  }, [initialDelay]);

  // 로딩 상태 변경 함수
  const setLoading = (loading, message = '로딩 중...') => {
    if (loading) {
      setStartTime(Date.now());
      setLoadingMessage(message);
      setIsLoading(true);
    } else {
      const elapsed = startTime ? Date.now() - startTime : 0;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);
      
      if (remainingTime > 0) {
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      } else {
        setIsLoading(false);
      }
    }
  };

  return {
    isLoading,
    setLoading,
    loadingMessage,
    setLoadingMessage
  };
};

/**
 * 비동기 작업을 로딩과 함께 실행하는 함수
 * @param {Function} asyncFunction - 실행할 비동기 함수
 * @param {string} loadingMessage - 로딩 메시지
 * @param {number} minLoadingTime - 최소 로딩 시간
 * @returns {Promise} 비동기 함수의 결과
 */
export const withLoading = async (asyncFunction, loadingMessage = '로딩 중...', minLoadingTime = 1000) => {
  const startTime = Date.now();
  
  try {
    const result = await asyncFunction();
    
    // 최소 로딩 시간 보장
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);
    
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    
    return result;
  } catch (error) {
    // 에러 발생 시에도 최소 로딩 시간 보장
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);
    
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    
    throw error;
  }
};

/**
 * 페이지 전환 시 로딩을 표시하는 훅
 * @param {boolean} isNavigating - 네비게이션 상태
 * @param {string} message - 로딩 메시지
 * @returns {Object} { isLoading, loadingMessage }
 */
export const usePageLoading = (isNavigating, message = '페이지를 불러오는 중...') => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(message);

  useEffect(() => {
    if (isNavigating) {
      setIsLoading(true);
      setLoadingMessage(message);
    } else {
      // 최소 500ms 로딩 표시
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isNavigating, message]);

  return { isLoading, loadingMessage };
};

export default useLoading;
