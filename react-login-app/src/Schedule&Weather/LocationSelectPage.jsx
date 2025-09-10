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
      await addToRecentLocations(location.id);
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
        setPopularLocations(popular);
        setRecentLocations(recent);
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
      setSearchResults(results);
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
        <div></div>
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
  width: 100%;
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #269962;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #269962;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 16px;
  cursor: pointer;
`;

const Title = styled.h1`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  margin: 0;
`;

const SearchSection = styled.div`
  padding: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 1px solid #269962;
  border-radius: 12px;
  padding: 15px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #050505;
  background: #FFFFFF;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #269962;
  }

  &::placeholder {
    color: #A7A7A7;
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
