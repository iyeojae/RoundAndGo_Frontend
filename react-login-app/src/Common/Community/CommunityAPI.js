import axios from 'axios';
import {API_BASE_URL} from "../../config/api";
import { getCookie } from '../../Login/utils/cookieUtils';

// axios 기본 설정 - 쿠키 포함
axios.defaults.withCredentials = true;

// // GET 사용자 정보
// export const getUserInfo = async () => {
//     const res = await axios.get(`${BASE_URL}/auth/user`, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//         },
//     });
//     return res.data.data;// { id, email, nickname, loginType, role }
// };

// GET 게시글 검색
export const searchPosts = async (keyword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/search?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('검색 실패');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('게시글 검색 에러:', error);
        return [];
    }
};



// GET 인기글 정보
export const fetchPopularPosts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts/popular`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error("데이터를 불러오는데 실패했습니다.");
        }
    } catch (err) {
        throw new Error(err.message || "인기글을 불러오는데 실패했습니다.");
    }
};

// GET 카테고리별 글 목록
export const fetchCategories = async (label) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts/category?category=${label}`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error("데이터를 불러오는데 실패했습니다.");
        }
    } catch (err) {
        throw new Error(err.message || "카테고리별 게시글 데이터를 불러오는데 실패했습니다.");
    }
};

// GET 최신글
export const fetchPostsLatest = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error("최신글 불러오는데 실패했습니다.");
        }
    } catch (err) {
        throw new Error(err.message || "최신글 데이터를 불러오는데 실패했습니다.");
    }
};

// GET 게시글 상세 정보
export const fetchPostDetail = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);  // 게시글 단건 상세
        return response.data;
    } catch (error) {
        console.error('게시글 상세 정보 가져오기 실패:', error);
        throw new Error('게시글 상세 정보를 가져오는데 실패했습니다.');
    }
};

// POST 게시글 작성
export const PostingBoard = async (title, content, category, images) => {
    const token = getCookie('accessToken');
    const formData = new FormData();
    try {
        console.log('이미지 확인:', images);
        if (images) {
            const imageList = Array.isArray(images) ? images : [images];
            imageList.forEach((image) => {
                formData.append('images', image);
            });
        }

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }
        const textData = {
            title,
            content,
            category,
        };
        formData.append('post', JSON.stringify(textData));

        const response = await axios.post(
            `${API_BASE_URL}/posts`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,  // 쿠키에서 읽은 토큰 사용
                },
                withCredentials: true, // 쿠키가 있다면 자동으로 전송
            }
        );

        return response.data;
    } catch (error) {
        console.error('게시글 작성 실패:', error);
        console.error('서버 응답:', error.response?.data?.data);
        throw new Error('게시글 작성에 실패했습니다.');
    }
};

// DELETE 게시글 삭제 API
export const deletePost = async (postId) => {
    const token = getCookie('accessToken');
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/posts/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error('게시글 삭제 실패:', error);
        throw error;
    }
};

// PUT 게시글 수정 (이미지 포함)
export const updatePostWithImages = async (postId, title, content, category, images) => {
    const token = getCookie('accessToken');
    const formData = new FormData();
    try {
        if (images) {
            // images가 배열인지 확인 후, 배열이 아니면 배열로 변환
            const imageList = Array.isArray(images) ? images : [images];
            imageList.forEach((image) => {
                formData.append('images', image);  // 이미지 각각을 formData에 append
            });
        }

        const textData = { title, content, category };
        formData.append('post', JSON.stringify(textData));

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        const response = await axios.put(
            `${API_BASE_URL}/posts/${postId}`,  // 게시글 수정 API 엔드포인트
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // 토큰 인증 헤더
                },
                withCredentials: true,  // 쿠키가 있다면 자동으로 전송
            }
        );

        return response.data;  // 서버 응답 데이터 반환
    } catch (error) {
        console.error('게시글 수정 실패:', error);
        console.error('서버 응답:', error.response?.data);
        throw new Error('게시글 수정에 실패했습니다.');
    }
};


// ----------------------------------------------------------------------

// GET 좋아요 수
export const fetchLikeCount = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/posts/likeCount/${postId}`);
        // 응답이 성공적일 경우
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("좋아요 수를 불러오는데 실패했습니다.");
        }
    } catch (err) {
        console.error('좋아요 수 가져오기 실패:', err);
        throw new Error(err.message || "좋아요 수를 불러오는데 실패했습니다.");
    }
};

// POST 좋아요 버튼
export const toggleLike = async (postId) => {
    const token = getCookie('accessToken');
    try {
        const response = await axios.post(
            `${API_BASE_URL}/posts/${postId}/like`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        // 응답이 성공적일 경우
        return response.data;
    } catch (error) {
        console.error('좋아요 토글 실패:', error);
        throw new Error('좋아요 처리에 실패했습니다.');
    }
};

// ----------------------------------------------------------------------

// GET 댓글 목록을 가져오는 함수
export const fetchComments = async (communityId) => {
    if (!communityId) {
        console.error("댓글 목록을 가져오는데 필요한 게시글 ID가 없습니다.");
        throw new Error("게시글 ID가 필요합니다.");
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/comments/post/${communityId}`);
        // 응답이 성공적일 경우
        if (response.status === 200) {
            const comments = Array.isArray(response.data.data) ? response.data.data : []; // data
            const totalCount = comments.length; // total comments, each of postId

            return { comments, totalCount }// 댓글 목록  | 댓글 수 반환
        } else {
            throw new Error("댓글 목록을 불러오는데 실패했습니다.");
        }
    } catch (error) {
        console.error('댓글 목록 가져오기 실패:', error);
        throw new Error('댓글 목록을 가져오는데 실패했습니다.');
    }
};

// POST 댓글 작성 api
export const postComment = async (communityId, content, parentCommentId = null)  => {
    const token = getCookie('accessToken');
    try {
        const response = await axios.post(
            `${API_BASE_URL}/comments`, // 댓글 작성 API 경로
            {
                content: content,           // 댓글 내용
                communityId: communityId, // 게시글 ID
                parentCommentId: parentCommentId, // 부모 댓글 ID (없으면 null, 답글일 경우 부모 댓글 ID)
            },
            {
                headers: {
                    'Content-Type': 'application/json',  // JSON 형식
                    'Authorization': `Bearer ${token}`
                },
            }
        );

        // if 성공
        return response.data;
    } catch (error) {
        console.error('댓글 작성 실패:', error);
        console.error('서버 응답:', error.response?.data);
        throw new Error('댓글 작성에 실패했습니다.');
    }
};

// PUT 댓글 수정 API
export const updateComment = async (commentId, content, communityId, parentCommentId = null) => {
    const token = getCookie('accessToken');
    try {
        const response = await axios.put(
            `${API_BASE_URL}/comments/${commentId}`,
            {
                content,
                communityId,
                parentCommentId, // 대댓글이면 부모 ID, 아니면 null
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('댓글 수정 실패:', error);
        throw new Error('댓글 수정에 실패했습니다.');
    }
};

// DELETE 댓글 삭제 API
export const deleteComment = async (commentId) => {
    const token = getCookie('accessToken');
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/comments/${commentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('댓글 삭제 실패:', error);
        throw new Error('댓글 삭제에 실패했습니다.');
    }
};
