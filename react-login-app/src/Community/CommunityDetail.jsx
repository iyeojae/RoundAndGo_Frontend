import React, { useState, useEffect, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../Layout/Header";
import { fetchPostDetail, postComment, fetchComments, toggleLike, fetchLikeCount, deletePost, deleteComment, updateComment } from '../Common/Community/CommunityAPI';
import Comment from './CommentIcon.svg'; // 댓글 아이콘
import { checkAuth } from "../Search/IsContainToken";
import { TAB_LABELS } from '../Common/Community/Community_TAB_LABELS'; // 카테고리 라벨
import DeleteConfirmModal from "../Common/Community/DeleteConfirm";
import BottomSheet from "./BottomSheet";

import './CommunityDetail.css';
import reply from './replybtn.svg';
import heart from './Heart.svg';
import greenheart from './GreenHeart.svg';
import waste from './waste-mini.svg';
import update from './update.svg';

function CommunityDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, accessToken, email } = checkAuth();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [post, setPost] = useState(null); // 게시글
    const [comments, setComments] = useState([]); // 댓글
    const [content, setContent] = useState(''); // 댓글/답글 내용
    const [replyTargetId, setReplyTargetId] = useState(null); // 대댓글 대상

    const [loading, setLoading] = useState(true); // 로딩중
    const [likeCount, setLikeCount] = useState(0); // 좋아요
    const [isLiked, setIsLiked] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null); // 클릭한 이미지 URL

    const handleToggleLike = async () => {
        if (!isAuthenticated || !accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/email-login');
            return;
        }

        try {
            await toggleLike(post.id, accessToken);
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    const [selectedComment, setSelectedComment] = useState(null); // 선택된 댓글 or 게시글
    const [selectedType, setSelectedType] = useState(null); // 'comment' or 'post'
    const [showOptions, setShowOptions] = useState(false); // 옵션 바텀시트 표시 여부

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const handleEdit = () => {
        if (selectedType === 'comment') {
            // 댓글 수정 모드 진입
            setEditingCommentId(selectedComment.id);
            setEditContent(selectedComment.content);
            setShowOptions(false);
        } else if (selectedType === 'post') {
            // 게시글 수정 페이지로 이동
            setShowOptions(false);
            navigate(`/community/edit/${selectedComment.id}`);
        }
    };


    const handleDelete = async () => {
        try {
            if (selectedType === 'comment') {
                await deleteComment(selectedComment.id, accessToken);
                alert('댓글이 삭제되었습니다.');
                setShowOptions(false);
                setEditingCommentId(null);
                await loadPostData();
            } else if (selectedType === 'post') {
                await deletePost(selectedComment.id, accessToken);
                alert('게시글이 삭제되었습니다.');
                setShowOptions(false);
                navigate('/community');
            }
        } catch (error) {
            alert('삭제에 실패했습니다.');
            console.error(error);
        }
    };

    const loadPostData = async () => {
        try {
            const postDetail = await fetchPostDetail(postId);
            setPost(postDetail.data);

            const commentData = await fetchComments(postId);
            setComments(commentData?.comments || []);

            const likeData = await fetchLikeCount(postId);
            setLikeCount(likeData.likeCount || 0);
            setIsLiked(likeData.isLiked || false);
        } catch (error) {
            console.error('게시글 불러오기 실패:', error);
            alert('게시글을 불러오는데 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPostData();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('댓글 내용을 입력하세요.');
            return;
        }
        if (!isAuthenticated || !accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/email-login');
            return;
        }
        try {
            await postComment(postId, content, accessToken, replyTargetId);
            setContent('');
            setReplyTargetId(null);
            await loadPostData();
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    const formatDate = (arr) => {
        if (!Array.isArray(arr)) return '';
        const [year, month, day, hour, minute] = arr;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour}:${minute}`;
    };

    const getCategoryLabel = (key) => {
        const found = TAB_LABELS.find(tab => tab.key === key);
        return found ? found.label : key;
    };

    // flat comments → tree 구조 변환
    const nestComments = (comments) => {
        const map = {};
        const roots = [];

        comments.forEach((comment) => {
            map[comment.id] = { ...comment, children: [] };
        });

        comments.forEach((comment) => {
            if (comment.parentCommentId) {
                const parent = map[comment.parentCommentId];
                if (parent) {
                    parent.children.push(map[comment.id]);
                }
            } else {
                roots.push(map[comment.id]);
            }
        });
        return roots;
    };

    const renderComments = (commentList, depth = 0) => {
        return commentList.map((comment) => (
            <div
                key={comment.id}
                className={`${depth > 0 ? 'child' : 'parent'}`}
                style={{
                    marginLeft: Math.min(depth * 20, 60),
                    marginTop: '10px'
                }}
            >
                <div className='profile-tab'>
                    {depth > 0 && (
                        <img src={reply} alt="대댓글" className="child-comment-img" />
                    )}

                    <img src={Comment} alt='프로필 이미지' />
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>{comment.author || '익명'}</strong>
                            <div
                                id='meat-ball'
                                onClick={() => {
                                    setSelectedComment(comment);
                                    setSelectedType('comment');
                                    setShowOptions(true);
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <span></span><span></span><span></span>
                            </div>
                        </div>

                        {/* 댓글 수정 중일 때 textarea */}
                        {editingCommentId === comment.id ? (
                            <>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows="3"
                                    style={{ width: '100%', marginTop: '8px' }}
                                />
                                <div style={{ marginTop: '4px' }}>
                                    <button
                                        onClick={async () => {
                                            if (!editContent.trim()) {
                                                alert('수정 내용을 입력하세요.');
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
                                                alert('댓글이 수정되었습니다.');
                                                setEditingCommentId(null);
                                                setEditContent('');
                                                await loadPostData();
                                            } catch (error) {
                                                alert('댓글 수정에 실패했습니다.');
                                                console.error(error);
                                            }
                                        }}
                                    >
                                        저장
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingCommentId(null);
                                            setEditContent('');
                                        }}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        취소
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                                <button
                                    id='reply'
                                    onClick={() => setReplyTargetId(comment.id)}
                                    style={{ marginTop: '4px' }}
                                >
                                    답글쓰기
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {replyTargetId === comment.id && (
                    <form onSubmit={handleCommentSubmit} style={{ marginTop: '8px' }}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="답글을 입력해주세요"
                            rows="3"
                            style={{ width: '100%' }}
                        />
                        <button type="submit">답글 작성</button>
                        <button
                            type="button"
                            onClick={() => {
                                setReplyTargetId(null);
                                setContent('');
                            }}
                            style={{ marginLeft: '8px' }}
                        >
                            취소
                        </button>
                    </form>
                )}

                {comment.children && comment.children.length > 0 && renderComments(comment.children, depth + 1)}
            </div>
        ));
    };

    if (loading) return <div>로딩 중...</div>;
    if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

    return (
        <main>
            <div style={{ backgroundColor: '#f8f8f8' }}>
                <Header versionClassName={'ArrowVer'} showLogo={false} showArrow={true} TitleText={'커뮤니티'} />
                <div className="community-detail-cont">
                    <div className="board-cont">
                        <div className='title-tab'>
                            <p id='cate'>{getCategoryLabel(post.category)}</p>
                            <h2>{post.title}</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p>{formatDate(post.createdAt)} | {post.author || '작성자 없음'}</p>
                                <div
                                    id='meat-ball'
                                    onClick={() => {
                                        setSelectedComment(post);
                                        setSelectedType('post');
                                        setShowOptions(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>

                        <div className='content-tab'>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                            <div id='imgs'>
                                {Array.isArray(post.images) && post.images.length > 0 ? (
                                    post.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.url}
                                            alt={img.originalFilename || `게시글 이미지 ${index + 1}`}
                                            style={{maxWidth: '100%', marginTop: '10px', cursor: 'pointer'}}
                                            onClick={() => setSelectedImage(img.url)}
                                        />
                                    ))
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>

                        <div className='btn-wrap'>
                            <button
                                onClick={handleToggleLike}
                                className={`like-button ${isLiked ? 'liked' : ''}`}
                            >
                                <img src={isLiked ? greenheart : heart} alt='좋아요'/>
                                {likeCount}
                            </button>

                            {post.author === email && (
                                <div>
                                    <button onClick={() => navigate(`/community/edit/${post.id}`)}>
                                        <img src={update} alt='수정'/>
                                        수정하기
                                    </button>
                                    <button onClick={() => setShowDeleteModal(true)}>
                                        <img src={waste} alt='삭제'/>
                                        삭제하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='comments-start-tab'>
                        <p id='count-comment'>댓글 {comments.length}</p>
                        {renderComments(nestComments(comments))}
                    </div>

                    {replyTargetId === null && (
                        <form onSubmit={handleCommentSubmit} style={{marginTop: '20px'}}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="댓글을 입력해주세요"
                                rows="4"
                                style={{ width: '100%' }}
                            />
                            <button type="submit">댓글 작성</button>
                        </form>
                    )}
                </div>
            </div>

            {/* 바텀시트 */}
            {showOptions && (
                <div className="bottom-sheet" onClick={() => setShowOptions(false)}>
                    <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
                        {selectedComment?.author === email ? (
                            <>
                                <button onClick={handleEdit}>수정하기</button>
                                <button onClick={handleDelete}>삭제하기</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => alert('신고 기능은 추후 구현 예정입니다.')}>신고하기</button>
                                <button onClick={() => alert('공유 기능은 추후 구현 예정입니다.')}>공유하기</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 이미지 뷰어 모달 */}
            {selectedImage && (
                <div
                    className="image-modal"
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        cursor: 'pointer'
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="확대 이미지"
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            boxShadow: '0 0 10px #000'
                        }}
                    />
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
                        navigate('/community', { state: { deleted: true } });
                    } catch (error) {
                        alert('삭제에 실패했습니다.');
                    }
                }}
            />
        </main>
    );
}

export default CommunityDetail;
