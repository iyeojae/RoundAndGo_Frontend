// MyPageAPI.js
import axios from 'axios';

const BASE_URL = 'https://api.roundandgo.com/api';

// GET 사용자 정보
export const getUserInfo = async () => {
    const res = await axios.get(`${BASE_URL}/auth/user`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    return res.data.data;// { id, email, nickname, loginType, role }
};

export const getProfileImage = async () => {
    const res = await axios.get(`${BASE_URL}/profile/image`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    console.log('API 응답:', res.data);
    const { nickname, profileImageUrl } = res.data.data;
    console.log(nickname, profileImageUrl);
    return { nickname, profileImageUrl };
};

export const uploadProfileImage = async (file, nickname, imageUrl) => {
    const formData = new FormData();
    if (file) {
        formData.append('url', file);  // 새 이미지 파일이 있을 경우
    } else {
        formData.append('url', imageUrl); // 기존 이미지
    }
    formData.append('nickname', nickname);  // 닉네임은 항상 전송

    const res = await axios.post(`${BASE_URL}/profile/image/upload`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data.result; // { url }
};

export const deleteProfileImage = async () => {
    const res = await axios.delete(`${BASE_URL}/profile/image`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    return res.data;
};
