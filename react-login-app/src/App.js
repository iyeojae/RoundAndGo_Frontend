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
import FirstMainPage from "./FirstMain/FirstMainPage";
import MainPage from "./Main/MainPage";
import HomePage from "./HomePage";
import OAuth2Callback from "./OAuth2Callback";

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
                <Route path="/first-main" element={<FirstMainPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/login/oauth2/code/kakao" element={<OAuth2Callback />} />
            </Routes>
        </div>
    </Router>
  );
}

export default App;

