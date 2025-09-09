// AccommodationList.jsx

import React, {createContext, useContext, useState} from 'react';
import NoImage from '../NoImage.svg';
import { getAccommodationTags } from '../Accommodation/Category.js';
import arrow from '../../Main/arrow.svg'; // 필요 시
import './AccommodationList.css';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

const AccommodationList = ({
    title,
    accommodations = [],
    showMoreButton = false,
    onMoreClick,
    limit = null,
    navigateToDetailPage,
    showFilterButtons = true,
    gridClassName = 'Accommo',
    imageClassName = 'AccommoImg',
    eachofhouseClassName = 'AccommoHouse',
                                  }) => {
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('전체');

    const filteredAccommodations = accommodations.filter(acc =>
        selectedCategoryFilter === '전체' || acc.category === selectedCategoryFilter
    );

    const previewAccommodations = limit
        ? filteredAccommodations.slice(0, limit)
        : filteredAccommodations;

    const handleAccommodationClick = (contentid) => {
        if (contentid) {
            // contentid를 localStorage에 저장
            localStorage.setItem('selectedContentid', contentid);
            navigateToDetailPage(contentid); // 페이지 이동
        } else {
            console.warn("No contentid found for accommodation");
        }
    };

    return (
        <div className="AccommodationList" style={{width: '90%', margin: '0 auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p className="IntroMent" style={{fontSize: '18px', fontWeight: '500', color: '#000', margin: '0'}}>
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

            {showFilterButtons && (
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
                            padding: '10px 0',
                        }}
                    >
                        {['전체', '프리미엄', '가성비', '감성'].map((cat) => (
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
            )}

            {/* 숙소 목록 */}
            <div className={`${gridClassName}`} // Accommo | DetailAccommo
            >
                {previewAccommodations.map((acc) => {
                    const imageUrl = acc.firstimage || NoImage;
                    const tags = getAccommodationTags(acc);

                    return (
                        <div
                            key={acc.contentid}
                            className={`${eachofhouseClassName}`}
                            onClick={() => handleAccommodationClick(acc.contentid)}
                        >
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={acc.title || '숙소 이미지'}
                                    className={`${imageClassName}`} // AccommoImg | DetailAccommoImg
                                />
                            )}
                            <div style={{marginTop: '3px'}}>
                                <h3 style={{fontSize: '12px', fontWeight: '550', margin: '0'}}>{acc.title}</h3>
                                <p style={{fontSize: '10px', color: '#797979', margin: '0'}}>
                                    {acc.city || '지역 정보 없음'}
                                </p>
                                <div
                                    style={{
                                        marginTop: '3px',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '4px',
                                    }}
                                >
                                    {tags.map((tag, idx) => (
                                        <span key={idx} style={{fontSize: '10px', color: '#269962', fontWeight: 'bold'}}>
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
};

export default AccommodationList;
