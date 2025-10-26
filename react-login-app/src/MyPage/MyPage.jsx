import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../LayoutNBanner/Header.jsx';
import Footer from '../LayoutNBanner/Footer.jsx';
import './MyPage.css';

import Toast from '../Common/Community/Toast';

import {
    getUserInfo,
    getProfileImage,
    uploadProfileImage,
    deleteProfileImage,
} from '../Common/MyPageAPI.js';

import updateIcon from '../assets/update.svg'; // 이름수정 아이콘
import cameraIcon from '../assets/camerabtn.svg'; // 카메라 아이콘
import profileIcon from '../assets/profile.svg'; // 기본이미지 색상 변경 아이콘
import selectIcon from '../assets/SelectColor.svg'; // 색상 선택 아이콘
import test from '../assets/whiteone.svg';

import myIcon from '../assets/MY.svg'; // 내 코스 모음 아이콘
import mapIcon from '../assets/map.svg'; // 골프장위치 아이콘
import communityIcon from '../assets/ActiveCommunity.svg'; // 커뮤니티 아이콘
import courseIcon from '../assets/ActiveAI.svg'; // 코스추천 아이콘
import scheduleIcon from '../assets/ActiveCal.svg'; // 일정관리 아이콘
import questionIcon from '../assets/question.svg'; // 고객지원 아이콘
import logoutIcon from '../assets/logout.svg'; // 로그아웃 아이콘

