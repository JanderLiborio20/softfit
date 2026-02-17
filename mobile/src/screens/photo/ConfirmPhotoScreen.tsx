import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoConfirm'>;
  route: RouteProp<RootStackParamList, 'PhotoConfirm'>;
};

export default function ConfirmPhotoScreen({ navigation, route }: Props) {
  const { photoUri } = route.params;

  return (
    <View style={styles.container}>
      {/* Photo preview */}
      <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />

      {/* Dark overlay at top */}
      <SafeAreaView style={styles.topOverlay} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerIcon}>{'✕'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirmar foto</Text>
          <View style={styles.headerButton} />
        </View>
      </SafeAreaView>

      {/* Bottom actions */}
      <SafeAreaView style={styles.bottomOverlay} edges={['bottom']}>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.retakeIcon}>{'↻'}</Text>
            <Text style={styles.retakeText}>Tirar outra</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() =>
              navigation.navigate('PhotoAnalyzing', { photoUri })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.confirmText}>Usar foto</Text>
            <Text style={styles.confirmArrow}>{'→'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 20,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  retakeIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
  retakeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#bef264',
    borderRadius: 14,
    paddingVertical: 16,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181b',
  },
  confirmArrow: {
    fontSize: 18,
    color: '#18181b',
  },
});
