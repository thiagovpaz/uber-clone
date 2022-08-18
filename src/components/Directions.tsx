import React from 'react';
import MapViewDirections, {
  MapDirectionsResponse,
} from 'react-native-maps-directions';
import Config from 'react-native-config';

interface DirectionsProps {
  origin?: { latitude: number; longitude: number };
  destination?: { latitude: number; longitude: number };
  onReady: (...args: MapDirectionsResponse[]) => void;
}

const Directions: React.FC<DirectionsProps> = ({
  origin,
  destination,
  onReady,
}) => {
  return (
    <MapViewDirections
      origin={origin}
      destination={destination}
      onReady={onReady}
      apikey={Config.GOOGLE_MAPS_API_KEY}
      strokeWidth={3}
      strokeColor="#222"
    />
  );
};

export { Directions };
