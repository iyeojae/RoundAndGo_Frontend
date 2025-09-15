// 실제 API 기반 장소 검색 함수들
import { API_BASE_URL } from '../config/api';

// 실제 API 엔드포인트들
const API_ENDPOINTS = {
  RESTAURANTS: `${API_BASE_URL}/tour-infos/restaurants`
};

// Tourapi API 키 (기존 코드에서 사용하던 것)
const TOURAPI_KEY = '2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D';

// 음식점 검색 (자체 API 사용)
const searchRestaurants = async (query) => {
  try {
    const cities = ['제주시', '서귀포시'];
    const responses = await Promise.all(
      cities.map(city =>
        fetch(`${API_ENDPOINTS.RESTAURANTS}?province=제주특별자치도&city=${city}`)
          .then(res => res.ok ? res.json() : Promise.reject(`API 에러: ${city}`))
          .catch(() => []) // 에러 시 빈 배열 반환
      )
    );
    
    const allRestaurants = responses.flat();
    // 검색어로 필터링
    const filtered = allRestaurants.filter(restaurant => 
      restaurant.title?.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.addr1?.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.map(item => ({
      id: item.contentid,
      name: item.title,
      address: item.addr1 || '',
      category: '음식점',
      image: item.firstimage || '',
      tel: item.tel || '',
      mapx: item.mapx,
      mapy: item.mapy,
      categoryName: '음식점'
    }));
  } catch (error) {
    console.warn('음식점 검색 실패:', error);
    return [];
  }
};

// 숙소 검색 (Tourapi API 직접 사용)
const searchAccommodations = async (query) => {
  try {
    const apiUrl = `https://apis.data.go.kr/B551011/KorService2/searchStay2?numOfRows=50&_type=json&MobileOS=WEB&MobileApp=DDD&serviceKey=${TOURAPI_KEY}&areaCode=39&cat1=B02&cat2=B0201&lDongRegnCd=50`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`API 호출 실패: ${response.statusText}`);
    
    const responseData = await response.json();
    let items = responseData?.response?.body?.items?.item || [];
    
    // 검색어로 필터링
    const filtered = items.filter(item => 
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.addr1?.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.map(item => ({
      id: item.contentid,
      name: item.title,
      address: item.addr1 || '',
      category: '숙소',
      image: item.firstimage || '',
      tel: item.tel || '',
      mapx: item.mapx,
      mapy: item.mapy,
      categoryName: '숙소'
    }));
  } catch (error) {
    console.warn('숙소 검색 실패:', error);
    return [];
  }
};

// 관광지 검색 (Tourapi API 직접 사용)
const searchTourism = async (query) => {
  try {
    const apiUrl = `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?numOfRows=100&MobileOS=WEB&MobileApp=ROUND%26GO&arrange=O&contentTypeId=12&areaCode=39&serviceKey=${TOURAPI_KEY}&_type=json`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`API 호출 실패: ${response.statusText}`);
    
    const data = await response.json();
    let items = data?.response?.body?.items?.item || [];
    
    // 검색어로 필터링
    const filtered = items.filter(item => 
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.addr1?.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.map(item => ({
      id: item.contentid,
      name: item.title,
      address: item.addr1 || '',
      category: '관광지',
      image: item.firstimage || '',
      tel: item.tel || '',
      mapx: item.mapx,
      mapy: item.mapy,
      categoryName: '관광지'
    }));
  } catch (error) {
    console.warn('관광지 검색 실패:', error);
    return [];
  }
};

// 통합 검색 (모든 카테고리)
export const searchLocations = async (query) => {
  try {
    if (!query.trim()) {
      return { items: [] };
    }

    // 모든 카테고리에서 병렬로 검색
    const searchPromises = [
      searchRestaurants(query),
      searchAccommodations(query),
      searchTourism(query)
    ];

    const results = await Promise.all(searchPromises);
    const allItems = results.flat();
    
    // 중복 제거 (같은 id를 가진 항목들)
    const uniqueItems = allItems.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );

    return { items: uniqueItems };
  } catch (error) {
    console.error('장소 검색 오류:', error);
    throw error;
  }
};

