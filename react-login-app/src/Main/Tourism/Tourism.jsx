// Tourism.jsx
import React, { useEffect, useState } from 'react';
import NoImage from '../../Common/NoImage.svg';
import { fetchTourismData } from "../../Common/Tourism/TourismAPI";
import './Tourism.css';

function Tourism({
                     title = '제주도 인기 관광지 모음',
                     subtitle = '',
                     mentClassName = 'IntroMent',
                 }) {
    const [tourismList, setTourismList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTourismData = async () => {
            setLoading(true);
            try {
                const tourismItems = await fetchTourismData();  // fetchTourismData 함수 호출
                setTourismList(tourismItems);
            } catch (err) {
                setError('관광지 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTourismData();
    }, []);

    if (loading) return <p>불러오는 중입니다...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="Tourism" style={{width: '100%', margin: '0 auto'}}> {/* 관광지 정보 - 더보기 없음 */}
            <div style={{
                width: '100%',
                aspectRatio: '440 / 330',
                backgroundImage: 'linear-gradient(#269962 0%, #2C8C7D 33%)'
            }}>
                <p className={`${mentClassName}`}>{title}</p>
                <p className="IntroMent-sub">{subtitle}</p>
            </div>

            <div className="TourismScrollWrapper" style={{marginTop: '-56%', position: 'relative'}}>
                <div className="ListOfTourismImg" style={{display: 'flex', overflowX: 'auto'}}>
                    {tourismList.map((item, index) => (
                        <div
                            key={index}
                            style={{minWidth: '211px', flexShrink: 0, cursor: 'pointer'}}
                            onClick={() => {
                                const query = encodeURIComponent(item.title);
                                const url = `https://map.naver.com/v5/search/${query}`;
                                window.open(url, '_blank');
                            }}
                        >
                            <div className="TourImgCont">
                                <img src={item.imageUrl || NoImage} alt={item.title}/>
                            </div>

                            <div>
                                <div className="TourismCard">
                                    <h3 className="Tourism-Title">{item.title}</h3>
                                    <p className="Tourism-Address">{item.address}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Tourism;
