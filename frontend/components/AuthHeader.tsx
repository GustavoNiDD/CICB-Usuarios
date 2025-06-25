// Crie este arquivo dentro da pasta 'frontend/components'.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthHeaderProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

/**
 * Um cabeçalho padronizado para as telas de autenticação.
 */
const AuthHeader = ({ iconName, title, subtitle }: AuthHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name={iconName}
        size={80}
        color="#3b82f6"
        style={styles.logo}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default AuthHeader;

