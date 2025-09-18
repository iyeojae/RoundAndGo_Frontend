// DetailTourism.jsx
import React, { useState, useEffect } from 'react';
import TourismMain from '../../Main/Tourism/Tourism.jsx';
import { fetchTourData } from "../../Common/BasedOn/API.js";
import NoImage from '../../Common/NoImage.svg';

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
        <div className="DetailTourism" style={{marginTop: '13%'}}>
            {loading && <p>불러오는 중입니다...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {/* 컴포넌트에 전달 */}
            <TourismMain
                title='제주도에 오면 꼭 가봐야되는'
                subtitle='인기 관광지 모음'
                mentClassName={'IntroMentDetail'}
            />

            {/* 관광지 표시 */}
            <div className="TourismGrid">
                {tourismList.map((item, index) => (
                    <div
                        key={index}
                        className="TourismItem"
                        onClick={() => {
                            const query = encodeURIComponent(item.title);
                            const url = `https://map.naver.com/v5/search/${query}`;
                            window.open(url, '_blank');
                        }}
                    >
                        <img className="gridImage" src={item.imageUrl || NoImage} alt={item.title}/>
                        <h3 className="TourismTitle">{item.title}</h3>
                        <p className="TourismAddress">{item.address}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default DetailTourism;