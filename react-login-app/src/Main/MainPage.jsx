import React from 'react';
import { useNavigate } from "react-router-dom";
import './MainPage.css';
import Header from '../Layout/Header.jsx';
import Footer from '../Layout/Footer.jsx';

import Accommodation from './Accommodation/Accommodation.jsx'; // 숙박시설 정보 컴포넌트
import Restaurant from './Restaurant/Restaurant.jsx'; // 음식점 정보 컴포넌트
import Tourism from './Tourism/Tourism.jsx';
import arrow from "./arrow.svg"; // 관광지 컴포넌트
import GoToCourse from './GoToCourse.svg';
import IconAI from '../Common/IconAI.svg';
import Arrow from '../Detail/BackBtn.svg';

function MainPage() {
    const navigate = useNavigate();
    const goTo = () => {
        navigate('/courseAI'); // 경로 설정된 곳으로 이동
    };

    return (
        <main>
            <div className="MainPage" style={{width: '100%', backgroundColor: '#F8F8F8'}}>
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

                <Accommodation/> {/* 숙박 컴포넌트 */}

                <span style={{width: '100%', height: '6px', backgroundColor: '#DFDFDF', marginTop: '25px'}}></span>

                <Restaurant/> {/* 음식점 컴포넌트 */}

                <Tourism/> {/* 관광지 컴포넌트 */} {/* TODO : 관광지 정보 -> 가로 스크롤 구현 ! */}

                <div className="Community" style={{paddingTop: '45px', width: '90%', margin: '0 auto'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <p className="IntroMent"
                           style={{fontSize: '18px', fontWeight: '500', color: '#000', padding: '0'}}>
                            커뮤니티
                        </p>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <p style={{fontSize: '10px', color: '#797979', marginRight: '5px'}}>더보기</p>
                            <img style={{width: '4px', height: '10px'}} src={arrow} alt="더보기"/>
                        </div>
                    </div>

                    <div className="CommunityContent"
                         style={{width: '100%', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)'}}>

                    </div>
                </div>
                <Footer/>
            </div>
        </main>
    );
}

export default MainPage;
