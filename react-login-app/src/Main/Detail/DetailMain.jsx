import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DetailNavbar from './Navbar/DetailNavbar.jsx';
import DetailAccommodation from './AccommodationD/DetailAccomodation.jsx';
import DetailRestaurant from './RestaurantD/DetailRestaurant.jsx';
import DetailTourism from './TourismD/DetailTourism.jsx';
import Header from "../../LayoutNBanner/Header";

function DetailMain() {
    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'accommodation';
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    return (
        <div className="DetailMain" style={{ width: '100%', height: '100%', backgroundColor: '#F8F8F8', position: 'relative' }}>
            <Header />
            <DetailNavbar activeTab={activeTab} onTabChange={setActiveTab} />

            <div>
                {activeTab === 'accommodation' && <DetailAccommodation />}
                {activeTab === 'restaurant' && <DetailRestaurant />}
                {activeTab === 'tourism' && <DetailTourism />}
            </div>
        </div>
    );
}

export default DetailMain;
