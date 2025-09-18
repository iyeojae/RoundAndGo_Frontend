import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './MainPage.css';
import Header from '../Layout/Header.jsx';
import Footer from '../Layout/Footer.jsx';

import Accommodation from './Accommodation/Accommodation.jsx'; // 숙박시설 정보 컴포넌트
import Restaurant from './Restaurant/Restaurant.jsx'; // 음식점 정보 컴포넌트
import Tourism from './Tourism/Tourism.jsx'; // 관광지 컴포넌트 
import CommunityPreview from "./Community/CommuinityPreview"; // 커뮤니티 컴포넌트
import arrow from "./arrow.svg";
import GoToCourse from './GoToCourse.svg';
import IconAI from '../Common/IconAI.svg';
import Arrow from '../Detail/BackBtn.svg';

function MainPage() {
    const navigate = useNavigate();
    const [golfCourseId, setGolfCourseId] = useState(null);

    useEffect(() => {
        const storedId = localStorage.getItem('selectedGolfCourseId');
        if (storedId) {
            setGolfCourseId(Number(storedId));
        }
    }, []);

    const goTo = () => {
        navigate('/course/recommendation');
    };

    return (
        <div className="MainPage" style={{backgroundColor: '#F8F8F8'}}>
            <Header/>

            <div className="RecommendCourse"
                 style={{backgroundImage: `linear-gradient(180deg, rgba(38, 153, 98, 0) 41.07%, #269962 75.53%), url(${GoToCourse})`}}> {/* 코스 추천 */}
                <div className="element-cont">
                    <div className="RecommendationChildContainer">
                        <div className='ImgContainer'>
                            <img src={IconAI} alt='IconAI'/>
                        </div>
                        <p>AI가 짜주는<br/><span>여행 코스 보러가기</span></p>
                    </div>
                    <img onClick={goTo} style={{width: '36px', transform: 'scale(-1)'}} src={Arrow}
                         alt='WhiteArrow'/>
                </div>
            </div>

            {/* 골프장 id 있으면 골프장, 없으면 지역 기반 */}
            <Accommodation golfCourseId={golfCourseId} /> {/* 숙박 컴포넌트 */}
            <span style={{ width: '100%', height: '6px', backgroundColor: '#DFDFDF', marginTop: '25px' }}></span>
            <Restaurant golfCourseId={golfCourseId} /> {/* 음식점 컴포넌트 */}
            <Tourism golfCourseId={golfCourseId} /> {/* 관광지 컴포넌트 */}

            <div className="Community" style={{paddingTop: '45px', width: '90%', margin: '0 auto'}}>
                <CommunityPreview/>
            </div>
            <Footer/>
        </div>
    );
}

export default MainPage;
