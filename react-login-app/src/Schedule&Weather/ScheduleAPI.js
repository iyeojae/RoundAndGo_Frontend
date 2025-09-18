/**
 * 스케줄 API 연동 함수들
 * 백엔드 API와의 통신을 담당합니다.
 */

import { API_ENDPOINTS } from '../config/api';


// 인증 토큰 가져오기
const getAuthToken = () => {
  // localStorage의 모든 키 확인
  console.log('🔍 localStorage 키들:', Object.keys(localStorage));
  
  // authUtils.js와 동일한 키 사용
  const token = localStorage.getItem('authToken');
  
  // 다른 가능한 토큰 키들도 확인
  const alternativeTokens = {
    'accessToken': localStorage.getItem('accessToken'),
    'token': localStorage.getItem('token'),
    'jwt': localStorage.getItem('jwt'),
    'authToken': token
  };
  
  console.log('🔑 토큰 검색 결과:', alternativeTokens);
  
  return token;
};

// API 요청 헤더 생성
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  console.log('🔑 헤더 생성:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
    headers
  });
  
  return headers;
};

// API 응답 처리
const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorData = {};
    let errorText = '';
    
    try {
      // JSON 응답 시도
      errorData = await response.json();
    } catch (e) {
      try {
        // 텍스트 응답 시도
        errorText = await response.text();
        console.log('오류 응답 (텍스트):', errorText);
      } catch (e2) {
        console.log('오류 응답을 파싱할 수 없음');
      }
    }
    
    console.error('API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData,
      errorText,
      errorMessage: errorData.message || errorData.error || errorText || 'Unknown error',
      allHeaders: Object.fromEntries(response.headers.entries())
    });
    
    // errorData의 상세 내용을 별도로 출력
    if (errorData && Object.keys(errorData).length > 0) {
      console.error('🔍 서버 오류 상세 정보:', errorData);
      console.error('🔍 errorData 타입:', typeof errorData);
      console.error('🔍 errorData 키들:', Object.keys(errorData));
    }
    
    throw new Error(errorData.message || errorData.error || errorText || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * 스케줄 생성
 * @param {Object} scheduleData - 스케줄 데이터
 * @param {string} scheduleData.title - 일정 제목
 * @param {string} scheduleData.startDateTime - 시작 날짜/시간 (ISO 8601 형식)
 * @param {string} scheduleData.endDateTime - 종료 날짜/시간 (ISO 8601 형식)
 * @param {boolean} scheduleData.allDay - 하루종일 여부
 * @param {string} scheduleData.color - 색상 코드
 * @param {string} scheduleData.category - 카테고리
 * @param {string} scheduleData.location - 위치
 * @returns {Promise<Object>} 생성된 스케줄 정보
 */
export const createSchedule = async (scheduleData) => {
  try {
    // API 명세에 따라 startDateTime, endDateTime을 Query 파라미터로 전송
    const { startDateTime, endDateTime, ...bodyData } = scheduleData;
    
    const queryParams = new URLSearchParams({
      startDateTime,
      endDateTime
    });
    
    const url = `${API_ENDPOINTS.SCHEDULES}?${queryParams}`;
    
    console.log('📝 스케줄 생성 요청:', {
      url,
      bodyData,
      queryParams: { startDateTime, endDateTime },
      originalScheduleData: scheduleData,
      bodyDataString: JSON.stringify(bodyData)
    });

    // 두 가지 방식 모두 시도해보기 위해 주석 처리
    // 1. Query 파라미터만 사용하는 방식
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bodyData)
    });

    // 2. 만약 위 방식이 실패하면, Body에 모든 데이터를 포함하는 방식도 시도
    if (!response.ok && response.status === 400) {
      console.log('🔄 첫 번째 방식 실패, Body에 모든 데이터를 포함하는 방식으로 재시도...');
      
         const categoryColor = getCategoryColor(scheduleData.category);
         const fullBodyData = {
           ...bodyData,
           startDateTime,
           endDateTime,
           color: categoryColor // 카테고리별 색상
         };
      
      console.log('🔄 재시도 요청 데이터:', {
        url: API_ENDPOINTS.SCHEDULES,
        fullBodyData,
        fullBodyDataString: JSON.stringify(fullBodyData)
      });
      
      const retryResponse = await fetch(API_ENDPOINTS.SCHEDULES, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fullBodyData)
      });
      
         // 3. 만약 두 번째 방식도 실패하면, 최소한의 데이터로 재시도
         if (!retryResponse.ok && retryResponse.status === 400) {
           console.log('🔄 두 번째 방식도 실패, 최소한의 데이터로 재시도...');

           // 최소한의 필수 데이터만 포함
           const minimalData = {
             title: scheduleData.title || '테스트 일정',
             startDateTime: scheduleData.startDateTime || new Date().toISOString(),
             endDateTime: scheduleData.endDateTime || new Date(Date.now() + 3600000).toISOString()
           };

           console.log('🔄 최소한의 요청 데이터:', {
             url: API_ENDPOINTS.SCHEDULES,
             minimalData,
             minimalDataString: JSON.stringify(minimalData)
           });

           const minimalResponse = await fetch(API_ENDPOINTS.SCHEDULES, {
             method: 'POST',
             headers: getAuthHeaders(),
             body: JSON.stringify(minimalData)
           });

           // 4. 네 번째 방식: API 명세서에 따라 정확한 형식으로 시도
           if (!minimalResponse.ok && minimalResponse.status === 400) {
             console.log('🔄 세 번째 방식도 실패, API 명세서에 따른 정확한 형식으로 재시도...');

             // API 명세서에 따라: Body에는 ScheduleRequestDto, Query에는 startDateTime, endDateTime
             const { startDateTime, endDateTime, ...bodyData } = scheduleData;
             
             const queryParams = new URLSearchParams({
               startDateTime: startDateTime || new Date().toISOString(),
               endDateTime: endDateTime || new Date(Date.now() + 3600000).toISOString()
             });

             const specCompliantUrl = `${API_ENDPOINTS.SCHEDULES}?${queryParams}`;
             const categoryColor = getCategoryColor(scheduleData.category);
             const specCompliantBody = {
               title: scheduleData.title || '테스트 일정',
               allDay: scheduleData.allDay || false,
               color: categoryColor, // 카테고리별 색상
               category: scheduleData.category || '기타',
               location: scheduleData.location || ''
             };

             console.log('🔄 API 명세서 준수 요청 데이터:', {
               url: specCompliantUrl,
               queryParams: Object.fromEntries(queryParams.entries()),
               bodyData: specCompliantBody,
               bodyDataString: JSON.stringify(specCompliantBody)
             });

             const specCompliantResponse = await fetch(specCompliantUrl, {
               method: 'POST',
               headers: getAuthHeaders(),
               body: JSON.stringify(specCompliantBody)
             });

             // 5. 다섯 번째 방식: 다른 가능한 DTO 구조들 시도
             if (!specCompliantResponse.ok && specCompliantResponse.status === 400) {
               console.log('🔄 네 번째 방식도 실패, 다른 DTO 구조들로 재시도...');

               // 방식 5-1: snake_case 필드명 + 카테고리별 색상
               const categoryColor = getCategoryColor(scheduleData.category);
               const snakeCaseBody = {
                 title: scheduleData.title || '테스트 일정',
                 all_day: scheduleData.allDay || false,
                 color: categoryColor, // 카테고리별 색상
                 category: scheduleData.category || '기타',
                 location: scheduleData.location || ''
               };

               console.log('🔄 snake_case 요청 데이터:', {
                 url: API_ENDPOINTS.SCHEDULES,
                 bodyData: snakeCaseBody,
                 bodyDataString: JSON.stringify(snakeCaseBody)
               });

               const snakeCaseResponse = await fetch(API_ENDPOINTS.SCHEDULES, {
                 method: 'POST',
                 headers: getAuthHeaders(),
                 body: JSON.stringify(snakeCaseBody)
               });

               // 방식 5-2: 다른 Enum 값들 시도
               if (!snakeCaseResponse.ok && snakeCaseResponse.status === 400) {
                 console.log('🔄 snake_case도 실패, 다른 Enum 값들로 재시도...');

                 const enumValues = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'SKYBLUE', 'BLUE', 'PURPLE', 'BLACK'];
                 
                 for (const colorValue of enumValues) {
                   console.log(`🔄 ${colorValue} Enum 값으로 시도...`);
                   
                   const enumBody = {
                     title: scheduleData.title || '테스트 일정',
                     allDay: scheduleData.allDay || false,
                     color: colorValue,
                     category: scheduleData.category || '기타',
                     location: scheduleData.location || ''
                   };

                   console.log(`🔄 ${colorValue} 요청 데이터:`, {
                     url: API_ENDPOINTS.SCHEDULES,
                     bodyData: enumBody,
                     bodyDataString: JSON.stringify(enumBody)
                   });

                   const enumResponse = await fetch(API_ENDPOINTS.SCHEDULES, {
                     method: 'POST',
                     headers: getAuthHeaders(),
                     body: JSON.stringify(enumBody)
                   });

                   if (enumResponse.ok) {
                     console.log(`✅ ${colorValue} Enum 값으로 성공!`);
                     return await handleApiResponse(enumResponse);
                   }
                 }

                 // 모든 Enum 값이 실패하면 필수 필드만으로 시도
                 console.log('🔄 모든 Enum 값 실패, 필수 필드만으로 재시도...');

                 const essentialOnlyBody = {
                   title: scheduleData.title || '테스트 일정'
                 };

                 console.log('🔄 필수 필드만 요청 데이터:', {
                   url: API_ENDPOINTS.SCHEDULES,
                   bodyData: essentialOnlyBody,
                   bodyDataString: JSON.stringify(essentialOnlyBody)
                 });

                 const essentialResponse = await fetch(API_ENDPOINTS.SCHEDULES, {
                   method: 'POST',
                   headers: getAuthHeaders(),
                   body: JSON.stringify(essentialOnlyBody)
                 });

                 return await handleApiResponse(essentialResponse);
               }

               return await handleApiResponse(snakeCaseResponse);
             }

             return await handleApiResponse(specCompliantResponse);
           }

           return await handleApiResponse(minimalResponse);
         }
      
      return await handleApiResponse(retryResponse);
    }

    return await handleApiResponse(response);
  } catch (error) {
    console.error('스케줄 생성 실패:', error);
    throw error;
  }
};

