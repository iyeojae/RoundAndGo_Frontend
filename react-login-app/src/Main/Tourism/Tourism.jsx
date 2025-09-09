// Tourism.jsx
import React, { useEffect, useState } from 'react';
// import Replace from "../Replace.jpg";
import NoImage from '../../Common/NoImage.svg';
import { fetchTourismData } from "../../Common/Tourism/TourismAPI";
import './Tourism.css';

// const ReplaceImage = Replace;  // 일단 임시적인 대체 이미지 ( 모든 곳에 적용 - 이미지가 없는 )

function Tourism({
                     title = '제주도 인기 관광지 모음',
                     subtitle = '',
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
        <div className="Tourism" style={{ width: '100%', margin: '0 auto' }}> {/* 관광지 정보 - 더보기 없음 */}
            <div style={{ backgroundImage: 'linear-gradient(#269962 0%, #2C8C7D 33%)' }}>
                <p
                    className="IntroMent"
                    style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: '10px',
                        paddingTop: '20px'
                    }}
                >
                    {title}
                </p>
                <p className="IntroMent-sub" style={{ color: '#fff', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>{subtitle}</p>

                {/* 관광지 이미지 리스트 */}
                <div
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        columnGap: '16px',
                        scrollbarWidth: 'none',
                        padding: '0 16px',
                    }}
                >
                    {tourismList.map((item, index) => (
                        <div key={index} style={{ minWidth: '211px', flexShrink: 0 }}>  {/*관광지 이미지*/}
                            <div
                                style={{
                                    width: '211px',
                                    height: '246px', // 병합 시 더 긴 쪽 선택
                                    overflow: 'hidden',
                                    borderTopLeftRadius: '105px',
                                    borderTopRightRadius: '105px',
                                    backgroundColor: '#fff' // 이미지가 없는 경우 흰색 배경
                                }}
                            >
                                <img
                                    src={item.imageUrl || NoImage}
                                    alt={item.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 관광지 텍스트 카드 리스트 */}
            <div
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    columnGap: '16px',
                    scrollbarWidth: 'none',
                    padding: '0 16px',
                    marginTop: '10px',
                }}
            >
                {tourismList.map((item, index) => (
                    <div key={index} style={{ minWidth: '211px', flexShrink: 0 }}>
                        <div
                            style={{
                                backgroundColor: '#fff',
                                padding: '12px 0',
                                width: '211px',
                                height: '80px',
                                marginBottom: '10px',
                                boxShadow: '0 0px 10px rgba(0,0,0,0.25)',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center'
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    margin: '4px auto 0 auto',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '90%',
                                    textAlign: 'center'
                                }}
                            >
                                {item.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: '12px',
                                    color: '#797979',
                                    margin: '4px auto 0 auto',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '90%',
                                    textAlign: 'center'
                                }}
                            >
                                {item.address}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tourism;
