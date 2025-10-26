import React, { useRef } from 'react';
import Camera from '../assets/camera.svg';

const ImageUploader = ({
                           existingImages,
                           setExistingImages,
                           keepImageIds,
                           setKeepImageIds,
                           images,
                           setImages,
                           previewUrls,
                           setPreviewUrls
                       }) => {
    const containerRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images];
        const newPreviews = [...previewUrls];


        files.forEach(file => {
            newImages.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        setImages(newImages);
        setPreviewUrls(newPreviews);

        e.target.value = null;

        setTimeout(() => {
            containerRef.current?.scrollTo({
                left: containerRef.current.scrollWidth,
                behavior: 'smooth',
            });
        }, 50);
    };

    const handleExistingRemove = (id) => {
        setKeepImageIds(keepImageIds.filter(imgId => imgId !== id));
        setExistingImages(existingImages.filter(img => img.id !== id));
    };

    const handleNewRemove = (index) => {
        const newImageFiles = images.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        setImages(newImageFiles);
        setPreviewUrls(newPreviews);
    };

    return (
        <div id='section-cont'>
            <label>사진</label>
            <div className="image-upload-container">
                {/* 카메라 아이콘 업로드 버튼 */}
                <label htmlFor="imageUpload" className="image-label">
                    <img src={Camera} alt="카메라" />
                </label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />

                <div ref={containerRef} className="image-preview-multiple">
                    {/* 기존 이미지 */}
                    {existingImages.map((img) => {
                        const imgUrl = img.url.replace(/^https:/, 'http:'); // HTTP 변환
                        return (
                            <div key={img.id} className="image-preview">
                                <button
                                    className="remove-image-btn"
                                    onClick={() => handleExistingRemove(img.id)}
                                >
                                    ×
                                </button>
                                <img src={imgUrl} alt={img.originalFilename} />
                            </div>
                        );
                    })}

                    {/* 새로 추가된 이미지 */}
                    {previewUrls.map((url, idx) => (
                        <div key={idx} className="image-preview">
                            <button
                                className="remove-image-btn"
                                onClick={() => handleNewRemove(idx)}
                            >
                                ×
                            </button>
                            <img src={url} alt={`미리보기-${idx}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
