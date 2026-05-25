import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider } from '../../contexts/UserContext';
import HomeScreen from '../main/HomeScreen';
import PublicProfileScreen from './PublicProfileScreen';
import PrivateProfileScreen from './PrivateProfileScreen';

export default function DevProfileFlow() {
  // Upgraded router state to hold parameters
  const [navState, setNavState] = useState({ screen: 'Menu', params: {} });

  const navigate = (screen, params = {}) => {
    setNavState({ screen, params });
  };

  const renderScreen = () => {
    switch (navState.screen) {
      case 'Home':
        return <HomeScreen />;
      case 'PublicProfile':
        return <PublicProfileScreen isPreview={navState.params?.isPreview} navigate={navigate} />;
      case 'PrivateProfile':
        return <PrivateProfileScreen navigate={navigate} />;
      default:
        return (
          <SafeAreaView style={styles.devMenuContainer}>
            <Text style={styles.devMenuTitle}>Dev Directory</Text>
            
            <TouchableOpacity style={[styles.devButton, { flexDirection: 'row', gap: 8 }]} onPress={() => navigate('Home')}>
              <Ionicons name="home-outline" size={18} color="#FFF" />
              <Text style={styles.devButtonText}>Go to Home Screen</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.devButton, { flexDirection: 'row', gap: 8 }]} onPress={() => navigate('PublicProfile')}>
              <Ionicons name="person-outline" size={18} color="#FFF" />
              <Text style={styles.devButtonText}>Go to Public Profile (Seller View)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.devButton, { flexDirection: 'row', gap: 8 }]} onPress={() => navigate('PrivateProfile')}>
              <Ionicons name="settings-outline" size={18} color="#FFF" />
              <Text style={styles.devButtonText}>Go to Private Profile</Text>
            </TouchableOpacity>
          </SafeAreaView>
        );
    }
  };

  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        {renderScreen()}
        
        {navState.screen !== 'Menu' && (
          <TouchableOpacity 
            style={styles.floatingBackBtn} 
            onPress={() => navigate('Menu')}
          >
            <Ionicons name="arrow-back" size={14} color="#FFF" />
            <Text style={styles.floatingBackText}> Dev Menu</Text>
          </TouchableOpacity>
        )}
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  devMenuContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  devMenuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  devButton: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  devButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingBackBtn: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingBackText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});