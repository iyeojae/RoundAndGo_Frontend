import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import NoImage from '../../assets/NoImage.svg';
import arrow from '../../assets/arrow.svg';
import { fetchTourData } from "../BasedOn/API.js";
import { getRestaurantCategory } from './Category.js';

import { ScreenSizeContext } from '../ScreenSizeContext';

function RestaurantList({
                            title = '제주도 맛집 구경하고 가세요~',
                            showMoreButton = false,
                            onMoreClick,
                            maxPreview = null,
                            showCategoryFilter = true,
                            customCategoryList = ['전체', '한식', '양식', '일식', '중식', '이색 음식점', '카페', '클럽'],
                            showOverlay = false,
                            showTitle = true,
                            showCity = true,
                            showAddress = true,
                            golfCourseId = null,
                            isDetail = false,
                        }) {
    const { isTablet } = useContext(ScreenSizeContext);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('전체');

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchTourData('restaurants', golfCourseId);
                const mapped = data.map(item => ({
                    ...item,
                    city: item.city || '',
                    category: getRestaurantCategory(item.cat3),
                }));

                setRestaurants(mapped);
            } catch (err) {
                console.error(err);
                setError('음식점 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [golfCourseId]);

    const filteredRestaurants = restaurants.filter(
        r => selectedCategoryFilter === '전체' || r.category === selectedCategoryFilter
    );

    const previewRestaurants = maxPreview
        ? filteredRestaurants.slice(0, maxPreview)
        : filteredRestaurants;

    return (
        <Container>
            <Header>
                <Title isTablet={isTablet}>{title}</Title>
                {showMoreButton && (
                    <MoreWrapper>
                        <MoreText isTablet={isTablet} onClick={onMoreClick}>더보기</MoreText>
                        <MoreIcon src={arrow} alt="더보기" />
                    </MoreWrapper>
                )}
            </Header>

            {showCategoryFilter && (
                <ScrollContainer>
                    <ButtonRow>
                        {customCategoryList.map(cat => (
                            <CategoryButton isTablet={isTablet}
                                key={cat}
                                selected={selectedCategoryFilter === cat}
                                onClick={() => setSelectedCategoryFilter(cat)}
                            >
                                {cat}
                            </CategoryButton>
                        ))}
                    </ButtonRow>
                </ScrollContainer>
            )}

            {loading && <p>불러오는 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Grid isDetail={isDetail}>
                {previewRestaurants.map(res => (
                    <Card key={res.contentid} onClick={() => {
                        const query = encodeURIComponent(res.title);
                        window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
                    }}>
                        <Image
                            src={res.firstimage || NoImage}
                            alt={res.title}
                            isDetail={isDetail}
                        />
                        {showOverlay && <Overlay />}
                        <Comment isDetail={isDetail} isTablet={isTablet}>
                            {showTitle && <h3>{res.title}</h3>}
                            {showCity && <p>{res.city}</p>}
                            {showAddress && <p>{res.addr1 + res.addr2}</p>}
                        </Comment>
                    </Card>
                ))}
            </Grid>
        </Container>
    );
}

export default RestaurantList;

const Container = styled.div`
    width: 90%;
    margin: 0 auto;
    padding-top: 10%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2%;
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

const MoreWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const MoreText = styled.p`
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(13px, 2vw, 18px)'
                    : 'clamp(10px, 2vw, 14px)'};
    color: #797979;
    margin-right: 5px;
    cursor: pointer;
`;

const MoreIcon = styled.img`
    width: 4px;
    height: 10px;
`;

const ScrollContainer = styled.div`
    overflow-x: scroll;
    margin-bottom: 20px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const ButtonRow = styled.div`
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
`;

const CategoryButton = styled.button`
    background-color: ${({ selected }) => (selected ? '#269962' : '#DFDFDF')};
    color: #fff;
    font-size: ${({ isTablet }) =>
            isTablet
                    ? 'clamp(16px, 2vw, 20px)'
                    : 'clamp(12px, 2vw, 14px)'};
    padding: 1.5% 4%;
    border: none;
    border-radius: 47px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ isDetail }) => (isDetail ? '0.03% 5%' : '1% 5.5%')};
  align-items: start;
  padding-bottom: 30px;
`;

const Card = styled.div`
  cursor: pointer;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: ${({ isDetail }) => (isDetail ? '192 / 144' : '19 / 19')};
  border-radius: ${({ isDetail }) => (isDetail ? '15px' : '10px')};
  object-fit: cover;
`;

const Comment = styled.div`
  margin-top: 3px;

  h3 {
    font-size: ${({ isDetail }) => (isDetail ? '14px' : '18px')};
    font-weight: ${({ isDetail }) => (isDetail ? '450' : '400')};
    margin: ${({ isDetail }) => (isDetail ? '5px 0' : '0')};
    color: ${({ isDetail }) => (isDetail ? '#000' : '#fff')};
    position: ${({ isDetail }) => (isDetail ? 'static' : 'absolute')};
    bottom: ${({ isDetail }) => (isDetail ? 'auto' : '15%')};
    left: ${({ isDetail }) => (isDetail ? 'auto' : '5%')};
    z-index: ${({ isDetail }) => (isDetail ? 'auto' : '3')};
  }

  p {
    font-size: ${({ isDetail }) => (isDetail ? '12px' : '0.75rem')};
    color: ${({ isDetail }) => (isDetail ? '#595959' : '#797979')};
    margin-top: ${({ isDetail }) => (isDetail ? '4px' : '0')};
    padding: 0;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 19/19;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #676767 100%);
  z-index: 1;
`;
