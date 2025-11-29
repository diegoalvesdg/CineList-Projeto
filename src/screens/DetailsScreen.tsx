import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Movie, Comment } from '../types/Movie';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ navigation, route }: Props) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const stored = await AsyncStorage.getItem('cinelist_movies');
        if (stored) {
          const movies: Movie[] = JSON.parse(stored);
          const found = movies.find(m => m.id === movieId);
          setMovie(found || null);
        }
      } catch (error) {
        console.error('Error loading movie:', error);
      }
      setLoading(false);
    };

    loadMovie();
  }, [movieId]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !movie) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: Date.now(),
    };

    const updatedMovie = {
      ...movie,
      comments: [newComment, ...movie.comments],
    };

    setMovie(updatedMovie);
    setCommentText('');

    try {
      const stored = await AsyncStorage.getItem('cinelist_movies');
      if (stored) {
        const movies: Movie[] = JSON.parse(stored);
        const updated = movies.map(m => m.id === movieId ? updatedMovie : m);
        await AsyncStorage.setItem('cinelist_movies', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!movie) return;

    const updatedMovie = {
      ...movie,
      comments: movie.comments.filter(c => c.id !== commentId),
    };

    setMovie(updatedMovie);

    try {
      const stored = await AsyncStorage.getItem('cinelist_movies');
      if (stored) {
        const movies: Movie[] = JSON.parse(stored);
        const updated = movies.map(m => m.id === movieId ? updatedMovie : m);
        await AsyncStorage.setItem('cinelist_movies', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleMarkAsWatched = async () => {
    if (!movie) return;

    const updatedMovie = {
      ...movie,
      watched: !movie.watched,
    };

    setMovie(updatedMovie);

    try {
      const stored = await AsyncStorage.getItem('cinelist_movies');
      if (stored) {
        const movies: Movie[] = JSON.parse(stored);
        const updated = movies.map(m => m.id === movieId ? updatedMovie : m);
        await AsyncStorage.setItem('cinelist_movies', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  if (loading || !movie) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>



          <View style={styles.content}>
            <Text style={styles.movieTitle}>{movie.title}</Text>

            <View style={styles.metaContainer}>
              <MaterialIcons name="star" size={18} color="#C13C37" />
              <Text style={styles.type}>{movie.type}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.rating}>{movie.rating}</Text>
              </View>
            </View>

            <Image
              source={{ uri: movie.image }}
              style={styles.movieImage}
            />

            <View style={styles.synopsisSection}>
              <Text style={styles.synopsisText}>{movie.synopsis}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.watchedButton,
                movie.watched && styles.watchedButtonActive,
              ]}
              onPress={handleMarkAsWatched}
            >
              <Text style={styles.watchedButtonText}>
                {movie.watched ? '✓ Assistido' : 'Marcar como assistido'}
              </Text>
            </TouchableOpacity>

            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>Comentários</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Escreva seu comentário..."
                  placeholderTextColor="#666666"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleAddComment}
                >
                  <MaterialIcons name="send" size={20} color="#C13C37" />
                </TouchableOpacity>
              </View>

              <View style={styles.commentsList}>
                {movie.comments.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <TouchableOpacity
                      style={styles.deleteCommentButton}
                      onPress={() => handleDeleteComment(comment.id)}
                    >
                      <MaterialIcons name="delete" size={16} color="#C13C37" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111217',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
  },

  movieTitle: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 30,
  },

  movieImage: {
    marginLeft: 65,
    marginBottom: 20,
    width: '65%',
    height: 350,
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  metaContainer: {
    left: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 16
  },
  type: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  ratingBadge: {
    backgroundColor: '#C13C37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  synopsisSection: {
    marginBottom: 20,
  },
  synopsisText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    fontWeight: '400',
  },
  watchedButton: {
    borderWidth: 1,
    borderColor: '#C13C37',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  watchedButtonActive: {
    backgroundColor: '#C13C37',
  },
  watchedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  commentsSection: {
    marginBottom: 20,
  },
  commentsHeader: {
    marginBottom: 12,
  },
  commentsTitle: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#1B2029',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    padding: 10,
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    flexDirection: 'row',
    backgroundColor: '#1B2029',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
  },
  commentText: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  deleteCommentButton: {
    padding: 4,
    marginLeft: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});