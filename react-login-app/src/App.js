import CommunityEntire from "./Community/CommunityEntire.jsx";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import EmailLoginPage from './EmailAuth/EmailLoginPage';
import SignupPage from './EmailAuth/SignupPage';
import FindAccountPage from './EmailAuth/FindAccountPage';
import SchedulePage from './Schedule&Weather/SchedulePage';
import WeatherPage from './WeatherPage';
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

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/email-login" element={<EmailLoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/find-account" element={<FindAccountPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/jeju-location" element={<JejuLocationPage />} />
                    <Route path="/login/oauth2/code/kakao" element={<OAuth2Callback />} />

                    <Route path="/first-main" element={<FirstMainPage />} /> {/* 첫 메인 페이지 */}
                    <Route path="/main" element={<MainPage />} /> {/* 메인 페이지 */}
                    <Route path="/detail/main/:" element={<DetailMainPage />} /> {/* 상세 페이지 */}
                    <Route path="/detail/main/more" elemet={<DetailMorePage/>}/> {/*상세페이지 더보기 - 숙박 */}
                    <Route path="/community" elemet={<CommunityMainPage/>}/> {/* 커뮤니티 - 메인 */}
                    <Route path="/community/entire" elemet={<CommunityEntirePage/>}/> {/* 커뮤니티 - 전체 */}
                    <Route path="/communiyt/write" elemet={<CommunityWritePage/>}/> {/* 커뮤니티 - 글쓰기 */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;



