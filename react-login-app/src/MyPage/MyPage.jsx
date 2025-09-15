import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header.jsx';
import Footer from '../Layout/Footer.jsx';
import './MyPage.css';

import {
    getUserInfo,
    getProfileImage,
    uploadProfileImage,
    deleteProfileImage, // 이미지 삭제 함수 추가
} from '../Common/MyPageAPI.js';

// 프로필 부분
import updateIcon from '../Community/update.svg'; // 이름수정 아이콘
import cameraIcon from './camerabtn.svg'; // 카메라 아이콘
import profileIcon from './ProfileIcon.svg'; // 기본이미지 색상 변경 아이콘
import selectIcon from './SelectColor.svg'; // 색상 선택 아이콘

import mapIcon from './map.svg'; // 골프장위치 아이콘
import communityIcon from '../Image/Layout/Footer/ActiveCommunity.svg'; // 커뮤니티 아이콘
import courseIcon from '../Image/Layout/Footer/ActiveAI.svg'; // 코스추천 아이콘
import scheduleIcon from '../Image/Layout/Footer/ActiveCal.svg'; // 일정관리 아이콘

import questionIcon from './question.svg'; // 고객지원 아이콘
import logoutIcon from './logout.svg'; // 로그아웃 아이콘

function MyPage() {
    const navigate = useNavigate();
    const goTo = (path) => navigate(path);

    const profileColors = ['#F97316', '#EC4899', '#A855F7', '#6366F1', '#14B8A6', '#22C55E'];
    const [selectedColor, setSelectedColor] = useState('#EC4899');

    const [nickname, setNickname] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [deleteImageMode, setDeleteImageMode] = useState(false); // 삭제 모드인지 여부

    const fileInputRef = useRef();

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreviewImage(imageURL);
            setDeleteImageMode(false);
            setShowSaveButton(true);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setShowSaveButton(false);
    };

    const handleDeleteImageClick = () => {
        // 삭제 모드로 전환
        setPreviewImage(null);
        setProfileImageUrl(null);
        setDeleteImageMode(true);
        setShowSaveButton(true);
    };

    const handleSaveImage = async () => {
        if (deleteImageMode) {
            try {
                await deleteProfileImage(); // 삭제 API 호출
                setProfileImageUrl(null);
                setPreviewImage(null);
                setDeleteImageMode(false);
                setShowSaveButton(false);
            } catch (err) {
                console.error('이미지 삭제 실패:', err);
            }
            return;
        }

        const file = fileInputRef.current.files[0];
        if (!file) return;

        try {
            const res = await uploadProfileImage(file);
            setProfileImageUrl(res.url); // 서버에서 받은 최종 이미지 URL
            setPreviewImage(null);
            setShowSaveButton(false);
        } catch (err) {
            console.error('이미지 저장 실패:', err);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userInfo = await getUserInfo();
                const profileImg = await getProfileImage();

                setNickname(userInfo.email || '사용자');
                setProfileImageUrl(profileImg?.url || null);
            } catch (err) {
                console.error('프로필 정보 불러오기 실패:', err);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <main className="mypage">
            <Header />
            <div className="mypage-container">
                {/* 프로필 섹션 */}
                <section className="profile-section">
                    <div className="profile-avatar" style={{ backgroundColor: selectedColor }}>
                        <img
                            src={previewImage || profileImageUrl || profileIcon}
                            alt="프로필 이미지"
                            className="profile-image"
                        />
                        <div className="camera-wrapper">
                            <img
                                src={cameraIcon}
                                alt="카메라 아이콘"
                                className="camera-icon"
                                onClick={handleCameraClick}
                            />
                            {previewImage && (
                                <button className="remove-image-button" onClick={handleRemoveImage}>x</button>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="profile-name-wrapper">
                        <span className="profile-name">{nickname}</span>
                        <img
                            src={updateIcon}
                            alt="프로필 이미지 삭제"
                            className="update-image"
                            onClick={handleDeleteImageClick}
                        />
                        {showSaveButton && (
                            <button className="save-button" onClick={handleSaveImage}>
                                저장
                            </button>
                        )}
                    </div>
                    <div className="color-options">
                        {profileColors.map((color, idx) => (
                            <span
                                key={idx}
                                className="color-dot-wrapper"
                                onClick={() => handleColorClick(color)}
                            >
                                <span
                                    className={`color-dot ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            </span>
                        ))}
                    </div>
                </section>

                {/* 메뉴 섹션 */}
                <section className="page-section">
                    <MenuItem icon={scheduleIcon} label="일정관리" onClick={() => goTo('/schedule')} />
                    <MenuItem icon={courseIcon} label="코스 추천" onClick={() => goTo('/course')} />
                    <MenuItem icon={communityIcon} label="커뮤니티" onClick={() => goTo('/community')} />
                    <MenuItem icon={mapIcon} label="골프장 위치 재설정" onClick={() => goTo('/first-main')} />
                </section>

                {/* 고객지원/로그아웃 */}
                <section className="login-section">
                    <MenuItem icon={questionIcon} label="고객지원" />
                    <MenuItem icon={logoutIcon} label="로그아웃" onClick={() => goTo('/')} isLogout />
                </section>
            </div>
            <Footer />
        </main>
    );
}

function MenuItem({ icon, label, onClick, isLogout = false }) {
    return (
        <div className={`menu-item ${isLogout ? 'logout' : ''}`} onClick={onClick}>
            <div id="icon-btn">
                <img src={icon} alt={label} className="menu-icon" />
            </div>
            <span className="menu-label">{label}</span>
        </div>
    );
}

export default MyPage;
