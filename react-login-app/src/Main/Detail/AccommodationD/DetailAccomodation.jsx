import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccommodationList from '../../../Common/Accommodation/AccommodationList.jsx';
import { fetchTourData } from '../../../Common/BasedOn/API.js';
import { getAccommodationCategory } from '../../../Common/Accommodation/Category.js';

function DetailAccommodation() {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllAccommodations = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchTourData('accommodations');
                const mapped = data.map(acc => {
                    const city = acc.city || (
                        acc.addr1?.includes('서귀포시') ? '서귀포시' :
                            acc.addr1?.includes('제주시') ? '제주시' : '기타'
                    );

                    return {
                        ...acc,
                        city,
                        category: getAccommodationCategory(acc),
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
    }, []);

    const navigateToMorePage = ({ contentId, mapx, mapy }) => {
        console.log("DetailAccommodation navigateToMorePage contentId:", contentId); // 확인용
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
        <div className="DetailAccommodation">
            {!loading && !error && (
                <AccommodationList
                    title="제주도 숙소"
                    accommodations={accommodations}
                    navigateToDetailPage={navigateToMorePage}
                    showMoreButton={false}
                    limit={null}
                    showFilterButtons={true}
                    gridClassName={'DetailAccommo'}
                    imageClassName={'DetailAccommoImg'}
                    eachofhouseClassName={'DetailAccommoHouse'}
                />
            )}
        </div>
    );
}

export default DetailAccommodation;
