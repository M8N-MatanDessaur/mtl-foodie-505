import React from 'react';
import styled from 'styled-components';

export default function TopBar({toggleModal}) {
    return (
        <Header>
            <Title>
                Ya quoi à manger icitte<span>?</span>
            </Title>
            <InfoLink onClick={toggleModal}>
                <svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.25 12a8.75 8.75 0 1 1 17.5 0 8.75 8.75 0 0 1-17.5 0ZM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 2.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd"></path>
                </svg>
            </InfoLink>
        </Header>
    );
}

const Header = styled.header`
width: 100%;
height: 50px;
border-bottom: 2px solid #2e5bf3;
background-color: #2e5bf3;
display: flex;
align-items: center;
justify-content: space-between;
padding: 10px 20px;
z-index: 100;
`;

const InfoLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;

  & svg {
    height: 30px;
    width: 30px;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      transform: scale(0.8);
    }
  }
  `;

const Title = styled.h1`
  position: relative;
  color: #fff;
  font-size: 1.5rem;
  text-align: center;
  filter: drop-shadow(0 0 15px #00f8fb);
  text-shadow: 0 0 30px #00f8fb;

& span {
  position: absolute;
  left: 105%;
  transform: scale(1.3) rotate(35deg);
}

`;