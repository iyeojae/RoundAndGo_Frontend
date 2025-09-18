// src/MainPage/CommunityPreview.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchPostsLatest, fetchComments } from "../../Common/Community/CommunityAPI";
import { TAB_LABELS } from "../../Common/Community/Community_TAB_LABELS.js";
import './preview.css';
import arrow from "../arrow.svg";

function CommunityPreview() {
    const navigate = useNavigate();
    const [previewPosts, setPreviewPosts] = useState([]);

    const goToDetail = (postId) => {
        navigate(`/community/detail/${postId}`);
    };

    const goToCommunity = () => {
        navigate('/community');
    };

    // key → label 매핑 함수
    const getCategoryLabel = (key) => {
        const found = TAB_LABELS.find(item => item.key === key);
        return found ? found.label : key; // 없으면 그냥 key 표시
    };

    useEffect(() => {
        const fetchPreviewData = async () => {
            try {
                const data = await fetchPostsLatest();
                const firstThreePosts = data.slice(0, 3);

                const postsWithComments = await Promise.all(
                    firstThreePosts.map(async post => {
                        const { totalCount } = await fetchComments(post.id);
                        return {
                            ...post,
                            commentCount: totalCount,
                        };
                    })
                );

                setPreviewPosts(postsWithComments);
            } catch (err) {
                console.error("커뮤니티 미리보기 불러오기 실패:", err);
            }
        };

        fetchPreviewData();
    }, []);

    return (
        // src/MainPage/CommunityPreview.jsx
        <div className="Community" style={{ paddingTop: '30px', width: '90%', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <p className="IntroMent"
                   style={{ fontSize: '18px', fontWeight: '600', color: '#000', padding: '0' }}>
                    커뮤니티
                </p>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={goToCommunity}>
                    <p style={{ fontSize: '12px', color: '#797979', marginRight: '5px' }}>더보기</p>
                    <img style={{ width: '6px', height: '12px' }} src={arrow} alt="더보기"/>
                </div>
            </div>

            {/* 카드 박스도 width 90% margin auto */}
            <div className="CommunityContent">
                {previewPosts.map(post => (
                    <div className="preview-post" key={post.id} onClick={() => goToDetail(post.id)}>
                        {/* 카테고리 + 제목 세로 정렬 */}
                        <div className="post-header" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="category" style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#2a8f2a'
                    }}>
                        {getCategoryLabel(post.category)}
                    </span>
                            <span className="title" style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                        {post.title}
                    </span>
                        </div>
                        <div className="post-meta" style={{ fontSize: '12px', color: '#555', marginTop: '8px', display: 'flex', gap: '10px' }}>
                            <span>❤️ {post.likeCount || 0}</span>
                            <span>👁 {post.viewCount || 0}</span>
                            <span>💬 {post.commentCount}</span>
                        </div>
                    </div>
                ))}
                {previewPosts.length === 0 && <p style={{ padding: '20px' }}>게시글이 없습니다</p>}
            </div>
        </div>

    );
}

export default CommunityPreview;
