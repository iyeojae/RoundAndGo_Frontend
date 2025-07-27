import React, { useState, useEffect } from 'react';
import './MainPage.css';
import Header from '../Layout/Header.jsx';
import Replace from './Replace.jpg';
import Footer from '../Layout/Footer.jsx';

import Accommodation from './Accommodation/Accommodation.jsx'; // 숙박시설 정보 컴포넌트
import Restaurent from './Restaurent/Restaurent.jsx'; // 음식점 정보 컴포넌트
import Tourism from './Tourism/Tourism.jsx';
import arrow from "./arrow.svg"; // 관광지 컴포넌트

// 대체 이미지
const ReplaceImage = Replace; // 일단 임시적인 대체 이미지 ( 모든 곳에 적용 - 이미지가 없는 )

const AccommodationImage = ''; // 숙소
const RestaurentImage = ''; // 음식점
const TourismImage = ''; // 관광지


function MainPage() {

    return (
        <div className="MainPage" style={{ width: '100%', backgroundColor: '#F8F8F8' }}>
            <Header />

            <div className="RecommendCourse" style={{ width: '90%', margin: '0 auto' }}> {/* 코스 추천 */}
                <p className="IntroMent" style={{ fontSize: '18px', fontWeight: '500', marginTop: '38px', marginBottom: '18px' }}>
                    추천 받을 코스를 선택해보세요
                </p>

                <div className="Course" style={{ marginBottom: '100px' }}> {/* 코스 추천 버튼 -> 프리미엄, 가성비, 리조트, 감성 */}
                    {['프리미엄', '가성비', '리조트', '감성'].map(label => (
                        <button key={label} className={`CourseButton ${label}-btn`}>
                            <div className="overlay"></div>
                            <p>{label}</p>
                        </button>
                    ))}
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
