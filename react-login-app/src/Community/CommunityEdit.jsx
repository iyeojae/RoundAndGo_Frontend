import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../LayoutNBanner/Header";
import { fetchPostDetail, updatePostWithImages } from "../Common/Community/CommunityAPI";
import { getCookie } from '../Login/utils/cookieUtils';
import CategorySelector from './CategorySelector';
import ImageUploader from './ImageUploader';
import InputField from './InputField';
import { TAB_LABELS } from "../Common/Community/Community_TAB_LABELS";
import './CommunityWrite.css';
import Toast from '../Common/Community/Toast';

function CommunityEdit() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState('');

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    // 기존 게시글 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchPostDetail(postId);
                const data = res.data;

                setTitle(data.title);
                setContent(data.content);
                setSelectedCategory(data.category);
                setExistingImages(data.images || []);
            } catch (err) {
                alert("게시글 로드 실패");
                navigate('/community');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [postId, navigate]);

    // 필드 흔들기 효과
    const triggerShake = (ref) => {
        if (!ref.current) return;
        ref.current.classList.remove('shake');
        void ref.current.offsetWidth;
        ref.current.classList.add('shake');
        setTimeout(() => ref.current.classList.remove('shake'), 500);
    };

    // 입력값 검증
    const validate = () => {
        const errs = {
            title: title.trim() === '',
            content: content.trim() === '',
            category: selectedCategory === ''
        };
        if (errs.title) triggerShake(titleRef);
        if (errs.content) triggerShake(contentRef);
        setErrors(errs);
        return !Object.values(errs).includes(true);
    };

    // 게시글 수정 제출
    const handleSubmit = async () => {
        if (!validate()) return;

        const token = getCookie('accessToken');
        if (!token) {
            setToastMessage("로그인이 필요합니다.");
            setTimeout(() => navigate('/email-login'), 1000);
            return;
        }

        const selectedCategoryLabel = TAB_LABELS.find(tab => tab.key === selectedCategory)?.label;
        if (!selectedCategoryLabel) {
            setToastMessage("유효하지 않은 카테고리입니다.");
            setTimeout(() => navigate(`/community/detail/${postId}`), 1000);
            return;
        }

        try {
            await updatePostWithImages(
                postId,
                title,
                content,
                selectedCategoryLabel,
                images
            );

            setToastMessage("게시글이 수정되었습니다.");
            setTimeout(() => navigate(`/community/detail/${postId}`), 1000);
        } catch (err) {
            console.error('수정 실패:', err);
            setToastMessage("수정 실패. 다시 시도해 주세요.");
            setTimeout(() => navigate(`/community/detail/${postId}`), 1000);
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div style={{ backgroundColor: '#f8f8f8', minHeight: '100%' }}>
            <Header versionClassName='ArrowVer' showLogo={false} showArrow={true} TitleText='글 수정' />
            <div className="form-wrap">
                <InputField
                    label="제목"
                    value={title}
                    setValue={setTitle}
                    ref={titleRef}
                    error={errors.title}
                />
                <CategorySelector
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    error={errors.category}
                />
                <InputField
                    label="내용"
                    type="textarea"
                    value={content}
                    setValue={setContent}
                    ref={contentRef}
                    error={errors.content}
                />
                <ImageUploader
                    existingImages={existingImages}
                    setExistingImages={setExistingImages}
                    images={images}
                    setImages={setImages}
                    previewUrls={previewUrls}
                    setPreviewUrls={setPreviewUrls}
                />

                {toastMessage && (
                    <Toast
                        style={{width: '75%'}}
                        message={toastMessage}
                        duration={1000}
                        onClose={() => setToastMessage('')}
                    />
                )}

                <div className='btn-wrap'>
                    <button onClick={handleSubmit} className='SubmitBtn'>수정 완료</button>
                </div>
            </div>
        </div>
    );
}

export default CommunityEdit;
