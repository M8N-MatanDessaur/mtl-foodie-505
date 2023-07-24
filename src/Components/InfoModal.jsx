import React from "react";
import styled from "styled-components";
import CloseButton from "./CloseButton";

export default function InfoModal({coffeeButtonPressed, toggleModal}) {
    return (
        <ModalWrapper>
          <ModalContent>
            <CoffeeButton onClick={coffeeButtonPressed}>
              <a href="https://www.buymeacoffee.com/matandessaur" target="_blank" rel="noreferrer">Achetez-moi un café ☕</a>
            </CoffeeButton>
            <ModalText>
              <br />
              Aléoresto te lance des restos au pif, en pigeant dans les spots de bouffe proches de toi, le tout de manière aléatoire 🍔🍕🌯🍜🍣🍛
              <br /> <br />
              Créé par un fan de bouffe, pour les fans de bouffe 😋
              <br /> <br />
              Pour les nerds, Aléoresto est codé en <code>React</code>, avec un peu de <code>styled-components</code> et en utilisant l'API de google maps 📍🌎
              <br /> <br />
              Pour les curieux, le nom <b><i>aléoresto</i></b> vien du jeu de mots d'<u><i>aléatoire</i></u> et <u><i>resto</i></u> pour faire un nom qui sonne comme "aller au resto".
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