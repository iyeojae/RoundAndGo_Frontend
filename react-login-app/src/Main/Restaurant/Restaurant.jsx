// Restaurant.jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import RestaurantList from '../../Common/Restaurant/RestaurantList.jsx';

function Restaurant() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path); // 경로 설정된 곳으로 이동
    };

    return (
        <RestaurantList
            title="제주도 맛집 구경하고 가세요~"
            showMoreButton={true}
            onMoreClick={() => goTo('/detail/main?tab=restaurant')}
            maxPreview={4}
            showOverlay={true}
            showCity={false}
            showAddress={false}
        />
    );
}

export default Restaurant;