// Tourism.jsx
import React, { useEffect, useState } from 'react';
import Replace from "../Replace.jpg";

const ReplaceImage = Replace;  // 일단 임시적인 대체 이미지 ( 모든 곳에 적용 - 이미지가 없는 )

function Tourism() {
    const [tourismList, setTourismList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTourism = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?numOfRows=100&MobileOS=WEB&MobileApp=ROUND%26GO&arrange=O&contentTypeId=12&areaCode=39&serviceKey=2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D&_type=json`
                );
                const data = await response.json();

                const items = data.response.body.items.item || [];

                const parsed = items.map(item => ({
                    title: item.title,
                    imageUrl: item.firstimage,
                    category: item.cat1,
                    address: item.addr2 ? `${item.addr1} ${item.addr2}` : item.addr1
                }));

                setTourismList(parsed);
            } catch (err) {
                setError('관광지 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTourism();
    }, []);

    if (loading) return <p>불러오는 중입니다...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="Tourism" style={{width: '100%', margin: '0 auto'}}> {/* 관광지 정보 - 더보기 없음 */}
            <div style={{backgroundImage: 'linear-gradient(#269962 0%, #2C8C7D 33%)'}}>
                <p
                    className="IntroMent"
                    style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: '20px',
                        paddingTop: '20px'
                    }}
                >
                    제주도 인기 관광지 모음
                </p>

                <div style={{display: 'flex', overflowX: 'auto', columnGap: '16px', scrollbarWidth: 'none'}}>
                    {tourismList.map((item, index) => (
                        <div key={index} style={{minWidth: '211px', flexShrink: 0}}>  {/*관광지 이미지*/}
                            {/* 이미지 부분 */}
                            <div
                                style={{
                                    width: '211px',
                                    height: '230px',
                                    overflow: 'hidden',
                                    borderTopLeftRadius: '50%',
                                    borderTopRightRadius: '50%',
                                    backgroundColor: '#fff' // 이미지가 없는 경우 흰색 배경
                                }}
                            >
                                <img
                                    src={item.imageUrl || ReplaceImage}
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

            <div style={{
                display: 'flex',
                overflowX: 'auto',
                columnGap: '16px',
                scrollbarWidth: 'none',
            }}>
                {tourismList.map((item, index) => (
                    // 관광지 이미지에 대응하는 텍스트
                    <div key={index} style={{minWidth: '211px', flexShrink: 0}}>
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
                            {/* 넘치면 ... 처리 */}
                            <h3 style={{fontSize: '14px', fontWeight: '600', margin: '4px auto 0 auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '90%', textAlign: 'center'}}>{item.title}</h3>
                            <p style={{fontSize: '12px', color: '#797979', margin: '4px auto 0 auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '90%', textAlign: 'center'}}>{item.address}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tourism;