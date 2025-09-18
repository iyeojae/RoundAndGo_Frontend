// MyPageAPI.js
import axios from 'axios';
import { getAuthToken } from '../utils/cookieUtils';

const BASE_URL = 'https://api.roundandgo.com/api';

// axios 기본 설정 - 쿠키 포함
axios.defaults.withCredentials = true;

// GET 사용자 정보
export const getUserInfo = async () => {
    const token = getAuthToken();
    const res = await axios.get(`${BASE_URL}/auth/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.data;// { id, email, nickname, loginType, role }
};

export const getProfileImage = async () => {
    const token = getAuthToken();
    const res = await axios.get(`${BASE_URL}/profile/image`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
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

    const token = getAuthToken();
    const res = await axios.post(`${BASE_URL}/profile/image/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    });
    return res.data.result; // { url }
};

export const deleteProfileImage = async () => {
    const token = getAuthToken();
    const res = await axios.delete(`${BASE_URL}/profile/image`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
};
