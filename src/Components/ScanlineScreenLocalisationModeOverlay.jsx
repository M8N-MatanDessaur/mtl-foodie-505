import React from "react";
import styled, { keyframes } from "styled-components";

export default function ScanlineScreenLocalisationModeOverlay({ changeMode, radius, localized }) {
  return (
    <ChangeModeOverlay changeMode={changeMode} localized={localized}>
      {localized ? (
        <>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C7.59 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.03-5.56 8-12 0-4.411-3.589-8-8-8Zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Z"></path>
          </svg>
        </>

      ) : (
        <>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7.25 3.86A6.984 6.984 0 0 1 12 2c3.87 0 7 3.13 7 7 0 1.57-.63 3.36-1.51 5.11l-3.55-3.55c.35-.43.56-.97.56-1.56A2.5 2.5 0 0 0 12 6.5c-.59 0-1.13.21-1.56.55L7.25 3.86ZM2 4.27l1.41-1.41 16.73 16.73L18.73 21l-3.35-3.35C13.67 20.15 12 22 12 22S5 14.25 5 9c0-.53.07-1.05.18-1.55L2 4.27Z" clip-rule="evenodd"></path>
          </svg>
          <h2>Off</h2>
        </>

      )
      }
    </ChangeModeOverlay>
  )
}

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ChangeModeOverlay = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: #1a1d25;
  background-size: 100% 4px;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & h2 {
    color: #fff;
    font-size: 1.5rem;
    margin-top: 10px;
    animation: ${fadeInAnimation} 0.5s ease-in-out;
  }

  & svg {
    stroke: ${props => (props.localized ? "#13d713" : "#213377")};
    fill: ${props => (props.localized ? "#13d713" : "#213377")};
    height: 50px;
    width: 50px;
  }

  display: ${props => props.changeMode ? 'flex' : 'none'};
`;