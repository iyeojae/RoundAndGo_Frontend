import React, { useEffect } from 'react';
import { handleKakaoLogin } from '../utils/authUtils';
import styled from 'styled-components';

const KakaoLoginButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #FEE500;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FDD835;
  }

  &:active {
    background-color: #FBC02D;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const KakaoLogin = ({ onLoginSuccess, onLoginError }) => {
  useEffect(() => {
    // 카카오 SDK 초기화
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.REACT_APP_KAKAO_APP_KEY);
      }
    }
  }, []);

  const handleKakaoLoginClick = () => {
    if (!window.Kakao) {
      console.error('카카오 SDK가 로드되지 않았습니다.');
      onLoginError?.('카카오 SDK를 불러올 수 없습니다.');
      return;
    }

    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          // 사용자 정보 가져오기
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: async (res) => {
              console.log('카카오 사용자 정보:', res);
              
              // 백엔드로 카카오 사용자 정보 전송
              const loginResult = await handleKakaoLogin(res);
              
              if (loginResult.success) {
                console.log('카카오 로그인 성공:', loginResult.user);
                onLoginSuccess?.(loginResult.user);
              } else {
                console.error('카카오 로그인 실패:', loginResult.message);
                onLoginError?.(loginResult.message);
              }
            },
            fail: (err) => {
              console.error('카카오 사용자 정보 요청 실패:', err);
              onLoginError?.('사용자 정보를 가져올 수 없습니다.');
            }
          });
        } catch (error) {
          console.error('카카오 로그인 처리 오류:', error);
          onLoginError?.('로그인 처리 중 오류가 발생했습니다.');
        }
      },
      fail: (err) => {
        console.error('카카오 로그인 실패:', err);
        onLoginError?.('카카오 로그인에 실패했습니다.');
      }
    });
  };

  return (
    <KakaoLoginButton onClick={handleKakaoLoginClick}>
      <img 
        src="/images/kakao-icon-50a288.png" 
        alt="카카오 로그인" 
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      카카오로 시작하기
    </KakaoLoginButton>
  );
};

export default KakaoLogin; 