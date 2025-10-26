// AccommodationAPI.js

import {API_BASE_URL} from "../../config/api";

// 제목, 숙소소개, 주소
const serviceKey = process.env.REACT_APP_API_SERVICE_KEY;
export const getAccommodationDetail = async (contentId) => {
    const url = `${API_BASE_URL}/accommodation/detail/${contentId}`;
    // https://apis.data.go.kr/B551011/KorService2/detailCommon2?ServiceKey=${serviceKey}&contentId=${contentId}&MobileOS=ETC&MobileApp=AppTest&_type=json
    try {
        const response = await fetch(url);
        const json = await response.json();

        return {
            title: json.title || "",
            overview: json.overview || "",
            addr1: json.addr1 || "",
            firstimage: json.firstimage || "",
        };
    } catch (error) {
        console.error("숙소 상세 정보 조회 실패:", error);
        throw new Error("숙소 상세 정보를 불러오는 데 실패했습니다.");
    }
};

// 숙소 추가 이미지
export const getAccommodationImages = async (contentId) => {
    const url = `${API_BASE_URL}/accommodation/images/${contentId}`;
    // https://apis.data.go.kr/B551011/KorService2/detailImage2?ServiceKey=${serviceKey}&contentId=${contentId}&MobileOS=ETC&MobileApp=AppTest&imageYN=Y&numOfRows=10&_type=json

    try {
        const response = await fetch(url);
        const json = await response.json();

        const items = Array.isArray(json) ? json : (json.response?.body?.items?.item || []);

        return items.map((item) => ({
            originimgurl: item.originimgurl || "",
            smallimageurl: item.smallimageurl || "",
        }));
    } catch (error) {
        console.error("숙소 이미지 조회 실패:", error);
        throw new Error("숙소 이미지를 불러오는 데 실패했습니다.");
    }
};

// 숙소 부대시설 및 서비스 정보 조회
export const getAccommodationInfo = async (contentId) => {
    const contentTypeId = 32;
    const url = `${API_BASE_URL}/accommodation/info/${contentId}`;
    // https://apis.data.go.kr/B551011/KorService2/detailInfo2?ServiceKey=${serviceKey}&contentTypeId=${contentTypeId}&contentId=${contentId}&MobileOS=ETC&MobileApp=AppTest&_type=json

    try {
        const response = await fetch(url);
        const json = await response.json();

        const items = Array.isArray(json)
            ? json
            : (json.response?.body?.items?.item || []);


        return items.map((item) => ({
            roomtitle: item.roomtitle || "",
            subfacility: item.subfacility || "",
            roomtype: item.roomtype || "",
            refundregulation: item.refundregulation || "",
            facilities: {
                tv: item.facilities?.tv ?? (item.roomtv === 'Y'),
                pc: item.facilities?.pc ?? (item.roompc === 'Y'),
                internet: item.facilities?.internet ?? (item.roominternet === 'Y'),
                refrigerator: item.facilities?.refrigerator ?? (item.roomrefrigerator === 'Y'),
                sofa: item.facilities?.sofa ?? (item.roomsofa === 'Y'),
                table: item.facilities?.table ?? (item.roomtable === 'Y'),
                hairdryer: item.facilities?.hairdryer ?? (item.roomhairdryer === 'Y'),
                bath: item.facilities?.bath ?? (item.roombath === 'Y'),
                bathfacility: item.facilities?.bathfacility ?? (item.roombathfacility === 'Y'),
                aircondition: item.facilities?.aircondition ?? (item.roomaircondition === 'Y'),
            }
        }));
    } catch (error) {
        console.error("숙소 부대시설 정보 조회 실패:", error);
        throw new Error("숙소 부대시설 정보를 불러오는 데 실패했습니다.");
    }
};
