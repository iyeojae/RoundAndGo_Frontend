import React, { useState, useEffect } from 'react';
import './MainPage.css';
import Header from '../Layout/Header.jsx';
import Replace from './Replace.jpg';
import Footer from '../Layout/Footer.jsx';

import Accommodation from './Accommodation/Accommodation.jsx'; // 숙박시설 정보 컴포넌트
import Restaurent from './Restaurant/Restaurant.jsx'; // 음식점 정보 컴포넌트
import Tourism from './Tourism/Tourism.jsx';
import arrow from "./arrow.svg"; // 관광지 컴포넌트
import IconAI from '../Common/IconAIColor.svg';
import WhiteArrow from '../Common/WhiteArrow.svg';

function MainPage() {

    return (
        <div className="MainPage" style={{ width: '100%', backgroundColor: '#F8F8F8' }}>
            <Header />

            <div className="RecommendCourse" style={{width: '90%', margin: '0 auto'}}> {/* 코스 추천 */}
                <p className="IntroMent"
                   style={{fontSize: '18px', fontWeight: '500', marginTop: '38px', marginBottom: '18px'}}>
                    추천 받을 코스를 선택해보세요
                </p>

                <div className="RecommendCourse"> {/* 코스 추천 */}
                    <p className="IntroMent">
                        여러분에게 딱 맞는 여행 코스를 추천합니다
                    </p>

                    <div className="GoToRecommendation">
                        <div className="RecommendationChildContainer">
                            <div className='ImgContainer'>
                                <img src={IconAI} alt='IconAI'/>
                            </div>
                            <p>여행 코스 보러가기<br/><span>마음에 쏙 들걸요?</span></p>
                        </div>
                        <img style={{width: '14px'}} src={WhiteArrow} alt='WhiteArrow'/>
                    </div>
                </div>
            </div>

            <Accommodation/> {/* 숙박 컴포넌트 */}

            <span style={{width: '100%', height: '6px', backgroundColor: '#DFDFDF', marginTop: '25px'}}></span>

            <Restaurent/> {/* 음식점 컴포넌트 */}

            <Tourism/> {/* 관광지 컴포넌트 */} {/* TODO : 관광지 정보 -> 가로 스크롤 구현 ! */}

            <div className="Community" style={{paddingTop: '45px', width: '90%', margin: '0 auto'}}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <p className="IntroMent" style={{fontSize: '18px', fontWeight: '500'}}>
                        커뮤니티
                    </p>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p style={{fontSize: '10px', color: '#797979', marginRight: '5px'}}>더보기</p>
                        <img style={{width: '4px', height: '10px'}} src={arrow} alt="더보기"/>
                    </div>
                </div>

                <div className="CommunityContent" style={{width: '100%', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)'}}>

                </div>
            </div>
            {/*<Footer />*/}
        </div>
    );
}

export default MainPage;
