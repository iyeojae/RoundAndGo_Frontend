// DetailRestaurant.jsx
import React, {useState, useEffect} from 'react';
import RestaurantList from '../../../Common/Restaurant/RestaurantList.jsx';

function DetailRestaurant() {
    const [golfCourseId, setGolfCourseId] = useState(null);

    useEffect(() => {
        const savedId = localStorage.getItem("selectedGolfCourseId");
        if (savedId) {
            setGolfCourseId(parseInt(savedId, 10));
        }
    }, []);


    return (
        <div className="DetailRestaurant">
            <RestaurantList
                title="제주도 음식점"
                golfCourseId={golfCourseId}
                showMoreButton={false}
                showCity={false}
                gridClassName={'DetailRestGrid'}
                eachofrestaurantClassName={'DetailRestrestaurant'}
                commentClassName={'DetailRestcomment'}
                imageClassName={'DetailRestImg'}
                isDetail={true}
            />
        </div>
    );
}

export default DetailRestaurant;