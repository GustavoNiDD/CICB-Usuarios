// Crie este arquivo dentro da pasta 'frontend/components'.

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialAuthButtonProps {
  provider: 'Google'; // Futuramente podemos adicionar 'Apple', 'Facebook', etc.
  onPress: () => void;
}

/**
 * Um botão específico para autenticação com provedores sociais.
 */
const SocialAuthButton = ({ provider, onPress }: SocialAuthButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="logo-google" size={24} color="#4285F4" />
      <Text style={styles.buttonText}>Continuar com o {provider}</Text>
      <View style={{ width: 24 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginTop: 16,
  },
  buttonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SocialAuthButton;
