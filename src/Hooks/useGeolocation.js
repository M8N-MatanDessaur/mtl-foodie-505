import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useGeolocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [rememberLocation, setRememberLocation] = useState(false);

  let watchId = null;

  const getLocation = useCallback((locationCallback) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          // Call the callback with the updated location
          if (locationCallback) {
            locationCallback({ latitude, longitude });
          }
          // If userLocation preference is true, update the user's location in localStorage
          if (rememberLocation) {
            setUserLocation({ latitude, longitude });
            localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
          }
          // Once we have the initial location, switch to watching for continuous updates
          if (!watchId) {
            watchId = navigator.geolocation.watchPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
                // Call the callback with the updated location
                if (locationCallback) {
                  locationCallback({ latitude, longitude });
                }
                // If userLocation preference is true, update the user's location in localStorage
                if (rememberLocation) {
                  setUserLocation({ latitude, longitude });
                  localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
                }
              },
              (error) => {
                toast.error('Error watching current location', error);
                setCurrentLocation(null);
              }
            );
          }
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
  }, [rememberLocation]);

  useEffect(() => {
    // Check if there's a stored user location preference in localStorage
    const storedLocationPref = localStorage.getItem('rememberLocation');
    if (storedLocationPref !== null) {
      setRememberLocation(JSON.parse(storedLocationPref));
    }
    getLocation();
    // Cleanup function to stop watching the user's location when the component is unmounted
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };
  }, [getLocation]);

  useEffect(() => {
    // If the userLocation preference is true, get the stored user location from localStorage
    if (rememberLocation) {
      const storedUserLocation = localStorage.getItem('userLocation');
      if (storedUserLocation !== null) {
        setUserLocation(JSON.parse(storedUserLocation));
      }
    }
  }, [rememberLocation]);

  return { currentLocation, userLocation, rememberLocation, getLocation };
};

export default useGeolocation;
