import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DetailNavbar from './Navbar/DetailNavbar.jsx';
import DetailAccommodation from './Accommodation/DetailAccomodation.jsx';
import DetailRestaurant from './Restaurant/DetailRestaurant.jsx';
import DetailTourism from './Tourism/DetailTourism.jsx';
import Header from "../Layout/Header";
import Arrow from "./BackBtn.svg";
import './DetailMain.css';

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

    // const ScrollToTopButton = () => {
    //     const scrollToTop = () => {
    //         window.scrollTo({ top: 0, behavior: 'smooth' });
    //     };
    //
    //     return (
    //         <button
    //             className="scroll-to-top-btn"
    //             onClick={scrollToTop}
    //             aria-label="위로 가기"
    //         >
    //             <img src={Arrow} alt="위로 가기" />
    //         </button>
    //     );
    // };

    return (
        <div className="DetailMain" style={{ width: '100%', backgroundColor: '#F8F8F8', position: 'relative' }}>
            <Header />
            <DetailNavbar activeTab={activeTab} onTabChange={setActiveTab} />

            <div>
                {activeTab === 'accommodation' && <DetailAccommodation />}
                {activeTab === 'restaurant' && <DetailRestaurant />}
                {activeTab === 'tourism' && <DetailTourism />}
            </div>

            {/*<ScrollToTopButton />*/}
        </div>
    );
}

export default DetailMain;
