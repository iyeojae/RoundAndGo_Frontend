// category.js
export const getRestaurantCategory = (cat3) => {
    const CATEGORY_MAP = {
        'A05020100': '한식',
        'A05020200': '양식',
        'A05020300': '일식',
        'A05020400': '중식',
        'A05020700': '이색 음식점',
        'A05020900': '카페',
        'A05021000': '클럽',
    };

    return CATEGORY_MAP[cat3] || '기타';
};
