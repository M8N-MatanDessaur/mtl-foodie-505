import React from "react";
import styled from "styled-components";

export default function LocalizationButton({ toggleLocalized, currentLocation, localized, randomRestaurant }) {

  return (
    <Button
      onClick={toggleLocalized}
      currentLocation={currentLocation}
      localized={localized}
      disabled={currentLocation === null}
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C7.59 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.03-5.56 8-12 0-4.411-3.589-8-8-8Zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Z"></path>
      </svg>
    </Button>
  );
}

const Button = styled.button`
  height: 60px;
  width: ${props => (props.currentLocation === null ? "0" : "20%")};
  background-color: #2e5bf3;
  letter-spacing: 1.5px;
  border: 0;
  border-right: 3px solid #213377;
  border-width: ${props => (props.currentLocation === null ? "0" : "3px")};
  font-size: 15px;
  align-items: center;
  justify-content: center;
  display: flex;

  & svg {
    stroke: ${props => (props.localized ? "#13d713" : "#213377")};
    fill: ${props => (props.localized ? "#13d713" : "#213377")};
    height: 30px;
    width: 30px;
  }

  &:active {
    background-color: #2e5bf3;
    & svg {
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
}`;
