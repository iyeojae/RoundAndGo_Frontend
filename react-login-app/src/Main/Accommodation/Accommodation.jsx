// Accommodation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccommodationList from '../../Common/Accommodation/AccommodationList.jsx';
import { fetchAccommodations } from "../../Common/Accommodation/AccommodationAPI";

function Accommodation() {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('전체');

    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path); // 경로 설정된 곳으로 이동
    };

    useEffect(() => {
        const fetchAllAccommodations = async () => {
            setLoading(true);
            setError(null);
            setAccommodations([]);

            try {
                const items = await fetchAccommodations();  // fetchAccommodations 함수 호출
                setAccommodations(items);
            } catch (err) {
                setError(`숙소 데이터를 불러오는 데 실패했습니다: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAccommodations();
    }, []);

    const navigateToDetailPage = (contentId) => {
        navigate('../Detail/DetailAccomodation.jsx', {
            state: { contentId },
        });
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="Accommodation">
            {!loading && !error && (
                <AccommodationList
                    title="제주도의 인기 숙소를 만나보세요"
                    accommodations={accommodations}
                    showMoreButton={true}
                    onMoreClick={() => goTo('/detail/main?tab=accommodation')}
                    limit={4}
                    navigateToDetailPage={navigateToDetailPage}
                    showFilterButtons={true}
                />
            )}
        </div>
    );
}

export default Accommodation;
