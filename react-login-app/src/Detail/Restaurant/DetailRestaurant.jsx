// DetailRestaurant.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantList from '../../Common/Restaurant/RestaurantList.jsx';

function DetailRestaurant() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path); // 경로 설정된 곳으로 이동
    };

    return (
        <div className="DetailRestaurant">
            <RestaurantList
                title="제주도 음식점"
                showMoreButton={false}
                showCity={false}
                gridClassName={'DetailRestGrid'}
                eachofrestaurantClassName={'DetailRestrestaurant'}
                commentClassName={'DetailRestcomment'}
                imageClassName={'DetailRestImg'}
            />
        </div>
    );
}

export default DetailRestaurant;