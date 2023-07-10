import React from "react";
import styled from "styled-components";

export default function ScanlineScreenLoadingOverlay({ loading }) {
    return(
        <LoadingOverlay loading={loading}>
            ALÉ&nbsp;<LoadingSpinner />&nbsp;RESTO
        </LoadingOverlay>
    )
}

const LoadingOverlay = styled.div`
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

  display: ${props => props.loading ? 'flex' : 'none'};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid #2e5bf3;
  border-top: 5px solid #fff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg) scale(1);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
`;