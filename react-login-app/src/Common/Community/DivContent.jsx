import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';
import NoContent from '../../Community/NoContent.svg';
import comment from '../../Community/CommentIcon.svg';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../utils/cookieUtils';

// react-slick CSS 파일 임포트
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// CSS-in-JS를 위한 스타일 정의
const customStyles = `
    .slick-dots {
        position: absolute;
        bottom: -30px;
        width: 100%;
        display: flex !important;
        justify-content: center;
        padding: 0;
    }
    .slick-dots li {
        width: 8px !important;
        height: 8px !important;
        margin: 0 4px !important;
    }
    .slick-dots li button:before {
        font-size: 0px !important;
    }
    /* 닷의 기본 스타일 */
    .slick-dots li div {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: lightgray;
    }
    /* 활성화된 닷 스타일 */
    .slick-dots li.slick-active div {
        background-color: #269962;
    }
`;

function TabButtons() {
    const [activeTab, setActiveTab] = useState('');
    const [writtenPosts, setWrittenPosts] = useState([]);
    const [commentedPosts, setCommentedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = getAuthToken();
    const navigate = useNavigate();

    // 동적으로 CSS를 삽입하는 useEffect 훅
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = customStyles;
        document.head.appendChild(styleSheet);

        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const fetchWrittenPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/posts/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWrittenPosts(res.data?.data?.slice(0, 15) || []);
        } catch (err) {
            console.error("내가 쓴 글 가져오기 실패", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommentedPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/comments/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentedPosts(res.data?.data?.slice(0, 15) || []);
        } catch (err) {
            console.error("댓글 단 글 가져오기 실패", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (activeTab === 'written') fetchWrittenPosts();
        else if (activeTab === 'commented') fetchCommentedPosts();
    }, [activeTab]);

    const handlePostClick = (id) => {
        navigate(`/community/detail/${id}`);
    };

    const formatCreatedAt = (createdAt) => {
        if (Array.isArray(createdAt) && createdAt.length >= 3) {
            const [year, month, day] = createdAt;
            const formattedMonth = String(month).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            return `${year}.${formattedMonth}.${formattedDay}`;
        }
        return '날짜 정보 없음';
    };

    const renderPosts = (posts) => {
        if (loading) return <p style={{ textAlign: 'center' }}>불러오는 중...</p>;
        if (posts.length === 0) {
            return (
                <div
                    className="empty-post"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                    }}
                >
                    <img src={NoContent} alt="없음" style={{ width: '40px', marginBottom: '10px' }} />
                    <p style={{ color: '#AAAAAA', fontSize: '0.65rem' }}>
                        최근 작성하신 {activeTab === 'written' ? '글' : '댓글'}이 없습니다.
                    </p>
                </div>
            );
        }

        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            appendDots: dots => (
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '0'
                }}>
                    <ul style={{ margin: "0px", padding: '0px' }}> {dots} </ul>
                </div>
            ),
            customPaging: i => (
                <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    display: "inline-block",
                    backgroundColor: "lightgray"
                }}></div>
            )
        };

        const chunkedPosts = [];
        for (let i = 0; i < posts.length; i += 3) {
            chunkedPosts.push(posts.slice(i, i + 3));
        }

        return (
            <>
                <p style={{
                    color: '#269962',
                    fontSize: '10px',
                    fontWeight: '300',
                    textAlign: 'center',
                    marginBottom: '10px'
                }}>
                    최근 작성한 {activeTab === 'written' ? '글' : '댓글'}이 최대 15개까지 표시됩니다.
                </p>
                <div style={{ padding: '0 10px' }}>
                    <Slider {...settings}>
                        {chunkedPosts.map((chunk, index) => (
                            <div key={index}>
                                {chunk.map(post => {
                                    const title = activeTab === 'written' ? post.title : post.content;
                                    const createdAt = activeTab === 'written' ? formatCreatedAt(post.createdAt) : null;
                                    const id = activeTab === 'written' ? post.id : post.communityId;

                                    return (
                                        <div
                                            key={post.id || post.communityId}
                                            style={{
                                                borderBottom: '1px solid #E0E0E0',
                                                padding: '10px 0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handlePostClick(id)}
                                        >
                                            <div style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                flexGrow: 1
                                            }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 5px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title || '내용 없음'}</h4>
                                                {createdAt && (
                                                    <p style={{ fontSize: '11px', fontWeight: '400', color: '#797979', margin: '0' }}>{createdAt}</p>
                                                )}
                                            </div>
                                            {activeTab === 'written' && (
                                                <div style={{ display: 'flex', alignItems: 'center', minWidth: '40px', justifyContent: 'flex-end' }}>
                                                    <img src={comment} alt="댓글 아이콘" style={{ width: '16px', height: '16px', marginRight: '5px' }} />
                                                    <span style={{ fontSize: '14px', color: '#555' }}>{post.commentCount || 0}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </Slider>
                </div>
            </>
        );
    };

    const commonStyle = {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#aaa',
        transition: 'all 0.2s ease',
        flex: 1,
    };

    const activeStyle = {
        color: '#fff',
        backgroundColor: '#269962',
    };

    const leftRounded = {
        borderRadius: '10px 0 0 10px',
    };

    const rightRounded = {
        borderRadius: '0 10px 10px 0',
    };

    return (
        <div style={{ marginBottom: '5%' }}>
            {/* Tabs */}
            <div
                style={{
                    display: 'flex',
                    backgroundColor: '#dfdfdf',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    width: '90%',
                    margin: '20px auto'
                }}
            >
                <button
                    onClick={() => setActiveTab('written')}
                    style={{
                        ...commonStyle,
                        ...(activeTab === 'written' ? activeStyle : {}),
                        ...(activeTab === 'written' ? leftRounded : {}),
                        borderRight: '1px solid white'
                    }}
                >
                    내가 쓴 글
                </button>
                <button
                    onClick={() => setActiveTab('commented')}
                    style={{
                        ...commonStyle,
                        ...(activeTab === 'commented' ? activeStyle : {}),
                        ...(activeTab === 'commented' ? rightRounded : {}),
                        borderLeft: '1px solid white'
                    }}
                >
                    댓글 단 글
                </button>
            </div>

            {/* Posts - 탭 선택 시에만 표시 */}
            {activeTab && (
                <div
                    style={{
                        backgroundColor: '#F6F6F6',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '90%',
                        margin: '0 auto',
                        minHeight: '150px',
                        boxSizing: 'border-box',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.25)',
                        position: 'relative',
                        paddingBottom: '50px'
                    }}
                >
                    {activeTab === 'written'
                        ? renderPosts(writtenPosts)
                        : renderPosts(commentedPosts)}
                </div>
            )}
        </div>
    );
}

export default TabButtons;