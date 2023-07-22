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
import RadiusSlider from './Components/RadiusSlider';

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
  const [userLocation, setUserLocation] = useState(null);

  const [randomRestaurant, setRandomRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changeMode, setChangeMode] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [localized, setLocalized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [radius, setRadius] = useState(2); // Radius in kilometers

  // Audio
  const audio = new Audio(buttonSound);
  const audio2 = new Audio(buttonSoundAlt);
  const audio3 = new Audio(buttonSoundGo);

  let watchId;

const getLocation = () => {
    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
            },
            (error) => {
                toast.error('Error getting current location', error);
                setCurrentLocation(null);
            }
        );
    } else {
        toast.error('Geolocation is not supported by your browser');
        setCurrentLocation(null);
    }
}


useEffect(() => {
    getLocation();
    // Cleanup function to stop watching the user's location when the component is unmounted
    return () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
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

  async function getDirectionsDistanceKm(originLat, originLng, destinationLat, destinationLng) {
    const apiKey = 'AIzaSyBu0MZ1OGyDCbamYAJH24STXOLYJRt3YAo';
    const origin = `${originLat},${originLng}`;
    const destination = `${destinationLat},${destinationLng}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}&mode=walking&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching walking distance data');
      }
      const data = await response.json();
      if (data.status !== 'OK') {
        throw new Error('Error calculating walking distance');
      }
      const distanceInMeters = data.routes[0].legs[0].distance.value;
      const distanceInKm = distanceInMeters / 1000;
      return distanceInKm;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // Pick a random restaurant from the list
  const pickRandomRestaurant = async () => {
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
        setLoading(false);
      } else {
        setCountdown(countdownValue);
      }
    }, 400);

    mainButtonPressed();
    setLoading(true);

    // Filter restaurant list based on the 'localized' value and 'radius'
    let restaurantList = RestaurantList;
    if (localized && currentLocation) {
      restaurantList = RestaurantList.filter((restaurant) => {
        const restaurantLocation = {
          latitude: parseFloat(restaurant.Latitude),
          longitude: parseFloat(restaurant.Longitude),
        };
   
        const dist = haversineDistance(currentLocation, restaurantLocation);
        const radiusF = parseFloat(radius);
        const distInKm = dist.toFixed(2);

        return distInKm <= radiusF && distInKm > 0;
      });
    }

    // Proceed if we have a filtered restaurant list
    if (restaurantList.length > 0) {
      // Pick a random restaurant
      const randomIndex = Math.floor(Math.random() * restaurantList.length);
      const randomRestaurant = restaurantList[randomIndex];

      // Create a link to the restaurant on Google Maps
      let mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
        randomRestaurant.name
      )},montréal&key=AIzaSyBu0MZ1OGyDCbamYAJH24STXOLYJRt3YAo`;
      let mapUrlLocalized = '';
      if (currentLocation) {
        mapUrlLocalized = `https://www.google.com/maps/embed/v1/directions?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${encodeURIComponent(
          randomRestaurant.name
        )},montréal&mode=driving&key=AIzaSyBu0MZ1OGyDCbamYAJH24STXOLYJRt3YAo`;
      }
      const mapContainer = (
        <MapContainer>
          {localized ? (
            <MapFrame src={mapUrlLocalized} allowFullScreen></MapFrame>
          ) : (
            <MapFrame src={mapUrl} allowFullScreen></MapFrame>
          )}
        </MapContainer>
      );

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

      toast('Aucun restaurant trouvé. Essayez de changer de rayon ou de désactiver la localisation.', {
        duration: 5000, // Duration of the toast display in milliseconds
        position: 'top-center', // Toast position on the screen
        style: {
          background: '#363636', // Toast background color
          color: '#fff', // Toast text color
          fontSize: '18px', // Toast text font size
        },
      });
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  

  // Haversine distance function
  const haversineDistance = (coords1, coords2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(coords2.latitude - coords1.latitude);
    const dLng = deg2rad(coords2.longitude - coords1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coords1.latitude)) * Math.cos(deg2rad(coords2.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c; // Distance in km
    return dist;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
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

  const toggleRad = (value) => {
    coffeeButtonPressed();
    setRadius(value);
  };



  return (
    <Wrapper>
      <AppContainer>
        <TopBar toggleModal={toggleModal} setRandomRestaurant={setRandomRestaurant} />
        <ScanlineScreen>
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff', fontSize: '16px' } }} />
          <ScanlineScreenLoadingOverlay loading={loading} />
          <ScanlineScreenLocalisationModeOverlay changeMode={changeMode} radius={radius} localized={localized} />
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
              {currentLocation !== null && (
                <Explication>
                  <p>Si tu veux que j'te trouve un spot à proximité, appuis sur le pitton <span><svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M5 9c0-3.87 3.13-7 7-7s7 3.13 7 7c0 5.25-7 13-7 13S5 14.25 5 9Zm4.5 0a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0-5 0Z" clip-rule="evenodd"></path>
                  </svg></span> pour activer la localisation.</p>
                  <p>Glisse le slider pour changer le radius de proximité, c'est aussi simple que ça !</p>
                </Explication>
              )}
            </>
          )}
          {localized && (
            <RadiusSlider radius={radius} localized={localized} toggleRad={toggleRad} />
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


const MarqueeContainer = styled.div`
  border-bottom: 5px solid #2e5bf3;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;