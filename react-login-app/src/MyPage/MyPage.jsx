import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../LayoutNBanner/Header.jsx';
import Footer from '../LayoutNBanner/Footer.jsx';
import './MyPage.css';

import {
    getProfileImage,
    uploadProfileImage,
    deleteProfileImage, // 이미지 삭제 함수 추가
} from '../Common/MyPageAPI.js';

// 프로필 부분
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

    const profileColors = ['#F97316', '#EC4899', '#A855F7', '#6366F1', '#14B8A6', '#22C55E'];
    const [selectedColor, setSelectedColor] = useState('#EC4899');  // Default color

    const [nickname, setNickname] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [isEditingNickname, setIsEditingNickname] = useState(false);

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

    const handleDeleteImageClick = () => {
        setPreviewImage(null);
        setProfileImageUrl(null);
        setDeleteImageMode(true);
        setShowSaveButton(true);
    };

    const handleEditNicknameClick = () => {
        setNewNickname(nickname);
        setIsEditingNickname(true);
        setShowSaveButton(true); // 저장 버튼 보이게
    };

    const handleSaveProfile = async () => {
        const file = fileInputRef.current.files[0];
        const updatedNickname = isEditingNickname ? newNickname : nickname;

        try {
            if (deleteImageMode) {
                await deleteProfileImage();
                setProfileImageUrl(null);
            } else {
                const res = await uploadProfileImage(file || null, updatedNickname, profileImageUrl);
                setProfileImageUrl(res.url || profileImageUrl);
            }

            setNickname(updatedNickname);
            setIsEditingNickname(false);
            setNewNickname('');
            setPreviewImage(null);
            setShowSaveButton(false);
            setDeleteImageMode(false);
        } catch (err) {
            console.error('프로필 저장 실패:', err);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const { nickname, profileImageUrl } = await getProfileImage();
                setNickname(nickname || '사용자');
                setProfileImageUrl(profileImageUrl || null);
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
                    <div className="profile-avatar" style={{backgroundColor: selectedColor}}>
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
                            style={{display: 'none'}}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* 색상 선택 아이콘들 */}
                    <div className="color-con">
                        {profileColors.map((color, idx) => (
                            <div
                                key={idx}
                                className="color-item"
                                onClick={() => handleColorClick(color)}
                            >
                                <div
                                    className="color-box"
                                    style={{
                                        backgroundColor: color,
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '50%',
                                    }}
                                >
                                    <img
                                        src={selectedColor === color ? selectIcon : test} // 클릭되면 selectIcon, 아니면 test 아이콘
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
                                    onBlur={() => setIsEditingNickname(false)}
                                    autoFocus
                                    className="nickname-input"
                                />
                            ) : (
                                nickname
                            )}
                        </span>

                        {/* 수정 아이콘은 isEditingNickname이 true면 숨김 */}
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

                {/* 마이 섹션 */}
                <section className="my-section">
                    <MenuItem
                        icon={myIcon}
                        label={(
                            <>
                                내 코스 모음
                                <br/>
                                <span>내가 추천받은 코스를 볼 수 있어요.</span>
                            </>
                        )}
                        onClick={() => goTo('/course/my')}
                    />

                </section>

                {/* 메뉴 섹션 */}
                <section className="page-section">
                    <MenuItem icon={scheduleIcon} label="일정관리" onClick={() => goTo('/course/my')}/>
                    <MenuItem icon={courseIcon} label="코스 추천" onClick={() => goTo('/course')}/>
                    <MenuItem icon={communityIcon} label="커뮤니티" onClick={() => goTo('/community')}/>
                    <MenuItem icon={mapIcon} label="골프장 위치 재설정" onClick={() => goTo('/first-main')}/>
                </section>

                {/* 고객지원/로그아웃 */}
                <section className="login-section">
                    <MenuItem icon={questionIcon} label="고객지원"/>
                    <MenuItem icon={logoutIcon} label="로그아웃" onClick={() => goTo('/')} isLogout/>
                </section>
                <Footer/>
            </div>
        </main>
    );
}

function MenuItem({icon, label, onClick, isLogout = false}) {
    return (
        <div className={`menu-item ${isLogout ? 'logout' : ''}`} onClick={onClick}>
            <div id="icon-btn">
                <img src={icon} alt={label} className="menu-icon"/>
            </div>
            <span className="menu-label">{label}</span>
        </div>
    );
}

export default MyPage;
