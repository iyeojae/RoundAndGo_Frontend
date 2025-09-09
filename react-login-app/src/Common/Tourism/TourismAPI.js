export const fetchTourismData = async () => {
    try {
        const response = await fetch(
            `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?numOfRows=100&MobileOS=WEB&MobileApp=ROUND%26GO&arrange=O&contentTypeId=12&areaCode=39&serviceKey=2g4UkG4HCnw63pTfOXD%2FLX%2Fy3BRi%2BzsW3B57RCDkJ2q5sDYi6rSb8OFqZYnJ9nGTpzVy4fyCRIFF79zqQBEhuA%3D%3D&_type=json`
        );
        const data = await response.json();

        const items = data.response.body.items.item || [];
        return items.map(item => ({
            title: item.title,
            imageUrl: item.firstimage,
            category: item.cat1,
            address: item.addr2 ? `${item.addr1} ${item.addr2}` : item.addr1
        }));
    } catch (error) {
        console.error('관광지 정보를 불러오는 데 실패했습니다:', error);
        throw new Error('관광지 정보를 불러오는 데 실패했습니다.');
    }
};
