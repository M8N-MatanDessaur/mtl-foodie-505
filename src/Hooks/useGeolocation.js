import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useGeolocation = () => {
  const [location, setLocation] = useState({
    current: JSON.parse(localStorage.getItem('currentLocation')) || null,
    user: JSON.parse(localStorage.getItem('userLocation')) || null,
  });

  const handlePosition = useCallback(position => {
    const { latitude, longitude } = position.coords;
    const newLocation = { latitude, longitude };

    setLocation(prevState => ({ ...prevState, current: newLocation, user: newLocation }));
    localStorage.setItem('currentLocation', JSON.stringify(newLocation));
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  }, []);

  const handleError = useCallback(error => {
    toast.error(`Error: ${error.message}`);
    setLocation(prevState => ({ ...prevState, current: null }));
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    const options = { enableHighAccuracy: true, maximumAge: 0 }; // No timeout option
    navigator.geolocation.getCurrentPosition(handlePosition, handleError, options);
  }, [handlePosition, handleError]);

  useEffect(() => {
    getLocation();
    const watchId = navigator.geolocation.watchPosition(handlePosition, handleError);

    return () => navigator.geolocation.clearWatch(watchId);
  }, [getLocation, handlePosition, handleError]);

  return { ...location, getLocation };
};

export default useGeolocation;
