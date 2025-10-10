import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccommodationList from '../../../Common/Accommodation/AccommodationList.jsx';
import { fetchTourData } from '../../../Common/BasedOn/API.js';
import { getAccommodationCategory } from '../../../Common/Accommodation/Category';

function Accommodation({ golfCourseId }) {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllAccommodations = async () => {
            setLoading(true);
            setError(null);
            setAccommodations([]);

            try {
                const data = await fetchTourData('accommodations', golfCourseId);

                const mapped = data.map(acc => {
                    const city = acc.city || (() => {
                        if (acc.addr1?.includes('서귀포시')) return '서귀포시';
                        if (acc.addr1?.includes('제주시')) return '제주시';
                        return '기타';
                    })();

                    return {
                        ...acc,
                        city,
                        category: getAccommodationCategory(acc),
                        mapx: parseFloat(acc.mapx),
                        mapy: parseFloat(acc.mapy),
                    };
                });

                setAccommodations(mapped);
            } catch (err) {
                setError(`숙소 데이터를 불러오는 데 실패했습니다: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAccommodations();
    }, [golfCourseId]);

    const navigateToDetailPage = ({ contentId, mapx, mapy }) => {
        console.log("Accommodation navigateToDetailPage contentId:", contentId);
        if (!contentId) {
            alert("숙소 ID가 없습니다.");
            return;
        }
        navigate('/detail/main/more', {
            state: {
                contentId,
                mapx,
                mapy,
            },
        });
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="Accommodation" style={{width: '90%', margin: '0 auto'}}>
            {!loading && !error && (
                <AccommodationList
                    title="제주도의 인기 숙소를 만나보세요"
                    accommodations={accommodations}
                    showMoreButton={true}
                    onMoreClick={() => navigate('/detail/main?tab=accommodation')}
                    limit={4}
                    navigateToDetailPage={navigateToDetailPage}
                    showFilterButtons={true}
                />
            )}
        </div>
    );
}

export default Accommodation;
