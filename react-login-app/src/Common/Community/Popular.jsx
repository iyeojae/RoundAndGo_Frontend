import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {fetchPopularPosts, fetchComments, fetchLikeCount, getUserInfo} from './CommunityAPI.js';
import { getCookie } from '../../Login/utils/cookieUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import './Popular.css';
import fire from '../../assets/PopularFire.svg';
import CommentIcon from '../../assets/CommentIcon.svg';
import HeartIcon from '../../assets/HeartIcon.svg';
import ActiveHeartIcon from '../../assets/ActiveHeartIcon.svg';
import WatchIcon from '../../assets/WatchIcon.svg';



function Popular() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path);
    };

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentCounts, setCommentCounts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});

    const loadUserInfo = async () => {
        const token = getCookie('accessToken');
        if (!token) return;  // 토큰 없으면 종료

        try {
            const userInfo = await getUserInfo();
            setCurrentUserId(userInfo?.id);
        } catch (err) {
            console.error('사용자 정보 가져오기 실패:', err);
        }
    };


    useEffect(() => {
        // 로컬스토리지에서 좋아요 상태 불러오기
        const storedLikes = JSON.parse(localStorage.getItem(`likes_${currentUserId}`)) || {};

        // posts가 변경될 때마다 해당 post.id 기준으로 상태 세팅
        const liked = {};
        posts.forEach(post => {
            liked[post.id] = storedLikes[post.id] || false;
        });

        setLikedPosts(liked);
    }, [posts]);

    const fetchCommentCount = async (postId) => {
        try {
            const { totalCount } = await fetchComments(postId);
            return totalCount;
        } catch (err) {
            console.error(`댓글 수 가져오기 실패 (postId: ${postId})`, err);
            return 0;
        }
    };

    useEffect(() => {
        const loadCommentCounts = async () => {
            const counts = {};

            await Promise.all(
                posts.map(async (post) => {
                    const count = await fetchCommentCount(post.id);
                    counts[post.id] = count;
                })
            );
            setCommentCounts(counts);
        };

        if (posts.length > 0) {
            loadCommentCounts();
        }
    }, [posts]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPopularPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="popular-posts">
            <div className="TabMsg">
                <img src={fire} alt='인기글 불모양' />
                <p>인기글</p>
            </div>

            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={false}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                // style={{ padding: '5px 3px 30px 5px', margin: '0 auto' }}
                className="PopularSwiper"
            >
                {posts.map((post) => (
                    <SwiperSlide className="popular-slide" key={post.id}>
                        <div className='content-container' onClick={() => goTo(`/community/detail/${post.id}`)}>
                            <h3>{post.title}</h3>
                            <div>
                                <img src={CommentIcon} alt='메시지아이콘' />
                                <p>{commentCounts[post.id] ?? 0}</p>
                            </div>
                        </div>
                        <div className='btn-container'>
                            <div className='heart'>
                                <img
                                    src={likedPosts[post.id] ? ActiveHeartIcon : HeartIcon}
                                    alt="하트 아이콘"
                                />
                                <span>{likeCounts[post.id] ?? 0}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Popular;