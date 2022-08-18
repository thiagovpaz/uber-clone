import React, { useEffect, useState, useCallback, useRef } from 'react';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import Config from 'react-native-config';
import MapView, { Marker } from 'react-native-maps';
import {
  PermissionsAndroid,
  Platform,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { Search } from './Search';
import { Directions } from './Directions';
import { Details } from './Details';

import markerImage from '../assets/marker.png';
import backImage from '../assets/back.png';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Destination {
  latitude: number;
  longitude: number;
  title: string;
}

Geocoder.init(Config.GOOGLE_MAPS_API_KEY);

const Map: React.FC = () => {
  const mapViewRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region | undefined>();
  const [destination, setDestination] = useState<Destination | undefined>();
  const [duration, setDuration] = useState(0);
  const [location, setLocation] = useState('');

  const requestLocation = useCallback(async () => {
    let granted = false;

    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse').then(response => {
        granted = response === 'granted';
      });
    }

    if (Platform.OS === 'android') {
      try {
        const isGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        granted = isGranted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log(err);
      }
    }
    if (granted) {
      Geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;

          const response = await Geocoder.from(latitude, longitude);
          const address = response.results[0].formatted_address;

          setLocation(address.substring(0, address.indexOf(',')));

          setRegion({
            ...coords,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  }, []);

  const handleLocationSelected = useCallback(
    async (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      if (details) {
        const {
          location: { lat: latitude, lng: longitude },
        } = details?.geometry;

        setDestination({
          longitude,
          latitude,
          title: data.structured_formatting.main_text,
        });
      }
    },
    [],
  );

  const handleBack = () => {
    setDestination(undefined);

    mapViewRef.current?.animateToRegion(region!);
  };

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.mapContainer}
        region={region}
        initialRegion={region}
        showsUserLocation={!destination}
        loadingEnabled>
        {destination && (
          <>
            <Directions
              origin={region}
              destination={destination}
              onReady={result => {
                setDuration(Math.floor(result.duration));

                mapViewRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: RFValue(120),
                    left: RFValue(50),
                    right: RFValue(50),
                    bottom: RFValue(50),
                  },
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}>
              <View style={styles.locationBox}>
                <Text style={styles.locationText}>{destination.title}</Text>
              </View>
            </Marker>
            <Marker
              image={markerImage}
              coordinate={region!}
              anchor={{ x: 0, y: 0 }}>
              <View style={styles.locationBox}>
                <View style={styles.locationTimeBox}>
                  <Text style={styles.locationTimeBoxTitle}>{duration}</Text>
                  <Text style={styles.locationTimeBoxDescription}>分</Text>
                </View>
                <Text style={styles.locationText}>{location}</Text>
              </View>
            </Marker>
          </>
        )}
      </MapView>
      {destination ? (
        <>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image
              style={styles.backButtonImage}
              source={backImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Details duration={duration} />
        </>
      ) : (
        <Search onLocationSelect={handleLocationSelected} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: { flex: 1 },
  locationBox: {
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 0 },
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    flexDirection: 'row',
    marginTop: 20,
  },
  locationText: {
    marginVertical: 8,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  locationTimeBox: {
    backgroundColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  locationTimeBoxTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  locationTimeBoxDescription: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: getStatusBarHeight() + 20,
    left: 20,
    backgroundColor: '#fff',
    padding: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  backButtonImage: {
    width: 18,
    height: 18,
  },
});

export { Map };
