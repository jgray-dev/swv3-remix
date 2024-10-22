import React, { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';

interface LocationData {
  type: 'geolocator' | 'input';
  data: GeolocationPosition | string;
}

export default function LocationService() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const fetcher = useFetcher();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            type: 'geolocator',
            data: position,
          });
        },
        (err) => {
          setError(`Unable to retrieve your location. Please enter it manually. ${err}`);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  }, []);

  useEffect(() => {
    if (locationData) {
      fetcher.submit(
        { locationData: JSON.stringify(locationData) },
        { method: 'post' }
      );
    }
  }, [locationData]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocationData({
      type: 'input',
      data: manualInput,
    });
  };

  if (fetcher.state === 'submitting') {
    return <p>Submitting location data...</p>;
  }

  return (
    <div>
      {error && (
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter your location"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {!error && !locationData && <p>Retrieving your location...</p>}
    </div>
  );
}