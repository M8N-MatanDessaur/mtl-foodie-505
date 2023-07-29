import React from "react";
import styled from "styled-components";
import CloseButton from "./CloseButton";

export default function InfoModal({coffeeButtonPressed, toggleModal}) {
    return (
        <ModalWrapper>
          <ModalContent>
            <CoffeeButton onClick={coffeeButtonPressed}>
              <a href="https://www.buymeacoffee.com/matandessaur" target="_blank" rel="noreferrer">Buy me a coffee ☕</a>
            </CoffeeButton>
            <ModalText>
              <br />
              Aléoresto randomly suggests restaurants to you, drawing from food spots near your location in a completely random manner. <br/>
              🍔🍕🌯🍜🍣🍛🍚🍲🥙🥩
              <br /> <br />
              Created by a food lover, for food lovers. 😋
              <br /> <br />
              For the nerds, Aleoresto is coded in <code>React</code>, with a bit of <code>styled-components</code> and using Google Maps' API. 📍🌎
              <br /> <br />
              For the curious, the name <b><i>aleoresto</i></b> comes from the wordplay of <u><i>aleatoire</i></u> (random) and <u><i>resto</i></u> (restaurant), to create a name that sounds like "going to a restaurant".
            </ModalText>
            <CloseButton toggleFunction={toggleModal} />
          </ModalContent>
        </ModalWrapper>
    )
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ModalContent = styled.div`
position: relative;
background-color: #fff;
padding: 20px;
border-radius: 5px;
width: 350px;
height: fit-content;
overflow: auto;

scrollbar-width: thin;
  scrollbar-color: #d1d1d1 #1a1d25;
  &::-webkit-scrollbar {
      width: 12px;
  }
  &::-webkit-scrollbar-track {
      border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb {
      background-color: #d1d1d1;
      border-radius: 20px;
      border: 3px solid #1a1d25;
  }
  &::-webkit-scrollbar-corner {
      background-color: rgba(0,0,0,0);
  }
`;

const ModalText = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 35px;
`;




const CoffeeButton = styled.button`
  position: absolute;
  bottom: 15px;
  right: 50%;
  transform: translateX(50%);
  background-color: #eabf45;
  border-radius: 50px;
  color: #000;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  text-wrap: nowrap;

  & a{
    text-wrap: nowrap;
  }
  `;