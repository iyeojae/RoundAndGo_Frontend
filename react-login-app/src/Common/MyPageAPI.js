// MyPageAPI.js
import axios from 'axios';

const BASE_URL = 'https://roundandgo.shop/api';

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
    return res.data.data; // { url }
};

export const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(`${BASE_URL}/profile/image`, formData, {
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
