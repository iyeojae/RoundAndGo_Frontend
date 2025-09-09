// category.js
export const getAccommodationCategory = (accommodation) => {
    const cat3Code = String(accommodation.cat3 || '');
    const CATEGORIES_MAP = {
        'B02010300': '프리미엄',
        'B02010100': '프리미엄',
        'B02010900': '가성비',
        'B02010600': '가성비',
        'B02010000': '가성비',
        'B02010200': '가성비',
        'B02010700': '감성',
        'B02011100': '감성',
        'B02011600': '감성',
        'B02010500': '감성',
    };
    return CATEGORIES_MAP[cat3Code] || '기타';
};

export const getAccommodationTags = (acc) => {
    const tags = [];
    const title = (acc.title || '').toLowerCase();
    const cat3 = String(acc.cat3 || '');

    const PREMIUM_CODES = ['B02010300', 'B02010100'];
    const VALUE_CODES = ['B02010900', 'B02010600', 'B02010000', 'B02010200'];
    const EMOTIONAL_CODES = ['B02010700', 'B02011100', 'B0201100', 'B02010500'];

    if (PREMIUM_CODES.includes(cat3)) tags.push('#프리미엄');
    else if (VALUE_CODES.includes(cat3)) tags.push('#가성비');
    else if (EMOTIONAL_CODES.includes(cat3)) tags.push('#감성');

    if (title.includes('오션') || title.includes('씨')) {
        tags.push('#오션뷰', '#뷰맛집');
    }

    if (title.includes('포레스트')) {
        tags.push('#마운틴뷰', '#자연');
    }

    if (title.includes('스테이')) {
        tags.push('#편안한');
    }

    const luxuryKeywords = ['그랜드', '하얏트', '롯데', '메종', '신화'];
    if (luxuryKeywords.some(keyword => title.includes(keyword))) {
        tags.push('#5성급');
    }

    return tags;
};
