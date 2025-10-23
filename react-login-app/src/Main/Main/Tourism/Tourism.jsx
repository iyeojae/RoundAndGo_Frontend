import React, { useEffect, useState, useRef } from 'react';
import NoImage from '../../../assets/NoImage.svg';
import { fetchTourData } from "../../../Common/BasedOn/API.js";

function Tourism({
                     title = '제주도 인기 관광지 모음',
                     subtitle = '',
                     mentClassName = 'IntroMent',
                     golfCourseId = null,
                     //useDummy = true,  // 더미데이터 사용 여부
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

    const scrollIndicatorWidth = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
    const currentCardIndex = tourismList.length > 0 ? Math.round(scrollPosition / 227) + 1 : 0;

    // CSS 스타일을 JavaScript 객체로 정의
    const styles = {
        Tourism: {
            width: '100%',
            margin: '0 auto'
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
        TourismScrollWrapper: {
            marginTop: '-56%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden',
            overflowX: 'scroll',

            // 스크롤바 커스텀 스타일
            scrollbarWidth: 'thin',          // Firefox
            msOverflowStyle: 'none',         // IE/Edge
            msScrollbarTrackColor: '#DEDEDE',
            scrollbarColor: '#2C8C7D',
            '&::-webkit-scrollbar': {
                height: '5px',                // 수평 스크롤바 높이
            },
            '&::-webkit-scrollbar-track': {
                background: '#DEDEDE',        // 트랙 배경
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#2C8C7D',        // 스크롤바 썸
            },

            padding: 0,
            gap: '16px',
        },
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
            overflowX: 'Scroll',
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
            element.style.setProperty('scrollbar-width', 'none');
            element.style.setProperty('-ms-overflow-style', 'none');
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

            <div className="TourismScrollWrapper" style={styles.TourismScrollWrapper}>
                <div className="TourismScrollArea" style={styles.TourismScrollArea}>
                    <div
                        className="ListOfTourismImg"
                        ref={(el) => {
                            scrollContainerRef.current = el;
                            applyWebkitStyle(el);
                        }}
                        onScroll={handleScroll}
                        style={styles.ListOfTourismImg}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tourism;
