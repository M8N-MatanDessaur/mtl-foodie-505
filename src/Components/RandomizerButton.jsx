import React from "react";
import styled from "styled-components";

export default function RandomizerButton({ pickRandomRestaurant, countdown, currentLocation}) {
    return (
        <Button onClick={()=>pickRandomRestaurant()} currentLocation={currentLocation} disabled={countdown > 0} countdownActive={countdown > 0}>
            {countdown > 0 ? (
                <CountdownDisplay>{countdown}</CountdownDisplay>
            ) : (
                <svg
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M7 4v16l13-8L7 4Z"></path>
                </svg>
            )}
        </Button>
    )
}

const Button = styled.button`
  width: ${props => props.currentLocation === null ? "80%" : "60%"};
  height: 60px;
  border: 0;
  background-color: #2e5bf3;
  letter-spacing: 1.5px;
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

const CountdownDisplay = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  color: #fff;
  `;