// 인기 장소 목록 조회 (제주도 인기 장소들)
export const getPopularLocations = async () => {
  try {
    // 각 카테고리에서 인기 장소들을 가져오기
    const popularPromises = [
      // 인기 음식점 (제주시, 서귀포시에서 각각 2개씩)
      Promise.all([
        fetch(`${API_ENDPOINTS.RESTAURANTS}?province=제주특별자치도&city=제주시`)
          .then(res => res.ok ? res.json() : [])
          .catch(() => []),
        fetch(`${API_ENDPOINTS.RESTAURANTS}?province=제주특별자치도&city=서귀포시`)
          .then(res => res.ok ? res.json() : [])
          .catch(() => [])
      ]).then(results => {
        const allRestaurants = results.flat().slice(0, 3); // 상위 3개만
        return allRestaurants.map(item => ({
          id: item.contentid,
          name: item.title,
          address: item.addr1 || '',
          category: '음식점',
          image: item.firstimage || '',
          tel: item.tel || '',
          mapx: item.mapx,
          mapy: item.mapy,
          categoryName: '음식점'
        }));
      }).catch(() => []),
      
      // 인기 숙소 (Tourapi API에서 상위 3개)
      fetch(`https://apis.data.go.kr/B551011/KorService2/searchStay2?numOfRows=3&_type=json&MobileOS=WEB&MobileApp=DDD&serviceKey=${TOURAPI_KEY}&areaCode=39&cat1=B02&cat2=B0201&lDongRegnCd=50`)
        .then(res => res.ok ? res.json() : Promise.reject('API 에러'))
        .then(data => {
          const items = data?.response?.body?.items?.item || [];
          return items.map(item => ({
            id: item.contentid,
            name: item.title,
            address: item.addr1 || '',
            category: '숙소',
            image: item.firstimage || '',
            tel: item.tel || '',
            mapx: item.mapx,
            mapy: item.mapy,
            categoryName: '숙소'
          }));
        })
        .catch(() => []),
      
      // 인기 관광지 (Tourapi API에서 상위 4개)
      fetch(`https://apis.data.go.kr/B551011/KorService2/areaBasedList2?numOfRows=4&MobileOS=WEB&MobileApp=ROUND%26GO&arrange=O&contentTypeId=12&areaCode=39&serviceKey=${TOURAPI_KEY}&_type=json`)
        .then(res => res.ok ? res.json() : Promise.reject('API 에러'))
        .then(data => {
          const items = data?.response?.body?.items?.item || [];
          return items.map(item => ({
            id: item.contentid,
            name: item.title,
            address: item.addr1 || '',
            category: '관광지',
            image: item.firstimage || '',
            tel: item.tel || '',
            mapx: item.mapx,
            mapy: item.mapy,
            categoryName: '관광지'
          }));
        })
        .catch(() => [])
    ];

    const results = await Promise.all(popularPromises);
    const allItems = results.flat();
    
    return { items: allItems };
  } catch (error) {
    console.error('인기 장소 조회 오류:', error);
    throw error;
  }
};

// 최근 검색 장소 조회 (로컬 스토리지 사용)
export const getRecentLocations = async () => {
  try {
    const recentLocations = localStorage.getItem('recentLocations');
    if (recentLocations) {
      return { items: JSON.parse(recentLocations) };
    }
    return { items: [] };
  } catch (error) {
    console.error('최근 검색 장소 조회 오류:', error);
    return { items: [] };
  }
};

// 장소 선택 시 최근 검색에 추가 (로컬 스토리지 사용)
export const addToRecentLocations = async (location) => {
  try {
    const recentLocations = localStorage.getItem('recentLocations');
    let locations = recentLocations ? JSON.parse(recentLocations) : [];
    
    // 중복 제거 (같은 ID가 있으면 제거)
    locations = locations.filter(item => item.id !== location.id);
    
    // 새 항목을 맨 앞에 추가
    locations.unshift(location);
    
    // 최대 10개까지만 저장
    if (locations.length > 10) {
      locations = locations.slice(0, 10);
    }
    
    localStorage.setItem('recentLocations', JSON.stringify(locations));
    return { success: true };
  } catch (error) {
    console.error('최근 검색 추가 오류:', error);
    throw error;
  }
};
