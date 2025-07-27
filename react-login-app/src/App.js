import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import EmailLoginPage from './EmailLoginPage';
import SchedulePage from './SchedulePage';
import WeatherPage from './WeatherPage';
import JejuLocationPage from './JejuLocationPage';
import FirstMainPage from "./FirstMain/FirstMainPage";
import MainPage from "./Main/MainPage";
import HomePage from "./HomePage";

function App() {
  return (
    <Router>
        <div style={{minWidth: '375px', maxWidth: '440px', margin: '0 auto'}}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/email-login" element={<EmailLoginPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/jeju-location" element={<JejuLocationPage />} />
                <Route path="/first-main" element={<FirstMainPage />} />
                <Route path="/main" element={<MainPage />} />f
            </Routes>
        </div>
    </Router>
  );
}

export default App;

