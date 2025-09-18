import axios from 'axios';
import { getAuthToken } from '../../utils/cookieUtils';


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

// GET 인기글 정보
export const fetchPopularPosts = async () => {
    try {
        const response = await axios.get('https://api.roundandgo.com/api/posts/popular');
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
        const response = await axios.get(`https://api.roundandgo.com/api/posts/category?category=${label}`);
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
        const response = await axios.get('https://api.roundandgo.com/api/posts');
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
        const response = await axios.get(`https://api.roundandgo.com/api/posts/${postId}`);  // 게시글 단건 상세
        return response.data;
    } catch (error) {
        console.error('게시글 상세 정보 가져오기 실패:', error);
        throw new Error('게시글 상세 정보를 가져오는데 실패했습니다.');
    }
};

// POST 게시글 작성
export const PostingBoard = async (title, content, category, images) => {
    try {
        const formData = new FormData();
        // 이미지가 있을 때 개별적으로 추가
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image); // f iles
            });
        }
        // 텍스트 묶음
        const textData = {
            title: title,
            content: content,
            category: category,
        };
        formData.append('post', JSON.stringify(textData)); // post라는 이름의 data로 하나로 보내
        const token = getAuthToken();
        const response = await axios.post(
            'https://api.roundandgo.com/api/posts',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data.data;
    } catch (error) {
        console.error('게시글 작성 실패:', error);
        console.error('서버 응답:', error.response?.data.data);
        throw new Error('게시글 작성에 실패했습니다.');
    }
};

// DELETE 게시글 삭제 API
export const deletePost = async (postId) => {
    try {
        const token = getAuthToken();
        const response = await axios.delete(
            `https://api.roundandgo.com/api/posts/${postId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('게시글 삭제 실패:', error);
        // 에러를 던져 상위 컴포넌트에서 catch하도록 함
        throw error;
    }
};

// PUT 게시글 수정 (이미지 포함)
export const updatePostWithImages = async (postId, title, content, category, images) => {
    try {
        const formData = new FormData();

        // 이미지가 있을 때 개별적으로 추가
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image); // f iles
            });
        }

        // 텍스트 데이터 추가
        const textData = {
            title: title,
            content: content,
            category: category,
        };

        formData.append("post", JSON.stringify(textData)); // "post"라는 이름으로 묶어서 보냄

        const response = await axios.put(
            `https://api.roundandgo.com/api/posts/${postId}`,
            formData
        );

        return response.data;  // 수정된 데이터 반환
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
        const response = await axios.get(`https://api.roundandgo.com/api/posts/likeCount/${postId}`);
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
    try {
        const token = getAuthToken();
        const response = await axios.post(
            `https://api.roundandgo.com/api/posts/${postId}/like`,
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
        const response = await axios.get(`https://api.roundandgo.com/api/comments/post/${communityId}`);
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
    try {
        const token = getAuthToken();
        const response = await axios.post(
            'https://api.roundandgo.com/api/comments', // 댓글 작성 API 경로
            {
                content,           // 댓글 내용
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
        throw new Error('댓글 작성에 실패했습니다.');
    }
};

// PUT 댓글 수정 API
export const updateComment = async (commentId, content, communityId, parentCommentId = null) => {
    try {
        const response = await axios.put(
            `https://api.roundandgo.com/api/comments/${commentId}`,
            {
                content,
                communityId,
                parentCommentId, // 대댓글이면 부모 ID, 아니면 null
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
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
    try {
        const token = getAuthToken();
        const response = await axios.delete(
            `https://api.roundandgo.com/api/comments/${commentId}`,
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
