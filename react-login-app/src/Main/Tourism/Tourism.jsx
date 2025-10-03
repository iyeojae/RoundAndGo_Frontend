import React, { useEffect, useState, useRef } from 'react';
import NoImage from '../../assets/NoImage.svg';
import { fetchTourData } from "../../Common/BasedOn/API.js";

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
            try {
                const savedId = localStorage.getItem("selectedGolfCourseId");
                const currentGolfCourseId = savedId ? parseInt(savedId, 10) : golfCourseId;

                const data = await fetchTourData('attractions', currentGolfCourseId);
                const mapped = data.map(item => ({
                    title: item.title,
                    imageUrl: item.firstimage,
                    address: item.addr2 ? `${item.addr1} ${item.addr2}` : item.addr1,
                    category: item.cat1 || '기타'
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
            fontSize: '18px',
            fontWeight: 500,
            color: '#fff',
            textAlign: 'center',
            marginBottom: '10px',
            paddingTop: '20px',
        },
        IntroMentDetail: {
            fontSize: '14px',
            fontWeight: 400,
            color: '#fff',
            textAlign: 'center',
            marginBottom: '10px',
            paddingTop: '20px'
        },
        IntroMentSub: {
            fontSize: '18px',
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
            padding: 0,
            gap: '16px',
            msOverflowStyle: 'none',
        },
        TourismScrollArea: {
            overflowX: 'scroll',
            whiteSpace: 'nowrap',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'center',
        },
        ListOfTourismImg: {
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            columnGap: '16px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
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
        ScrollbarContainer: {
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(90% - 40px)',
            maxWidth: '400px',
            height: '5px',
            backgroundColor: '#e0e0e0',
            borderRadius: '5px',
            zIndex: 10
        },
        ScrollbarIndicator: {
            height: '100%',
            backgroundColor: '#269962',
            borderRadius: '5px',
            transition: 'width 0.1s ease-out',
            width: `${scrollIndicatorWidth}%` // 동적 값
        },
        ScrollNumber: {
            position: 'absolute',
            bottom: '-15px',
            right: '5%',
            fontSize: '14px',
            color: '#6c757d',
            zIndex: 11
        }
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
                                key={index}
                                className="TourismCardWrapper"
                                onClick={() => {
                                    const query = encodeURIComponent(item.title);
                                    const url = `https://map.naver.com/v5/search/${query}`;
                                    window.open(url, '_blank');
                                }}
                                style={styles.TourismCardWrapper}
                            >
                                <div className="TourImgCont" style={styles.TourImgCont}>
                                    <img src={item.imageUrl || NoImage} alt={item.title} style={styles.TourImgContImg}/>
                                </div>
                                <div className="TourismCard" style={styles.TourismCard}>
                                    <h3 className="Tourism-Title" style={styles.TourismTitle}>{item.title}</h3>
                                    <p className="Tourism-Address" style={styles.TourismAddress}>{item.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {maxScroll > 0 && (
                    <>
                        <div className="ScrollbarContainer" style={styles.ScrollbarContainer}>
                            <div className="ScrollbarIndicator" style={styles.ScrollbarIndicator}></div>
                        </div>
                        <div className="ScrollNumber" style={styles.ScrollNumber}>
                            {currentCardIndex}/{tourismList.length}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Tourism;