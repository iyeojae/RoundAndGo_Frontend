// RestaurantList.jsx
import React, { useState, useEffect } from 'react';
import NoImage from '../NoImage.svg';
import arrow from '../../Main/arrow.svg';
import { getRestaurantCategory } from './Category.js';
import './RestaurantList.css';

function RestaurantList({
                            title = '제주도 맛집 구경하고 가세요~',
                            showMoreButton = false,
                            onMoreClick,
                            maxPreview = null,
                            onRestaurantClick = (res) => alert(`Restaurant ID: ${res.id}`),
                            showCategoryFilter = true,
                            customCategoryList = ['전체', '한식', '양식', '일식', '중식', '이색 음식점', '카페', '클럽'],
                            showOverlay = false,
                            showTitle= true,
                            showCity = true,
                            showAddress = true,
                            gridClassName = 'RestGrid',
                            eachofrestaurantClassName = 'Restrestaurant',
                            commentClassName = 'Restcomment',
                            imageClassName = 'RestImg',
                        }) {
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
                        fetch(`https://roundandgo.shop/api/tour-infos/restaurants?province=제주특별자치도&city=${city}`)
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

    const previewRestaurants = maxPreview ? filteredRestaurants.slice(0, maxPreview) : filteredRestaurants;

    return (
        <div className="RestaurantList" style={{width: '90%', margin: '0 auto', paddingTop: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p className="IntroMent" style={{fontSize: '18px', fontWeight: '500', color: '#000'}}>
                    {title}
                </p>
                {showMoreButton && (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p
                            onClick={onMoreClick}
                            style={{fontSize: '10px', color: '#797979', marginRight: '5px', cursor: 'pointer'}}
                        >
                            더보기
                        </p>
                        <img style={{width: '4px', height: '10px'}} src={arrow} alt="더보기"/>
                    </div>
                )}
            </div>

            {showCategoryFilter && (
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
                            padding: '10px 0'
                        }}
                    >
                        {customCategoryList.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategoryFilter(cat)}
                                style={{
                                    backgroundColor: selectedCategoryFilter === cat ? '#269962' : '#DFDFDF',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '47px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && <p>불러오는 중...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <div className={`${gridClassName}`} // RestGrid || DetailRestGrid
            >
                {previewRestaurants.map((res) => (
                    <div
                        key={res.id}
                        className={`${eachofrestaurantClassName}`}
                        onClick={() => onRestaurantClick(res)}
                    >
                        <img className={`${imageClassName}`} // RestImg || DetailRestImg
                            src={res.firstimage || NoImage}
                            alt={res.name}
                        />
                        {showOverlay && (
                            <div className='overlay'/>
                        )}
                        <div className={`${commentClassName}`} style={{marginTop: '3px'}}> {/* Rest || DetailRest */}
                            {showTitle && (
                                <h3>
                                    {res.title}
                                </h3>
                            )}
                            {showCity && (
                                <p>
                                    {res.city}
                                </p>
                            )}
                            {showAddress && (
                                <p>
                                    {res.addr1 + res.addr2}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RestaurantList;
