// Crie a pasta 'frontend/components' e, dentro dela, este arquivo.

import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';

/**
 * Um componente de campo de texto reutilizável com estilos padrão
 * para os formulários de autenticação.
 */
const AuthTextInput = (props: TextInputProps) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#94a3b8" // Cor sutil para o placeholder
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    marginBottom: 12,
    color: '#1e293b',
  },
});

export default AuthTextInput;
