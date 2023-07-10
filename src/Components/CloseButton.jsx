import React from "react";
import styled from "styled-components";

export default function CloseButton({ toggleFunction }) {
    return (
        <Button onClick={toggleFunction}>
        <svg fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="m12 12-5 5m5-5L7 7l5 5Zm0 0 5 5-5-5Zm0 0 5-5-5 5Z"></path>
        </svg>
      </Button>
    );
}

const Button = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  border-radius: 5px;
  color: #fff;
  border: none;
  padding: 2px;
  cursor: pointer;

  & svg {
    height: 20px;
    width: 20px;
  }

  &:hover {
    opacity: 0.8;
  }
`;