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
    return { nickname, url, profileColor };
};

export const uploadProfileImage = async (file, nickname, colorLabel) => {
    const formData = new FormData();

    formData.append('nickname', nickname || '');

    formData.append('profileColor', colorLabel || '');

    if (file) {
        formData.append('file', file);
    }

    const token = getCookie('accessToken');

    const res = await axios.post(
        `${API_BASE_URL}/profile/image`,
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
        }
    );

    return res.data.result;
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
