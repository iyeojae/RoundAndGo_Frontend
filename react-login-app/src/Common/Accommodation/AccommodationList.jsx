import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import NoImage from '../../assets/NoImage.svg';
import { getAccommodationTags } from './Category';
import arrow from '../../assets/arrow.svg';
import './AccommodationList.css';

import { ScreenSizeContext } from '../ScreenSizeContext';

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
    const { isTablet } = useContext(ScreenSizeContext);
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
        <Container className="AccommodationList">
            <Header>
                <Title isTablet={isTablet} className="IntroMent">{title}</Title>
                {showMoreButton && (
                    <MoreButton>
                        <MoreText isTablet={isTablet} onClick={onMoreClick}>더보기</MoreText>
                        <MoreIcon src={arrow} alt="더보기" />
                    </MoreButton>
                )}
            </Header>

            {showFilterButtons && (
                <FilterWrapper className="scroll-hidden">
                    <FilterButtons>
                        {['전체', '프리미엄', '가성비', '감성'].map(cat => (
                            <FilterButton
                                isTablet={isTablet}
                                key={cat}
                                selected={selectedCategoryFilter === cat}
                                onClick={() => setSelectedCategoryFilter(cat)}
                            >
                                {cat}
                            </FilterButton>
                        ))}
                    </FilterButtons>
                </FilterWrapper>
            )}

            {previewAccommodations.length === 0 ? (
                <NoDataText isTablet={isTablet}>해당 카테고리의 숙소가 없습니다.</NoDataText>
            ) : (
                <div className={`${gridClassName}`}>
                    {previewAccommodations.map(acc => {
                        const imageUrl = acc.firstimage || NoImage;
                        const tags = getAccommodationTags(acc);

                        return (
                            <div
                                key={acc.contentid}
                                className={`${eachofhouseClassName}`}
                                onClick={() =>
                                    handleAccommodationClick(acc.contentid, tags, acc.mapx, acc.mapy)
                                }
                            >
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt={acc.title || '숙소 이미지'}
                                        className={`${imageClassName}`}
                                        onError={e => {
                                            e.target.src = NoImage;
                                        }}
                                    />
                                )}
                                <div style={{ marginTop: '3px' }}>
                                    <CardTitle isTablet={isTablet}>{acc.title || '제목 없음'}</CardTitle>
                                    <CityText isTablet={isTablet}>{acc.city || '지역 정보 없음'}</CityText>
                                    <TagWrapper isTablet={isTablet}>
                                        {tags.map((tag, idx) => (
                                            <Tag key={idx}>{tag}</Tag>
                                        ))}
                                    </TagWrapper>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Container>
    );
};

export default AccommodationList;


const Container = styled.div`
  width: 100%;
  margin: 10% 0 0 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3%;
  width: 100%;
`;

const Title = styled.p`
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(20px, 3vw, 28px)'
                    : 'clamp(18px, 3vw, 20px)'};
  font-weight: 500;
  color: #000;
  margin: 0;
  padding: 0;
`;

const MoreButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreText = styled.p`
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(13px, 2vw, 18px)'
                    : 'clamp(10px, 2vw, 14px)'};
  color: #797979;
  margin: 0 5px 0 0;
  cursor: pointer;
`;

const MoreIcon = styled.img`
    width: 4px;
    height: 10px;
`;

const FilterWrapper = styled.div`
  margin-bottom: 10px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  overflow-x: auto;
  column-gap: 10px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  padding: 1.5% 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  background-color: ${({ selected }) => (selected ? '#269962' : '#DFDFDF')};
  color: ${({ selected }) => (selected ? '#fff' : '#ffffff')};
  padding: 1.5% 4%;
  border: none;
  border-radius: 47px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  white-space: nowrap;
  flex-shrink: 0;
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(16px, 2vw, 20px)'
                    : 'clamp(12px, 2vw, 14px)'};
`;

const NoDataText = styled.p`
  text-align: center;
  color: #aaa;
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(0.9rem, 2vw, 1.1rem)'
                    : 'clamp(0.8rem, 2vw, 0.9rem)'};
`;

const CardTitle = styled.h3`
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(0.9rem, 2vw, 1.1rem)'
                    : 'clamp(0.75rem, 2vw, 0.9rem)'};
  font-weight: 400;
  margin: 0;
`;

const CityText = styled.p`
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(0.8rem, 2vw, 1rem)'
                    : 'clamp(0.65rem, 2vw, 0.8rem)'};
  color: #797979;
  margin: 0;
  font-weight: 450;
`;

const TagWrapper = styled.div`
  margin-top: 3px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Tag = styled.span`
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(0.8rem, 2vw, 1rem)'
                    : 'clamp(0.65rem, 2vw, 0.75rem)'};
  color: #269962;
  font-weight: 500;
`;
