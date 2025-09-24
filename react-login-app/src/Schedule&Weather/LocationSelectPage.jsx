import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { searchLocations, getPopularLocations, getRecentLocations, addToRecentLocations } from './LocationAPI';

const LocationSelectPage = ({ onLocationSelect, onBack }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleLocationSelect = async (location) => {
    try {
      // 최근 검색에 추가
      await addToRecentLocations(location);
    } catch (error) {
      console.error('최근 검색 추가 실패:', error);
    }

    if (onLocationSelect) {
      onLocationSelect(location.name);
    }
    handleBack();
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [popular, recent] = await Promise.all([
          getPopularLocations(),
          getRecentLocations()
        ]);
        setPopularLocations(popular.items || []);
        setRecentLocations(recent.items || []);
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      }
    };

    loadInitialData();
  }, []);

  // 검색 실행
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchLocations(query);
      setSearchResults(results.items || []);
      setShowResults(true);
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>뒤로</BackButton>
        <Title>장소</Title>
      </Header>
      
      <SearchSection>
        <SearchInput
          type="text"
          placeholder="장소를 입력해주세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchSection>
      
      <Content>
        {isLoading ? (
          <LoadingState>
            <LoadingText>검색 중...</LoadingText>
          </LoadingState>
        ) : showResults ? (
          <SearchResults>
            {searchResults.length > 0 ? (
              searchResults.map((location) => (
                <LocationItem key={location.id} onClick={() => handleLocationSelect(location)}>
                  <LocationName>{location.name}</LocationName>
                  {location.address && <LocationAddress>{location.address}</LocationAddress>}
                </LocationItem>
              ))
            ) : (
              <EmptyState>
                <EmptyText>검색 결과가 없습니다</EmptyText>
              </EmptyState>
            )}
          </SearchResults>
        ) : (
          <DefaultContent>
            {recentLocations.length > 0 && (
              <Section>
                <SectionTitle>최근 검색</SectionTitle>
                {recentLocations.map((location) => (
                  <LocationItem key={location.id} onClick={() => handleLocationSelect(location)}>
                    <LocationName>{location.name}</LocationName>
                    {location.address && <LocationAddress>{location.address}</LocationAddress>}
                  </LocationItem>
                ))}
              </Section>
            )}
            
            {popularLocations.length > 0 && (
              <Section>
                <SectionTitle>인기 장소</SectionTitle>
                {popularLocations.map((location) => (
                  <LocationItem key={location.id} onClick={() => handleLocationSelect(location)}>
                    <LocationName>{location.name}</LocationName>
                    {location.address && <LocationAddress>{location.address}</LocationAddress>}
                  </LocationItem>
                ))}
              </Section>
            )}
            
            {recentLocations.length === 0 && popularLocations.length === 0 && (
              <EmptyState>
                <EmptyText>검색어를 입력하여 장소를 찾아보세요</EmptyText>
              </EmptyState>
            )}
          </DefaultContent>
        )}
      </Content>
    </Container>
  );
};

// 스타일 컴포넌트들
const Container = styled.div`
  position: relative;
  width: 90%;
  margin: 0 auto;
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 20px 0;
  box-sizing: border-box;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #003CFF;
  
  padding: 0;
  
  font-weight: 300;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 16px;
  
  cursor: pointer;
`;

const Title = styled.h1`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 15px;
  font-weight: 400;
  
  color: #000000;
  
  margin: 0;

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const SearchSection = styled.div`
  padding: 15px 0;
  border-top: 1px solid #269962;
  border-bottom: 1px solid #269962;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 0.3px solid #269962;
  border-radius: 54px;

  padding: 10px 25px;
  box-sizing: border-box;
  box-shadow: 0 0 4.8px rgba(16, 117, 54, 0.42);
  
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  
  color: #050505;
  background: #FFFFFF;
  
  outline: none;

  &:focus {
    border-color: #269962;
  }

  &::placeholder {
    color: #B2B2B2;
    font-size: 12px;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyText = styled.p`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #999999;
  text-align: center;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.p`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #999999;
  text-align: center;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
`;

const DefaultContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #050505;
  margin: 0 0 10px 0;
`;

const LocationItem = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #F8F9FA;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LocationName = styled.div`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #050505;
  margin-bottom: 4px;
`;

const LocationAddress = styled.div`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #666666;
`;

export default LocationSelectPage;
