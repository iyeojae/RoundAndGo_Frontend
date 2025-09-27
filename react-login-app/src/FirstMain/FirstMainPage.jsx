// FirstMainPage.jsx
import React, { useState, useEffect } from 'react';
import './FirstMainPage.css';
import MapImage from './map_jeju.svg';
import GolfSearch from '../Search/Search.jsx';
import NoImage from '../Common/NoImage.svg';
import Warning from '../Search/Warning.svg'; // 검색결과 없음

import { TokenDebugging } from "./TokenCheking";

const regions = [ // 위치조정 필요 %로 설정하기
    { name: "한경면", top: "38%", left: "5%" },
    { name: "한림읍", top: "29%", left: "12%" },
    { name: "애월읍", top: "22%", left: "25%" },
    { name: "제주시", top: "16%", left: "40%" },
    { name: "조천읍", top: "11%", left: "57%" },
    { name: "구좌읍", top: "8%", left: "74%" },
    { name: "성산읍", top: "24%", left: "82%" },
    { name: "표선면", top: "30%", left: "70%" },
    { name: "남원읍", top: "37%", left: "58%" },
    { name: "서귀포시", top: "42%", left: "45%" },
    { name: "중문", top: "44%", left: "32%" },
    { name: "안덕면", top: "40%", left: "19%" },
    { name: "대정읍", top: "48%", left: "8%" }
];

function FirstMainPage() {
    const [selectedRegionName, setSelectedRegionName] = useState(null); // 선택된 지역 이름
    const [selectedRegionInfo, setSelectedRegionInfo] = useState(null); // 선택된 지역의 전체 정보
    const [golfCourses, setGolfCourses] = useState([]); // 해당 지역의 골프장 목록
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index, course) => {
        if (selectedImageIndex === index) {
            // 2번 클릭 -> 이동 및 id 저장
            console.log("저장된 골프장 ID:", course.id);
            localStorage.setItem("selectedGolfCourseId", course.id);
            window.location.href = '/main';
        } else {
            // 1번 클릭 -> 선택만
            setSelectedImageIndex(index);
        }
    };

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
        }
    };

    useEffect(() => {
        if (selectedRegionInfo) {
            const fetchGolfCourses = async () => {
                try {
                    const res = await fetch(`https://api.roundandgo.com/api/golf-courses/search-by-address?address=${selectedRegionInfo.name}`);
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

    useEffect(() => {
        if (golfCourses.length > 0) {
            // 가운데 index
            const centerIndex = Math.floor(golfCourses.length / 2);
            setSelectedImageIndex(centerIndex);
        }
    }, [golfCourses]);

    return (
        <main>
            <div className="FirstMainPage">
                <TokenDebugging/>
                <div className="content">
                    <div className="First">
                        <p>아래 지도에서 <span
                            style={{margin: "0", padding: "0", backgroundColor: "white", color: "#2C8C7D"}}>원하는
                    <span style={{fontWeight: "bold"}}>골프장</span></span>을<br/>선택해주세요</p>
                    </div>

                    <div className="Map">
                        <img src={MapImage} alt="대한민국 지도"/>
                        {regions.map((region) => (
                            <button
                                key={region.name}
                                className={`map-region-button ${selectedRegionName === region.name ? 'selected' : ''}`}
                                style={{position: 'absolute', top: region.top, left: region.left}}
                                onClick={() => handleRegionClick(region.name)}
                            >
                                {region.name}
                            </button>
                        ))}
                    </div>

                    <div className={`Top3ForRegion ${selectedRegionInfo ? 'active' : 'inactive'}`}>

                        {selectedRegionInfo ? (
                            <>
                                {/* 안내 문구 */}
                                <div className="subcomment">
                                    <p>{selectedRegionInfo.name}의 골프장, 이곳인가요?</p>
                                </div>

                                {/* 골프장 이미지 리스트 */}
                                {golfCourses.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        color: '#2C8C7D',
                                        marginTop: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <img style={{width: '70px', height: '70px'}} src={Warning} alt='경고 이미지'/>
                                        <p style={{
                                            color: '#fff',
                                            marginTop: '10%',
                                            fontSize: '0.75rem',
                                            fontWeight: '450'
                                        }}>해당 지역에 골프장이 없어요</p>
                                    </div>
                                ) : (
                                    <div className="GolfList">
                                        {golfCourses.map((course, index) => {
                                            const isSelected = (index === selectedImageIndex) || (golfCourses.length === 0);
                                            const listSize = golfCourses.length;

                                            // 동적 스타일 설정
                                            const imageStyle = {
                                                width: '100%',
                                                height: '140px',
                                                aspectRatio: (listSize === 1 || listSize === 0) ? '400 / 140' : (isSelected ? '234 / 140' : (listSize === 2 ? '153 / 140' : '70 / 140')),
                                                objectFit: 'cover',
                                                transition: 'all 0.5s ease-in-out',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                zIndex: 1,
                                            };

                                            const overlay = {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: isSelected ? 0.34 : 0,
                                                background: isSelected ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 23.56%, rgba(0, 0, 0, 0) 65.38%)' : 'none',
                                                zIndex: 2,
                                                pointerEvents: 'none',
                                                transition: 'all 0.3s ease-in-out'
                                            }
                                            return (
                                                <div key={index}
                                                     style={{position: 'relative', width: 'auto', flexShrink: 1}}>
                                                    <img
                                                        src={course.imageUrl || NoImage}
                                                        alt={course.name}
                                                        style={imageStyle} // 동적 width 적용
                                                        onClick={() => handleImageClick(index, course)}
                                                    />

                                                    {isSelected || listSize === 1 || listSize === 0 ? (
                                                        <>
                                                            <div style={overlay}></div>

                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '5%',
                                                                left: '5%',
                                                                color: '#fff',
                                                                fontSize: '0.6rem',
                                                                fontWeight: '400',
                                                                zIndex: 3
                                                            }}>
                                                                {course.name} {/* 골프장 이름 - 클릭된 이미지에서 표시 isSelected */}
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>

                    {/* 골프장 예약 내역 검색 컴포넌트 ( 분리 ) */}
                    <GolfSearch/>
                </div>
            </div>
        </main>
    );
}

export default FirstMainPage;