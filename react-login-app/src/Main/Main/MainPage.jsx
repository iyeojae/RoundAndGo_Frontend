import React, {useState, useEffect} from 'react';
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

function MainPage() {
    const navigate = useNavigate();
    const [golfCourseId, setGolfCourseId] = useState(null);

    useEffect(() => {
        const storedId = localStorage.getItem('selectedGolfCourseId');
        if (storedId) {
            setGolfCourseId(Number(storedId));
        }
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
            backgroundImage: `linear-gradient(180deg, rgba(38, 153, 98, 0) 41.07%, #269962 75.53%), url(${GoToCourse})`
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
            width: '60%'
        },
        RecommendationChildContainerP: {
            fontSize: '0.75rem',
            fontWeight: 400,
            color: '#fff',
            margin: '0',
        },
        RecommendationChildContainerPSpan: {
            fontSize: '1rem',
            fontWeight: 450,
            color: '#fff',
            marginTop: '3%'
        },
        ImgContainer: {
            width: '48px',
            height: '36px'
        },
    };

    return (
        // .MainPage 스타일 적용
        <div className="MainPage" style={styles.MainPage}>
            <Header/>
            <div className="RecommendCourse"
                 style={styles.RecommendCourse}> {/* 코스 추천 */}
                <div className="element-cont" style={styles.elementCont}>
                    <div className='RecommendationChildContainer' style={styles.RecommendationChildContainer}>
                        <div className='ImgContainer' style={styles.ImgContainer}>
                            <img src={IconAI} alt='IconAI'/>
                        </div>
                        <p style={styles.RecommendationChildContainerP}>
                            AI가 짜주는<br/>
                            <span style={styles.RecommendationChildContainerPSpan}>여행 코스 보러가기</span>
                        </p>
                    </div>
                    <img onClick={goTo} style={{width: '36px', transform: 'scale(-1)'}} src={Arrow}
                         alt='WhiteArrow'/>
                </div>
            </div>

            {/* 골프장 id 있으면 골프장, 없으면 지역 기반 */}
            <Accommodation golfCourseId={golfCourseId} /> {/* 숙박 컴포넌트 */}
            <span style={{ width: '100%', height: '6px', backgroundColor: '#DFDFDF', marginTop: '25px' }}></span>
            <Restaurant golfCourseId={golfCourseId} /> {/* 음식점 컴포넌트 */}
            <Tourism golfCourseId={golfCourseId} /> {/* 관광지 컴포넌트 */}

            <div className="Community" style={{width: '90%', margin: '0 auto'}}>
                <CommunityPreview/>
            </div>
            <Footer/>
        </div>
    );
}

export default MainPage;