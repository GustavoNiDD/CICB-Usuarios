// Crie este arquivo dentro da pasta 'frontend/components'.

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

/**
 * Um container reutilizável para as telas de autenticação.
 * Inclui SafeArea para evitar áreas de notch/status bar e
 * KeyboardAvoidingView para garantir que o teclado não cubra os inputs.
 */
const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <View style={styles.inner}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});

export default AuthContainer;