function MyPage() {
    const navigate = useNavigate();
    const goTo = (path) => navigate(path);

    const profileColors = [
        { color: '#F97316', label: 'ORANGE' },
        { color: '#EC4899', label: 'PINK' },
        { color: '#A855F7', label: 'PURPLE' },
        { color: '#6366F1', label: 'BLUE' },
        { color: '#14B8A6', label: 'MINT' },
        { color: '#22C55E', label: 'GREEN' },
    ];

    const [selectedColor, setSelectedColor] = useState('#EC4899'); // Default color
    const [nickname, setNickname] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [isEditingNickname, setIsEditingNickname] = useState(false);

    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [url, setProfileImageUrl] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [deleteImageMode, setDeleteImageMode] = useState(false);

    const fileInputRef = useRef();

    const [activeMenu, setActiveMenu] = useState(null);

    const handleMenuClick = (label, path) => {
        setActiveMenu(label);  // 클릭된 메뉴 상태 저장
        setTimeout(() => {
            goTo(path);
        }, 300); // 0.3s delay
    };

    const handleColorClick = async (color) => {
        setSelectedColor(color);
        const selectedColorLabel = profileColors.find(c => c.color === color)?.label;

        try {

            const res = await uploadProfileImage(
                fileInputRef.current?.files?.[0] || null,
                nickname,
                selectedColorLabel
            );

            if (res?.url) {
                setProfileImageUrl(res.url);
            }

            setToastMessage('성공적으로 저장되었습니다.');
            setShowToast(true);
            setTimeout(() => {
                window.location.href = '/mypage';
            }, 1000);
        } catch (err) {
            console.error('프로필 색상 업데이트 실패:', err);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
        setShowSaveButton(true); // 저장 버튼 보이게
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

    const handleDeleteImageClick = async () => {
        console.log('handleDeleteImageClick 실행');
        try {
            const res = await deleteProfileImage();
            console.log('deleteProfileImage 응답:', res);
            setProfileImageUrl(null);

            setToastMessage('성공적으로 삭제되었습니다.');
            setShowToast(true);
            setTimeout(() => {
                window.location.href = '/mypage';
            }, 1000);
        } catch (error) {
            console.error('이미지 삭제 실패:', error);
        }
    };

    const handleEditNicknameClick = () => {
        setNewNickname(nickname);
        setIsEditingNickname(true);
        setShowSaveButton(true); // 저장 버튼 보이게
    };

    const handleSaveProfile = async () => {
        const file = fileInputRef.current?.files?.[0];
        const updatedNickname = isEditingNickname ? newNickname : nickname;
        const selectedColorLabel = profileColors.find(c => c.color === selectedColor)?.label;

        try {
            if (deleteImageMode) {
                await deleteProfileImage();
                setProfileImageUrl(null);
            }

            const res = await uploadProfileImage(
                file || null,
                updatedNickname,
                selectedColorLabel || ''
            );

            if (res?.url) {
                setProfileImageUrl(res.url);
            }

            setNickname(updatedNickname);
            setIsEditingNickname(false);
            setNewNickname('');
            setPreviewImage(null);
            setShowSaveButton(false);
            setDeleteImageMode(false);

            setToastMessage('성공적으로 저장되었습니다.');
            setShowToast(true);
            setTimeout(() => {
                window.location.href = '/mypage';
            }, 1000);
        } catch (err) {
            console.error('프로필 저장 실패:', err);
        }
    };


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const { nickname, url, profileColor } = await getProfileImage();
                setNickname(nickname || '사용자');

                if (url) {
                    const adjustedUrl = url.replace(/^https:/, 'http:');
                    setProfileImageUrl(adjustedUrl);
                } else {
                    setProfileImageUrl(null);
                }

                const matchedColor = profileColors.find(c => c.label === profileColor);
                if (matchedColor) {
                    setSelectedColor(matchedColor.color);
                }
            } catch (err) {
                console.error('프로필 정보 불러오기 실패:', err);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="mypage">
            <Header />
            <div className="mypage-container">
                {/* 프로필 섹션 */}
                <section className="profile-section">
                    <div className="profile-avatar" style={{backgroundColor: selectedColor}}>
                        <img
                            src={previewImage || url || profileIcon}
                            key={previewImage || url || profileIcon}
                            alt="프로필 이미지"
                            className="profile-image"
                        />.
                        <div className="camera-wrapper">
                            {url ? (
                                // 이미지가 있는 경우 => X 버튼
                                <button
                                    className="remove-image-button"
                                    onClick={handleDeleteImageClick}
                                >
                                    x
                                </button>
                            ) : (
                                // 이미지가 없는 경우 => 카메라 아이콘
                                <img
                                    src={cameraIcon}
                                    alt="카메라 아이콘"
                                    className="camera-icon"
                                    onClick={handleCameraClick}
                                />
                            )}

                        {previewImage && (
                            <button className="remove-image-button" onClick={handleRemoveImage}>x</button>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
            </div>

            {/* 색상 선택 아이콘들 */}
            <div className="color-con">
                {profileColors.map((colorObj, idx) => (
                    <div
                        key={idx}
                        className="color-item"
                        onClick={() => handleColorClick(colorObj.color)}
                            >
                                <div
                                    className="color-box"
                                    style={{
                                        backgroundColor: colorObj.color,
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '50%',
                                    }}
                                >
                                    <img
                                        src={selectedColor === colorObj.color ? selectIcon : test}
                                        alt={`icon ${idx}`}
                                        className="test-icon"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="profile-name-wrapper">
                        <span className="profile-name">
                            {isEditingNickname ? (
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => {
                                        setNewNickname(e.target.value);
                                        setShowSaveButton(true);
                                    }}
                                    autoFocus
                                    className="nickname-input"
                                />
                            ) : (
                                nickname
                            )}
                        </span>

                        {!isEditingNickname && (
                            <img
                                src={updateIcon}
                                alt="닉네임 수정 아이콘"
                                className="update-image"
                                onClick={handleEditNicknameClick}
                            />
                        )}

                        {showSaveButton && (
                            <button className="save-button" onClick={handleSaveProfile}>
                                저장
                            </button>
                        )}
                    </div>
                </section>

                {/* 메뉴 섹션 */}
                <section className="page-section">
                    <MenuItem
                        icon={scheduleIcon}
                        label="일정관리"
                        activeMenu={activeMenu}
                        onClick={() => handleMenuClick("일정관리", "/schedule")}
                    />
                    <MenuItem
                        icon={courseIcon}
                        label="코스 추천"
                        activeMenu={activeMenu}
                        onClick={() => handleMenuClick("코스 추천", "/course")}
                    />
                    <MenuItem
                        icon={communityIcon}
                        label="커뮤니티"
                        activeMenu={activeMenu}
                        onClick={() => handleMenuClick("커뮤니티", "/community")}
                    />
                    <MenuItem
                        icon={mapIcon}
                        label="골프장 위치 재설정"
                        activeMenu={activeMenu}
                        onClick={() => handleMenuClick("골프장 위치 재설정", "/first-main")}
                    />
                </section>

                {/* 고객지원/로그아웃 */}
                <section className="login-section">
                    <MenuItem
                        icon={questionIcon}
                        label="고객지원"
                        activeMenu={activeMenu}
                        onClick={() => setActiveMenu("고객지원")}
                    />
                    <MenuItem
                        icon={logoutIcon}
                        label="로그아웃"
                        activeMenu={activeMenu}
                        onClick={() => handleMenuClick("로그아웃", "/")}
                        isLogout
                    />
                </section>
                <Footer />
            </div>

            {showToast && (
                <Toast
                    message={toastMessage}
                    duration={1000}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}

function MenuItem({ icon, label, onClick, isLogout = false, activeMenu }) {
    const isActive = activeMenu === label;

    return (
        <div
            className={`menu-item ${isLogout ? 'logout' : ''} ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div id="icon-btn">
                <img src={icon} alt={label} className="menu-icon"/>
            </div>
            <span className="menu-label">{label}</span>
        </div>
    );
}

export default MyPage;
