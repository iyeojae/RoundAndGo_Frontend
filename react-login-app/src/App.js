import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Login/utils/cleanupLocalStorage'; // 쿠키 기반 인증으로 전환하면서 로컬스토리지 정리

import LeftContent from './LayoutNBanner/LeftContent.jsx'; // 왼쪽 콘텐츠

import './App.css';
import EmailLoginPage from './Login/EmailAuth/EmailLoginPage';
import SignupPage from './Login/EmailAuth/SignupPage';
import FindAccountPage from './Login/EmailAuth/FindAccountPage';
import SchedulePage from './Schedule&Weather/SchedulePage';
import JejuLocationPage from './Schedule&Weather/JejuLocationPage';
import HomePage from "./Login/HomePage";
import OAuth2Callback from "./Login/OAuth2Callback";

import FirstMainPage from "./FirstMain/FirstMainPage"; // 첫 메인
import MainPage from "./Main/Main/MainPage"; // 메인
import DetailMainPage from './Main/Detail/DetailMain.jsx'; // 메인 더보기
import DetailMorePage from './Main/Detail/AccommodationD/MoreAccommodation.jsx'; // 더보기 -> 숙박 상세
import CommunityMainPage from './Community/Community.jsx'; // 커뮤니티
import CommunityEntirePage from './Community/CommunityEntire.jsx'; // 커뮤니티 전체보기
import CommunityWritePage from './Community/CommunityWrite.jsx'; // 커뮤니티 쓰기
import CommunityDetailPage from './Community/CommunityDetail.jsx' // 커뮤니티 상세
import CommunityEditPage from './Community/CommunityEdit.jsx' // 커뮤니티 편집
import CourseRecommendation from './Course/CourseRecommendation'; // 코스 추천
import CourseMain from './Course/CourseMain'; // 코스 추천 메인
import MyCourseView from './Course/Components/MyCourseView.jsx'; // 내 코스 보기
import MyPage from './MyPage/MyPage.jsx'; // 마이페이지

import { ScreenSizeProvider } from './Common/ScreenSizeContext';

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="left-content-wrapper">
                    <LeftContent />
                </div>
                <div className="right-content">
                    <ScreenSizeProvider>
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/email-login" element={<EmailLoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/find-account" element={<FindAccountPage />} />
                            <Route path="/schedule" element={<SchedulePage />} />
                            <Route path="/jeju-location" element={<JejuLocationPage />} />
                            <Route path="/login/oauth2/code/kakao" element={<OAuth2Callback />} />

                            <Route path="/first-main" element={<FirstMainPage/>}/> {/* 첫 메인 페이지 */}
                            <Route path="/main" element={<MainPage/>}/> {/* 메인 페이지 */}
                            <Route path="/detail/main" element={<DetailMainPage/>}/> {/* 상세 페이지 */}
                            <Route path="/detail/main/more" element={<DetailMorePage/>}/> {/*상세페이지 더보기 - 숙박 */}
                            <Route path="/community" element={<CommunityMainPage/>}/> {/* 커뮤니티 - 메인 */}
                            <Route path="/community/entire" element={<CommunityEntirePage/>}/> {/* 커뮤니티 - 전체 */}
                            <Route path="/community/detail/:postId" element={<CommunityDetailPage/>}/> {/* 커뮤니티 - 상세 */}
                            <Route path="/community/write" element={<CommunityWritePage/>}/> {/* 커뮤니티 - 글쓰기 */}
                            <Route path="/community/edit/:postId" element={<CommunityEditPage />} /> {/* 커뮤니티 - 수정 */}
                            {/*<Route path="/course/recommendation" element={<CourseRecommendation/>}/> /!* 코스 추천 *!/*/}
                            <Route path="/course/my" element={<MyCourseView/>}/> {/* 내 코스보기 */}
                            <Route path="/course/*" element={<CourseMain/>}/> {/* 코스 추천 3단계 */}
                            <Route path="/mypage" element={<MyPage />} /> {/* 마이 페이지 */}
                        </Routes>
                    </main>
                    </ScreenSizeProvider>
                </div>
            </div>
        </Router>
    );
}

export default App;


