import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchPopularPosts, fetchComments, fetchLikeCount, toggleLike } from './CommunityAPI.js';
import { checkAuth } from "../../FirstMain/IsContainToken.js";

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
    const [likedPosts, setLikedPosts] = useState({});


    useEffect(() => {
        const loadLikeData = async () => {
            const counts = {};
            const liked = {};

            await Promise.all(
                posts.map(async (post) => {
                    try {
                        const likeCount = await fetchLikeCount(post.id);
                        counts[post.id] = likeCount.count;
                        liked[post.id] = likeCount.liked;
                    } catch (error) {
                        console.error(`좋아요 데이터 로딩 실패 (postId: ${post.id})`, error);
                        counts[post.id] = 0;
                        liked[post.id] = false;
                    }
                })
            );

            setLikeCounts(counts);
            setLikedPosts(liked);
        };

        if (posts.length > 0) {
            loadLikeData();
        }
    }, [posts]);

    const handleLikeToggle = async (postId) => {
        const accessToken = checkAuth();

        if (!accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await toggleLike(postId, accessToken);

            setLikedPosts(prev => ({
                ...prev,
                [postId]: !prev[postId],
            }));

            setLikeCounts(prev => ({
                ...prev,
                [postId]: prev[postId] + (likedPosts[postId] ? -1 : 1),
            }));
        } catch (error) {
            console.error('좋아요 토글 중 오류:', error);
            alert('좋아요 처리에 실패했습니다.');
        }
    };

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
                            <div className='heart' onClick={() => handleLikeToggle(post.id)}>
                                <img
                                    src={likedPosts[post.id] ? ActiveHeartIcon : HeartIcon}
                                    alt="하트 아이콘"
                                />
                                <span>{likeCounts[post.id] ?? 0}</span>
                            </div>
                            <div className='watch'>
                                <img src={WatchIcon} alt="조회수 아이콘" />
                                <span>16</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Popular;