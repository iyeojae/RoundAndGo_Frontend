import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SignUpContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #269962 0%, #FFFFFF 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: auto;
  padding: 20px;
`;

const SignUpFrame = styled.div`
  width: 440px;
  min-height: 956px;
  position: relative;
  background: linear-gradient(180deg, #269962 0%, #FFFFFF 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
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

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(38, 153, 98, 0.51) 0%, #FFFFFF 66.35%);
  z-index: 1;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 124px;
  left: 50%;
  transform: translateX(-50%);
  width: 143px;
  height: 153px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const Logo = styled.img`
  width: 117px;
  height: 121px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-family: 'Julius Sans One', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.09;
  color: #2C8C7D;
  text-align: center;
  margin: 10px 0 0 0;
`;

const FormContainer = styled.div`
  position: absolute;
  top: 320px;
  left: 50%;
  transform: translateX(-50%);
  width: 328px;
  z-index: 2;
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.25;
  color: #2D8779;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  border-bottom: 1px solid ${props => props.error ? '#FF4D4F' : '#2D8779'};
  background: transparent;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #2D8779;
  outline: none;
  padding: 0 0 8px 0;

  &::placeholder {
    color: #92BEA9;
  }

  &:focus {
    border-bottom: 2px solid ${props => props.error ? '#FF4D4F' : '#2D8779'};
  }
`;

const SignUpButton = styled.button`
  width: 328px;
  height: 54px;
  background: transparent;
  border: 1px solid #2D8779;
  border-radius: 27px;
  color: #2D8779;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.25;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: #2D8779;
    color: #FFFFFF;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 135, 121, 0.3);
  }
`;

const BackButton = styled.button`
  position: absolute;
  bottom: 70px;
  left: 20px;
  width: 35px;
  height: 33px;
  background: transparent;
  border: 2px solid #2D8779;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: #2D8779;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(45, 135, 121, 0.3);
  }
`;

const BackIcon = styled.div`
  width: 16.31px;
  height: 15.06px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 12px;
    height: 2px;
    background: #2D8779;
    transform: translateY(-50%);
  }
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 8px;
    height: 8px;
    border-left: 2px solid #2D8779;
    border-bottom: 2px solid #2D8779;
    transform: translateY(-50%) rotate(45deg);
  }
`;

function SignUpPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [pwCheckError, setPwCheckError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = () => {
    let hasError = false;
    if (!userId) {
      setIdError(true);
      hasError = true;
    } else {
      setIdError(false);
    }
    if (!password) {
      setPwError(true);
      hasError = true;
    } else {
      setPwError(false);
    }
    if (!passwordCheck || password !== passwordCheck) {
      setPwCheckError(true);
      hasError = true;
    } else {
      setPwCheckError(false);
    }
    if (!name) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }
    if (hasError) return;
    // 회원가입 로직 구현
    alert('회원가입 완료!');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <SignUpContainer>
      <SignUpFrame>
        <BackgroundShapes>
          <Shape1 />
          <Shape2 />
          <Shape3 />
        </BackgroundShapes>
        <Overlay />
        <LogoContainer>
          <Logo src="/images/logo-280a0a.png" alt="ROUND & GO Logo" />
          <Title>회원가입</Title>
        </LogoContainer>
        <FormContainer>
          <InputGroup>
            <InputLabel>아이디</InputLabel>
            <Input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              error={idError}
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>비밀번호</InputLabel>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              error={pwError}
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>비밀번호 확인</InputLabel>
            <Input
              type="password"
              value={passwordCheck}
              onChange={e => setPasswordCheck(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              error={pwCheckError}
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>이름</InputLabel>
            <Input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              error={nameError}
            />
          </InputGroup>
          <InputGroup>
            <InputLabel>이메일</InputLabel>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              error={emailError}
            />
          </InputGroup>
          <SignUpButton onClick={handleSignUp}>회원가입</SignUpButton>
        </FormContainer>
        <BackButton onClick={handleBack}>
          <BackIcon />
        </BackButton>
      </SignUpFrame>
    </SignUpContainer>
  );
}

export default SignUpPage; 