import React, { useState } from 'react';
import styled from "styled-components";

export default function LocalizationButton({ toggleLocalized, currentLocation, localized, randomRestaurant, toggleRad, radius }) {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        e.preventDefault(); // Add this line
        setTouchStart(new Date().getTime());
    }

    const handleTouchEnd = (e) => {
        e.preventDefault(); // And this line
        setTouchEnd(new Date().getTime());

        // If touch duration was more than 500 milliseconds, treat it as a long press
        if ((touchEnd - touchStart) > 500) {
            toggleRad(e);
        }
    }

    return (
        <Button 
            radius={radius}  
            onTouchStart={handleTouchStart} 
            onTouchEnd={handleTouchEnd} 
            onClick={toggleLocalized} 
            currentLocation={currentLocation} 
            localized={localized} 
            disabled={currentLocation === null}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C7.59 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.03-5.56 8-12 0-4.411-3.589-8-8-8Zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Z"></path>
            </svg>
        </Button>
    )
}

const Button = styled.button`
  height: 60px;
  width: ${props => props.currentLocation === null ? "0" : "20%"};
  background-color: #2e5bf3;
  letter-spacing: 1.5px;
  border: 0;
  border-right: 3px solid #213377;
  border-width: ${props => props.currentLocation === null ? "0" : "3px"};
  font-size: 15px;
  align-items: center;
  justify-content: center;
  display: flex;
  
  & svg {
    stroke: ${props => {
      if (props.radius === 2) return props.localized ? '#13d713' : '#213377';
      if (props.radius === 8) return props.localized ? '#9fd713' : '#213377';
      if (props.radius === 20) return props.localized ? '#d7d713' : '#213377';
      if (props.radius === 45) return props.localized ? '#d71a13' : '#213377';
    }};
    fill: ${props => {
      if (props.radius === 2) return props.localized ? '#13d713' : '#213377';
      if (props.radius === 8) return props.localized ? '#9fd713' : '#213377';
      if (props.radius === 20) return props.localized ? '#d7d713' : '#213377';
      if (props.radius === 45) return props.localized ? '#d71a13' : '#213377';
    }};
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