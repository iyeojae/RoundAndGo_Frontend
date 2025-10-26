import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../LayoutNBanner/Header.jsx';
import Footer from '../../LayoutNBanner/Footer.jsx';

import Accommodation from './Accommodation/Accommodation.jsx'; // 숙박시설 정보 컴포넌트
import Restaurant from './Restaurant/Restaurant.jsx'; // 음식점 정보 컴포넌트
import Tourism from './Tourism/Tourism.jsx'; // 관광지 컴포넌트
import CommunityPreview from "./Community/CommuinityPreview"; // 커뮤니티 컴포넌트
import GoToCourse from '../../assets/GoToCourse.svg';
import IconAI from '../../assets/IconAI.svg';
import Arrow from '../../assets/BackBtn.svg';

import { ScreenSizeContext } from '../../Common/ScreenSizeContext';

function MainPage() {
    const { isTablet } = useContext(ScreenSizeContext);

    const navigate = useNavigate();
    const [golfCourseId, setGolfCourseId] = useState(null);

    const [animStyle, setAnimStyle] = useState({
        opacity: 0,
    });

    const [arrowBounce, setArrowBounce] = useState(false);

    useEffect(() => {
        const storedId = localStorage.getItem('selectedGolfCourseId');
        if (storedId) {
            setGolfCourseId(Number(storedId));
        }

        const fadeTimer = setTimeout(() => {
            setAnimStyle({
                opacity: 1,
                transition: 'opacity 1s ease-out'
            });
        }, 300);

        const arrowTimer = setTimeout(() => {
            setArrowBounce(true);
            setTimeout(() => setArrowBounce(false), 300);
        }, 1200);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(arrowTimer);
        };
    }, []);

    const goTo = () => {
        navigate('/course');
    };

    const styles = {
        MainPage: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            boxSizing: 'border-box',
            backgroundColor: '#F8F8F8'
        },
        RecommendCourse: {
            width: '100%',
            aspectRatio: '440 / 279',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            backgroundImage: `linear-gradient(180deg, rgba(38, 153, 98, 0) 41.07%, #269962 75.53%), url(${GoToCourse})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            ...animStyle
        },
        elementCont: {
            width: '90%',
            margin: '0 auto 3% auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        RecommendationChildContainer: {
            display: 'flex',
            flexDirection: 'row',
            gap: '2%',
            alignItems: 'center',
            width: '60%',
            transform: arrowBounce ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.5s ease'
        },
        RecommendationChildContainerP: {
            fontSize: isTablet
                ? 'clamp(16px, 2.5vw, 22px)'
                : 'clamp(12px, 2.2vw, 18px)',
            fontWeight: 400,
            color: '#fff',
            margin: '0',
            cursor: 'default',
            width: '80%',
        },
        RecommendationChildContainerPSpan: {
            fontSize: isTablet
                ? 'clamp(20px, 2.8vw, 28px)'
                : 'clamp(16px, 2.5vw, 22px)',
            fontWeight: 450,
            color: '#fff',
            marginTop: '3%'
        },
        ImgContainer: {
            width: '20%',
        },
        ImgContainerImg: {
            width: '100%',
            aspectRatio: '4 / 3',
        },
        ArrowImgContainer: {
            width: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        ArrowImg: {
            width: '100%',
            aspectRatio: '1',
            transform: arrowBounce ? 'scale(1.3) scaleX(-1)' : 'scale(1) scaleX(-1)',
            transition: 'transform 0.5s ease'
        }
    };

    return (
        <div className="MainPage" style={styles.MainPage}>
            <Header/>
            <div style={styles.RecommendCourse}> {/* 코스 추천 */}
                <div style={styles.elementCont}>
                    <div style={styles.RecommendationChildContainer}>
                        <div className='ImgContainer' style={styles.ImgContainer}>
                            <img src={IconAI} alt='IconAI' style={styles.ImgContainerImg}/>
                        </div>
                        <p style={styles.RecommendationChildContainerP}>
                            AI가 짜주는<br/>
                            <span style={styles.RecommendationChildContainerPSpan}>여행 코스 보러가기</span>
                        </p>
                    </div>
                    <div style={styles.ArrowImgContainer}>
                        <img onClick={goTo} style={styles.ArrowImg} src={Arrow} alt='WhiteArrow'/>
                    </div>
                </div>
            </div>

            {/* 골프장 id 있으면 골프장, 없으면 지역 기반 */}
            <Accommodation golfCourseId={golfCourseId}/> {/* 숙박 컴포넌트 */}
            <span style={{width: '100%', height: '6px', backgroundColor: '#DFDFDF', marginTop: '25px' }}></span>
            <Restaurant golfCourseId={golfCourseId} /> {/* 음식점 컴포넌트 */}
            <Tourism golfCourseId={golfCourseId} /> {/* 관광지 컴포넌트 */}

            <div className="Community" style={{width: '90%', margin: '0 auto'}}> {/* 커뮤니티 미리보기 컴포넌트 */}
                <CommunityPreview/>
            </div>
            <Footer/>
        </div>
    );
}

export default MainPage;
