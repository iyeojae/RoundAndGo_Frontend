// GolfSearch.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBtn from './SearchBtn.png'; // 검색 버튼
import NoImage from '../Common/NoImage.svg'; // 골프장 이미지 없음
import Warning from './Warning.svg'; // 검색결과 없음

function GolfSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGolfCourses, setFilteredGolfCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchPerformed, setSearchPerformed] = useState(false); // 검색 수행 여부
    const [clickedIndex, setClickedIndex] = useState(null); // 클릭된 버튼 인덱스

    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) return; // if searchTerm is empty -> just return ( do not search )

        setLoading(true);
        setError(null);
        setFilteredGolfCourses([]); // 새로운 검색 시작 시 이전 결과 초기화
        setSearchPerformed(true); // 검색 수행 표시

        try {
            const response = await fetch(
                `https://roundandgo.shop/api/golf-courses/search?name=${encodeURIComponent(searchTerm)}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '골프장 정보를 불러오는데 실패했습니다.');
            }

            
            const data = await response.json();

            if (Array.isArray(data.data)) {
                setFilteredGolfCourses(data.data);
            } else {
                setFilteredGolfCourses([]);
            }
        } catch (err) {
            console.error("API 호출 중 에러 발생:", err);
            setError(err.message);
            setFilteredGolfCourses([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // 페이지 이동
    const navigate = useNavigate();

    // NO 예약했을 경우, '예약한 ~' 클릭 시 -> 제주도 전체 음식점, 놀거리, 숙박시설만 보여주기
    const NoReserve = () => {
        // 토큰 확인 후 main 페이지로 이동
        const accessToken = localStorage.getItem('kakaoAccessToken') ||
            localStorage.getItem('emailAccessToken') ||
            localStorage.getItem('accessToken') ||
            localStorage.getItem('authToken');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        console.log('🔍 Search에서 Main 페이지 이동 전 토큰 확인:', {
            hasAccessToken: !!accessToken,
            isLoggedIn: isLoggedIn
        });

        if (accessToken || isLoggedIn) {
            console.log('✅ 토큰 확인 완료. Main 페이지로 이동합니다.');
            navigate('/main');
        } else {
            console.log('⚠️ 토큰이 없습니다. 로그인 페이지로 이동합니다.');
            navigate('/email-login');
        }
    }

    // 예약했을 경우, '클릭' 버튼 터치 시 -> 해당 정보 기반 주변 음식점, 놀거리, 숙박시설만 보여주기
    const Reserve = (index) => {
        setClickedIndex(index); // 클릭 상태 설정

        setTimeout(() => {
            // 토큰 확인 후 main 페이지로 이동
            const accessToken = localStorage.getItem('kakaoAccessToken') ||
                localStorage.getItem('emailAccessToken') ||
                localStorage.getItem('accessToken') ||
                localStorage.getItem('authToken');
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            console.log('🔍 Search Reserve에서 Main 페이지 이동 전 토큰 확인:', {
                hasAccessToken: !!accessToken,
                isLoggedIn: isLoggedIn
            });

            if (accessToken || isLoggedIn) {
                console.log('✅ 토큰 확인 완료. Main 페이지로 이동합니다.');
                navigate('/main');
            } else {
                console.log('⚠️ 토큰이 없습니다. 로그인 페이지로 이동합니다.');
                navigate('/email-login');
            }
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
                    onKeyPress={handleKeyPress}
                />
                <img
                    className="SearchBtnImg"
                    src={SearchBtn}
                    alt="검색버튼"
                    onClick={handleSearch}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            <div className="Response" style={{color: 'white', fontWeight: 'bold', fontSize: '0.7rem'}}>
                <p onClick={NoReserve} style={{marginBottom: '2.2rem', fontWeight: '450'}}>예약한 골프장이 없어요</p>
                {loading && <p>로딩 중...</p>}
                {error && <p>에러 발생: {error}</p>}

                {!loading && !error && searchPerformed && (
                    filteredGolfCourses.length > 0 ? (
                            <ul style={{listStyle: 'none', paddingLeft: 0}}>
                                {filteredGolfCourses.map((course, index) => (
                                    <li key={course.id || index}>
                                        <div style={{width: '100%', margin: '3% 0'}}>
                                            <div className="entire-cont">
                                                <div className='msg-cont'>
                                                    <strong>{course.name}</strong>
                                                    <p>{course.address}</p>
                                                    <button
                                                        className="ChosenReservedBtn"
                                                        onClick={() => Reserve(index)}
                                                        style={{
                                                            backgroundColor: clickedIndex === index ? '#2d8779' : 'transparent',
                                                            color: clickedIndex === index ? 'white' : '#2d8779',
                                                            width: 'fit-content',
                                                            border: '1px solid #2d8779',
                                                            borderRadius: '50px',
                                                            fontSize: '0.65rem',
                                                            padding: '1% 5%'
                                                        }}
                                                    >
                                                        선택
                                                    </button>
                                                </div>
                                                <img
                                                    style={{width: '130px', height: '80px', borderRadius: '10px'}}
                                                    src={course.image_url ? course.image_url : NoImage}
                                                    alt={course.name}
                                                />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) :
                        // 검색어가 있을 때만 "검색 결과가 없어요" 표시
                        (
                            (
                                <div className="NoResponse">
                                    <img className="Warning" src={Warning} alt='검색결과 없음'/>
                                    <p style={{
                                        textAlign: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: '450'
                                    }}>
                                        조건에 맞는 골프장이 없어요
                                        <br/>
                                        <span style={{
                                            fontSize: '0.6rem',
                                            fontWeight: '350'
                                        }}>
                                        검색어를 확인해 주세요
                                    </span>
                                    </p>
                                </div>
                            )
                        )
                )}
            </div>
        </div>
    )
};

export default GolfSearch;
