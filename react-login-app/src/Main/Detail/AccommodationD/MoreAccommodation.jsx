import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { getAccommodationDetail, getAccommodationImages, getAccommodationInfo } from '../../../Common/Accommodation/AccommodationAPI';
import { KAKAO_CONFIG } from '../../../config/kakaoConfig';

import arrow from '../../../assets/BackArrowGR.svg';
import NoImage from '../../../assets/NoImage.svg';
import Check from '../../../assets/check.svg';
import copyIcon from '../../../assets/copy.svg';
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
        if (!mapx || !mapy) {
            console.log('지도 좌표가 없습니다:', { mapx, mapy });
            return;
        }

        if (!mapContainer.current) {
            console.log('mapContainer가 아직 준비되지 않았습니다. 재시도합니다.');
            return;
        }

        console.log('지도 초기화 시작:', { mapx, mapy });

        const initMap = () => {
            const container = mapContainer.current;
            if (!container) {
                console.error("mapContainer가 아직 준비되지 않았습니다.");
                return;
            }

            try {
                const options = {
                    center: new window.kakao.maps.LatLng(mapy, mapx),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options);

                const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(mapy, mapx),
                });
                marker.setMap(map);
                
                console.log('지도 초기화 완료');
            } catch (error) {
                console.error('지도 초기화 중 오류:', error);
            }
        };

        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                console.log('카카오맵 API가 이미 로드됨');
                initMap();
            } else {
                console.log('카카오맵 API 로딩 중...');
                const script = document.createElement('script');
                script.src = KAKAO_CONFIG.MAP_SDK_URL_AUTOLOAD_FALSE;
                script.async = true;
                document.head.appendChild(script);
                script.onload = () => {
                    console.log('카카오맵 스크립트 로드 완료');
                    window.kakao.maps.load(() => {
                        console.log('카카오맵 API 로드 완료');
                        // DOM이 준비될 때까지 기다린 후 지도 초기화
                        setTimeout(initMap, 200);
                    });
                };
                script.onerror = (error) => {
                    console.error('카카오맵 스크립트 로드 실패:', error);
                };
            }
        };

        // DOM이 완전히 준비될 때까지 기다린 후 지도 로딩 시도
        setTimeout(loadKakaoMap, 300);
    }, [mapx, mapy, mapContainer.current]);


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

    const handleMoreDetailsClick = () => {
        if (detail?.title) {
            const query = encodeURIComponent(detail.title);
            const url = `https://search.naver.com/search.naver?query=${query}`;
            window.open(url, '_blank');
        } else {
            alert("숙소 정보가 없어 검색할 수 없습니다.");
        }
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
                            {(!mapx || !mapy) && (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#666',
                                    fontSize: '14px'
                                }}>
                                    지도 정보가 없습니다
                                </div>
                            )}
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
                        onClick={handleMoreDetailsClick}
                    >
                        자세히 보러가기
                    </button>
                </div>

            </div>
        </div>
    );
}

export default MoreAccommodation;