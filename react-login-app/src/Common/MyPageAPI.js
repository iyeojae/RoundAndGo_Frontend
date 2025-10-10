// MyPageAPI.js
import axios from 'axios';
import { getCookie } from '../Login/utils/cookieUtils';
import {API_BASE_URL} from "../config/api";


// axios 기본 설정 - 쿠키 포함
axios.defaults.withCredentials = true;

// GET 사용자 정보
export const getUserInfo = async () => {
    const token = getCookie('accessToken');
    const res = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data.data;// { id, email, nickname, loginType, role }
};

export const getProfileImage = async () => {
    const token = getCookie('accessToken');
    const res = await axios.get(`${API_BASE_URL}/profile/image`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log('API 응답:', res.data);
    const { nickname, url, profileColor } = res.data.data;
    console.log(nickname, url, profileColor);
    return { nickname, url, profileColor };
};

export const uploadProfileImage = async (file, nickname, colorLabel) => {
    const formData = new FormData();

    // 이미지 파일이 있는 경우에만 첨부
    if (file) {
        formData.append('file', file);
    }

    formData.append('nickname', nickname);

    if (colorLabel) {
        formData.append('profileColor', colorLabel);
    }

    const token = getCookie('accessToken');

    const res = await axios.post(
        `${API_BASE_URL}/profile/image`,
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return res.data.result; // { url }
};

export const deleteProfileImage = async () => {
    const token = getCookie('accessToken');
    const res = await axios.delete(`${API_BASE_URL}/profile/image`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
};
