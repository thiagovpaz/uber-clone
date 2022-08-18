import React, { useState } from 'react';
import Config from 'react-native-config';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

interface SearchProps {
  onLocationSelect: (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => void;
}

const Search: React.FC<SearchProps> = ({ onLocationSelect }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <GooglePlacesAutocomplete
      placeholder="行き先を入力"
      onPress={onLocationSelect}
      query={{
        language: 'ja',
        key: Config.GOOGLE_MAPS_API_KEY,
      }}
      textInputProps={{
        autoCapitize: 'none',
        autoCorrect: false,
        onFocus: () => {
          setSearchFocused(true);
        },
        onBlur: () => {
          setSearchFocused(false);
        },
      }}
      listViewDisplayed={searchFocused}
      fetchDetails
      enablePoweredByContainer={false}
      styles={{
        container: {
          position: 'absolute',
          top: getStatusBarHeight() + 30,
          width: '100%',
        },
        textInputContainer: {
          flex: 1,
          backgroundColor: 'transparent',
          height: 54,
          marginHorizontal: 20,
        },
        textInput: {
          height: 54,
          borderRadius: 0,
          margin: 0,
          padding: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { x: 0, y: 0 },
          shadowRadius: 15,
          borderWidth: 1,
          borderColor: '#ddd',
          fontSize: 16,
        },
        listView: {
          borderWidth: 1,
          borderColor: '#ddd',
          backgroundColor: '#fff',
          marginHorizontal: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { x: 0, y: 0 },
          shadowRadius: 15,
        },
        description: {
          fontSize: 16,
        },
        row: {
          padding: 20,
        },
      }}
    />
  );
};

export { Search };
