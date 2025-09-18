import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../Layout/Header";
import { fetchPostDetail, updatePostWithImages } from "../Common/Community/CommunityAPI";
import { checkAuth } from "../Search/IsContainToken";
import { getAuthToken } from '../utils/cookieUtils';
import CategorySelector from './CategorySelector';
import ImageUploader from './ImageUploader';
import InputField from './InputField';
import './CommunityWrite.css';

function CommunityEdit() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { accessToken } = checkAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [keepImageIds, setKeepImageIds] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchPostDetail(postId);
                const data = res.data;
                setTitle(data.title);
                setContent(data.content);
                setSelectedCategory(data.category);
                setExistingImages(data.images || []);
                setKeepImageIds(data.images?.map(img => img.id) || []);
            } catch (err) {
                alert("게시글 로드 실패");
                navigate('/community');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [postId, navigate]);

    const triggerShake = (ref) => {
        if (!ref.current) return;
        ref.current.classList.remove('shake');
        void ref.current.offsetWidth;
        ref.current.classList.add('shake');
        setTimeout(() => ref.current.classList.remove('shake'), 500);
    };

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

    const handleSubmit = async () => {
        if (!validate()) return;

        const authToken = getAuthToken();

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return navigate('/email-login');
        }

        try {
            await updatePostWithImages(accessToken, postId, title, content, selectedCategory, keepImageIds, images, authToken);
            alert("게시글이 수정되었습니다.");
            navigate(`/community/detail/${postId}`);
        } catch (err) {
            console.error(err);
            alert("수정 실패. 다시 시도해주세요.");
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <main>
            <Header versionClassName='ArrowVer' showLogo={false} showArrow={true} TitleText='글 수정' />
            <div className="form-wrap">
                <InputField label="제목" value={title} setValue={setTitle} ref={titleRef} error={errors.title} />
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
                    keepImageIds={keepImageIds}
                    setKeepImageIds={setKeepImageIds}
                    images={images}
                    setImages={setImages}
                    previewUrls={previewUrls}
                    setPreviewUrls={setPreviewUrls}
                />
                <div className='btn-wrap'>
                    <button onClick={handleSubmit} className='SubmitBtn'>수정 완료</button>
                </div>
            </div>
        </main>
    );
}

export default CommunityEdit;