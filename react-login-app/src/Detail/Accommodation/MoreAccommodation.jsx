import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAccommodationDetail, getAccommodationImages, getAccommodationInfo } from '../../Common/Accommodation/AccommodationAPI';

function MoreAccommodation() {
    const location = useLocation();
    const { contentid } = location.state || {};

    const [detail, setDetail] = useState(null);
    const [images, setImages] = useState([]);
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllFacilities, setShowAllFacilities] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [detailData, imageData, infoData] = await Promise.all([
                    getAccommodationDetail(contentid),
                    getAccommodationImages(contentid),
                    getAccommodationInfo(contentid),
                ]);
                setDetail(detailData);
                setImages(imageData);
                setInfo(infoData);
            } catch (err) {
                setError("숙소 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [contentid]);

    const copyAddress = () => {
        navigator.clipboard.writeText(detail?.addr1 || '');
        alert("주소가 복사되었습니다.");
    };

    const facilityMap = {
        tv: "TV",
        pc: "PC",
        internet: "인터넷",
        refrigerator: "냉장고",
        sofa: "소파",
        table: "테이블",
        hairdryer: "드라이기",
        bath: "욕조",
        bathfacility: "목욕시설",
        aircondition: "에어컨"
    };

    const extractFacilities = () => {
        const facilities = info?.[0]?.facilities || {};
        return Object.entries(facilities)
            .filter(([_, val]) => val)
            .map(([key]) => facilityMap[key]);
    };

    const visibleFacilities = extractFacilities().slice(0, 6);
    const allFacilities = extractFacilities();

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="MoreAccommodation">
            {/* 대표 이미지 */}
            {detail?.firstimage && (
                <img src={detail.firstimage} alt={detail.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            )}

            {/* 해시태그 (샘플) */}
            <div className="hashtags" style={{ marginTop: '10px' }}>
                <span>#힐링</span> <span>#자연</span> <span>#가족여행</span>
            </div>

            {/* 제목 */}
            <h2>{detail?.title}</h2>

            {/* 추가 이미지 */}
            {images.length > 0 && (
                <div className="images-scroll" style={{ display: 'flex', overflowX: 'scroll' }}>
                    {images.map((img, i) => (
                        <img key={i} src={img.originimgurl} alt={`추가 이미지 ${i + 1}`} style={{ width: '150px', marginRight: '10px' }} />
                    ))}
                </div>
            )}

            {/* 부대시설 */}
            <div style={{ marginTop: '20px' }}>
                <h3>서비스 및 부대시설</h3>
                <ul>
                    {(showAllFacilities ? allFacilities : visibleFacilities).map((f, i) => (
                        <li key={i}>{f}</li>
                    ))}
                </ul>
                {allFacilities.length > 6 && (
                    <button onClick={() => setShowAllFacilities(!showAllFacilities)}>
                        {showAllFacilities ? "접기" : "더보기"}
                    </button>
                )}
            </div>

            {/* 장소 (지도는 샘플) */}
            <div style={{ marginTop: '20px' }}>
                <h3>장소</h3>
                <p>{detail?.addr1}</p>
                <button onClick={copyAddress}>주소 복사</button>
                {/* 지도 샘플: 카카오/네이버 지도 iframe 또는 API로 구현 가능 */}
                <div style={{ width: '100%', height: '200px', background: '#eee', marginTop: '10px' }}>
                    <p style={{ padding: '70px', textAlign: 'center' }}>지도 들어갈 자리</p>
                </div>
            </div>

            {/* 숙소 소개 */}
            <div style={{ marginTop: '20px' }}>
                <h3>숙소 소개</h3>
                <p>{detail?.overview || "소개가 없습니다."}</p>
            </div>

            {/* 자세히 보러가기 */}
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => {
                        // 예: 외부 상세 페이지가 있을 경우 열기
                        alert("자세히 보러가기 기능은 아직 미정입니다.");
                    }}
                >
                    자세히 보러가기
                </button>
            </div>
        </div>
    );
}

export default MoreAccommodation;