/**
 * 전체 스케줄 조회
 * @returns {Promise<Array>} 스케줄 목록
 */
export const getSchedules = async () => {
  try {
    const token = getAuthToken();
    const headers = getAuthHeaders();
    
    console.log('🔍 스케줄 조회 요청 정보:', {
      url: API_ENDPOINTS.SCHEDULES,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      headers
    });

    const response = await fetch(API_ENDPOINTS.SCHEDULES, {
      method: 'GET',
      headers
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('스케줄 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 스케줄 조회
 * @param {number} scheduleId - 스케줄 ID
 * @returns {Promise<Object>} 스케줄 정보
 */
export const getScheduleById = async (scheduleId) => {
  try {
    const response = await fetch(API_ENDPOINTS.SCHEDULE_BY_ID(scheduleId), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('스케줄 조회 실패:', error);
    throw error;
  }
};

/**
 * 스케줄 수정
 * @param {number} scheduleId - 스케줄 ID
 * @param {Object} scheduleData - 수정할 스케줄 데이터
 * @returns {Promise<Object>} 수정된 스케줄 정보
 */
export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    // API 명세에 따라 startDateTime, endDateTime을 Query 파라미터로 전송
    const { startDateTime, endDateTime, ...bodyData } = scheduleData;
    
    const queryParams = new URLSearchParams({
      startDateTime,
      endDateTime
    });
    
    const url = `${API_ENDPOINTS.SCHEDULE_BY_ID(scheduleId)}?${queryParams}`;
    
    console.log('✏️ 스케줄 수정 요청:', {
      url,
      bodyData,
      queryParams: { startDateTime, endDateTime }
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bodyData)
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('스케줄 수정 실패:', error);
    throw error;
  }
};

/**
 * 스케줄 삭제
 * @param {number} scheduleId - 스케줄 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await fetch(API_ENDPOINTS.SCHEDULE_BY_ID(scheduleId), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('스케줄 삭제 실패:', error);
    throw error;
  }
};

/**
 * 날짜/시간을 ISO 8601 형식으로 변환
 * @param {string} date - 날짜 (YYYY-MM-DD)
 * @param {string} time - 시간 (HH:mm) 또는 null (하루종일)
 * @returns {string} ISO 8601 형식의 날짜/시간
 */
export const formatDateTime = (date, time = null) => {
  if (!time) {
    // 하루종일인 경우 시간을 00:00:00으로 설정
    return `${date}T00:00:00`;
  }
  return `${date}T${time}:00`;
};

/**
 * ISO 8601 형식의 날짜/시간을 분리
 * @param {string} dateTime - ISO 8601 형식의 날짜/시간
 * @returns {Object} { date: 'YYYY-MM-DD', time: 'HH:mm' }
 */
export const parseDateTime = (dateTime) => {
  const [date, time] = dateTime.split('T');
  const timeOnly = time ? time.substring(0, 5) : null; // HH:mm만 추출
  return { date, time: timeOnly };
};

/**
 * 스케줄 데이터를 API 형식으로 변환
 * @param {Object} schedule - 프론트엔드 스케줄 데이터
 * @returns {Object} API 형식의 스케줄 데이터
 */
export const transformScheduleForAPI = (schedule) => {
  // 날짜가 undefined인 경우 현재 날짜 사용
  const startDate = schedule.startDate || new Date().toISOString().split('T')[0];
  const endDate = schedule.endDate || startDate;
  
  const startDateTime = formatDateTime(startDate, schedule.startTime);
  const endDateTime = formatDateTime(endDate, schedule.endTime);

  console.log('🔍 원래 변환 디버깅:', {
    originalSchedule: schedule,
    startDate,
    endDate,
    startDateTime,
    endDateTime
  });

  // 카테고리에 따른 색상 자동 매핑
  const categoryColor = getCategoryColor(schedule.category);

  // API 명세에 따라 Body에는 startDateTime, endDateTime을 제외한 데이터만 포함
  return {
    title: schedule.title,
    allDay: schedule.isAllDay || false,
    color: categoryColor, // 카테고리별 색상
    category: schedule.category || '기타',
    location: schedule.location || '',
    // startDateTime과 endDateTime은 Query 파라미터로 전송되므로 Body에서 제외
    startDateTime,
    endDateTime
  };
};

// 카테고리별 색상 매핑 함수 (Enum 값)
export const getCategoryColor = (category) => {
  const categoryColorMap = {
    '골프': 'GREEN',
    '맛집': 'ORANGE', 
    '숙소': 'BLUE',
    '관광': 'PURPLE',
    '모임': 'RED',
    '기타': 'BLACK'
  };
  
  return categoryColorMap[category] || 'BLACK';
};

// 카테고리별 CSS 색상 매핑 함수 (프론트엔드 표시용)
export const getCategoryCSSColor = (category) => {
  const categoryCSSColorMap = {
    '골프': '#4CAF50',    // 초록색
    '맛집': '#FF8C00',    // 주황색
    '숙소': '#2196F3',    // 파란색
    '관광': '#9C27B0',    // 보라색
    '모임': '#E70012',    // 빨간색
    '기타': '#424242'     // 검은색
  };
  
  return categoryCSSColorMap[category] || '#424242';
};

// Enum 색상을 실제 CSS 색상으로 변환하는 함수
export const getEnumColorToCSS = (enumColor) => {
  const enumColorMap = {
    'RED': '#E70012',
    'ORANGE': '#FF8C00',
    'YELLOW': '#FFD700',
    'GREEN': '#4CAF50',
    'SKYBLUE': '#87CEEB',
    'BLUE': '#2196F3',
    'PURPLE': '#9C27B0',
    'BLACK': '#424242'
  };
  
  return enumColorMap[enumColor] || '#424242';
};

// 대안적인 API 형식 변환 함수
export const transformScheduleForAPIAlternative = (schedule) => {
  // 날짜가 undefined인 경우 현재 날짜 사용
  const startDate = schedule.startDate || new Date().toISOString().split('T')[0];
  const endDate = schedule.endDate || startDate;
  
  // 시간 정보를 올바르게 유지
  const startTime = schedule.startTime || '00:00';
  const endTime = schedule.endTime || '23:59';
  
  const startDateTime = formatDateTime(startDate, startTime);
  const endDateTime = formatDateTime(endDate, endTime);

  console.log('🔍 대안적 변환 디버깅:', {
    originalSchedule: schedule,
    startDate,
    endDate,
    startTime,
    endTime,
    startDateTime,
    endDateTime
  });

  // 카테고리에 따른 색상 자동 매핑
  const categoryColor = getCategoryColor(schedule.category);

  // 다른 가능한 형식들 시도
  return {
    title: schedule.title,
    startDateTime,
    endDateTime,
    allDay: schedule.isAllDay || false,
    color: categoryColor, // 카테고리별 색상
    category: schedule.category || '기타',
    location: schedule.location || ''
  };
};

/**
 * API 응답을 프론트엔드 형식으로 변환
 * @param {Object} apiSchedule - API 스케줄 데이터
 * @returns {Object} 프론트엔드 형식의 스케줄 데이터
 */
export const transformScheduleFromAPI = (apiSchedule) => {
  const startParsed = parseDateTime(apiSchedule.startDateTime);
  const endParsed = parseDateTime(apiSchedule.endDateTime);
  
  // Enum 색상을 CSS 색상으로 변환
  const cssColor = getEnumColorToCSS(apiSchedule.color);

  // 카테고리 정보 처리 및 디버깅
  console.log('🔄 API 스케줄 변환 - 카테고리 정보:', {
    apiScheduleId: apiSchedule.id,
    apiScheduleTitle: apiSchedule.title,
    apiCategory: apiSchedule.category,
    apiColor: apiSchedule.color,
    cssColor: cssColor
  });

  const result = {
    id: apiSchedule.id,
    title: apiSchedule.title,
    startDate: startParsed.date,
    endDate: endParsed.date,
    startTime: startParsed.time,
    endTime: endParsed.time,
    isAllDay: apiSchedule.allDay,
    color: cssColor, // Enum 색상을 CSS 색상으로 변환
    category: apiSchedule.category || '기타', // 기본값 추가
    location: apiSchedule.location,
    // 기존 UI 호환성을 위한 추가 필드들
    time: apiSchedule.allDay ? '하루종일' : `${startParsed.time || '00:00'}~${endParsed.time || '23:59'}`,
    date: startParsed.date,
    dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][new Date(startParsed.date).getDay()],
    attendees: '개인', // 기본값
    reminder: '1시간 전' // 기본값
  };

  console.log('✅ 변환된 스케줄 데이터:', {
    id: result.id,
    title: result.title,
    category: result.category,
    color: result.color
  });

  return result;
};
