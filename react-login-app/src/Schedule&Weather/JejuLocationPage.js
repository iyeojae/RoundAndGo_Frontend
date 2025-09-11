import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const JejuLocationPage = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const jejuLocations = [
    { id: 'ara', name: '제주시 아라동', displayName: '아라동', icon: '🏠' },
    { id: 'aewol', name: '제주시 애월읍', displayName: '애월읍', icon: '🌊' },
    { id: 'nohyeong', name: '제주시 노형동', displayName: '노형동', icon: '🏢' },
    { id: 'yongdam', name: '제주시 용담동', displayName: '용담동', icon: '🏘️' },
    { id: 'samdo', name: '제주시 삼도동', displayName: '삼도동', icon: '🏛️' },
    { id: 'ihop', name: '제주시 이호동', displayName: '이호동', icon: '🏖️' },
    { id: 'jocheon', name: '제주시 조천읍', displayName: '조천읍', icon: '🌅' },
    { id: 'gujwa', name: '제주시 구좌읍', displayName: '구좌읍', icon: '🌊' },
    { id: 'daejeong', name: '서귀포시 대정읍', displayName: '대정읍', icon: '🏝️' },
    { id: 'anduck', name: '서귀포시 안덕면', displayName: '안덕면', icon: '🏔️' },
    { id: 'seogwipo', name: '서귀포시 서귀동', displayName: '서귀동', icon: '🌋' },
    { id: 'jungmun', name: '서귀포시 중문동', displayName: '중문동', icon: '🏨' }
  ];

  // 검색어에 따른 필터링된 지역 목록
  const filteredLocations = jejuLocations.filter(location =>
    location.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지 진입 시 히스토리 상태 설정
  useEffect(() => {
    window.history.replaceState({ showWeather: true }, '');
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);

    // 선택 피드백을 위한 애니메이션
    const selectedCard = document.querySelector(`[data-location="${location.id}"]`);
    if (selectedCard) {
      selectedCard.style.transform = 'scale(0.95)';
      setTimeout(() => {
        selectedCard.style.transform = 'scale(1)';
      }, 150);
    }

    // 선택된 지역으로 스케줄 페이지로 이동
    setTimeout(() => {
      navigate('/schedule');
    }, 300);
  };

  const handleBack = () => {
    navigate('/schedule');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 검색 결과가 하나뿐이면 자동 선택
    if (filteredLocations.length === 1) {
      handleLocationSelect(filteredLocations[0]);
    }
  };

  return (
    <Container>
      <BackgroundShapes>
        <Shape1 />
        <Shape2 />
        <Shape3 />
      </BackgroundShapes>

      <Content>
        <Header>
          <BackButton onClick={handleBack}>
            <BackIcon>←</BackIcon>
          </BackButton>
          <SearchIcon>
            <SearchCircle />
            <SearchVector />
          </SearchIcon>
        </Header>

        <SearchSection>
          <SearchTitle>제주도 지역 검색</SearchTitle>
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInput
              placeholder="지역을 검색하세요"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchForm>
        </SearchSection>

        <LocationGrid>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                selected={selectedLocation === location.name}
                data-location={location.id}
              >
                <LocationIcon>{location.icon}</LocationIcon>
                <LocationName>{location.displayName}</LocationName>
                <CheckIcon selected={selectedLocation === location.name}>
                  <CheckVector />
                </CheckIcon>
              </LocationCard>
            ))
          ) : searchTerm ? (
            <NoResultsMessage>
              <NoResultsIcon>🔍</NoResultsIcon>
              <NoResultsText>"{searchTerm}"에 대한 검색 결과가 없습니다.</NoResultsText>
              <NoResultsSubtext>다른 키워드로 검색해보세요.</NoResultsSubtext>
            </NoResultsMessage>
          ) : (
            jejuLocations.map((location) => (
              <LocationCard
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                selected={selectedLocation === location.name}
                data-location={location.id}
              >
                <LocationIcon>{location.icon}</LocationIcon>
                <LocationName>{location.displayName}</LocationName>
                <CheckIcon selected={selectedLocation === location.name}>
                  <CheckVector />
                </CheckIcon>
              </LocationCard>
            ))
          )}
        </LocationGrid>

        <Divider />

        <LogoSection>
          <LogoContainer>
            <LogoText>ROUND & GO</LogoText>
          </LogoContainer>
        </LogoSection>
      </Content>
    </Container>
  );
};

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(180deg, #269962 0%, #FFFFFF 100%);
  position: relative;
  overflow: auto;
  padding-bottom: 2rem;
`;

const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Shape1 = styled.div`
  position: absolute;
  top: 67px;
  left: 51px;
  width: 678.48px;
  height: 274px;
  background: linear-gradient(180deg, #F1FFF8 21.63%, #227D51 100%);
  border-radius: 50% 50% 0 0;
  transform: translateX(-50%);
`;

const Shape2 = styled.div`
  position: absolute;
  top: 299px;
  left: -368px;
  width: 678.48px;
  height: 274px;
  background: linear-gradient(180deg, #227D51 0%, #F1FFF8 71.15%);
  border-radius: 0 0 50% 50%;
  transform: translateX(50%);
`;

const Shape3 = styled.div`
  position: absolute;
  top: 519px;
  left: 166px;
  width: 274px;
  height: 678.48px;
  background: linear-gradient(180deg, #F1FFF8 0%, #269962 100%);
  border-radius: 50% 0 0 50%;
  transform: translateY(-50%);
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const BackIcon = styled.span`
  color: #2D8779;
  font-size: 20px;
  font-weight: bold;
`;

const SearchIcon = styled.div`
  position: relative;
  width: 22.73px;
  height: 22.52px;
`;

const SearchCircle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 16.98px;
  height: 16.98px;
  border: 2px solid #2C8C7D;
  border-radius: 50%;
`;

const SearchVector = styled.div`
  position: absolute;
  top: 12.35px;
  left: 13.89px;
  width: 8.84px;
  height: 10.17px;
  border-right: 2px solid #2C8C7D;
  border-bottom: 2px solid #2C8C7D;
  transform: rotate(45deg);
`;

const SearchSection = styled.div`
  margin-bottom: 30px;
`;

const SearchTitle = styled.h2`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.25;
  color: #B2B2B2;
  margin: 0 0 10px 0;
`;

const SearchForm = styled.form`
  width: 100%;
  height: 45px;
  background: #FFFFFF;
  border: 0.3px solid #2D8779;
  border-radius: 42px;
  padding: 0 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  box-shadow: 0px 0px 4.8px rgba(16, 117, 54, 0.42);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #B2B2B2;

  &::placeholder {
    color: #B2B2B2;
  }
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 6px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LocationCard = styled.div`
  flex: 1;
  height: 25px;
  background: #FFFFFF;
  border: 0.3px solid #2D8779;
  border-radius: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease, transform 0.15s ease;
  box-shadow: 0px 0px 4.8px rgba(16, 117, 54, 0.42);

  &:hover {
    background: #F1FFF8;
    border-color: #2D8779;
    transform: translateY(-1px);
  }

  ${props => props.selected && `
    background: #F1FFF8;
    border-color: #2D8779;
    box-shadow: 0px 2px 8px rgba(16, 117, 54, 0.6);
  `}
`;

const LocationIcon = styled.span`
  font-size: 12px;
  margin-right: 4px;
`;

const LocationName = styled.span`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.25;
  color: #2D8779;
`;

const CheckIcon = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 8.3px;
  height: 8.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.selected ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const CheckVector = styled.div`
  width: 7.59px;
  height: 7.59px;
  border-right: 1px solid #2D8779;
  border-bottom: 1px solid #2D8779;
  transform: rotate(45deg);
`;

const Divider = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(38, 153, 98, 0.35);
  margin: 20px 0;
`;

const LogoSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
`;

const LogoImage = styled.img`
  width: 192px;
  height: 198px;
  object-fit: contain;
`;

const LogoText = styled.h1`
  font-family: 'Julius Sans One', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 1.09;
  color: rgba(44, 140, 126, 0.45);
  text-align: center;
  margin: 0;
  text-shadow: 1px 1px 1px rgba(44, 140, 126, 0.45);
`;

const NoResultsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #B2B2B2;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
`;

const NoResultsIcon = styled.span`
  font-size: 30px;
  margin-bottom: 10px;
`;

const NoResultsText = styled.p`
  font-weight: 500;
  margin-bottom: 5px;
`;

const NoResultsSubtext = styled.p`
  font-size: 12px;
  color: #888888;
`;

export default JejuLocationPage;