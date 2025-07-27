// Accommodation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Replace from '../Replace.jpg';
import arrow from "../arrow.svg";

const ReplaceImage = Replace;

const getAccommodationCategory = (accommodation) => {
    const cat3Code = String(accommodation.cat3 || '');
    const CATEGORIES_MAP = {
        'B02010300': '프리미엄',
        'B02010100': '프리미엄',
        'B02010900': '가성비',
        'B02010600': '가성비',
        'B02010000': '가성비',
        'B02010200': '가성비',
        'B02010700': '감성',
        'B02011100': '감성',
        'B02011600': '감성',
        'B02010500': '감성',
    };
    return CATEGORIES_MAP[cat3Code] || '기타';
};

const getAccommodationTags = (acc) => {
    const tags = [];
    const title = (acc.title || '').toLowerCase();
    const cat3 = String(acc.cat3 || '');

    const PREMIUM_CODES = ['B02010300', 'B02010100'];
    const VALUE_CODES = ['B02010900', 'B02010600', 'B02010000', 'B02010200'];
    const EMOTIONAL_CODES = ['B02010700', 'B02011100', 'B0201100', 'B02010500'];

    if (PREMIUM_CODES.includes(cat3)) tags.push('#프리미엄');
    else if (VALUE_CODES.includes(cat3)) tags.push('#가성비');
    else if (EMOTIONAL_CODES.includes(cat3)) tags.push('#감성');

    if (title.includes('오션') || title.includes('씨')) {
        tags.push('#오션뷰', '#뷰맛집');
    }

    if (title.includes('포레스트')) {
        tags.push('#마운틴뷰', '#자연');
    }

    if (title.includes('스테이')) {
        tags.push('#편안한');
    }

    const luxuryKeywords = ['그랜드', '하얏트', '롯데', '메종', '신화'];
    if (luxuryKeywords.some(keyword => title.includes(keyword))) {
        tags.push('#5성급');
    }

    return tags;
};

function Accommodation() {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('전체');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllAccommodations = async () => {
            setLoading(true);
            setError(null);
            setAccommodations([]);

            try {
                const apiUrl = `https://apis.data.go.kr/B551011/KorService2/searchStay2?numOfRows=50&_type=json&MobileOS=WEB&MobileApp=DDD&serviceKey=2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D&areaCode=39&cat1=B02&cat2=B0201&lDongRegnCd=50`;
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`API 호출 실패: ${response.statusText}`);

                const responseData = await response.json();
                let items = responseData?.response?.body?.items?.item || [];

                const itemsWithCity = items.map(acc => {
                    let city = '';
                    if (acc.addr1?.includes('서귀포시')) city = '서귀포시';
                    else if (acc.addr1?.includes('제주시')) city = '제주시';
                    else city = '기타';
                    return { ...acc, city };
                });

                const categorizedAccommodations = itemsWithCity.map(acc => ({
                    ...acc,
                    category: getAccommodationCategory(acc)
                }));

                setAccommodations(categorizedAccommodations);
            } catch (err) {
                setError(`숙소 데이터를 불러오는 데 실패했습니다: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAccommodations();
    }, []);

    const filteredAccommodations = accommodations.filter(acc =>
        selectedCategoryFilter === '전체' || acc.category === selectedCategoryFilter
    );

    const previewAccommodations = filteredAccommodations.slice(0, 4);

    const navigateToDetailPage = (contentId) => {
        navigate('../Detail/DetailAccomodation.jsx', {
            state: { contentId },
        });
    };

    return (
        <div className="Accommodation" style={{width: '90%', margin: '0 auto'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <p className="IntroMent" style={{fontSize: '18px', fontWeight: '500'}}>
                    제주도의 인기 숙소를 만나보세요
                </p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <p style={{fontSize: '10px', color: '#797979', marginRight: '5px'}}>더보기</p>
                    <img style={{width: '4px', height: '10px'}} src={arrow} alt="더보기"/>
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px',
                    paddingBottom: '50px'
                }}
            >
                {!loading && !error && previewAccommodations.map(acc => {
                    const imageUrl = acc.firstimage || ReplaceImage;
                    const tags = getAccommodationTags(acc);

                    return (
                        <div
                            key={acc.contentid}
                            style={{overflow: 'hidden', cursor: 'pointer'}}
                            onClick={() => navigateToDetailPage(acc.contentid)}
                        >
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={acc.title || '숙소 이미지'}
                                    style={{
                                        width: '190px',
                                        height: '130px',
                                        borderRadius: '10px',
                                        objectFit: 'cover'
                                    }}
                                />
                            )}
                            <div style={{marginTop: '3px'}}>
                                <h3 style={{fontSize: '12px', fontWeight: '550', margin: '0'}}>
                                    {acc.title}
                                </h3>
                                <p style={{fontSize: '10px', color: '#797979', margin: '0'}}>
                                    {acc.city || '지역 정보 없음'}
                                </p>
                                <div style={{marginTop: '3px', display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                    {tags.map((tag, idx) => (
                                        <span key={idx} style={{fontSize: '10px', color: '#269962'}}>
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Accommodation;

