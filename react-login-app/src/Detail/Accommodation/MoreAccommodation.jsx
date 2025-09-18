import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { getAccommodationDetail, getAccommodationImages, getAccommodationInfo } from '../../Common/Accommodation/AccommodationAPI';

import arrow from '../Navbar/BackArrowGR.svg';
import NoImage from '../../Common/NoImage.svg';
import Check from '../check.svg';
import copyIcon from './copy.svg';
import './MoreAccommodation.css';

function MoreAccommodation() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    const location = useLocation();
    const { contentId, mapx, mapy } = location.state || {};

    const mapContainer = useRef(null);

    useEffect(() => {
        if (!mapx || !mapy) return;

        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                initMap();
            } else {
                const script = document.createElement('script');
                script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=본인의_API_KEY&autoload=false';
                script.async = true;
                document.head.appendChild(script);
                script.onload = () => {
                    window.kakao.maps.load(initMap);
                };
            }
        };

        const initMap = () => {
            const container = mapContainer.current;
            if (!container) {
                console.error("mapContainer가 아직 준비되지 않았습니다.");
                return;
            }

            const options = {
                center: new window.kakao.maps.LatLng(mapy, mapx),
                level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(mapy, mapx),
            });
            marker.setMap(map);
        };

        loadKakaoMap();
    }, [mapx, mapy]);


    const [detail, setDetail] = useState(null);
    const [images, setImages] = useState([]);
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllFacilities, setShowAllFacilities] = useState(false);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        console.log('contentId:', contentId);
        console.log('mapx:', mapx);
        console.log('mapy:', mapy);

        if (!contentId) {
            setError("숙소 ID가 없습니다.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [detailData, imageData, infoData] = await Promise.all([
                    getAccommodationDetail(contentId),
                    getAccommodationImages(contentId),
                    getAccommodationInfo(contentId),
                ]);
                setDetail(detailData);
                setImages(imageData);
                setInfo(infoData);
                setError(null);
            } catch (err) {
                setError("숙소 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const storedTags = localStorage.getItem('selectedTags');
        if (storedTags) {
            setTags(JSON.parse(storedTags));
        }
    }, [contentId]);

    const copyAddress = () => {
        if (detail?.addr1) {
            navigator.clipboard.writeText(detail.addr1);
            alert("주소가 복사되었습니다.");
        }
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
        aircondition: "에어컨",
    };

    const extractFacilities = () => {
        const facilities = info?.[0]?.facilities || {};
        return Object.entries(facilities)
            .filter(([_, val]) => val)
            .map(([key]) => facilityMap[key])
            .filter(Boolean);
    };

    const allFacilities = extractFacilities();
    const visibleFacilities = allFacilities.slice(0, 6);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: false,
        centerPadding: '10px',
        dots: false,
        arrows: false,
    };

    return (
        <div className="MoreAccommodation">
            {/* 대표 이미지 */}
            <div className="Image">
                <img onClick={goBack} id="back-arrow" src={arrow} alt="back-arrow" />
                {detail?.firstimage ? (
                    <img src={detail.firstimage} alt={detail.title || 'None'} />
                ) : (
                    <img src={NoImage} alt="이미지 없음" />
                )}
            </div>

            <div className="Contentainer">
                <div className="TagTitleContainer">
                    {/* 태그 */}
                    {tags.length > 0 && (
                        <div className="hashtags">
                            {tags.map((tag, index) => (
                                <span key={index}>{tag} </span>
                            ))}
                        </div>
                    )}
                    <h2>{detail?.title}</h2>
                </div>

                {/* 숙소사진 */}
                {images.length > 0 && (
                    <div className="next-images">
                        <h6>숙소사진</h6>
                        <div className="slider-wrapper">
                            <Slider {...settings}>
                                {images.map((img, i) => (
                                    <div key={i} className="slider-item">
                                        <img
                                            src={img.originimgurl}
                                            alt={`추가 이미지 ${i + 1}`}
                                            className={`slider-image ${i === mainImageIndex ? 'active' : ''}`}
                                            onClick={() => setMainImageIndex(i)}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                )}

                {/* 부대시설 */}
                <div>
                    <h6>서비스 및 부대시설</h6>
                    <div className="section service-container">
                        <div className="service-header">
                            {allFacilities.length > 6 && (
                                <p onClick={() => setShowAllFacilities(!showAllFacilities)}>
                                    {showAllFacilities ? "접기" : "더보기"}
                                </p>
                            )}
                        </div>
                        <ul className="facilities-list">
                            {(showAllFacilities ? allFacilities : visibleFacilities).map((f, i) => (
                                <li key={i}>
                                    <img id="check" src={Check} alt="체크" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 위치 */}
                <div>
                    <h6>위치</h6>
                    <div className="location-container">
                        <div className="location-map" ref={mapContainer} style={{ width: '100%', height: '300px' }}>
                            {/* 지도 렌더링 영역 */}
                        </div>
                        <div className="textC">
                            <p className="address-text">{detail?.addr1}</p>
                            <button className="address-copy-btn" onClick={copyAddress}>
                                <img src={copyIcon} alt="주소 복사" /> 주소 복사
                            </button>
                        </div>
                    </div>
                </div>


                {/* 숙소 소개 */}
                <div>
                    <h6>숙소 소개</h6>
                    <div className="section introduce">
                        <p>{detail?.overview || "소개가 없습니다."}</p>
                    </div>
                </div>

                <div className="more-btn">
                    {/* 자세히 보러가기 */}
                    <button
                        onClick={() => {
                            alert("자세히 보러가기 기능은 아직 미정입니다.");
                        }}
                    >
                        자세히 보러가기
                    </button>
                </div>

            </div>
        </div>
    );
}

export default MoreAccommodation;
