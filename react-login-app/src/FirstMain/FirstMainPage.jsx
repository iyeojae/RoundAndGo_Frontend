// FirstMainPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './FirstMainPage.css';
import { useKakaoLoginDetector } from '../useKakaoLoginDetector';
import MapImage from './map_jeju.svg';
import GolfSearch from '../Search/Search.jsx'; // 검색 기능

const regions = [ // 위치조정 필요 %로 설정하기
    { name: "한경면", top: "61%", left: "11%" },
    { name: "한림읍", top: "52%", left: "17%" },
    { name: "애월읍", top: "45%", left: "27%" }, //, imageFolder: "aewol", top3Image: null
    { name: "제주시", top: "39%", left: "41%" },
    { name: "조천읍", top: "36%", left: "57%" },
    { name: "구좌읍", top: "31%", left: "71%" },
    { name: "성산읍", top: "44%", left: "78%" },
    { name: "표선면", top: "52%", left: "67%" },
    { name: "남원읍", top: "60%", left: "57%" },
    { name: "서귀포시", top: "67%", left: "46%" },
    { name: "중문", top: "66%", left: "35%" },
    { name: "안덕면", top: "65%", left: "23%" },
    { name: "대정읍", top: "72%", left: "13%" }
];

function FirstMainPage() {
    // 🎯 백그라운드에서 카카오 로그인 성공 자동 감지 (UI 영향 없음)
    useKakaoLoginDetector();

    // 🍪 쿠키 디버깅 추가
    useEffect(() => {
        const debugCookiesAndTokens = () => {
            // 쿠키 파싱
            const parseCookies = () => {
                const cookieObj = {};
                document.cookie.split(';').forEach(cookie => {
                    const [name, value] = cookie.trim().split('=');
                    if (name && value) {
                        cookieObj[name] = decodeURIComponent(value);
                    }
                });
                return cookieObj;
            };

            // URL 파라미터 파싱
            const parseUrlParams = () => {
                const params = new URLSearchParams(window.location.search);
                const paramObj = {};
                for (let [key, value] of params.entries()) {
                    paramObj[key] = value;
                }
                return paramObj;
            };

            const currentCookies = parseCookies();
            const currentParams = parseUrlParams();

            // 상세 디버깅 로그
            console.log('🚀 FirstMainPage 로드됨 - 쿠키 및 토큰 분석 시작');
            console.log('🍪 현재 쿠키:', currentCookies);
            console.log('🔗 URL 파라미터:', currentParams);
            console.log('🌐 현재 도메인:', window.location.hostname);
            console.log('🔒 현재 프로토콜:', window.location.protocol);
            console.log('📋 전체 쿠키 문자열:', document.cookie);
            console.log('🕒 현재 시간:', new Date().toISOString());

            // 백엔드에서 설정한 쿠키 확인
            if (currentCookies.accessToken) {
                console.log('✅ accessToken 쿠키 발견!');
                console.log('📄 토큰 내용 (처음 50자):', currentCookies.accessToken.substring(0, 50) + '...');
                
                // localStorage로 이동
                localStorage.setItem('authToken', currentCookies.accessToken);
                if (currentCookies.refreshToken) {
                    localStorage.setItem('refreshToken', currentCookies.refreshToken);
                }
                localStorage.setItem('user', JSON.stringify({
                    type: 'kakao',
                    loginTime: new Date().toISOString(),
                    isOAuth2: true,
                    source: 'cookie-from-backend',
                    domain: window.location.hostname
                }));
                
                console.log('✅ 쿠키에서 localStorage로 토큰 이동 완료');
                
                // 쿠키에서 토큰을 가져왔으므로 성공 메시지 표시
                setTimeout(() => {
                    alert('카카오 로그인 성공!\n토큰이 정상적으로 받아졌습니다.');
                }, 1000);
                
            } else {
                console.log('❌ accessToken 쿠키를 찾을 수 없습니다');
                console.log('🔍 사용 가능한 쿠키 목록:', Object.keys(currentCookies));
                
                // 대안: URL 파라미터에서 토큰 찾기
                if (currentParams.token || currentParams.accessToken) {
                    console.log('🔄 URL 파라미터에서 토큰 발견');
                    const accessToken = currentParams.accessToken || currentParams.token;
                    const refreshToken = currentParams.refreshToken;
                    
                    // 토큰을 localStorage에 안전하게 저장
                    localStorage.setItem('authToken', accessToken);
                    if (refreshToken) {
                        localStorage.setItem('refreshToken', refreshToken);
                    }
                    localStorage.setItem('user', JSON.stringify({
                        type: 'kakao',
                        loginTime: new Date().toISOString(),
                        isOAuth2: true,
                        source: 'url-parameter'
                    }));
                    
                    console.log('✅ URL 파라미터에서 localStorage로 토큰 저장 완료');
                    
                    // 🔒 보안 강화: URL에서 토큰 파라미터 제거 후 리다이렉트
                    console.log('🔒 보안을 위해 URL에서 토큰 파라미터 제거 중...');
                    
                    // 깨끗한 URL로 브라우저 히스토리 업데이트 (새로고침 없이)
                    const cleanUrl = window.location.origin + window.location.pathname;
                    window.history.replaceState(null, '', cleanUrl);
                    
                    console.log('✅ URL 정리 완료 - 토큰이 더 이상 URL에 노출되지 않습니다');
                    
                    // 사용자에게 성공 알림
                    setTimeout(() => {
                        alert('카카오 로그인 성공!\n보안을 위해 URL이 정리되었습니다.');
                    }, 500);
                }
            }

            // 모든 쿠키 상세 분석
            console.log('📊 쿠키 상세 분석:');
            Object.entries(currentCookies).forEach(([key, value]) => {
                console.log(`  ${key}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
            });
        };

        debugCookiesAndTokens();
    }, []);

    const [selectedRegionName, setSelectedRegionName] = useState(null); // 선택된 지역 이름
    const [selectedRegionInfo, setSelectedRegionInfo] = useState(null); // 선택된 지역의 전체 정보
    const [golfCourses, setGolfCourses] = useState([]); // 해당 지역의 골프장 목록
    const [selectedImageIndex, setSelectedImageIndex] = useState(1); // 가운데 강조될 이미지 인덱스

    const navigate = useNavigate();
    const goToMainPage = () => {
        navigate('/main'); // main페이지로 이동
    }

    const handleRegionClick = (clickedRegionName) => {
        // 이미 선택된 지역을 다시 클릭하면 선택 해제
        if (selectedRegionName === clickedRegionName) {
            setSelectedRegionName(null);
            setSelectedRegionInfo(null);
            setGolfCourses([]);
        } else {
            // 새 지역을 클릭하면 해당 지역 정보 업데이트
            const regionInfo = regions.find(r => r.name === clickedRegionName);
            setSelectedRegionName(clickedRegionName);
            setSelectedRegionInfo(regionInfo);
            setSelectedImageIndex(1); // 초기 가운데 강조
        }
    };

    useEffect(() => {
        if (selectedRegionInfo) {
            const fetchGolfCourses = async () => {
                try {
                    const res = await fetch(`https://roundandgo.onrender.com/api/golf-courses/search-by-address?address=${selectedRegionInfo.name}`);
                    const result = await res.json();

                    if (Array.isArray(result.data)) {
                        setGolfCourses(result.data.slice(0, 3)); // 최대 3개만 보여줌
                    } else {
                        setGolfCourses([]);
                    }
                } catch (error) {
                    console.error("Error fetching golf courses:", error);
                    setGolfCourses([]);
                }
            };

            fetchGolfCourses();
        }
    }, [selectedRegionInfo]);

    return (
        <div className="FirstMainPage">
            <div className="content">
                <div className="First">
                    <p>아래 지도에서 <span style={{margin: "0", padding: "0", backgroundColor: "white", color: "#2C8C7D"}}>원하는
                    <span style={{fontWeight: "bold"}}>골프장</span></span>을<br/>선택해주세요</p>
                </div>

                <div className="Map">
                    <img src={MapImage} alt="대한민국 지도"/>
                    {regions.map((region) => (
                        <button
                            key={region.name}
                            className={`map-region-button ${selectedRegionName === region.name ? 'selected' : ''}`}
                            style={{ top: region.top, left: region.left }}
                            onClick={() => handleRegionClick(region.name)}
                        >
                            {region.name}
                        </button>
                    ))}
                </div>

                <div className="Top3ForRegion" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    width: '90%',
                    margin: '0 auto 100px auto'
                }}>
                    {selectedRegionInfo ? (
                        <>
                            {/* 안내 문구 */}
                            <div className="subcomment" style={{margin: '20px auto 12px auto', textAlign: 'center'}}>
                                <p style={{
                                    backgroundColor: "white",
                                    color: "#2C8C7D",
                                    fontWeight: "normal"
                                }}>{selectedRegionInfo.name}의 골프장, 이곳인가요?</p>
                            </div>

                            {/* 골프장 이미지 리스트 */}
                            <div className="GolfList" style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '13px'
                            }}>
                                {golfCourses.map((course, index) => {
                                    const isSelected = index === selectedImageIndex;
                                    const imageStyle = {
                                        width: isSelected ? '200px' : '70px',
                                        height: '140px',
                                        objectFit: 'cover',
                                        transition: 'all 0.5s ease-in-out',
                                        cursor: 'pointer'
                                    };

                                    return (
                                        <img
                                            key={index}
                                            src={course.image_url}
                                            alt={course.name}
                                            style={imageStyle}
                                            onClick={() => setSelectedImageIndex(index)}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    ) : null}
                </div>

                <GolfSearch/> {/* 골프장 예약 내역 검색 로직 - 컴포넌트 따로 */}

                {/* 임시 이동 버튼 */}
                <div className="TemporaryButton">
                    <button onClick={goToMainPage}>임시<br/>메인 페이지로 이동</button>
                </div>
            </div>
        </div>
    );
}

export default FirstMainPage;