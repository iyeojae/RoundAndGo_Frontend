import React, { useEffect, useState, useRef } from 'react';
import NoImage from '../../../assets/NoImage.svg';
import { fetchTourData } from "../../../Common/BasedOn/API.js";
import styled from "styled-components";

function Tourism({
                     title = '제주도 인기 관광지 모음',
                     subtitle = '',
                     mentClassName = 'IntroMent',
                     golfCourseId = null,
                 }) {
    const [tourismList, setTourismList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const loadTourismData = async () => {
            setLoading(true);
            setError(null);

            try {
                let data;

                const savedId = localStorage.getItem("selectedGolfCourseId");
                const currentGolfCourseId = savedId ? parseInt(savedId, 10) : golfCourseId;
                data = await fetchTourData('attractions', currentGolfCourseId);

                const mapped = data.map(item => ({
                    title: item.title,
                    imageUrl: item.firstimage || item.imageUrl || NoImage,
                    address: item.addr2 ? `${item.addr1} ${item.addr2}` : item.addr1 || '',
                    category: item.cat1 || item.category || '기타',
                })).slice(0, 30);

                setTourismList(mapped);
            } catch (err) {
                setError('관광지 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTourismData();
    }, [golfCourseId]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setScrollPosition(scrollLeft);
            setMaxScroll(scrollWidth - clientWidth);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            handleScroll();
        }
    }, [tourismList]);

    if (loading) return <p>불러오는 중입니다...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const scrollRatio = maxScroll > 0 ? scrollPosition / maxScroll : 0;
    const currentCardIndex =
        tourismList.length > 0 ? Math.min(tourismList.length, Math.floor(scrollRatio * tourismList.length) + 1) : 0;

    // CSS 스타일을 JavaScript 객체로 정의
    const styles = {
        Tourism: {
            width: '100%',
            margin: '0 auto',
        },
        IntroMent: {
            fontSize: 'clamp(18px, 2vw, 20px)',
            fontWeight: 500,
            color: '#fff',
            textAlign: 'center',
            marginBottom: '10px',
            paddingTop: '20px',
        },
        IntroMentDetail: {
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontWeight: 400,
            color: '#fff',
            textAlign: 'center',
            marginBottom: '10px',
            paddingTop: '20px'
        },
        IntroMentSub: {
            fontSize: 'clamp(18px, 2vw, 20px)',
            fontWeight: 500,
            color: '#fff',
            textAlign: 'center',
            marginBottom: '20px'
        },
        // TourismScrollWrapper: {
        //     marginTop: '-56%',
        //     position: 'relative',
        //     display: 'flex',
        //     flexDirection: 'column',
        //     overflowY: 'hidden',
        //     overflowX: 'scroll',
        //
        //     // 스크롤바 커스텀 스타일
        //     scrollbarWidth: 'thin',          // Firefox
        //     msOverflowStyle: 'none',         // IE/Edge
        //     msScrollbarTrackColor: '#DEDEDE',
        //     scrollbarColor: '#2C8C7D',
        //     '&::WebkitScrollbar': {
        //         height: '5px',                // 수평 스크롤바 높이
        //     },
        //     '&::WebkitScrollbarTrack': {
        //         backgroundColor: '#DEDEDE',        // 트랙 배경
        //     },
        //     '&::WebkitScrollbarThumb': {
        //         backgroundColor: '#2C8C7D',        // 스크롤바 썸
        //     },
        //
        //     padding: 0,
        //     gap: '16px',
        // },
        TourismScrollArea: {
            whiteSpace: 'nowrap',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'center',
        },
        ListOfTourismImg: {
            display: 'flex',
            overflowX: 'scroll',
            overflowY: 'hidden',
            columnGap: '16px',
            padding: '0 5%',
            paddingBottom: '20px',
            width: '100%',
            minWidth: 'max-content',
        },
        TourismCardWrapper: {
            minWidth: '211px',
            flexShrink: 0,
            cursor: 'pointer'
        },
        TourImgCont: {
            width: '211px',
            aspectRatio: '211 / 246',
            overflow: 'hidden',
            borderTopLeftRadius: '105px',
            borderTopRightRadius: '105px',
            backgroundColor: '#fff'
        },
        TourImgContImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        TourismCard: {
            backgroundColor: '#fff',
            padding: '12px 0',
            width: '211px',
            height: '80px',
            marginBottom: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
        },
        TourismTitle: {
            fontSize: '14px',
            fontWeight: 600,
            margin: '4px auto 0 auto',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '90%',
            textAlign: 'center'
        },
        TourismAddress: {
            fontSize: '12px',
            color: '#797979',
            margin: '4px auto 0 auto',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '90%',
            textAlign: 'center'
        },
    };

    const applyWebkitStyle = (element) => {
        if (element) {
            element.style.setProperty('-webkit-overflow-scrolling', 'touch');
        }
    };

    // mentClassName에 따른 스타일 선택
    const mentStyle = mentClassName === 'IntroMentDetail' ? styles.IntroMentDetail : styles.IntroMent;

    return (
        <div className="Tourism" style={styles.Tourism}>
            <div style={{
                width: '100%',
                aspectRatio: '440 / 330',
                backgroundImage: 'linear-gradient(#269962 0%, #2C8C7D 33%)'
            }}>
                <p className={`${mentClassName}`} style={mentStyle}>{title}</p>
                <p className="IntroMent-sub" style={styles.IntroMentSub}>{subtitle}</p>
            </div>

            <TourismScrollWrapper>
                <ScrollableArea
                    ref={(el) => {
                        scrollContainerRef.current = el;
                        applyWebkitStyle(el);
                    }}
                    onScroll={handleScroll}
                >
                    {tourismList.map((item, index) => (
                        <div
                            className="TourismCardWrapper"
                            style={styles.TourismCardWrapper}
                            key={`tourism-${index}`}
                        >
                            <div style={styles.TourImgCont}>
                                <img
                                    src={item.imageUrl || NoImage}
                                    alt={item.title}
                                    style={styles.TourImgContImg}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = NoImage;
                                    }}
                                />
                            </div>
                            <div style={styles.TourismCard}>
                                <span style={styles.TourismTitle}>{item.title}</span>
                                <span style={styles.TourismAddress}>{item.address}</span>
                            </div>
                        </div>
                    ))}
                </ScrollableArea>

                {/* 페이지 표시 */}
                <PageIndicator>
                    {String(currentCardIndex).padStart(2, '0')} / {String(tourismList.length).padStart(2, '0')}
                </PageIndicator>
            </TourismScrollWrapper>
        </div>
    );
}

export default Tourism;

/* 스크롤바 영역 컨테이너 */
const TourismScrollWrapper = styled.div`
    margin-top: -60%;
    position: relative;
    width: 100%;
`;

/* 실제 스크롤 가능한 영역 */
const ScrollableArea = styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 16px;
    padding: 0 3% 20px 3%;
    scroll-behavior: smooth;

    /* 스크롤바 스타일 */
    scrollbar-width: thin;
    scrollbar-color: #2C8C7D #DEDEDE;

    &::-webkit-scrollbar {
        height: 3px;
    }

    &::-webkit-scrollbar-track {
        background-color: #DEDEDE;
        border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #2C8C7D;
        border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #1e6b59;
    }

    &::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
    }
`;

/* 페이지네이션? 느낌 */
const PageIndicator = styled.p`
    position: absolute;
    right: 4%;
    bottom: 0;

    color: #2C8C7D;
    font-size: clamp(10px, 2vw, 13px);
    font-weight: 500;
    letter-spacing: 0.5px;
`;
