import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Launch'>;
};

export default function LaunchScreen({ navigation }: Props) {
  const { user, isLoading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const dest = user.role === 'nutritionist' ? 'NutritionistHome' : 'Home';
        navigation.reset({ index: 0, routes: [{ name: dest }] });
      } else {
        setChecked(true);
      }
    }
  }, [isLoading, user]);

  if (!checked) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#bef264" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/launch-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.greenOverlay} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              <Text style={styles.logoWhite}>food</Text>
              <Text style={styles.logoGreen}>ia</Text>
              <Text style={styles.logoWhite}>ry</Text>
            </Text>
          </View>

          <LinearGradient
            colors={['transparent', '#09090b']}
            style={styles.buttonsGradient}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('OnboardingGoal')}
            >
              <Text style={styles.primaryButtonText}>Criar Conta</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem conta?</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLink}>Acessar conta</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#65a30d',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  greenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#10b981',
    opacity: 0.1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 60,
    fontStyle: 'italic',
  },
  logoWhite: {
    color: '#fafafa',
  },
  logoGreen: {
    color: '#bef264',
  },
  buttonsGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#bef264',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181b',
    lineHeight: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '500',
    color: '#bef264',
    lineHeight: 24,
    paddingVertical: 14,
    paddingLeft: 4,
  },
});
