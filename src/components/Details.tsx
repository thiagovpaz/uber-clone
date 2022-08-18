import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import uberx from '../assets/uberx.png';

interface DetailsProps {
  duration: number;
}

const Details: React.FC<DetailsProps> = ({ duration }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>エコノミー</Text>
      <Text style={styles.description}> {duration}分 がかかります。</Text>
      <Image source={uberx} style={styles.image} />
      <Text style={styles.title}>UberX</Text>
      <Text style={styles.title}>¥28,700</Text>
      <TouchableOpacity style={styles.requestButton}>
        <Text style={styles.requestButtonText}>UBERXを依頼する</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 300,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 0 },
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#222',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    height: 80,
    marginVertical: 10,
  },
  requestButton: {
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 44,
    marginTop: 10,
  },
  requestButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export { Details };
