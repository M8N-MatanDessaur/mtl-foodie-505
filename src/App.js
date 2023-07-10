import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import Marquee from "react-fast-marquee";
import Cookies from 'universal-cookie';
import { Toaster, toast } from 'react-hot-toast';

import buttonSound from './button_pressed.mp3';
import buttonSoundAlt from './button_pressed_alt.mp3';
import buttonSoundGo from './button_pressed_go.mp3';
import TopBar from './Components/TopBar';
import ScanlineScreen from './Components/ScanlineScreen';
import ScanlineScreenLoadingOverlay from './Components/ScanlineScreenLoadingOverlay';
import ScanlineScreenLocalisationModeOverlay from './Components/ScanlineScreenLocalisationModeOverlay';
import RestaurantListOverlay from './Components/RestaurantListOverlay';
import RandomizerButton from './Components/RandomizerButton';
import LocalizationButton from './Components/LocalizationButton';
import ListToggleButton from './Components/ListToggleButton';
import InfoModal from './Components/InfoModal';

import RestaurantList from './Restaurants/RestaurantsList.json';

export default function App() {
  // Cookies
  const cookies = new Cookies();
  const cookieOptions = {
    sameSite: 'none',
    secure: true
  };
  cookies.set('cookieName', 'cookieValue', cookieOptions);

  // State
  const [currentLocation, setCurrentLocation] = useState(null);
  const [randomRestaurant, setRandomRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changeMode, setChangeMode] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [localized, setLocalized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Audio
  const audio = new Audio(buttonSound);
  const audio2 = new Audio(buttonSoundAlt);
  const audio3 = new Audio(buttonSoundGo);

  useEffect(() => {
    // Get current location if possible
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
        },
        (error) => {
          toast.error('Error getting current location', error);
          setCurrentLocation(null);
        }
      );
    } 
    // Alert user if geolocation is not supported
    else {
      toast.error('Geolocation is not supported by your browser');
      setCurrentLocation(null);
    }
  }, []);


  const mainButtonPressed = () => {
    if ('vibrate' in navigator) {
      audio.play();
      navigator.vibrate(100);
    }
    else {
      audio.play();
    }
  };

  const buttonPressed = () => {
    if ('vibrate' in navigator) {
      audio2.play();
      navigator.vibrate(100);
    }
    else {
      audio2.play();
    }
  };

  const coffeeButtonPressed = () => {
    if ('vibrate' in navigator) {
      audio3.play();
      navigator.vibrate(100);
    }
    else {
      audio3.play();
    }
  };


  // Pick a random restaurant from the list
  const pickRandomRestaurant = () => {

    // Prevent spamming the button
    if (loading || countdown > 0) {
      return;
    }

    // Countdown animation 
    // The countdown is used to prevent spamming the button with a loading animation
    let countdownValue = 3;
    setCountdown(countdownValue);
    const countdownInterval = setInterval(() => {
      countdownValue--;
      if (countdownValue === 0) {
        clearInterval(countdownInterval);
        setCountdown(0);
        setLoading(false);
      } else {
        setCountdown(countdownValue);
      }
    }, 400);

    // Pick a random restaurant
    mainButtonPressed();
    setLoading(true);
    const randomIndex = Math.floor(Math.random() * RestaurantList.length);
    const randomRestaurant = RestaurantList[randomIndex];
    let mapUrlLocalized = '';
    if (randomRestaurant) {
      const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(randomRestaurant.name)},montréal&key=AIzaSyBu0MZ1OGyDCbamYAJH24STXOLYJRt3YAo`;
      if (currentLocation !== null) {
        mapUrlLocalized = `https://www.google.com/maps/embed/v1/directions?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${encodeURIComponent(randomRestaurant.name)},montréal&key=AIzaSyBu0MZ1OGyDCbamYAJH24STXOLYJRt3YAo`;
      }
      const mapContainer = (
        <MapContainer>
          {localized ? (
            <MapFrame src={mapUrlLocalized} allowFullScreen></MapFrame> //Show localized map direction
          ) : (
            <MapFrame src={mapUrl} allowFullScreen></MapFrame> //Show default map location
          )}
        </MapContainer>
      );
      // Create a link to the restaurant on Google Maps
      const mapFrame = (
        <MapLink href={randomRestaurant.links} target="_blank" rel="noopener noreferrer">
          {randomRestaurant.name}
        </MapLink>
      );
      setRandomRestaurant({
        ...randomRestaurant,
        mapContainer,
        mapFrame,
        mapUrl,
        mapUrlLocalized,
      });
    } else {
      setRandomRestaurant(null);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Toggle the info modal
  const toggleModal = () => {
    buttonPressed();
    setShowModal(!showModal);
  };

  // Toggle the restaurant list
  const toggleList = () => {
    buttonPressed();
    setListOpened(!listOpened);
  };

  // Toggle the localization mode
  const toggleLocalized = () => {
    setChangeMode(true);
    coffeeButtonPressed();
    setLocalized(!localized);
    if (randomRestaurant) {
      const mapUrl = localized ? randomRestaurant.mapUrl : randomRestaurant.mapUrlLocalized;
      const updatedMapContainer = (
        <MapContainer>
          <MapFrame src={mapUrl} allowFullScreen></MapFrame>
        </MapContainer>
      );
      setRandomRestaurant(prevRandomRestaurant => ({
        ...prevRandomRestaurant,
        mapContainer: updatedMapContainer,
      }));
    }
    setTimeout(() => {
      setChangeMode(false);
    }, 1000);
  };

  return (
    <Wrapper>
      <AppContainer>
        <TopBar toggleModal={toggleModal} />
        <ScanlineScreen>
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff', fontSize: '16px' } }} />
          <ScanlineScreenLoadingOverlay loading={loading} />
          <ScanlineScreenLocalisationModeOverlay changeMode={changeMode} />
          <RestaurantListOverlay listOpened={listOpened} toggleList={toggleList} RestaurantList={RestaurantList} />
          <FullScreenOverlay />

          {/* If a restaurant was picked show the mapContainer & Frame if not show the welcome message */}
          {randomRestaurant ? (
            <>
              {randomRestaurant.mapContainer}
              {randomRestaurant.mapFrame}
            </>
          ) : (
            <>
              <Main>
                Appuis s'ul pitton ▷ pour choisir aléatoirement où manger!
              </Main>
              <Sub>
                y'a d'la bouffe à profusion icitte! Y a toutes sortes de restos et d'casses-croûtes qui vont te faire saliver à s'en r'tenir la bave au menton!
              </Sub>
            </>
          )}
        </ScanlineScreen>
        <ButtonWrapper>
          <LocalizationButton toggleLocalized={toggleLocalized} currentLocation={currentLocation} localized={localized} randomRestaurant={randomRestaurant} />
          <RandomizerButton pickRandomRestaurant={pickRandomRestaurant} currentLocation={currentLocation} countdown={countdown} />
          <ListToggleButton toggleList={toggleList} />
        </ButtonWrapper>
        <MarqueeContainer>
          <Marquee>
            Asteur écoute icitte, j'ai des spots de bouffe qui vont t'en faire glousser dans ton p'tit bedon! T'as l'estomac qui crie pour une poutine à te faire baver dans ton hoodie? Pas d'soucis, mon chum! Y'a des places pour ça, j'te dis! Pis si t'es plutôt d'humeur pour du smoked meat tendre à te faire fondre l'coeur, y'a des endroits pour ça aussi, crissement!
            Et pour ceux qui aiment les fruits de mer, y'a un coin qui va te faire décoller le palais, osti! J'te dis pas où, mais ça vaut la peine d'explorer!
            Ah, pis pour les amateurs de burgers, y'a un spot qui va te faire saliver comme un loup affamé! J'te laisse découvrir par toi-même, mon pote!
            Faque là, mon chum, prends ton hoodie, ton sens de l'humour et vas-y découvrir ces spots où tu risques de baver et de rire en même temps!
          </Marquee>
        </MarqueeContainer>
      </AppContainer>
      {showModal && (
        <InfoModal coffeeButtonPressed={coffeeButtonPressed} toggleModal={toggleModal} />
      )}
    </Wrapper>
  );
}


