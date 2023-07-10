import React from "react";
import styled,{keyframes} from "styled-components";

export default function ScanlineScreenLocalisationModeOverlay({ changeMode }) {
    return (
    <ChangeModeOverlay changeMode={changeMode}>
        <svg width="58" height="58" fill="green" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C7.59 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.03-5.56 8-12 0-4.411-3.589-8-8-8Zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Z"></path>
        </svg>
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
  align-items: center;
  justify-content: center;

  & > svg {
    opacity: ${props => (props.changeMode ? 1 : 0)};
    animation: ${fadeInAnimation} 0.5s ease; /* Adjust the duration and timing function as needed */
  }

  display: ${props => props.changeMode ? 'flex' : 'none'};
`;