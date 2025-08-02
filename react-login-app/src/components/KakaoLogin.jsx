import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleKakaoLogin } from '../utils/authUtils';

/**
 * 카카오 로그인 컴포넌트
 * 카카오 SDK를 사용하여 로그인 기능을 제공
 */
const KakaoLogin = () => {
  const navigate = useNavigate();
  const [isSDKReady, setIsSDKReady] = useState(false);

  /**
   * 카카오 SDK 초기화
   */
  useEffect(() => {
    const initializeKakao = () => {
      // 카카오 SDK가 로드되었는지 확인
      if (window.Kakao) {
        // 이미 초기화되었는지 확인
        if (!window.Kakao.isInitialized()) {
          // 환경 변수에서 클라이언트 ID 가져오기
          const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
          console.log('환경 변수에서 가져온 클라이언트 ID:', clientId);
          
          // 임시로 하드코딩된 클라이언트 ID 사용 (디버깅용)
          const actualClientId = clientId || 'ad66696f1e438be81ff958f80c7ced41';
          
          if (actualClientId && actualClientId !== 'your_kakao_client_id_here') {
            window.Kakao.init(actualClientId);
            console.log('카카오 SDK 초기화 완료 - 클라이언트 ID:', actualClientId);
            setIsSDKReady(true);
          } else {
            console.error('카카오 클라이언트 ID가 설정되지 않았습니다.');
            alert('카카오 로그인 설정이 완료되지 않았습니다. 개발자에게 문의하세요.');
          }
        } else {
          console.log('카카오 SDK가 이미 초기화되어 있습니다.');
          setIsSDKReady(true);
        }
      } else {
        // SDK가 아직 로드되지 않았다면 잠시 후 다시 시도
        console.log('카카오 SDK 로딩 중...');
        setTimeout(initializeKakao, 100);
      }
    };

    initializeKakao();
  }, []);

  /**
   * 카카오 로그인 실행
   */
  const handleKakaoLoginClick = () => {
    if (!isSDKReady) {
      alert('카카오 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.login({
        success: (authObj) => {
          console.log('카카오 로그인 성공:', authObj);
          
          // 사용자 정보 가져오기
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
              console.log('사용자 정보:', res);
              
              // 로그인 성공 후 처리
              const result = handleKakaoLogin(res);
              if (result.success) {
                navigate('/schedule');
              } else {
                alert(result.message);
              }
            },
            fail: (error) => {
              console.error('사용자 정보 가져오기 실패:', error);
              alert('로그인 중 오류가 발생했습니다.');
            }
          });
        },
        fail: (error) => {
          console.error('카카오 로그인 실패:', error);
          alert('카카오 로그인에 실패했습니다.');
        }
      });
    } else {
      alert('카카오 SDK가 로드되지 않았습니다.');
    }
  };

  return (
    <button
      onClick={handleKakaoLoginClick}
      disabled={!isSDKReady}
      style={{
        width: '328px',
        height: '54px',
        background: '#FEE500',
        border: 'none',
        borderRadius: '27px',
        cursor: isSDKReady ? 'pointer' : 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        fontFamily: 'Spoqa Han Sans Neo, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        color: '#000000',
        opacity: isSDKReady ? 1 : 0.6
      }}
    >
      {isSDKReady ? '카카오로 시작하기' : '카카오 SDK 로딩중...'}
    </button>
  );
};

export default KakaoLogin; 