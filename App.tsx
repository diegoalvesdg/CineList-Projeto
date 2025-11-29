import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import AddScreen from './src/screens/AddScreen';
import { Movie } from './src/types/Movie';
import { initialMovies } from './src/data/movies';

export type RootStackParamList = {
  Home: undefined;
  Details: { movieId: string };
  Add: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const stored = await AsyncStorage.getItem('cinelist_movies');
        if (stored) {
          setMovies(JSON.parse(stored));
        } else {
          setMovies(initialMovies);
          await AsyncStorage.setItem('cinelist_movies', JSON.stringify(initialMovies));
        }
      } catch (error) {
        console.error('Error loading movies:', error);
        setMovies(initialMovies);
      }
      setLoaded(true);
    };

    loadMovies();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#111217' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ movies, setMovies }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          initialParams={{ movies, setMovies }}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          initialParams={{ movies, setMovies }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}