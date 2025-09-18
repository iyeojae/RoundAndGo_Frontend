import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header.jsx';
import Footer from '../Layout/Footer.jsx';
import WriteBtn from './WriteNewBoard.jsx';
import DivContent from '../Common/Community/DivContent.jsx';
import { checkAuth } from "../Search/IsContainToken.js";

import { fetchCategories, fetchPostsLatest, fetchComments, fetchLikeCount, toggleLike } from "../Common/Community/CommunityAPI";
import { TAB_LABELS } from '../Common/Community/Community_TAB_LABELS.js';
import WatchIcon from './WatchIcon.svg';
import ActiveHeartIcon from './ActiveHeartIcon.svg';
import HeartIcon from './HeartIcon.svg';
import Comment from './CommentIcon.svg';
import NoContent from './NoContent.svg';

function CommunityEntire() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path); // 경로 설정된 곳으로 이동
    };

    const [posts, setPosts] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [categorizedPosts, setCategorizedPosts] = useState({});
    const [activeTab, setActiveTab] = useState('LATEST');

    // 오늘 날짜와 비교해서 최신글 필터링
    const isToday = (createdAt) => {
        const [year, month, day] = createdAt;
        const postDate = new Date(year, month - 1, day); // month는 0부터 시작 -> -1
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 00:00 시간 설정
        return postDate.getTime() === today.getTime(); // 오늘 날짜와 비교
    };

    // ENG TO KOR
    const EngToKor = (key) => {
        const tab = TAB_LABELS.find(tab => tab.key === key);
        return tab ? tab.label : key;
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // 최신글
                const latestData = await fetchPostsLatest();
                const todayPosts = latestData.filter(post => isToday(post.createdAt));
                setLatestPosts(latestData);

                // 카테고리별 데이터
                const categoryData = await Promise.all(
                    TAB_LABELS.filter(({ key }) => key !== 'LATEST') // LATEST 제외
                        .map(({ label }) => fetchCategories(label))
                );

                // key로 묶어서 저장
                const categorizedData = categoryData.reduce((acc, categoryPosts, idx) => {
                    const categoryKey = TAB_LABELS[idx + 1].key; // key 사용 ('TRAVEL_MATE', 'FREE_BOARD' 등)
                    acc[categoryKey] = categoryPosts;
                    return acc;
                }, {});

                setCategorizedPosts(categorizedData);
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
            }
        };

        fetchPosts();
    }, []);

    // 탭에 따른 필터링
    const filteredPosts = activeTab === 'LATEST'
        ? latestPosts.filter(post => isToday(post.createdAt))
        : categorizedPosts[activeTab] || [];


    const [likeCounts, setLikeCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [likedPosts, setLikedPosts] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const latestData = await fetchPostsLatest();
                setLatestPosts(latestData);

                const categoryData = await Promise.all(
                    TAB_LABELS.filter(({ key }) => key !== 'LATEST')
                        .map(({ label }) => fetchCategories(label))
                );

                const categorizedData = categoryData.reduce((acc, categoryPosts, idx) => {
                    const categoryKey = TAB_LABELS[idx + 1].key;
                    acc[categoryKey] = categoryPosts;
                    return acc;
                }, {});
                setCategorizedPosts(categorizedData);

                // 댓글 수 / 좋아요 수
                const allPosts = [...latestData, ...categoryData.flat()];
                const likePromises = allPosts.map(post => fetchLikeCount(post.id));
                const commentPromises = allPosts.map(post => fetchComments(post.id));

                const likes = await Promise.all(likePromises);
                const comments = await Promise.all(commentPromises);

                const likeData = {};
                const commentData = {};
                allPosts.forEach((post, i) => {
                    likeData[post.id] = likes[i]?.data ?? 0;
                    commentData[post.id] = comments[i]?.totalCount ?? 0;
                });

                setLikeCounts(likeData);
                setCommentCounts(commentData);
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
            }
        };

        fetchPosts();
    }, []);

    const ToggleLike = async (postId) => {
        try {
            const accessToken = checkAuth();
            if (!accessToken) {
                alert("로그인이 필요합니다.");
                navigate("/email-login");
                return;
            }

            await toggleLike(postId, accessToken);

            // 토글 후 좋아요 수 다시 갱신
            const updatedCount = await fetchLikeCount(postId);
            setLikeCounts(prev => ({ ...prev, [postId]: updatedCount?.data || 0 }));

            // 간단한 토글 UI 상태도 추가
            setLikedPosts(prev => ({
                ...prev,
                [postId]: !prev[postId],
            }));
        } catch (error) {
            console.error('좋아요 토글 실패:', error.message);
        }
    };

    // GoToDetailCommunity
    const goToPostDetail = (postId) => {
        navigate(`/community/detail/${postId}`);
    };


    return (
        <main>
            <div className="community">
                <Header />
                <div style={{backgroundColor: '#F8F8F8', width: '100%',}}>
                    <div>
                        <DivContent/>

                        <div style={{marginTop: '7%'}}>
                        <span style={{
                            display: 'block',
                            width: '100%',
                            maxWidth: '440px',
                            minWidth: '375px',
                            height: '6px',
                            backgroundColor: '#dfdfdf',
                            margin: '0 auto',
                        }}></span>
                        </div>
                    </div>

                    {/* 카테고리 네비게이션 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        borderBottom: '1px solid #ddd',
                    }}>
                        {TAB_LABELS.map(tab => (
                            <div
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    padding: '10px 15px',
                                    cursor: 'pointer',
                                    // borderBottom: activeTab === tab.key ? '3px solid green' : 'none',
                                    fontWeight: '400',
                                    fontSize: '14px',
                                    color: activeTab === tab.key ? '#269962' : '#aaa',
                                }}
                            >
                                {tab.label}
                            </div>
                        ))}
                    </div>

                    {/* 게시글 목록 */}
                    <ul style={{
                        width: '90%',
                        margin: '0 auto',
                        listStyle: 'none',
                        padding: 0,
                        minHeight: '67vh',
                        display: filteredPosts.length === 0 ? 'flex' : 'block',
                        alignItems: filteredPosts.length === 0 ? 'center' : undefined,
                        justifyContent: filteredPosts.length === 0 ? 'center' : undefined
                    }}>
                        {filteredPosts.length === 0 && (
                            <li>
                                <img src={NoContent} alt='no'/>
                            </li>
                        )}
                        {filteredPosts.map(post => (
                            <li key={post.id} className="post-item" onClick={() => goToPostDetail(post.id)} style={{
                                margin: '12px auto 1px auto',
                                paddingBottom: '1px',
                                borderBottom: '0.5px solid #797979',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <div className="post-left-cont" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                    alignItems: 'flex-start',
                                }}>
                                    <p style={{
                                        fontSize: '9px',
                                        border: '0.8px solid #269962',
                                        fontWeight: '400',
                                        color: '#269962',
                                        width: 'fit-content',
                                        margin: 0,
                                        padding: '0.25% 1%',
                                    }}>{EngToKor(post.category)}</p>

                                    <p style={{
                                        fontSize: '13px',
                                        fontWeight: '450',
                                        margin: '0'
                                    }}>{post.title}</p>

                                    <div style={{
                                        width: '100%',
                                        margin: 0,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '10px'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: 'row', gap: '2px'}}>
                                            <img
                                                style={{width: '14px'}}
                                                onClick={() => ToggleLike(post.id)}
                                                src={likedPosts[post.id] ? ActiveHeartIcon : HeartIcon}
                                                alt="좋아요"
                                            />
                                            <p style={{
                                                margin: 0,
                                                fontSize: '9px',
                                                color: '#797979'
                                            }}>{likeCounts[post.id] ?? 0}</p>
                                        </div>

                                        <div style={{display: 'flex', flexDirection: 'row', gap: '2px'}}>
                                            <img src={WatchIcon} alt="조회수" style={{width: '14px'}}/>
                                            <p style={{margin: 0, fontSize: '9px', color: '#797979'}}>0</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='post-right-cont' style={{display: 'flex', flexDirection: 'column'}}>
                                    <img style={{margin: '0'}} src={Comment} alt='메시지아이콘'/>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '11px',
                                        color: '#797979',
                                        textAlign: 'center'
                                    }}>0</p>
                                </div>
                            </li>
                        ))}
                    </ul>


                    <WriteBtn/>
                    <Footer/>
                </div>
            </div>
        </main>
    );
}

export default CommunityEntire;
