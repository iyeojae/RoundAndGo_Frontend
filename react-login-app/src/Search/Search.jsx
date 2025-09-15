// GolfSearch.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'; //
import 'swiper/css';
import 'swiper/css/pagination'; // 페이지네이션
import { Pagination } from 'swiper/modules';
import { checkAuth } from "./IsContainToken"; // 토큰 체크
import searchBtn from './SearchBtn.svg'; // 검색 버튼
import NoImage from '../Common/NoImage.svg'; // 골프장 이미지 없음
import Warning from './Warning.svg'; // 검색결과 없음

function GolfSearch() {
    const [state, setState] = useState({ // useState 통합
        searchTerm: '',
        filteredGolfCourses: [],
        loading: false,
        error: null,
        searchPerformed: false, // 검색 수행 여부
        clickedIndex: null,     // 클릭된 버튼 인덱스
        currentPage: 0,         // swiper 페이지
    });

    const { // useState 통합
        searchTerm,
        filteredGolfCourses,
        loading,
        error,
        searchPerformed, // 검색 수행 여부
        clickedIndex, // 클릭된 버튼 인덱스
        currentPage, // swiper
    } = state;

    const navigate = useNavigate();

    const updateState = (updates) => { // 상태 업데이트 헬퍼 함수
        setState((prev) => ({ ...prev, ...updates }));
    };

    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) return; // if searchTerm is empty -> just return ( do not search )

        updateState({ loading: true, error: null, filteredGolfCourses: [], searchPerformed: true }); // ::, ::, 새로운 검색 시작 시 이전 결과 초기화, 검색 수행 표시

        try {
            const response = await fetch(
                `https://api.roundandgo.com/api/golf-courses/search?name=${encodeURIComponent(searchTerm)}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                new Error(errorData.message || '골프장 정보를 불러오는데 실패했습니다.');
            }

            
            const data = await response.json();
            const results = Array.isArray(data.data) ? data.data : [];

            updateState({ filteredGolfCourses: results });

        } catch (err) {
            console.error("API 호출 중 에러 발생:", err);
            updateState({ error: err.message, filteredGolfCourses: [] });
        } finally {
            updateState({ loading: false });
        }
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        updateState({ searchTerm: e.target.value });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const navigateAfterCheck = (path) => { // 인증 후 라우팅 공통
        if (checkAuth()) {
            console.log('토큰 확인 완료. 이동:', path);
            navigate(path);
        } else {
            console.log('토큰 없음. 로그인으로 이동');
            navigate('/email-login');
        }
    };

    const NoReserve = () => { // NO 예약했을 경우, '예약한 ~' 클릭 시 -> 제주도 전체 음식점, 놀거리, 숙박시설만 보여주기
        navigateAfterCheck('/main');
    }

    const Reserve = (index) => { // 예약했을 경우, '클릭' 버튼 터치 시 -> 해당 정보 기반 주변 음식점, 놀거리, 숙박시설만 보여주기
        const selectedCourse = filteredGolfCourses[index];

        if (selectedCourse && selectedCourse.id) {
            localStorage.setItem('selectedGolfCourseId', selectedCourse.id); // 로컬 스토리지에 저장
            // 불러올 때 const 변수명 = localStorage.getItem('selectedGolfCourseId'); 이렇게 불러오면 됨
        } // console.log('골프장 아이디: ', selectedCourse.id);
        updateState({ clickedIndex: index });

        setTimeout(() => {
            navigateAfterCheck('/main');
        }, 300); // 버튼 색상이 변한 후 이동 - delay
    };

    return (
        <div className="Search&Response"> {/* 검색과 응답 로직 */}
            <div className="Search">
                <input
                    type="text"
                    placeholder="골프장을 검색해주세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress}
                />
                <img
                    className="SearchBtnImg"
                    src={searchBtn}
                    alt="검색버튼"
                    onClick={handleSearch}
                />
            </div>

            <div className="Response">
                <p onClick={NoReserve} style={{marginBottom: '2.2rem', fontWeight: '450'}}>
                    예약한 골프장이 없어요
                </p>

                {loading && <p>로딩 중...</p>}
                {error && <p>에러 발생: {error}</p>}

                {!loading && !error && searchPerformed && (
                    filteredGolfCourses.length > 0 ? (
                        <>
                            <Swiper
                                modules={[Pagination]}
                                spaceBetween={30}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
                                onSlideChange={(swiper) => updateState({ currentPage: swiper.activeIndex })} // 현재 페이지 상태 업데이트
                                style={{ paddingBottom: '30px' }}
                            >
                                {
                                    Array.from({ length: Math.ceil(filteredGolfCourses.length / 2) }).map((_, i) => {
                                        const start = i * 2;
                                        const courses = filteredGolfCourses.slice(start, start + 2); // 2개씩

                                        return (
                                            <SwiperSlide key={i}>
                                                <div style={{ display: 'flex', flexDirection: 'column'}}>
                                                    {courses.map((course, idx) => {
                                                        const index = start + idx;

                                                        return (
                                                            <li key={course.id || index}>
                                                                <div style={{ width: '100%', margin: '2% 0' }}>
                                                                    <div className="entire-cont">
                                                                        <div className='msg-cont'>
                                                                            <strong>{course.name}{/*<span>홀 수: {course.holeCount || '모름'}</span>*/}</strong>
                                                                            <p>{course.address}</p>
                                                                            <button
                                                                                onClick={() => Reserve(index)}
                                                                                style={{
                                                                                    backgroundColor: clickedIndex === index ? '#2d8779' : 'transparent',
                                                                                    color: clickedIndex === index ? 'white' : '#2d8779',
                                                                                }}
                                                                            >
                                                                                선택
                                                                            </button>
                                                                        </div>
                                                                        <img src={course.imageUrl ? course.imageUrl : NoImage} alt={course.name}/>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </div>
                                            </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </>
                    ) : (
                        // 검색어가 있을 때만 "검색 결과가 없어요" 표시
                        <div className="NoResponse">
                            <img className="Warning" src={Warning} alt='검색결과 없음'/>
                            <p>조건에 맞는 골프장이 없어요<br/><span>검색어를 확인해 주세요</span></p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default GolfSearch;
