// Restaurent.jsx
import React, { useState, useEffect } from 'react';
import arrow from '../arrow.svg';
import Replace from '../Replace.jpg';
import './Restaurent.css';

const ReplaceImage = Replace;

const getRestaurantCategory = (cat3) => {
    const CATEGORY_MAP = {
        'A05020100': '한식',
        'A05020200': '양식',
        'A05020300': '일식',
        'A05020400': '중식',
        'A05020700': '이색 음식점',
        'A05020900': '카페',
        'A05021000': '클럽',
    };

    return CATEGORY_MAP[cat3] || '기타';
};

function Restaurent() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('전체');

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            setError(null);

            try {
                const cities = ['제주시', '서귀포시'];
                const responses = await Promise.all(
                    cities.map(city =>
                        fetch(`https://roundandgo.onrender.com/api/tour-infos/restaurants?province=제주특별자치도&city=${city}`)
                            .then(res => res.ok ? res.json() : Promise.reject(`API 에러: ${city}`))
                            .then(data => data.map(item => ({
                                ...item,
                                city,
                                category: getRestaurantCategory(item.cat3),
                            })))
                    )
                );

                const combined = responses.flat();
                setRestaurants(combined);
            } catch (err) {
                setError(typeof err === 'string' ? err : '데이터 불러오기 실패');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter((r) =>
        selectedCategoryFilter === '전체' || r.category === selectedCategoryFilter
    );

    const previewRestaurants = filteredRestaurants.slice(0, 4);

    return (
        <div className="Restaurent" style={{ width: '90%', margin: '0 auto', paddingTop: '45px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <p className="IntroMent" style={{ fontSize: '18px', fontWeight: '500' }}>
                    제주도 맛집 구경하고 가세요~
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#797979', marginRight: '5px' }}>더보기</p>
                    <img style={{ width: '4px', height: '10px' }} src={arrow} alt="더보기" />
                </div>
            </div>

            <div
                style={{
                    marginBottom: '20px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    paddingBottom: '5px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                className="scroll-hidden"
            >
                <div
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        columnGap: '10px',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
                        MsOverflowStyle: 'none',
                        padding: '10px 0'
                    }}
                >
                    {['전체', '한식', '양식', '일식', '중식', '이색 음식점', '카페', '클럽'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategoryFilter(cat)}
                            style={{
                                backgroundColor: selectedCategoryFilter === cat ? '#269962' : '#DFDFDF',
                                color: selectedCategoryFilter === cat ? '#fff' : '#ffffff',
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '47px',
                                cursor: 'pointer',
                                transition: '0.3s ease-in-out',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>


            {loading && <p>불러오는 중...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px',
                    paddingBottom: '50px'
                }}
            >
                {previewRestaurants.map((res) => (
                    <div
                        key={res.id}
                        style={{
                            overflow: 'hidden',
                            cursor: 'pointer',
                        }}
                        onClick={() => alert(`Restaurant ID: ${res.id}`)}
                    >
                        <img
                            src={res.firstimage || ReplaceImage}
                            alt={res.name}
                            style={{
                                width: '190px',
                                height: '130px',
                                borderRadius: '10px',
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{ marginTop: '3px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '550', margin: '0' }}>
                                {res.title}
                            </h3>
                            <p style={{ fontSize: '10px', color: '#797979', margin: '0' }}>
                                {res.city}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Restaurent;
