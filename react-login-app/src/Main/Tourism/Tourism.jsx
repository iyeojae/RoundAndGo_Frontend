import React, { useEffect, useState, useRef } from 'react';
import NoImage from '../../Common/NoImage.svg';
import { fetchTourData } from "../../Common/BasedOn/API.js";
import './Tourism.css';

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

    return (
        <div className="Tourism" style={{width: '100%', margin: '0 auto'}}>
            <div style={{
                width: '100%',
                aspectRatio: '440 / 330',
                backgroundImage: 'linear-gradient(#269962 0%, #2C8C7D 33%)'
            }}>
                <p className={`${mentClassName}`}>{title}</p>
                <p className="IntroMent-sub">{subtitle}</p>
            </div>

            <div className="TourismScrollWrapper" style={{marginTop: '-56%', position: 'relative'}}>
                <div style={{
                    overflowX: 'scroll',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    alignItems: 'center'
                }}>
                    <div
                        className="ListOfTourismImg"
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
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
                            >
                                <div className="TourImgCont">
                                    <img src={item.imageUrl || NoImage} alt={item.title}/>
                                </div>
                                <div className="TourismCard">
                                    <h3 className="Tourism-Title">{item.title}</h3>
                                    <p className="Tourism-Address">{item.address}</p>
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