const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #282c34;
  background-image: url(https://uploads-ssl.webflow.com/62e3ee10882dc50bcae8d07a/631a5d4631d4c55a475f3e34_noise-50.png);
  background-size: 20%; 
`;

const AppContainer = styled.div`
  position: relative;
  height: 100%;
  width: 450px;
  background-color: #282c34;
  background-image: url(https://uploads-ssl.webflow.com/62e3ee10882dc50bcae8d07a/631a5d4631d4c55a475f3e34_noise-50.png);
  background-size: 20%;
  color: white;
  font-size: calc(10px + 2vmin);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 0 500px 50px #2e5bf390;
  border-left: 5px solid #2e5bf3;
  border-right: 5px solid #2e5bf3;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    padding: 0;
    border:none;
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  `;

const MapLink = styled.a`
  font-size: 1.2rem;
  color: #fff;
  text-decoration: none;
  background-color: #2e5bf3;
  padding: 20px 40px;
  border-radius: 50px;
  margin-top: 20px;
  border: 5px solid #6487fe;

  &:hover {
    transform: scale(1.1);
    transition: 200ms;
    filter: drop-shadow(5px 5px 25px #2e5bf3);
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 20px;
  filter: hue-rotate(318deg);
  border: 5px solid #cd77fa;
  border-radius: 5px;
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;

const FullScreenOverlay = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: linear-gradient(180deg, transparent 50%, #00000030 51%);
  background-size: 100% 4px;
  z-index: 10;
  pointer-events: none;
`;

const Main = styled.h2`
  font-size: 1.2rem;
  color: #fff;
  text-align: center;
  margin-bottom: 10px;
`;

const Sub = styled.p`
  font-size: 1rem;
  color: #fff;
  text-align: center;
`;

const MarqueeContainer = styled.div`
  border-bottom: 5px solid #2e5bf3;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;