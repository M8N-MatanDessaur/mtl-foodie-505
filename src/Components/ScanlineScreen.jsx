import React from "react";
import styled from "styled-components";
import { Toaster, toast } from 'react-hot-toast';

export default function ScanlineScreen({ children }) {
    return (
        <ScanlineScreenContainer>
            {children}
        </ScanlineScreenContainer>
    );
}


const ScanlineScreenContainer = styled.div`
  position: relative;
  height: 40%;
  height: calc(100% - 160px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 35px;
  background-color: #213377;

  border: 5px solid #2e5bf3;
  border-bottom: none;
  box-shadow: inset 7px 7px 17px #1d2026,
            inset -7px -7px 17px #333842; 
`;