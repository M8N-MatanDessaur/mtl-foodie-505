import React from "react";
import styled from "styled-components";

export default function RadiusSlider({ radius, toggleRad }) {
    return (
        <SliderContainer>
            <SliderLabel>{radius} km</SliderLabel>
            <SliderInput
                type="range"
                min={1}
                max={50}
                value={radius}
                onChange={(e) => toggleRad(parseInt(e.target.value))}
            />

        </SliderContainer>
    );
}

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
    bottom: 0;
    width: 100%;
    padding: 15px 35px;
`;

const SliderLabel = styled.span`
  color: #fff;
  margin-right: 10px;
`;

const SliderInput = styled.input`
    width: 78%;
`;
