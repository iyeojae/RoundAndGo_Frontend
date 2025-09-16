import CommunityEntire from "./Community/CommunityEntire.jsx";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Banner from './EntireBackground.svg';
import Logo from './Image/Layout/Header/greenlogo.svg';

import './App.css';
import EmailLoginPage from './EmailAuth/EmailLoginPage';
import SignupPage from './EmailAuth/SignupPage';
import FindAccountPage from './EmailAuth/FindAccountPage';
import SchedulePage from './Schedule&Weather/SchedulePage';
import JejuLocationPage from './Schedule&Weather/JejuLocationPage';
import HomePage from "./HomePage";
import OAuth2Callback from "./OAuth2Callback";

import FirstMainPage from "./FirstMain/FirstMainPage"; // 첫 메인
import MainPage from "./Main/MainPage"; // 첫 메인
import DetailMainPage from './Detail/DetailMain.jsx'; // 첫 메인
import DetailMorePage from './Detail/Accommodation/MoreAccommodation.jsx'; // 첫 메인
import CommunityMainPage from './Community/Community.jsx'; // 커뮤니티
import CommunityEntirePage from './Community/CommunityEntire.jsx'; // 커뮤니티 전체보기
import CommunityWritePage from './Community/CommunityWrite.jsx'; // 커뮤니티 쓰기
import CourseRecommendation from './Course/CourseRecommendation'; // 코스 추천
import CourseMain from './Course/CourseMain'; // 코스 추천 메인

function App() {
    return (
        <Router>
            <div
                style={{
                    backgroundImage: `url(${Banner})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '2rem',
                    boxSizing: 'border-box',
                }}
            >
                {/* 왼쪽 콘텐츠 */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: '2rem',
                    color: '#000',
                    zIndex: 1,
                }}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '5%',}}>
                        <img style={{width: '100px', aspectRatio: '10 / 15'}} src={Logo} alt='로고'/>
                        <h1 style={{fontSize: '2rem', color: '#595959', fontWeight: 'bold', margin: 0}}>AI가 찾아주는
                            여행코스</h1>
                        <p style={{fontSize: '1.5rem', color: '#595959', fontWeight: '350', margin: 0}}>당신의 골프여행이 더욱
                            특별해집니다!</p>
                        <p style={{fontSize: '1rem', color: '#2C8C7D', fontWeight: 'bold', marginTop: '3%'}}>AI 추천 코스 보러가기
                            ></p>
                    </div>
                </div>

                {/* 오른쪽 콘텐츠 (라우터) */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                }}>
                    <main>
                    <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/email-login" element={<EmailLoginPage/>}/>
                            <Route path="/signup" element={<SignupPage/>}/>
                            <Route path="/find-account" element={<FindAccountPage/>}/>
                            <Route path="/schedule" element={<SchedulePage/>}/>
                            <Route path="/jeju-location" element={<JejuLocationPage/>}/>
                            <Route path="/login/oauth2/code/kakao" element={<OAuth2Callback/>}/>

                            <Route path="/first-main" element={<FirstMainPage/>}/> {/* 첫 메인 페이지 */}
                            <Route path="/main" element={<MainPage/>}/> {/* 메인 페이지 */}
                            <Route path="/detail/main/:" element={<DetailMainPage/>}/> {/* 상세 페이지 */}
                            <Route path="/detail/main/more" elemet={<DetailMorePage/>}/> {/*상세페이지 더보기 - 숙박 */}
                            <Route path="/community" element={<CommunityMainPage/>}/> {/* 커뮤니티 - 메인 */}
                            <Route path="/community/entire" element={<CommunityEntirePage/>}/> {/* 커뮤니티 - 전체 */}
                            <Route path="/communiyt/write" element={<CommunityWritePage/>}/> {/* 커뮤니티 - 글쓰기 */}
                            <Route path="/course/recommendation" element={<CourseRecommendation/>}/> {/* 코스 추천 */}
                            <Route path="/course/*" element={<CourseMain/>}/> {/* 코스 추천 3단계 */}
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;



