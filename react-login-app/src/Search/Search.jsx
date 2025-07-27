// GolfSearch.jsx
import React, { useState, useCallback } from 'react';
import searchbtn from './SearchBtn.png';

function GolfSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGolfCourses, setFilteredGolfCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setFilteredGolfCourses([]); // 새로운 검색 시작 시 이전 결과 초기화

        if (!searchTerm.trim()) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `https://roundandgo.onrender.com/api/golf-courses/search-by-address?address=${encodeURIComponent(searchTerm)}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '골프장 정보를 불러오는데 실패했습니다.');
            }

            const data = await response.json();

            if (Array.isArray(data.data)) {
                setFilteredGolfCourses(data.data);
            } else {
                setFilteredGolfCourses([]);
            }
        } catch (err) {
            console.error("API 호출 중 에러 발생:", err);
            setError(err.message);
            setFilteredGolfCourses([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="Search&Response"> {/* 검색과 응답 로직 */}
            <div className="Search">
                <input
                    type="text"
                    placeholder="지역을 검색해주세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                />
                <img
                    className="searchbtnimg"
                    src={searchbtn}
                    alt="검색버튼"
                    onClick={handleSearch}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            <div className="Response">
                {loading && <p style={{ color: 'white', fontWeight: 'bold' }}>로딩 중...</p>}
                {error && <p style={{ color: 'red' }}>에러: {error}</p>}
                {!loading && !error && (
                    filteredGolfCourses.length > 0 ? (
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {filteredGolfCourses.map((course, index) => (
                                <li key={course.id || course._id || index}>
                                    <strong style={{color: 'white'}}>{course.name}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        searchTerm.trim() ? (
                            <p style={{ color: 'white', fontWeight: 'bold' }}>검색 결과가 없어요</p>
                        ) : (
                            <p style={{ color: 'white', fontWeight: 'bold' }}>골프장이 있는 지역을 검색해주세요</p>
                        )
                    )
                )}
            </div>
        </div>
    );
}

export default GolfSearch;

