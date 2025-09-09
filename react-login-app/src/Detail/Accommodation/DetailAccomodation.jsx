// DetailAccommodation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccommodationList from '../../Common/Accommodation/AccommodationList.jsx';
import { fetchAccommodations } from "../../Common/Accommodation/AccommodationAPI";

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
                const items = await fetchAccommodations();  // fetchAccommodations 함수 호출
                console.log("Fetched accommodations:", items);
                setAccommodations(items);
            } catch (err) {
                setError(`숙소 데이터를 불러오는 데 실패했습니다: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAccommodations();
    }, []);

    const navigateToMorePage = (contentid) => {
        console.log("Navigating with contentid:", contentid);  // 여기에 추가
        navigate('/detail/main/more', {
            state: { contentid },
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
                    navigateToDetailPage={(item) => navigateToMorePage(item.contentid)}
                    showMoreButton={false}
                    limit={null}
                    showFilterButtons={true}
                    gridClassName = {'DetailAccommo'}
                    imageClassName = {'DetailAccommoImg'}
                    eachofhouseClassName={'DetailAccommoHouse'}
                />
            )}
        </div>
    );
}

export default DetailAccommodation;




