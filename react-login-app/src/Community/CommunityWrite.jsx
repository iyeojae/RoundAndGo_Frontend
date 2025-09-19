import React, { useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import Header from "../Layout/Header";
import { TAB_LABELS } from "../Common/Community/Community_TAB_LABELS";
import Camera from '../Image/Community/camera.svg';
import {PostingBoard} from "../Common/Community/CommunityAPI";

import { checkAuth } from "../Search/IsContainToken";

import './CommunityWrite.css';

function CommunityWrite() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        title: false,
        category: false,
        content: false,
    });

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    const triggerShake = (ref) => {
        if (ref.current) {
            ref.current.classList.remove('shake');
            void ref.current.offsetWidth;
            setTimeout(() => {
                ref.current.classList.remove('shake');
            }, 500);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images];
        const newPreviews = [...previewUrls];

        files.forEach((file) => {
            newImages.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        setImages(newImages);
        setPreviewUrls(newPreviews);
    };

    const handleImageRemove = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
        setPreviewUrls(previewUrls.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async () => {
        const newErrors = {
            title: title.trim() === '',
            category: selectedCategory === '',
            content: content.trim() === '',
        };
        setErrors(newErrors);

        if (newErrors.title) triggerShake(titleRef);
        if (newErrors.content) triggerShake(contentRef);

        if (newErrors.title || newErrors.category || newErrors.content) return;

        const selectedCategoryLabel = TAB_LABELS.find(tab => tab.key === selectedCategory)?.label;
        if (!selectedCategoryLabel) {
            console.error('선택한 카테고리가 유효하지 않습니다.');
            return;
        }

        const { accessToken } = checkAuth();
        console.log('Access Token:', accessToken);

        if (!accessToken) {
            console.error('토큰이 없습니다. 로그인 상태를 확인해주세요.');
            return;
        }

        try {
            const response = await PostingBoard(accessToken, title, content, selectedCategoryLabel, images);
            console.log('게시 성공:', response);

            const postId = response?.data?.id;

            if (postId) {
                navigate(`/community/detail/${postId}`);
            } else {
                console.warn('응답에 게시글 ID가 없습니다. 이동 실패');
            }

        } catch (error) {
            console.error('게시 실패:', error);
            alert('게시글 작성이 완료되지 않았습니다. 다시 시도해 주세요')
            navigate('/community');
        }
    };

    return (
        <main>
            <div>
                <Header versionClassName={'ArrowVer'} showLogo={false} showArrow={true} TitleText={'글쓰기'} />
                <div style={{ backgroundColor: '#F8F8F8', width: '100%' }}>
                    <div className="form-wrap" style={{height: '100vh'}}>
                        <div id='section-cont'>
                            <label>제목</label>
                            <input
                                ref={titleRef}
                                type="text"
                                value={title}
                                placeholder={'제목을 입력해주세요'}
                                onChange={(e) => setTitle(e.target.value)}
                                className={errors.title ? 'input-error shake' : ''}
                            />
                        </div>

                        <div id='section-cont'>
                            <label>카테고리</label>
                            <div className={`category-select ${errors.category ? 'error' : ''}`}>
                                {TAB_LABELS.filter(tab => tab.key !== 'LATEST').map((tab) => (
                                    <button
                                        key={tab.key}
                                        className={selectedCategory === tab.key ? 'active' : ''}
                                        onClick={() => setSelectedCategory(tab.key)}
                                        type="button"
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div id='section-cont'>
                            <label>내용</label>
                            <textarea
                                ref={contentRef}
                                value={content}
                                placeholder={'내용을 입력해주세요'}
                                onChange={(e) => setContent(e.target.value)}
                                className={errors.content ? 'input-error shake' : ''}
                            />
                        </div>

                        <div id='section-cont'>
                            <label>사진</label>
                            <div className="image-upload-container">
                                <label htmlFor="imageUpload" className="image-label">
                                    <img src={Camera} alt="카메라"/>
                                </label>
                                <div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        style={{display: 'none'}}
                                        onChange={handleImageChange}
                                    />
                                </div>

                                <div className="image-preview-multiple">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="image-preview">
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => handleImageRemove(index)}
                                            >
                                                ×
                                            </button>
                                            <img src={url} alt={`미리보기-${index}`}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='btn-wrap' style={{width: '90%', position: 'fixed', bottom: 0, margin: '3% 0'}}>
                            <button onClick={handleSubmit} className='SubmitBtn'>작성</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CommunityWrite;
