// LeftContent.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/greenlogo.svg';

const LeftWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 2rem;
    color: #000;
    z-index: 1;
`;

const ContentBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5%;
`;

const LogoImage = styled.img`
    width: 100px;
    aspect-ratio: 10 / 15;
`;

const Title = styled.h1`
    font-size: 2rem;
    color: #595959;
    font-weight: bold;
    margin: 0;
`;

const Description = styled.p`
    font-size: 1.5rem;
    color: #595959;
    font-weight: 350;
    margin: 0;
`;

const StyledLink = styled(Link)`
    font-size: 1rem;
    color: #2C8C7D;
    font-weight: bold;
    margin-top: 3%;
    text-decoration: none;
    cursor: pointer;
`;

function LeftContent() {
    return (
        <LeftWrapper>
            <ContentBox>
                <LogoImage src={Logo} alt="로고" />
                <Title>AI가 찾아주는 여행코스</Title>
                <Description>당신의 골프여행이 더욱 특별해집니다!</Description>
                <StyledLink to="/course">AI 추천 코스 보러가기 &gt;</StyledLink>
            </ContentBox>
        </LeftWrapper>
    );
}

export default LeftContent;
