// CommunityDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../LayoutNBanner/Header";
import {
    fetchPostDetail, postComment, fetchComments,
    toggleLike, fetchLikeCount, deletePost, deleteComment,
    updateComment
} from '../Common/Community/CommunityAPI';
import { getUserInfo } from '../Common/MyPageAPI.js';

import { checkAuth } from "../FirstMain/IsContainToken.js";
import DeleteConfirmModal from "../Common/Community/DeleteConfirm";
import Toast from '../Common/Community/Toast.jsx';
import { TAB_LABELS } from '../Common/Community/Community_TAB_LABELS';

import profile from '../assets/profile.svg';
import reply from '../assets/replybtn.svg';
import heart from '../assets/Heart.svg';
import greenheart from '../assets/GreenHeart.svg';
import waste from '../assets/waste-mini.svg';
import update from '../assets/update.svg';
import SendIcon from '../assets/ArrowTop.svg';

import './CommunityDetail.css';

function CommunityDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, accessToken } = checkAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserNickname, setCurrentUserNickname] = useState(null);

    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [content, setContent] = useState('');
    const [replyTargetId, setReplyTargetId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const showToastWithMessage = useCallback((message) => {
        setToastMessage(message);
        setShowToast(true);
    }, []);

    const loadPostData = async () => {
        try {
            const postDetail = await fetchPostDetail(postId);
            setPost(postDetail.data);

            const commentData = await fetchComments(postId);
            setComments(commentData?.comments || []);

            const likeData = await fetchLikeCount(postId);
            setLikeCount(likeData.count || 0);
            setIsLiked(likeData.liked || false);
        } catch (error) {
            console.error('게시글 불러오기 실패:', error);
            showToastWithMessage('게시글을 불러오는데 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const loadUserInfo = async () => {
        if (!isAuthenticated || !accessToken) return;
        try {
            const userInfo = await getUserInfo(accessToken);
            setCurrentUserId(userInfo?.id);
            setCurrentUserNickname(userInfo?.nickname);  // 닉네임 저장
        } catch (err) {
            console.error('사용자 정보 가져오기 실패:', err);
        }
    };

    useEffect(() => {
        loadUserInfo();
        loadPostData();
    }, [postId]);

    const handleToggleLike = async () => {
        if (!isAuthenticated || !accessToken) {
            showToastWithMessage('로그인이 필요합니다.');
            navigate('/email-login');
            return;
        }
        try {
            await toggleLike(post.id, accessToken);
            await loadPostData();
        } catch (error) {
            showToastWithMessage('좋아요 처리에 실패했습니다.');
        }
    };

    const handleEdit = () => {
        if (selectedType === 'comment') {
            setEditingCommentId(selectedComment.id);
            setEditContent(selectedComment.content);
            setShowOptions(false);
        } else if (selectedType === 'post') {
            setShowOptions(false);
            navigate(`/community/edit/${selectedComment.id}`);
        }
    };

    const handleDelete = async () => {
        try {
            if (selectedType === 'comment') {
                await deleteComment(selectedComment.id, accessToken);
                showToastWithMessage('댓글이 삭제되었습니다.');
                setEditingCommentId(null);
                setShowOptions(false);
                await loadPostData();
            } else if (selectedType === 'post') {
                await deletePost(selectedComment.id, accessToken);
                showToastWithMessage('게시글이 삭제되었습니다.');
                setShowOptions(false);
                navigate('/community');
            }
        } catch (error) {
            showToastWithMessage('삭제에 실패했습니다.');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            showToastWithMessage('댓글 내용을 입력하세요.');
            return;
        }
        if (!isAuthenticated || !accessToken) {
            showToastWithMessage('로그인이 필요합니다.');
            navigate('/email-login');
            return;
        }
        try {
            await postComment(postId, content, replyTargetId);
            setContent('');
            setReplyTargetId(null);
            await loadPostData();
        } catch (error) {
            showToastWithMessage('댓글 작성에 실패했습니다.');
        }
    };

    const getCategoryLabel = (key) => {
        const found = TAB_LABELS.find(tab => tab.key === key);
        return found ? found.label : key;
    };

    const formatDate = (arr) => {
        if (!Array.isArray(arr)) return '';
        const [year, month, day] = arr;
        return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    };

    const nestComments = (comments) => {
        const map = {};
        const roots = [];

        comments.forEach(comment => {
            map[comment.id] = { ...comment, children: [] };
        });

        comments.forEach(comment => {
            if (comment.parentCommentId) {
                const parent = map[comment.parentCommentId];
                if (parent) parent.children.push(map[comment.id]);
            } else {
                roots.push(map[comment.id]);
            }
        });

        return roots;
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToastWithMessage('게시글 주소가 복사되었습니다.'))
            .catch(() => showToastWithMessage('URL 복사에 실패했습니다.'));
        setShowOptions(false);
    };

    const handleReport = () => {
        showToastWithMessage('신고 기능은 추후 구현 예정입니다.');
        setShowOptions(false);
    };

    const convertToHttp = (url) => {
        if (!url) return '';
        if (url.startsWith('https://')) {
            return url.replace('https://', 'http://');
        }
        return url;
    };

    const profileColors = [
        { color: '#F97316', label: 'ORANGE' },
        { color: '#EC4899', label: 'PINK' },
        { color: '#A855F7', label: 'PURPLE' },
        { color: '#6366F1', label: 'BLUE' },
        { color: '#14B8A6', label: 'MINT' },
        { color: '#22C55E', label: 'GREEN' },
    ];

    const getBackgroundColor = (profileColor) => {
        const colorObj = profileColors.find(c => c.label === profileColor);
        return colorObj ? colorObj.color : '#ccc'; // 기본 색상 지정 가능
    };

    const renderComments = (commentList, depth = 0) => {
        return commentList.map(comment => {
            const isParent = depth === 0;
            const canEdit = comment.author === currentUserNickname;

            return (
                <div key={comment.id} className={`comment-group ${isParent ? 'parent-group' : ''}`}>
                    <div className='comment-item-wrap'>
                        <div className={`comment-item-content ${!isParent ? 'reply-content' : ''}`}>
                            {!isParent && <img src={reply} alt="reply" className="reply-arrow" />}
                            <div className="comment-profile-img"
                                 style={{ backgroundColor: !comment.profileImage ? getBackgroundColor(comment.profileColor) : 'transparent', }}>
                                {comment.profileImage ? (
                                    <img
                                        src={convertToHttp(comment.profileImage)}
                                        alt="profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <img
                                        src={profile}
                                        alt="profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            <div className="comment-body">
                                <div className='comment-meta'>
                                    <div className='comment-author-info'>
                                        <strong>{comment.author || '익명'}</strong>
                                        <p>{formatDate(comment.createdAt)}</p>
                                    </div>
                                    <div id='meat-ball' onClick={() => {
                                        setSelectedComment(comment);
                                        setSelectedType('comment');
                                        setShowOptions(true);
                                    }}>
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>

                                {/* 수정 모드 여부에 따른 조건부 렌더링 */}
                                {editingCommentId === comment.id ? (
                                    <div
                                        className="edit-comment-area"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows="1"
                                        autoFocus
                                        style={{
                                            flexGrow: 1,
                                            resize: 'none',
                                            background: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: 'inherit',
                                            fontFamily: 'inherit',
                                            whiteSpace: 'pre-wrap',
                                            padding: 0,
                                            margin: 0,
                                            color: 'inherit',
                                            overflow: 'hidden',
                                            // 기본 텍스트 커서 유지
                                        }}
                                    />
                                        <button
                                            onClick={async () => {
                                                if (!editContent.trim()) {
                                                    showToastWithMessage('수정 내용을 입력하세요.');
                                                    return;
                                                }
                                                try {
                                                    await updateComment(
                                                        editingCommentId,
                                                        editContent,
                                                        post.id,
                                                        accessToken,
                                                        comment.parentCommentId || null
                                                    );
                                                    showToastWithMessage('댓글이 수정되었습니다.');
                                                    setEditingCommentId(null);
                                                    setEditContent('');
                                                    await loadPostData();
                                                } catch {
                                                    showToastWithMessage('댓글 수정에 실패했습니다.');
                                                }
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '4px 8px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                color: '#269962',
                                            }}
                                        >
                                            완료
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setEditContent('');
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '4px 8px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                color: '#888',
                                            }}
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (
                                    <p className="comment-text" style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                                )}

                                {editingCommentId !== comment.id && (
                                    <button className='reply-btn' onClick={() => setReplyTargetId(comment.id)}>답글쓰기</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {comment.children && renderComments(comment.children, depth + 1)}
                </div>
            );
        });
    };


    if (loading) return <div>로딩 중...</div>;
    if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

    const isAuthor = post.author === currentUserNickname;

    return (
        <div id='main'>
            <Header versionClassName={'ArrowVer'} showLogo={false} showArrow={true} TitleText={'커뮤니티'} />
            <div className="community-content-wrapper"  style={{height: '100vh'}}>
                <div className="community-detail-cont">
                    <div className='board-cont'>
                        <div className='title-tab'>
                            <p id='cate'>{getCategoryLabel(post.category)}</p>
                            <h2>{post.title}</h2>
                            <div className='post-meta-line'>
                                <p>{formatDate(post.createdAt)} | {post.author}</p>
                                <div id='meat-ball' onClick={() => {
                                    setSelectedComment(post);
                                    setSelectedType('post');
                                    setShowOptions(true);
                                }}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>

                        <div className='content-tab'>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                            <div id='imgs'>
                                {Array.isArray(post.images) && post.images.map((img, i) => {
                                    const imgUrl = img.url.replace(/^https:/, 'http:');
                                    return (
                                        <img
                                            key={i}
                                            src={imgUrl}
                                            alt={img.originalFilename || `img-${i}`}
                                            onClick={() => setSelectedImage(imgUrl)}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div className='btn-wrap'>
                            <button onClick={handleToggleLike}>
                                <img src={isLiked ? greenheart : heart} alt='like' /> {likeCount}
                            </button>

                            {isAuthor && (
                                <div className='post-action-buttons'>
                                    <button onClick={() => navigate(`/community/edit/${post.id}`)}>
                                        <img src={update} alt='수정' /> 수정하기
                                    </button>
                                    <button onClick={() => setShowDeleteModal(true)}>
                                        <img src={waste} alt='삭제' /> 삭제하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='comments-start-tab'>
                        <p id='count-comment'>댓글 {comments.length}</p>
                        {renderComments(nestComments(comments))}
                    </div>
                </div>

                {/* 댓글 입력창 */}
                <div className='comment-input-area'>
                    <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={replyTargetId ? '답글을 입력해주세요' : '댓글을 입력해주세요'}
                        rows="1"
                    />
                        <button type="submit"><img src={SendIcon} alt="send" /></button>
                    </form>
                </div>
            </div>

            {/* 바텀시트 */}
            {showOptions && (
                <div className="bottom-sheet" onClick={() => setShowOptions(false)}>
                    <div className="bottom-sheet-content" onClick={e => e.stopPropagation()}>
                        {selectedComment?.author === currentUserNickname ? (
                            <>
                                <button onClick={handleEdit} style={{color: '#2563EB'}}>수정하기</button>
                                <button onClick={handleDelete} style={{color: '#F62C2F'}}>삭제하기</button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleReport} style={{color: '#F62C2F'}}>신고하기</button>
                                <button onClick={handleShare}>공유하기</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 이미지 확대 모달 */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="확대 이미지"/>
                </div>
            )}

            {/* 삭제 확인 모달 */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    try {
                        await deletePost(post.id, accessToken);
                        setShowDeleteModal(false);
                        navigate('/community', {state: {deleted: true}});
                    } catch {
                        showToastWithMessage('삭제에 실패했습니다.');
                    }
                }}
            />

            {showToast && (
                <Toast message={toastMessage} onClose={() => setShowToast(false)} />
            )}
        </div>
    );
}

export default CommunityDetail;
