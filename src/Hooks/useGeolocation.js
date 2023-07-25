import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useGeolocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [rememberLocation, setRememberLocation] = useState(false);

  let watchId = null;

  const updateLocation = useCallback((position, locationCallback) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({ latitude, longitude });

    if (locationCallback) {
      locationCallback({ latitude, longitude });
    }

    if (rememberLocation) {
      setUserLocation({ latitude, longitude });
      localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
    }
  }, [rememberLocation]);

  const handleError = useCallback((error, message) => {
    toast.error(message, error);
    setCurrentLocation(null);
  }, []);

  const getLocation = useCallback((locationCallback) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => updateLocation(position, locationCallback),
        (error) => handleError(error, 'Error getting current location')
      );

      if (!watchId) {
        watchId = navigator.geolocation.watchPosition(
          (position) => updateLocation(position, locationCallback),
          (error) => handleError(error, 'Error watching current location')
        );
      }
    } else {
      toast.error('Geolocation is not supported by your browser');
      setCurrentLocation(null);
    }
  }, [updateLocation, handleError]);

  useEffect(() => {
    const storedLocationPref = localStorage.getItem('rememberLocation');
    if (storedLocationPref !== null) {
      setRememberLocation(JSON.parse(storedLocationPref));
    }

    getLocation();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };
  }, [getLocation]);

  useEffect(() => {
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
