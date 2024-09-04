'use client'
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.720000,
  lng: 71.750000
};

type LatLngLiteral = { lat: number; lng: number };

interface GoogleMapComponentProps {
  onLocationSelect: (location: LatLngLiteral) => void;
  selectedLocation: LatLngLiteral | null;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ onLocationSelect, selectedLocation }) => {

  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(null); // State to store marker position
  const [savedPosition, setSavedPosition] = useState<LatLngLiteral | null>(null); // State to store saved position

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key is missing.');
    return <div>Error: Google Maps API key is missing.</div>;
  }

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if(event){
      const clickedLatLng: LatLngLiteral = {
        lat: event.latLng!.lat(),
        lng: event.latLng!.lng(),
      };
      setMarkerPosition(clickedLatLng);
      onLocationSelect(clickedLatLng);
    }
  };

  // Handle save button click
  const handleSave = () => {
    if (markerPosition) {
      setSavedPosition(markerPosition);
      // Here you can make an API call or store the position in a database
      console.log('Saved position:', markerPosition);
    } else {
      console.log('No marker position to save.');
    }
  };

  return (
    <>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={9}
          onClick={handleMapClick} // Attach the click event handler
        >
          {selectedLocation && <Marker position={selectedLocation} />} {/* Display the marker */}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default GoogleMapComponent;