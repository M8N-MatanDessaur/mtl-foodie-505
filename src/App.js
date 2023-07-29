import React, { useState, useEffect, useCallback } from 'react';
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
import RandomizerButton from './Components/RandomizerButton';
import InfoModal from './Components/InfoModal';

import useGeolocation from './Hooks/useGeolocation';

export default function App() {
  // Cookies
  const cookies = new Cookies();
  const cookieOptions = {
    sameSite: 'none',
    secure: true
  };
  cookies.set('cookieName', 'cookieValue', cookieOptions);

  // State
  const [randomRestaurant, setRandomRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [localized, setLocalized] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [navMode, setNavMode] = useState({mode: 'driving', level: '2'}); 
  const [radius, setRadius] = useState(10000);
  const [description, setDescription] = useState('');
  const [mainText, setMainText] = useState('');
  const [subText, setSubText] = useState('');


  // GPT DESCRIPTION
  const fetchDescription = async (restaurantName) => {
    try {
      const response = await fetch(`/.netlify/functions/fetch-description?name=${restaurantName}&language=en`);
      const data = await response.json();
      if (data && data.description) {
        setDescription(data.description);
      } else {
        setDescription(`Asteur écoute icitte, j'ai des spots de bouffe qui vont t'en faire glousser dans ton p'tit bedon! T'as l'estomac qui crie pour une poutine à te faire baver dans ton hoodie? Pas d'soucis, mon chum! Y'a des places pour ça, j'te dis! Pis si t'es plutôt d'humeur pour du smoked meat tendre à te faire fondre l'coeur, y'a des endroits pour ça aussi, crissement!
        Et pour ceux qui aiment les fruits de mer, y'a un coin qui va te faire décoller le palais, osti! J'te dis pas où, mais ça vaut la peine d'explorer!
        Ah, pis pour les amateurs de burgers, y'a un spot qui va te faire saliver comme un loup affamé! J'te laisse découvrir par toi-même, mon pote!
        Faque là, mon chum, prends ton hoodie, ton sens de l'humour et vas-y découvrir ces spots où tu risques de baver et de rire en même temps!`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchMainText = async => {
    const response = await fetch(`/.netlify/functions/fetch-main-text?language=en`);
    const data = await response.json();
      if (data && data.mainText) {
        setMainText(data.mainText);
      } else {
        setMainText(`Press on the button ▷ to randomly choose where to eat!`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSubText = async => {
    const response = await fetch(`/.netlify/functions/fetch-sub-text?language=en`);
    const data = await response.json();
      if (data && data.subText) {
        setSubText(data.subText);
      } else {
        setSubText(`There's an abundance of food here! There are all kinds of restaurants and snack bars that will make you drool to the point of holding back the drool from your chin!`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Audio
  const audio = new Audio(buttonSound);
  const audio2 = new Audio(buttonSoundAlt);
  const audio3 = new Audio(buttonSoundGo);

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

  // useGeolocation hook to get the user's location
  const { currentLocation, userLocation, rememberLocation, getLocation } = useGeolocation();


  // Choose a random restaurant
  const pickRandomRestaurantCallback = useCallback(async () => {

    // Get current location
    getLocation();

    // Prevent spamming the button
    if (loading || countdown > 0) {
      return;
    }

    // Countdown animation
    let countdownValue = 3;
    setCountdown(countdownValue);
    const countdownInterval = setInterval(() => {
      countdownValue--;
      if (countdownValue === 0) {
        clearInterval(countdownInterval);
        setCountdown(0);
      } else {
        setCountdown(countdownValue);
      }
    }, 400);

    mainButtonPressed();
    setLoading(true);

    // Fetch restaurants data from Google Places API via Netlify Function
    try {
      const response = await fetch(`/.netlify/functions/getPlaces?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&radius=${radius}&type=restaurant|cafe|bar|bakery|bistro|buffet|diner|food_court|pizza|ice_cream|fast_food|fine_dining|breakfast|brunch|lunch|dinner|pub|taco|steakhouse|sushi|bbq|vegetarian|food_truck|haitian|creole|indian|chinese|italian|mexican|greek|thai|seafood|burger|dessert|ramen|french|spanish|mediterranean|korean|vietnamese|american|german|middle_eastern|caribbean|peruvian|brazilian|ethiopian|vegan|gluten_free|japanese&key=AIzaSyAmNrNmvYsOCOp5rsSOI4cYDpALlHBetGQ`);
      const data = await response.json();

      // Check if results are available
      if (data.results.length > 0) {
        // Pick a random restaurant
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomRestaurant = data.results[randomIndex];

        // Create a link to the restaurant on Google Maps
        let mapUrl = `https://www.google.com/maps/embed/v1/directions?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=place_id:${randomRestaurant.place_id}&mode=${navMode.mode}&&key=AIzaSyAmNrNmvYsOCOp5rsSOI4cYDpALlHBetGQ`;
        let openLink;

        if (/(android|iphone|ipad)/i.test(navigator.userAgent)) {
          // If on mobile, open the place in the Google Maps app
          const name = encodeURIComponent(randomRestaurant.name);
          const address = encodeURIComponent(randomRestaurant.vicinity);
          openLink = `https://maps.google.com/maps?q=${name}, ${address}`;
        } else {
          // If on desktop or other devices, open the place in the web browser
          openLink = `https://www.google.com/maps?q=${randomRestaurant.name}, ${randomRestaurant.geometry.location.lat},${randomRestaurant.geometry.location.lng}, ${randomRestaurant.vicinity}`;
        }

        // Create map container
        const mapContainer = (
          <MapContainer>
            <MapFrame src={mapUrl} allowFullScreen></MapFrame>
          </MapContainer>
        );

        setRandomRestaurant({
          ...randomRestaurant,
          mapContainer,
          mapUrl,
          openLink,
        });
        fetchDescription(randomRestaurant.name)
        setTimeout(() => {
          setLoading(false);  // Data has been loaded, stop loading
        }, 1000);
      } else {
        setRandomRestaurant(null);
        toast('No restaurants found. Try changing the radius or disabling localization.', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '18px',
          },
        });
        setTimeout(() => {
          setLoading(false);  // Data has been loaded, stop loading
        }, 1000);
      }
    } catch (error) {
      console.error(`Error while fetching data from Google Places API: ${error}`);
      setLoading(false);  // Error occurred, stop loading
    }
  }, [currentLocation, loading, countdown, setLoading, setCountdown, mainButtonPressed, getLocation]);

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

  const changeNavMode = (mode, level) => {
    setNavMode({mode, level});

    // If a random restaurant is picked, update the mapUrl with the new navMode
    if (randomRestaurant) {
      const mapUrl = `https://www.google.com/maps/embed/v1/directions?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=place_id:${randomRestaurant.place_id}&mode=${mode}&key=AIzaSyAmNrNmvYsOCOp5rsSOI4cYDpALlHBetGQ`;

      // Update the randomRestaurant state with the new mapUrl
      setRandomRestaurant(prevRandomRestaurant => {
        const updatedRandomRestaurant = {
          ...prevRandomRestaurant,
          mapUrl,
        };
        return updatedRandomRestaurant;
      });
    }
  };

  const handleNavModeChange = (mode, level) => {
    coffeeButtonPressed();
    mode === 'driving' && level === '2' ? setRadius(12000)
      : mode === 'bicycling' && level === '2' ? setRadius(5000)
        : mode === 'walking' && level === '2' ? setRadius(1500)
          : mode === 'walking' && level === '1' ? setRadius(250)
            : setRadius(10000);
    changeNavMode(mode, level);
  };

  return (
    <Wrapper>
      <AppContainer>
        <TopBar toggleModal={toggleModal} setRandomRestaurant={setRandomRestaurant} />
        <ScanlineScreen>
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff', fontSize: '16px' } }} />
          <ScanlineScreenLoadingOverlay loading={loading} />
          <FullScreenOverlay />
          <NavModeChange>
            <NavModeButton onClick={() => handleNavModeChange('walking', '1')} active={navMode.mode === 'walking' && navMode.level==='1'} ><svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill='white'>
              <path fill-rule="evenodd" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7Zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 12 4Zm-4 7.85c.86 1.3 2.33 2.15 4 2.15s3.14-.85 4-2.15c-.02-1.32-2.67-2.05-4-2.05s-3.98.73-4 2.05Z" clip-rule="evenodd"></path>
            </svg></NavModeButton>
            <NavModeButton onClick={() => handleNavModeChange('walking', '2')} active={navMode.mode === 'walking' && navMode.level==='2'} ><svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill='white'>
              <path d="M13 5.25c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm-3.7 3.4-2.8 14.1h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6a2.145 2.145 0 0 0-2.65-.84L5.5 8.05v4.7h2v-3.4l1.8-.7Z"></path>
            </svg></NavModeButton>
            <NavModeButton onClick={() => handleNavModeChange('bicycling', '2')} active={navMode.mode === 'bicycling' && navMode.level==='2'}><svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill='white'>
              <path fill-rule="evenodd" d="M17.5 3.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2ZM0 17c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5Zm5 3.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5ZM19.1 11c-2.1 0-3.8-.8-5.1-2.1l-.8-.8-2.4 2.4 2.2 2.3V19h-2v-5l-3.2-2.8c-.4-.3-.6-.8-.6-1.4 0-.5.2-1 .6-1.4l2.8-2.8c.3-.4.8-.6 1.4-.6.6 0 1.1.2 1.6.6l1.9 1.9c.9.9 2.1 1.5 3.6 1.5v2Zm-.1 1c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5Zm-3.5 5c0 1.9 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5-3.5 1.6-3.5 3.5Z" clip-rule="evenodd"></path>
            </svg></NavModeButton>
            <NavModeButton onClick={() => handleNavModeChange('driving', '2')} active={navMode.mode === 'driving' && navMode.level==='2'}><svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill='white'>
              <path fill-rule="evenodd" d="M17.5 4c.66 0 1.22.42 1.42 1.01L21 11v8c0 .55-.45 1-1 1h-1c-.55 0-1-.45-1-1v-1H6v1c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-8l2.08-5.99C5.29 4.42 5.84 4 6.5 4h11ZM5 13.5c0 .83.67 1.5 1.5 1.5S8 14.33 8 13.5 7.33 12 6.5 12 5 12.67 5 13.5ZM17.5 15c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Zm-11-9.5L5 10h14l-1.5-4.5h-11Z" clip-rule="evenodd"></path>
            </svg></NavModeButton>
          </NavModeChange>
          {/* If a restaurant was picked show the mapContainer & Frame if not show the welcome message */}
          {randomRestaurant ? (
            <>
              {randomRestaurant.mapContainer}
              <MapLink href={randomRestaurant.openLink} target="_blank" rel="noopener noreferrer">{randomRestaurant.name}</MapLink>
            </>
          ) : (
            <>
              <Main>
                {mainText}
              </Main>
              <Sub>
                {subText}
              </Sub>
            </>
          )}

        </ScanlineScreen>
        <ButtonWrapper>
          <RandomizerButton pickRandomRestaurant={pickRandomRestaurantCallback} currentLocation={currentLocation} countdown={countdown} />
        </ButtonWrapper>
        <MarqueeContainer>

          {randomRestaurant ? (
            <Marquee speed={100}>
              {description}
            </Marquee>
          ) : (
            <Marquee>
              Asteur écoute icitte, j'ai des spots de bouffe qui vont t'en faire glousser dans ton p'tit bedon! T'as l'estomac qui crie pour une poutine à te faire baver dans ton hoodie? Pas d'soucis, mon chum! Y'a des places pour ça, j'te dis! Pis si t'es plutôt d'humeur pour du smoked meat tendre à te faire fondre l'coeur, y'a des endroits pour ça aussi, crissement!
              Et pour ceux qui aiment les fruits de mer, y'a un coin qui va te faire décoller le palais, osti! J'te dis pas où, mais ça vaut la peine d'explorer!
              Ah, pis pour les amateurs de burgers, y'a un spot qui va te faire saliver comme un loup affamé! J'te laisse découvrir par toi-même, mon pote!
              Faque là, mon chum, prends ton hoodie, ton sens de l'humour et vas-y découvrir ces spots où tu risques de baver et de rire en même temps!
            </Marquee>
          )}

        </MarqueeContainer>
      </AppContainer>
      {
        showModal && (
          <InfoModal coffeeButtonPressed={coffeeButtonPressed} toggleModal={toggleModal} />
        )
      }
    </Wrapper >
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
  font-size: 1rem;
  width: 100%;
  color: #fff;
  text-decoration: none;
  background-color: #2e5bf3;
  padding: 20px 40px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 5px solid #6487EF;
  border-top: none;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 75%;
  filter: hue-rotate(318deg);
  border: 5px solid #cd77fa;
  border-bottom: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
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

const Explication = styled.div`
  font-size: 0.8rem;
  color: #fff;
  text-align: left;
  margin-top: 35px;
  line-height: 1.2rem;
  padding: 10px 20px;
  background-color: #2e5bf3f0;
  border-radius: 15px;
  border: 5px solid #6487fe;

  p {
    margin-bottom: 10px;
  }

  span {
    display: inline-block;
    margin-left: 1px;
    margin-right: 1px;
    vertical-align: middle;
  }

  svg {
    fill: #fff;
    vertical-align: middle;
  }
`;

const NavModeChange = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

const NavModeButton = styled.button`
  font-size: 1rem;
  height: 30px;
  width: 30px;
  color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  padding: 5px 5px;
  background-color: ${props => props.active ? '#2e5bf3' : '#363636'};
  border: 1px solid #6487fe;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #2e5bf3;
  }

  &:active {
    background-color: #363636;
  }
`;

const MarqueeContainer = styled.div`
  border-bottom: 5px solid #2e5bf3;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: inherit;
`;
