// Crie este arquivo dentro da pasta 'frontend/components'.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  href: any; // A 'href' do Link do Expo Router
}

/**
 * Um link de rodapé reutilizável para as telas de autenticação.
 */
const AuthFooterLink = ({ text, linkText, href }: AuthFooterLinkProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Link href={href} asChild>
        <TouchableOpacity>
          <Text style={styles.link}> {linkText}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#64748b',
    fontSize: 14,
  },
  link: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AuthFooterLink;
