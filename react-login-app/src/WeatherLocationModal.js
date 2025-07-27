import React from 'react';
import styled from 'styled-components';

const WeatherLocationModal = ({ onClose, onLocationChange, currentLocation }) => {
  const locations = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '제주시', '서귀포시', '춘천', '강릉', '청주', '전주', '포항', '창원'
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>날씨 지역 변경</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <LocationSearch>
          <SearchInput placeholder="지역을 검색하세요" />
        </LocationSearch>

        <LocationList>
          {locations.map(location => (
            <LocationOption
              key={location}
              onClick={() => onLocationChange(location)}
            >
              <LocationOptionText>{location}</LocationOptionText>
              {currentLocation === location && <CheckIcon>✓</CheckIcon>}
            </LocationOption>
          ))}
        </LocationList>
      </ModalContent>
    </ModalOverlay>
  );
};

// 스타일 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const ModalTitle = styled.h2`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #2C8C7D;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 30px;
  height: 30px;
  border: 2px solid #2C8C7D;
  border-radius: 50%;
  background: transparent;
  color: #2C8C7D;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #2C8C7D;
    color: #FFFFFF;
  }
`;

const LocationSearch = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E5E5E5;
  border-radius: 10px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2C8C7D;
  }

  &::placeholder {
    color: #B2B2B2;
  }
`;

const LocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
`;

const LocationOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #E5E5E5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2C8C7D;
    background: #F8FFFE;
  }
`;

const LocationOptionText = styled.span`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
`;

const CheckIcon = styled.span`
  color: #2C8C7D;
  font-weight: bold;
  font-size: 16px;
`;

export default WeatherLocationModal;