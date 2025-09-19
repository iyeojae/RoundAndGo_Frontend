import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Layout/Header.jsx';
import Footer from '../Layout/Footer.jsx';
import DivContent from '../Common/Community/DivContent.jsx';
import'./Community.css';

import BlackArrow from './BlackArrow.svg';
import Comment from './CommentIcon.svg';
import NewBoard from './NewBoardIcon.svg';
import { fetchCategories, fetchPostsLatest, fetchComments, searchPosts } from "../Common/Community/CommunityAPI";
import { TAB_LABELS } from '../Common/Community/Community_TAB_LABELS.js';
import Popular from "../Common/Community/Popular";
import WriteNewBoard from './WriteNewBoard.jsx';
import Toast from '../Common/Community/Toast.jsx';

import search from '../Community/search.svg';

function CommunityBoard() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path); // 경로 설정된 곳으로 이동
    };

    const [posts, setPosts] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [categorizedPosts, setCategorizedPosts] = useState([]);
    const [commentCounts, setCommentCounts] = useState({});

    const [showToast, setShowToast] = useState(false);
    const location = useLocation();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (searchKeyword.trim() === '') return;

        const results = await searchPosts(searchKeyword);
        setSearchResults(results);
        setIsSearching(true);
    };

    useEffect(() => {
        if (location.state?.deleted) {
            setShowToast(true);

            // 브라우저 히스토리 초기화
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


    // 댓글 수 || 댓글 목록
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

            // 최신글 댓글 수
            await Promise.all(
                latestPosts.map(async (post) => {
                    const count = await fetchCommentCount(post.id);
                    counts[post.id] = count;
                })
            );

            // 카테고리별 게시글 댓글 수
            await Promise.all(
                categorizedPosts.flat().map(async (post) => {
                    if (!(post.id in counts)) { // 중복 요청 방지
                        const count = await fetchCommentCount(post.id);
                        counts[post.id] = count;
                    }
                })
            );

            setCommentCounts(counts);
        };

        if (latestPosts.length > 0 || categorizedPosts.length > 0) {
            loadCommentCounts();
        }
    }, [latestPosts, categorizedPosts]);

    // 오늘 날짜와 비교해서 최신글 필터링
    const isToday = (createdAt) => {
        const [year, month, day] = createdAt;
        const postDate = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 00:00으로 설정
        return postDate.getTime() === today.getTime(); // 오늘 날짜와 비교
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // 최신글
                const latestData = await fetchPostsLatest();
                const filteredLatestPosts = latestData
                    .filter(post => isToday(post.createdAt))
                    .slice(0, 3); // 최대 3개만

                setLatestPosts(filteredLatestPosts); // 최신글 상태

                // 최신글을 제외 카테고리
                const categoryData = await Promise.all(
                    TAB_LABELS.filter(({ key }) => key !== 'LATEST')
                        .map(({ label }) => fetchCategories(label))
                        );
                setCategorizedPosts(categoryData);

            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
            }
        };

        fetchPosts();
    }, []);

    // GoToDetailCommunity
    const goToPostDetail = (postId) => {
        navigate(`/community/detail/${postId}`);
    };

    return (
        <div className="community">
            <Header/>
            <div style={{backgroundColor: '#F8F8F8', width: '100%'}}>
                <div>
                    {/* 검색창 */}
                    <form onSubmit={handleSearchSubmit} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '20px auto',
                        width: '100%',
                    }}>
                        <div className='formcon' style={{position: 'relative', width: '90%', maxWidth: '440px'}}>
                            <input
                                type="text"
                                placeholder="보고싶은 게시글을 검색하세요"
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    height: '45px',
                                    padding: '0 40px 0 15px', // 오른쪽 아이콘 공간 확보
                                    borderRadius: '10px',
                                    border: '1px solid #ccc',
                                    fontSize: '14px',
                                    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.25)',
                                }}
                            />
                            <img
                                src={search}
                                alt="검색아이콘"
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '16px',
                                    height: '16px',
                                    pointerEvents: 'none',
                                    userSelect: 'none', // 혹시 선택 막기 원하면 추가
                                }}
                            />
                        </div>

                    </form>

                    {/* 검색 결과 */}
                    {isSearching && (
                        <div className="community-section">
                            <div className="section-header-comm-main">
                                <h4>검색 결과</h4>
                                <button onClick={() => {
                                    setIsSearching(false);
                                    setSearchKeyword('');
                                    setSearchResults([]);
                                }} style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '12px',
                                    color: '#269962',
                                    cursor: 'pointer'
                                }}>
                                    초기화
                                </button>
                            </div>
                            <ul className="post-list">
                                {searchResults.length === 0 ? (
                                    <li className="no-post">검색 결과가 없습니다</li>
                                ) : (
                                    searchResults.map((post) => (
                                        <li key={post.id} className="post-item" onClick={() => goToPostDetail(post.id)}>
                                            <div className="post-title"><p>{post.title}</p></div>
                                            <div className="comment-count">
                                                <img src={Comment} alt="댓글" />
                                                <p>{commentCounts[post.id] ?? 0}</p>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                            <span style={{
                                display: 'block',
                                height: '2px',
                                width: '100%',
                                backgroundColor: '#dfdfdf',
                                marginTop: '10px',
                                borderRadius: '3px',
                            }} />
                        </div>
                    )}


                    <DivContent/>

                    <Popular/>
                    {/* 인기글 */}

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

                <div className="CommunityContainer" style={{paddingBottom: '5%'}}>
                    {/* 최신글 섹션 */}
                    <div className="community-section">
                        <div className="section-header-comm-main">
                            <h4>최신글</h4>
                            <img onClick={() => goTo('/community/entire')} src={BlackArrow} alt='더보기'/>
                        </div>
                        <ul className="post-list">
                            {latestPosts.length === 0 && <li className="no-post">최신글이 없습니다</li>}
                            {latestPosts.map((post) => (
                                <li key={post.id} className="post-item" onClick={() => goToPostDetail(post.id)}>
                                    <div className="post-title">
                                        <img src={NewBoard} alt='최신글'/>
                                        <p>{post.title}</p>
                                    </div>
                                    <div className="comment-count">
                                        <img src={Comment} alt='댓글 아이콘'/>
                                        <p>{commentCounts[post.id] ?? 0}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <span
                            style={{
                                display: 'block',
                                height: '2px',
                                width: '100%',
                                backgroundColor: '#dfdfdf',
                                marginTop: '10px',
                                borderRadius: '3px',
                            }}
                        />
                    </div>

                    {/* 카테고리별 게시글 섹션 */}
                    {categorizedPosts.length > 0 && categorizedPosts.map((categoryPosts, idx) => {
                        const {label} = TAB_LABELS[idx + 1];  // '최신글' 제외
                        const postsInCategory = categoryPosts.slice(0, 3); // 최대 3개

                        return (
                            <div key={label} className="community-section">
                                <div className="section-header-comm-main">
                                    <h4>{label}</h4>
                                    <img onClick={() => goTo('/community/entire')} src={BlackArrow} alt='더보기'/>
                                </div>
                                <ul className="post-list">
                                    {postsInCategory.length === 0 && <li className="no-post">게시글이 없습니다</li>}
                                    {postsInCategory.map((post) => (
                                        <li key={post.id} className="post-item"
                                            onClick={() => goToPostDetail(post.id)}>
                                            <div className="post-title"><p>{post.title}</p></div>
                                            <div className="comment-count">
                                                <img src={Comment} alt='댓글 아이콘'/>
                                                <p>{commentCounts[post.id] ?? 0}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* 마지막 index 아닐 때만 visible */}
                                {idx !== categorizedPosts.length - 1 && (
                                    <span
                                        style={{
                                            display: 'block',
                                            height: '2px',
                                            width: '100%',
                                            backgroundColor: '#dfdfdf',
                                            marginTop: '10px',
                                            borderRadius: '3px',
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {showToast && (
                        <Toast
                            message="게시글이 정상적으로 삭제되었습니다."
                            duration={3000}
                            onClose={() => setShowToast(false)}
                        />
                    )}
                    <WriteNewBoard/>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

export default CommunityBoard;