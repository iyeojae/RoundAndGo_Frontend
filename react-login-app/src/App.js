import CommunityEntire from "./Community/CommunityEntire.jsx";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import EmailLoginPage from './EmailAuth/EmailLoginPage';
import SignupPage from './EmailAuth/SignupPage';
import FindAccountPage from './EmailAuth/FindAccountPage';
import SchedulePage from './Schedule/SchedulePage';
import WeatherPage from './WeatherPage';
import JejuLocationPage from './JejuLocationPage';
import HomePage from "./HomePage";
import OAuth2Callback from "./OAuth2Callback";

import FirstMainPage from "./FirstMain/FirstMainPage.jsx"; // 첫 메인
import MainPage from "./Main/MainPage.jsx"; // 첫 메인
import DetailMainPage from './Detail/DetailMain.jsx'; // 첫 메인
import DetailMorePage from './Detail/Accommodation/MoreAccommodation.jsx'; // 첫 메인
import CommunityMainPage from './Community/Community.jsx'; // 커뮤니티
import CommunityEntirePage from './Community/CommunityEntire.jsx'; // 커뮤니티 전체보기
import CommunityDetailPage from './Community/CommunityDetail.jsx'; // 커뮤니티 단일 게시글 상세보기
import CommunityWritePage from './Community/CommunityWrite.jsx'; // 커뮤니티 작성 페이지
import CommunityEditPage from './Community/CommunityEdit.jsx'; // 커뮤니티 수정 페이지
import MyPage from './MyPage/MyPage.jsx';

function App() {
    return (
        <Router>
            <main>
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
                    <Route path="/detail/main" element={<DetailMainPage />} /> {/* 상세 페이지 */}
                    <Route path="/detail/main/more" element={<DetailMorePage/>}/> {/*상세페이지 더보기 - 숙박 */}
                    <Route path="/community" element={<CommunityMainPage/>}/> {/* 커뮤니티 - 메인 */}
                    <Route path="/community/entire" element={<CommunityEntirePage/>}/> {/* 커뮤니티 - 전체 */}
                    <Route path="/community/detail/:postId" element={<CommunityDetailPage/>}/> {/* 커뮤니티 - 단일 게시글 상세보기  */}
                    <Route path="/community/write" element={<CommunityWritePage/>}/> {/* 커뮤니티 - 글쓰기 */}
                    <Route path="/community/edit/:postId" element={<CommunityEditPage/>}/> {/* 커뮤니티 - 글수정 */}
                    <Route path="/mypage" element={<MyPage/>}/> {/* 마이페이지 */}
                </Routes>
            </main>
        </Router>
    );
}

export default App;



