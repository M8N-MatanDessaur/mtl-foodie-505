import React from "react";
import styled from "styled-components";
import CloseButton from "./CloseButton";

export default function RestaurantListOverlay({ listOpened, toggleList, RestaurantList }) {
    return (
        <ListOverlay listOpened={listOpened}>
            <CloseButton toggleFunction={toggleList} />
            <ListTitle>La liste pour les fines bouches</ListTitle>
            <ListWrapper>
              {RestaurantList.sort((a, b) => a.name.localeCompare(b.name)).map((restaurant, index) => (
                <ListItem>
                  <ListLink href={restaurant.links} key={index} target="_blank" rel="noopener noreferrer">
                    {restaurant.name}
                  </ListLink>
                </ListItem>
              ))}
            </ListWrapper>
          </ListOverlay>
    )
}

const ListTitle = styled.h3`
position: absolute;
top: 10px;
left: 10px;
  color: #fff;
  text-align: left;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  `;

  const ListWrapper = styled.div`
  position: relative;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  height: 500px;
  overflow: scroll;

  scrollbar-width: thin;
  scrollbar-color: #d1d1d1 #1a1d25;
  &::-webkit-scrollbar {
      width: 12px;
  }
  &::-webkit-scrollbar-track {
      border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb {
      background-color: #d1d1d1;
      border-radius: 20px;
      border: 3px solid #1a1d25;
  }
  &::-webkit-scrollbar-corner {
      background-color: rgba(0,0,0,0);
  }

  display:flex;
  flex-direction: column;
  align-items: center;
  `;

  const ListOverlay = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: #1a1d25;
  background-size: 100% 4px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  display: ${props => props.listOpened ? 'flex' : 'none'};
`;



const ListItems = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #333;
  padding: 10px;
  `;

const ListLink = styled.a`
  color: #fff;
  text-decoration: none;
  text-align: left;
  font-size: 0.8rem;
  font-weight: bold;
  `;

