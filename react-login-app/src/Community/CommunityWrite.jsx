import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../Layout/Header";
import DivContent from "../Common/Community/DivContent";

const TAB_LABELS = [
    { key: 'LATEST', label: '최신글' },
    { key: 'QUESTION', label: '질문글' },
    { key: 'INFO', label: '정보글' },
    { key: 'REVIEW', label: '후기글' },
    { key: 'FREE_TALK', label: '자유글' },
];

function CommunityWrite() {
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('LATEST');

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await axios.get('https://roundandgo.onrender.com/api/communities');
                setPosts(res.data.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPosts();
    }, []);

    // 탭에 따른 필터링 (예시: LATEST는 전체 다 보여주기)
    const filteredPosts = activeTab === 'LATEST'
        ? posts
        : posts.filter(post => post.category === activeTab);

    return (
        <div>
            <Header/>
            <DivContent/>
            <div style={{marginTop: '10%'}}>
                <span style={{
                    position: 'absolute',
                    minWidth: '375px',
                    maxWidth: '440px',
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#dfdfdf',
                }}></span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderBottom: '1px solid #ddd'}}>
                {TAB_LABELS.map(tab => (
                    <div
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            borderBottom: activeTab === tab.key ? '3px solid green' : 'none',
                            fontWeight: '400',
                            fontSize: '14px',
                            color: activeTab === tab.key ? 'green' : '#aaa',
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            <ul style={{listStyle: 'none'}}>
                {filteredPosts.length === 0 && <li>게시글이 없습니다.</li>}
                {filteredPosts.map(post => (
                    <>
                        <li key={post.id}>
                            <p style={{
                                fontSize: '9px',
                                border: '0.8px solid #269962',
                                fontWeight: '400',
                                color: '#269962',
                                width: 'fit-content',
                                padding: '0.25% 1%'
                            }}>{post.label}</p>
                            <strong>{post.title}</strong> - {post.category}
                        </li>
                    </>
                ))}
            </ul>
        </div>
    );
}

export default CommunityWrite;
