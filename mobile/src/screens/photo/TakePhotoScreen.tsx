import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoTake'>;
};

export default function TakePhotoScreen({ navigation }: Props) {
  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('PhotoConfirm', { photoUri: result.assets[0].uri });
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('PhotoConfirm', { photoUri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeIcon}>{'✕'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tirar Foto</Text>
          <View style={styles.closeButton} />
        </View>
      </SafeAreaView>

      {/* Camera preview area */}
      <View style={styles.cameraArea}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraPlaceholderIcon}>{'📷'}</Text>
          <Text style={styles.cameraPlaceholderText}>
            Aponte a câmera para sua refeição
          </Text>
        </View>
      </View>

      {/* Bottom controls */}
      <SafeAreaView style={styles.bottomArea} edges={['bottom']}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handlePickFromGallery}
            activeOpacity={0.7}
          >
            <Text style={styles.galleryIcon}>{'🖼'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePhoto}
            activeOpacity={0.8}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <View style={styles.galleryButton} />
        </View>

        <Text style={styles.hintText}>Tirar Foto</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  cameraArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    gap: 16,
  },
  cameraPlaceholderIcon: {
    fontSize: 64,
  },
  cameraPlaceholderText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  bottomArea: {
    paddingBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryIcon: {
    fontSize: 24,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  captureInner: {
    flex: 1,
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  hintText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    paddingBottom: 8,
  },
});
