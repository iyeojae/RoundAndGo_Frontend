// AccommodationAPI.js
import { getAccommodationCategory } from './Category.js';

// export const fetchAccommodations = async () => {
//     try {
//         const apiUrl = `https://apis.data.go.kr/B551011/KorService2/searchStay2?numOfRows=50&_type=json&MobileOS=WEB&MobileApp=DDD&serviceKey=2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D&areaCode=39&cat1=B02&cat2=B0201&lDongRegnCd=50`;
//         const response = await fetch(apiUrl);
//         if (!response.ok) throw new Error(`API 호출 실패: ${response.statusText}`);
//
//         const responseData = await response.json();
//         let items = responseData?.response?.body?.items?.item || [];
//
//         const itemsWithCityAndCategory = items.map((acc) => {
//             const city = acc.addr1?.includes('서귀포시')
//                 ? '서귀포시'
//                 : acc.addr1?.includes('제주시')
//                     ? '제주시'
//                     : '기타';
//
//             return {
//                 ...acc,
//                 city,
//                 category: getAccommodationCategory(acc),
//             };
//         });
//
//         return itemsWithCityAndCategory;
//     } catch (err) {
//         throw new Error(`숙소 데이터를 불러오는 데 실패했습니다: ${err.message}`);
//     }
// };

// 제목, 숙소소개, 주소
export const getAccommodationDetail = async (contentId) => {
    const serviceKey = "2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D";
    const url = `https://apis.data.go.kr/B551011/KorService2/detailCommon2?ServiceKey=${serviceKey}&contentId=${contentId}&MobileOS=ETC&MobileApp=AppTest&_type=xml`;

    try {
        const response = await fetch(url);
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        const item = xml.getElementsByTagName("item")[0];

        if (!item) return null;

        return {
            title: item.getElementsByTagName("title")[0]?.textContent || "",
            overview: item.getElementsByTagName("overview")[0]?.textContent || "",
            addr1: item.getElementsByTagName("addr1")[0]?.textContent || "",
            firstimage: item.getElementsByTagName("firstimage")[0]?.textContent || "",
        };
    } catch (error) {
        console.error("숙소 상세 정보 조회 실패:", error);
        throw new Error("숙소 상세 정보를 불러오는 데 실패했습니다.");
    }
};

// 숙소 추가 이미지
export const getAccommodationImages = async (contentId) => {
    const serviceKey = "2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D";
    const url = `https://apis.data.go.kr/B551011/KorService2/detailImage2?ServiceKey=${serviceKey}&contentId=${contentId}&MobileOS=ETC&MobileApp=AppTest&imageYN=Y&numOfRows=10&_type=xml`;

    try {
        const response = await fetch(url);
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        const items = Array.from(xml.getElementsByTagName("item")).map((item) => ({
            originimgurl: item.getElementsByTagName("originimgurl")[0]?.textContent || "",
            smallimageurl: item.getElementsByTagName("smallimageurl")[0]?.textContent || "",
        }));

        return items;
    } catch (error) {
        console.error("숙소 이미지 조회 실패:", error);
        throw new Error("숙소 이미지를 불러오는 데 실패했습니다.");
    }
};

// 숙소 부대시설 및 서비스 정보 조회
export const getAccommodationInfo = async (contentId) => {
    const serviceKey = "2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D";
    const contentTypeId = 32;

    const url = `https://apis.data.go.kr/B551011/KorService2/detailInfo2?ServiceKey=${serviceKey}&contentTypeId=${contentTypeId}&contentId=${contentId}&MobileOS=ETC&MobileApp=AppTest&_type=xml`;

    try {
        const response = await fetch(url);
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        const items = Array.from(xml.getElementsByTagName("item")).map((item) => ({
            roomtitle: item.getElementsByTagName("roomtitle")[0]?.textContent || "",
            subfacility: item.getElementsByTagName("subfacility")[0]?.textContent || "",
            roomtype: item.getElementsByTagName("roomtype")[0]?.textContent || "",
            refundregulation: item.getElementsByTagName("refundregulation")[0]?.textContent || "",
            facilities: {
                tv: item.getElementsByTagName("roomtv")[0]?.textContent === 'Y',
                pc: item.getElementsByTagName("roompc")[0]?.textContent === 'Y',
                internet: item.getElementsByTagName("roominternet")[0]?.textContent === 'Y',
                refrigerator: item.getElementsByTagName("roomrefrigerator")[0]?.textContent === 'Y',
                sofa: item.getElementsByTagName("roomsofa")[0]?.textContent === 'Y',
                table: item.getElementsByTagName("roomtable")[0]?.textContent === 'Y',
                hairdryer: item.getElementsByTagName("roomhairdryer")[0]?.textContent === 'Y',
                bath: item.getElementsByTagName("roombath")[0]?.textContent === 'Y',
                bathfacility: item.getElementsByTagName("roombathfacility")[0]?.textContent === 'Y',
                aircondition: item.getElementsByTagName("roomaircondition")[0]?.textContent === 'Y',
            }
        }));

        return items;
    } catch (error) {
        console.error("숙소 부대시설 정보 조회 실패:", error);
        throw new Error("숙소 부대시설 정보를 불러오는 데 실패했습니다.");
    }
};



