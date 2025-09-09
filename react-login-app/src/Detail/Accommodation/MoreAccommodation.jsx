import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAccommodationDetail, getAccommodationImages, getAccommodationInfo } from '../../Common/Accommodation/AccommodationAPI';

function MoreAccommodation() {
    const location = useLocation();
    console.log(location);
    const { contentid } = location.state;  // 이전 페이지에서 전달된 contentid 가져오기

    const [accommodationDetail, setAccommodationDetail] = useState(null);
    const [accommodationImages, setAccommodationImages] = useState([]);
    const [accommodationInfo, setAccommodationInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 숙소 상세 정보, 이미지, 부대시설 및 서비스 데이터를 가져오는 함수
    useEffect(() => {
        const fetchAccommodationData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [detail, images, info] = await Promise.all([
                    getAccommodationDetail(contentid),  // 숙소 상세 정보
                    getAccommodationImages(contentid),  // 숙소 이미지
                    getAccommodationInfo(contentid)     // 숙소 부대시설
                ]);

                setAccommodationDetail(detail);
                setAccommodationImages(images);
                setAccommodationInfo(info);
            } catch (err) {
                setError("숙소 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccommodationData();
    }, [contentid]);  // contentid가 변경될 때마다 다시 실행

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="MoreAccommodation">
            {accommodationDetail && (
                <div>
                    <h2>{accommodationDetail.title}</h2>
                    <p>{accommodationDetail.overview}</p>
                    <p>주소: {accommodationDetail.addr1}</p>
                    {accommodationDetail.firstimage && (
                        <img src={accommodationDetail.firstimage} alt={accommodationDetail.title} width="300" />
                    )}
                </div>
            )}

            {accommodationImages.length > 0 && (
                <div>
                    <h3>추가 이미지</h3>
                    <div>
                        {accommodationImages.map((image, index) => (
                            <img key={index} src={image.originimgurl} alt={`이미지 ${index + 1}`} width="150" style={{ marginRight: '10px' }} />
                        ))}
                    </div>
                </div>
            )}

            {accommodationInfo.length > 0 && (
                <div>
                    <h3>부대시설 및 서비스</h3>
                    <ul>
                        {accommodationInfo.map((item, index) => (
                            <li key={index}>
                                <strong>{item.roomtitle}</strong>: {item.subfacility}<br />
                                <em>{item.roomtype}</em><br />
                                <small>{item.refundregulation}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MoreAccommodation;
