// 장소 검색 API 함수들
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 장소 검색 API
export const searchLocations = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/api/locations/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('장소 검색에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('장소 검색 오류:', error);
    throw error;
  }
};

// 인기 장소 목록 조회
export const getPopularLocations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/locations/popular`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('인기 장소 조회에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('인기 장소 조회 오류:', error);
    throw error;
  }
};

// 최근 검색 장소 조회
export const getRecentLocations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/locations/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // 로그인된 사용자의 최근 검색
      },
    });

    if (!response.ok) {
      throw new Error('최근 검색 장소 조회에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('최근 검색 장소 조회 오류:', error);
    throw error;
  }
};

// 장소 선택 시 최근 검색에 추가
export const addToRecentLocations = async (locationId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/locations/recent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ locationId }),
    });

    if (!response.ok) {
      throw new Error('최근 검색 추가에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('최근 검색 추가 오류:', error);
    throw error;
  }
};
