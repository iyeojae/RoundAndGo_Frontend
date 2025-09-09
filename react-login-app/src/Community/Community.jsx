import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Layout/Header.jsx';
import DivContent from '../Common/Community/DivContent.jsx';

import ActiveHeart from './ActiveHeartIcon.svg';
import Heart from './HeartIcon.svg';
import Watch from './WatchIcon.svg';
import BlackArrow from './BlackArrow.svg';
import Comment from './CommentIcon.svg';

const CATEGORY_MAP = {
    QUESTION: '질문글',
    REVIEW: '후기글',
    FREE_TALK: '자유글',
    // 최신글 / 정보글 / 인기글
};

function CommunityBoard() {
    const navigate = useNavigate();
    const goTo = (path) => {
        navigate(path); // 경로 설정된 곳으로 이동
    };

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('https://roundandgo.shop/api/communities');
                setPosts(res.data.data);
            } catch (error) {
                console.error('게시글 불러오기 실패:', error);
            }
        };

        fetchPosts();
    }, []);

    const categorizedPosts = Object.entries(CATEGORY_MAP).map(([key, label]) => {
        const filtered = posts.filter(
            p => p.category?.toUpperCase() === key // 대소문자 문제 해결
        ).slice(0, 3); // 최대 3개까지만 가져오기

        return { label, key, items: filtered };
    });

    return (
        <div className="community">
            <Header/>
            <DivContent/>

            {/* 인기글 들어갈 자리 . . . */}

            <div>
                <span style={{
                    position: 'absolute',
                    minWidth: '375px',
                    maxWidth: '440px',
                    width: '100%',
                    margin: '0 auto',
                    height: '6px',
                    backgroundColor: '#dfdfdf',
                }}></span>
            </div>

            <div className="CommunityContainer">
                {categorizedPosts.map(({key, label, items}) => (
                    <div key={key} className="community-section">
                        <div className="section-header" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '3px',
                            width: '90%',
                            margin: '0 auto'
                        }}>
                            <h4 style={{fontSize: '14px', fontWeight: '500'}}>{label}</h4>
                            <img onClick={() => goTo('/community/entire')} src={BlackArrow} alt='더보기' style={{width: '6px', height: '10px'}}/>
                        </div>
                        <ul className="post-list"
                            style={{width: '90%', margin: '0 auto', listStyle: 'none', padding: '0'}}>
                            {items.length === 0 && <li className="no-post">게시글이 없습니다</li>}
                            {items.map((post) => (
                                <li key={post.id} className="post-item" style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div className="post-title"
                                         style={{
                                             fontSize: '12px',
                                             fontWeight: '400',
                                             margin: '1px 0'
                                         }}>{post.title}</div>
                                    {/*<div className="post-content">{post.content}</div>*/}
                                    <div className="comment-count"
                                         style={{display: 'flex', flexDirection: 'row', gap: '5px', margin: '1px 0'}}>
                                        <img src={Comment} alt='댓글 아이콘' style={{
                                            width: '15px',
                                            height: '15px',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: '1px 0'
                                        }}/>
                                        <p style={{
                                            margin: '1px 0',
                                            fontSize: '12px',
                                            color: '#797979',
                                            fontWeight: '400'
                                        }}>0</p> {/* TODO : 카운트해서 숫자 변경되게 바꾸기 */}
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
                ))}

                {/* TODO : 버튼 위치 고정하기 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <button className="write-button" style={{
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '3px',
                        padding: '0.3% 6%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 'none',
                        backgroundColor: '#269962',
                        borderRadius: '38px',
                        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.7)',
                    }}>
                        <span style={{fontSize: '32px', margin: '0', padding: '0'}}>+</span>
                        <p style={{fontSize: '14px', margin: '0', padding: '0'}}>새 글 쓰기</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommunityBoard;
