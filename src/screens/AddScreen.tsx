import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Movie } from '../types/Movie';

type Props = NativeStackScreenProps<RootStackParamList, 'Add'>;

export default function AddScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Filme' | 'Série'>('Filme');
  const [rating, setRating] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !rating.trim() || !synopsis.trim()) {
      alert('Preencha todos os campos');
      return;
    }

    const newMovie: Movie = {
      id: Date.now().toString(),
      title: title.trim(),
      type,
      rating: parseFloat(rating),
      synopsis: synopsis.trim(),
      image: image || 'https://via.placeholder.com/300x400?text=Movie',
      comments: [],
      watched: false,
    };

    try {
      const stored = await AsyncStorage.getItem('cinelist_movies');
      const movies = stored ? JSON.parse(stored) : [];
      const updated = [...movies, newMovie];
      await AsyncStorage.setItem('cinelist_movies', JSON.stringify(updated));
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving movie:', error);
      alert('Erro ao salvar o filme');
    }
  };

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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Adicionar Filme/Série</Text>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={styles.imagePickerContainer}
              onPress={pickImage}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="image" size={48} color="#666666" />
                  <Text style={styles.imagePlaceholderText}>
                    Selecionar Imagem
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.formSection}>
              <Text style={styles.label}>Nome do Filme/Série</Text>
              <TextInput
                style={styles.input}
                placeholder="Título"
                placeholderTextColor="#666666"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Tipo</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'Filme' && styles.typeButtonActive,
                  ]}
                  onPress={() => setType('Filme')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === 'Filme' && styles.typeButtonTextActive,
                    ]}
                  >
                    Filme
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'Série' && styles.typeButtonActive,
                  ]}
                  onPress={() => setType('Série')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === 'Série' && styles.typeButtonTextActive,
                    ]}
                  >
                    Série
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Nota</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#666666"
                value={rating}
                onChangeText={setRating}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Sinopse</Text>
              <TextInput
                style={[styles.input, styles.synopsisInput]}
                placeholder="Descrição do filme/série"
                placeholderTextColor="#666666"
                value={synopsis}
                onChangeText={setSynopsis}
                multiline
                numberOfLines={5}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    bottom: -15,
  },
  backButton: {
    padding: 30,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  imagePickerContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#1B2029',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1B2029',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
  synopsisInput: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1B2029',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  typeButtonActive: {
    backgroundColor: '#C13C37',
    borderColor: '#C13C37',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#C13C37',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});