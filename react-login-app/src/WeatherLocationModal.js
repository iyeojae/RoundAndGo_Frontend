import React from 'react';
import styled from 'styled-components';

const WeatherLocationModal = ({ onClose, onLocationChange, currentLocation }) => {
  const locations = [
    '제주시', '서귀포시', '제주시 아라동', '제주시 연동', '제주시 노형동', 
    '제주시 이도동', '제주시 삼도동', '제주시 용담동', '제주시 건입동',
    '서귀포시 중문동', '서귀포시 대정읍', '서귀포시 남원읍', '서귀포시 성산읍',
    '서귀포시 표선면', '서귀포시 안덕면', '서귀포시 대천동', '서귀포시 동홍동'
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>제주도 날씨 지역 변경</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <LocationSearch>
          <SearchInput placeholder="제주도 내 지역을 검색하세요" />
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
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 12px 16px;
  border: 2px solid #E5E5E5;
  border-radius: 10px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

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