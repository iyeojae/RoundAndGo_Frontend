import { API_ENDPOINTS } from "../../config/api";

const TOUR_INFOS_RESTAURANTS = API_ENDPOINTS;

export const fetchTourData = async (type, golfCourseId = null) => {
    if (golfCourseId && !isNaN(Number(golfCourseId))) {
        // 골프장 기반 요청
        const url = `${TOUR_INFOS_RESTAURANTS}/tour-infos/by-golf-course/${type}?golfCourseId=${golfCourseId}`;
        console.log("fetchTourData 호출됨", { type, golfCourseId });
        try {
            const res = await fetch(url);
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error(`${type} 데이터 로드 실패 (골프장 기반):`, err);
            return [];
        }
    } else {
        // 도시 기반 요청 - 제주시 + 서귀포시
        const cities = ['제주시', '서귀포시'];
        console.log("fetchTourData 호출됨", { type, golfCourseId });
        try {
            const results = await Promise.all(
                cities.map(city =>
                    fetch(`${TOUR_INFOS_RESTAURANTS}/tour-infos/${type}?province=제주특별자치도&city=${city}`)
                        .then(res => res.ok ? res.json() : [])
                )
            );
            return results.flat();
        } catch (err) {
            console.error(`${type} 데이터 로드 실패 (지역 기반):`, err);
            return [];
        }
    }
};
