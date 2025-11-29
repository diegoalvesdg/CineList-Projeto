import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Movie } from '../types/Movie';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  onDelete: () => void;
}

export default function MovieCard({ movie, onPress, onDelete }: MovieCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: movie.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>

        <View style={styles.metaContainer}>
          <Text style={styles.type}>{movie.type}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <MaterialIcons name="delete" size={25} color="#C13C37" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1B2029',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingRight: 12,
    height: 200,
    alignItems: 'center',
    position: 'relative'
  },
  image: {
    width: 100,
    height: 180,
    left: 15,
    marginRight: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 8,
    bottom: 30,
    left: 20.
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  type: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
    top: 27,
    left: 20
  },
  deleteButton: {
    top: 65,     
    right: 25,
    padding: 6,
  },

});