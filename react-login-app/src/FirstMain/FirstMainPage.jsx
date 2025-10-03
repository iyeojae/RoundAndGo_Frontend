import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MapImage from '../assets/map_jeju.svg';
import GolfSearch from './Search.jsx';
import NoImage from '../assets/NoImage.svg';
import Warning from '../assets/Warning.svg'; // 검색결과 없음

import { TokenDebugging } from "./TokenCheking";

import './FirstMainPage.css';

const regions = [
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

const FirstMainPageWrapper = styled.div`
    background-image: linear-gradient(0.02deg, #269962 41.09%, #8BD3BA 57.62%, #2C8C7D 86.54%);
    display: flex;
    width: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 20px;
    box-sizing: border-box;
    margin: 0 auto;
`;

const Content = styled.div`
    text-align: center;
    width: 100%;
    box-sizing: border-box;
`;

const FirstText = styled.p`
    padding-top: 15%;
    font-size: clamp(1.3rem, 2vw, 1.5rem);
    line-height: 1.2;
    color: white;
    margin-bottom: 20px;

    span {
        margin: 0;
        padding: 0;
        background-color: white;
        color: #2C8C7D;
        font-weight: bold;
    }
`;

const Map = styled.div`
    position: relative;
    max-width: 90%;
    margin: 13% auto;
    box-sizing: content-box;

    img {
        position: relative;
        width: 100%;
        height: auto;
        display: block;
        z-index: 1;
    }
`;

const MapRegionButton = styled.button`
    position: absolute;
    width: fit-content;
    background-color: white;
    border-radius: 25px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #2C8C7D;
    font-size: 8px;
    font-weight: bold;
    text-align: center;
    z-index: 10;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    transition: opacity 0.2s ease, background-color 0.2s ease, transform 0.1s ease;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }

    &.selected {
        background-color: #FFE500;

        &:hover {
            background-color: #FFE500;
        }
    }
`;

const Top3ForRegion = styled.div`
    width: 90%;
    max-width: 380px;
    transition: all 0.3s ease-in-out;
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: ${props => (props.active ? '50px' : '0')};
    gap: ${props => (props.active ? '15px' : '0')};
    height: ${props => (props.active ? 'auto' : '0')};
    overflow: ${props => (props.active ? 'visible' : 'hidden')};
`;

const Subcomment = styled.div`
    margin: 10px auto;
    text-align: center;

    p {
        color: #fff;
        font-weight: 700;
    }
`;

const GolfList = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 13px;
    width: 100%;
`;

const GolfCourseImageWrapper = styled.div`
    position: relative;
    width: auto;
    flex-shrink: 1;
`;

const GolfCourseImage = styled.img`
    width: 100%;
    height: 140px;
    aspect-ratio: ${props => props.aspectRatio};
    object-fit: cover;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    position: relative;
    z-index: 1;
`;

const ImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${props => (props.visible ? 0.34 : 0)};
    background: ${props => (props.visible ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 23.56%, rgba(0, 0, 0, 0) 65.38%)' : 'none')};
    z-index: 2;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
`;

const ImageLabel = styled.div`
    position: absolute;
    top: 5%;
    left: 5%;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 400;
    z-index: 3;
`;

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
            <FirstMainPageWrapper>
                <TokenDebugging/>
                <Content>
                    <FirstText>
                        아래 지도에서 <span>원하는 <span>골프장</span></span>을<br/>선택해주세요
                    </FirstText>

                    <Map>
                        <img src={MapImage} alt="대한민국 지도"/>
                        {regions.map((region) => (
                            <MapRegionButton
                                key={region.name}
                                className={selectedRegionName === region.name ? 'selected' : ''}
                                style={{top: region.top, left: region.left}}
                                onClick={() => handleRegionClick(region.name)}
                            >
                                {region.name}
                            </MapRegionButton>
                        ))}
                    </Map>

                    <Top3ForRegion active={!!selectedRegionInfo}>
                        {selectedRegionInfo ? (
                            <>
                                <Subcomment>
                                    <p>{selectedRegionInfo.name}의 골프장, 이곳인가요?</p>
                                </Subcomment>

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
                                    <GolfList>
                                        {golfCourses.map((course, index) => {
                                            const isSelected = (index === selectedImageIndex) || (golfCourses.length === 0);
                                            const listSize = golfCourses.length;

                                            const aspectRatio = (listSize === 1 || listSize === 0)
                                                ? '400 / 140'
                                                : (isSelected
                                                    ? '234 / 140'
                                                    : (listSize === 2 ? '153 / 140' : '70 / 140'));

                                            return (
                                                <GolfCourseImageWrapper key={index}>
                                                    <GolfCourseImage
                                                        src={course.imageUrl || NoImage}
                                                        alt={course.name}
                                                        aspectRatio={aspectRatio}
                                                        onClick={() => handleImageClick(index, course)}
                                                    />

                                                    {(isSelected || listSize === 1 || listSize === 0) && (
                                                        <>
                                                            <ImageOverlay visible={isSelected} />
                                                            <ImageLabel>{course.name}</ImageLabel>
                                                        </>
                                                    )}
                                                </GolfCourseImageWrapper>
                                            );
                                        })}
                                    </GolfList>
                                )}
                            </>
                        ) : null}
                    </Top3ForRegion>

                    {/* 골프장 예약 내역 검색 컴포넌트 ( 분리 ) */}
                    <GolfSearch/>
                </Content>
            </FirstMainPageWrapper>
        </main>
    );
}

export default FirstMainPage;
