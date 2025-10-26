// DetailTourism.jsx
import React, { useState, useEffect } from 'react';
import TourismMain from '../../Main/Tourism/Tourism.jsx';
import { fetchTourData } from "../../../Common/BasedOn/API.js";
import NoImage from '../../../assets/NoImage.svg';
import styled from 'styled-components';

function DetailTourism() {
    const [tourismList, setTourismList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTourismData = async () => {
            setLoading(true);
            try {
                const savedId = localStorage.getItem("selectedGolfCourseId");
                const golfCourseId = savedId ? parseInt(savedId, 10) : null;

                const data = await fetchTourData('attractions', golfCourseId);
                const mapped = data.map(item => ({
                    title: item.title,
                    imageUrl: item.firstimage,
                    address: item.addr2 ? `${item.addr1} ${item.addr2}` : item.addr1,
                    category: item.cat1 || '기타'
                }));
                setTourismList(mapped);
            } catch (err) {
                setError('관광지 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTourismData();
    }, []);

    return (
        <div className="DetailTourism">
            {loading && <p>불러오는 중입니다...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {/* 컴포넌트에 전달 */}
            <TourismMain
                title='제주도에 오면 꼭 가봐야되는'
                subtitle='인기 관광지 모음'
                mentClassName={'IntroMentDetail'}
            />

            {/* 관광지 표시 */}
            <div style={{width: '90%', margin: '10% auto'}}>
                <TourismGrid>
                    {tourismList.map((item, index) => (
                        <TourismItem
                            key={index}
                            onClick={() => {
                                const query = encodeURIComponent(item.title);
                                const url = `https://map.naver.com/v5/search/${query}`;
                                window.open(url, '_blank');
                            }}
                        >
                            <GridImage src={item.imageUrl || NoImage} alt={item.title} />
                            <TourismTitle>{item.title}</TourismTitle>
                            <TourismAddress>{item.address}</TourismAddress>
                        </TourismItem>
                    ))}
                </TourismGrid>
            </div>
        </div>
    );
}

export default DetailTourism;

const TourismGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.03% 5%;
    align-items: start;
    padding-bottom: 30px;
`;

const TourismItem = styled.div`
    cursor: pointer;
    position: relative;
`;

const GridImage = styled.img`
    width: 100%;
    aspect-ratio: 192 / 144;
    border-radius: 15px;
    object-fit: cover;
    //display: block;
`;

const TourismTitle = styled.h3`
    font-size: 14px;
    font-weight: 450;
    margin: 5px 0;
`;

const TourismAddress = styled.p`
    color: #595959;
    font-size: 12px;
    margin-top: 4px;
    padding: 0;
`;
