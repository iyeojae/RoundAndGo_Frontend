import React, { useState } from 'react';
import NoImage from '../../assets/NoImage.svg';
import { getAccommodationTags } from './Category';
import arrow from '../../assets/arrow.svg';
import './AccommodationList.css';

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

    const handleAccommodationClick = (contentid, tags, mapx, mapy) => {
        if (contentid) {
            localStorage.setItem('selectedTags', JSON.stringify(tags));
            // 여기서 인자를 객체 형태로 전달!
            navigateToDetailPage({ contentId: contentid, mapx, mapy });
        } else {
            console.warn("No contentid found for accommodation");
        }
    };

    return (
        <div className="AccommodationList" style={{ width: '90%', margin: '10% auto 0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3%' }}>
                <p className="IntroMent" style={{ fontSize: '18px', fontWeight: '500', color: '#000', margin: '0', padding: '0' }}>
                    {title}
                </p>
                {showMoreButton && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p
                            onClick={onMoreClick}
                            style={{ fontSize: '10px', color: '#797979', marginRight: '5px', cursor: 'pointer' }}
                        >
                            더보기
                        </p>
                        <img style={{ width: '4px', height: '10px' }} src={arrow} alt="더보기" />
                    </div>
                )}
            </div>

            {showFilterButtons && (
                <div
                    style={{
                        marginBottom: '10px',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
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
                            padding: '3px 0',
                        }}
                    >
                        {['전체', '프리미엄', '가성비', '감성'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategoryFilter(cat)}
                                style={{
                                    backgroundColor: selectedCategoryFilter === cat ? '#269962' : '#DFDFDF',
                                    color: selectedCategoryFilter === cat ? '#fff' : '#ffffff',
                                    padding: '5px 12px',
                                    border: 'none',
                                    borderRadius: '47px',
                                    cursor: 'pointer',
                                    transition: '0.3s ease-in-out',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    fontSize: '12px'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {previewAccommodations.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.8rem' }}>해당 카테고리의 숙소가 없습니다.</p>
            ) : (
                <div className={`${gridClassName}`}>
                    {previewAccommodations.map((acc) => {
                        const imageUrl = acc.firstimage || NoImage;
                        const tags = getAccommodationTags(acc);

                        return (
                            <div
                                key={acc.contentid}
                                className={`${eachofhouseClassName}`}
                                onClick={() => handleAccommodationClick(acc.contentid, tags, acc.mapx, acc.mapy)}
                            >
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt={acc.title || '숙소 이미지'}
                                        className={`${imageClassName}`}
                                        onError={(e) => { e.target.src = NoImage; }}
                                    />
                                )}
                                <div style={{ marginTop: '3px' }}>
                                    <h3 style={{ fontSize: '0.75rem', fontWeight: '400', margin: '0' }}>
                                        {acc.title || '제목 없음'}
                                    </h3>
                                    <p style={{ fontSize: '0.65rem', color: '#797979', margin: '0', fontWeight: '450' }}>
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
                                            <span key={idx} style={{ fontSize: '0.65rem', color: '#269962', fontWeight: '500' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AccommodationList;
