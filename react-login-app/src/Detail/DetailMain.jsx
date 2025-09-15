// DetailMain.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // 빠졌던 부분
import DetailNavbar from './Navbar/DetailNavbar.jsx';
import DetailAccommodation from './Accommodation/DetailAccomodation.jsx';
import DetailRestaurant from './Restaurant/DetailRestaurant.jsx';
import DetailTourism from './Tourism/DetailTourism.jsx';
import Header from "../Layout/Header";

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
        <main>
            <div className="DetailMain" style={{width: '100%', backgroundColor: '#F8F8F8'}}>
                <Header/>
                <DetailNavbar activeTab={activeTab} onTabChange={setActiveTab}/>

                <div>
                    {activeTab === 'accommodation' && <DetailAccommodation/>}
                    {activeTab === 'restaurant' && <DetailRestaurant/>}
                    {activeTab === 'tourism' && <DetailTourism/>}
                </div>
            </div>
        </main>
    );
}

export default DetailMain;
