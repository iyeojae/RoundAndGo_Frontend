// src/MainPage/CommunityPreview.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchPostsLatest, fetchComments } from "../../../Common/Community/CommunityAPI";
import { TAB_LABELS } from "../../../Common/Community/Community_TAB_LABELS.js";
import arrow from "../../../assets/arrow.svg";
import heart from '../../../assets/HeartIcon.svg';
import view from '../../../assets/WatchIcon.svg';
import comment from '../../../assets/CommentIcon.svg';

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

    // CSS 스타일을 JavaScript 객체로 정의
    const styles = {
        CommunityContent: {
            width: '90%',
            margin: '3% auto 10% auto',
            borderRadius: '10px',
            background: '#fff',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.25)',
            padding: '15px'
        },
        previewPost: {
            padding: '10px 0',
            borderBottom: '1px solid #797979',
            cursor: 'pointer'
        },
        previewPostLastChild: { // 마지막 요소 스타일 (인라인에서는 별도로 적용 필요)
            padding: '10px 0',
            cursor: 'pointer',
            borderBottom: 'none'
        },
        postHeader: {
            display: 'flex',
            flexDirection: 'column', // 세로 정렬
            gap: '4px',
            marginBottom: '6px' // 필요 시 유지
        },
        category: {
            fontSize: '9px',
            fontWeight: 500,
            color: '#269962',
            border: '0.8px solid #269962',
            padding: '2px 6px',
            width: 'fit-content'
        },
        title: {
            fontSize: '13px',
            fontWeight: 500,
            color: '#000',
            flex: 1
        },
        postMeta: { // 이전에 인라인으로 적용된 스타일과 병합됨
            display: 'flex',
            gap: '10px',
            marginTop: '8px',
            fontSize: '12px',
            color: '#555'
        },
        postMetaIcon: {
            width: '12px', // 아이콘의 크기를 명시적으로 지정 (원본에는 없었으나 폰트 사이즈 대비 적절히 추정)
            height: '12px',
            verticalAlign: 'middle', // 텍스트와 이미지 중앙 정렬
            marginRight: '3px' // 텍스트와의 간격
        },
        commentIcon: {
            width: '10px',
            height: '10px',
            verticalAlign: 'middle',
            marginRight: '3px'
        }
    };

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '7%'
            }}>
                <p className="IntroMent"
                   style={{fontSize: '18px', fontWeight: '500', color: '#000', padding: '0', margin: '0'}}>
                    커뮤니티
                </p>
                <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={goToCommunity}>
                    <p style={{fontSize: '10px', color: '#797979', marginRight: '5px'}}>더보기</p>
                    <img style={{width: '6px', height: '10px'}} src={arrow} alt="더보기"/>
                </div>
            </div>

            {/* .CommunityContent 스타일 적용 */}
            <div className="CommunityContent" style={styles.CommunityContent}>
                {previewPosts.map((post, index) => {
                    const isLast = index === previewPosts.length - 1;
                    return (
                        // .preview-post 및 :last-child 스타일 적용
                        <div
                            className="preview-post"
                            key={post.id}
                            onClick={() => goToDetail(post.id)}
                            style={isLast ? styles.previewPostLastChild : styles.previewPost}
                        >
                            {/* .post-header 스타일 적용 */}
                            <div className="post-header" style={styles.postHeader}>
                                {/* .category 스타일 적용 */}
                                <span className="category" style={styles.category}>
                                    {getCategoryLabel(post.category)}
                                </span>
                                {/* .title 스타일 적용 */}
                                <span className="title" style={styles.title}>
                                    {post.title}
                                </span>
                            </div>
                            {/* .post-meta 스타일 적용 */}
                            <div className="post-meta" style={styles.postMeta}>
                                <span><img style={styles.postMetaIcon} src={heart} alt='좋아요'/> {post.likeCount || 0}</span>
                                <span><img style={styles.commentIcon} src={comment}
                                           alt='댓글'/> {post.commentCount}</span>
                            </div>
                        </div>
                    );
                })}
                {previewPosts.length === 0 && <p style={{padding: '20px'}}>게시글이 없습니다</p>}
            </div>
        </>
    );
}

export default CommunityPreview;