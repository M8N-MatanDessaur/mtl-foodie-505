import React from "react";
import styled from "styled-components";

export default function ListToggleButton({toggleList}) {
    return (
        <Button onClick={toggleList}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"></path>
            </svg>
        </Button>
    )
}

const Button = styled.button`
  width: 20%;
  height: 60px;
  background-color: #2e5bf3;
  letter-spacing: 1.5px;
  border: 0;
  border-left: 3px solid #213377;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  & svg {
    stroke: #213377;
    fill: #213377;
    height: 30px;
    width: 30px;
  }
 
&:active {
  background-color: #2e5bf3;
  & svg{
    transform: scale(0.8);
  }
 }

  &:hover {
    & svg {
      fill: #fff;
      stroke: #fff;
    }
    transition: all 200ms ease-in-out;
  }
`;


