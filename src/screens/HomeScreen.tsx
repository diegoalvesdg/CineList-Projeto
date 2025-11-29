import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MovieCard from '../components/MovieCard';
import { RootStackParamList } from '../App';
import { Movie } from '../types/Movie';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {
  const [movies, setMovies] = React.useState<Movie[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadMovies = async () => {
        try {
          const stored = await AsyncStorage.getItem('cinelist_movies');
          if (stored) {
            setMovies(JSON.parse(stored));
          }
        } catch (error) {
          console.error('Error loading movies:', error);
        }
      };

      loadMovies();
    }, [])
  );

  const handleDeleteMovie = async (movieId: string) => {
    const updatedMovies = movies.filter(m => m.id !== movieId);
    setMovies(updatedMovies);
    await AsyncStorage.setItem('cinelist_movies', JSON.stringify(updatedMovies));
  };

  const handleAddMovie = async (newMovie: Movie) => {
    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    await AsyncStorage.setItem('cinelist_movies', JSON.stringify(updatedMovies));
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>CineList</Text>
      </View>

      <FlatList
       
        data={movies}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('Details', { movieId: item.id })}
            onDelete={() => handleDeleteMovie(item.id)}
          />
        )}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Add')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={38} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111217',
  },
  
  title: {
    fontSize: 50,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 80,
    paddingBottom: 15,
    paddingTop: 50,
  },
  
  listContent: {
    margin: 15,
    paddingBottom: 40, 
  },
  fab: {
    position: 'absolute',
    marginTop: 70,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 28,
    backgroundColor: '#C13C37',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});