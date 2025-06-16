// Crie este arquivo dentro da pasta 'frontend/components'.

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';

// Define as propriedades que nosso botão customizado aceitará.
interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

/**
 * Um botão reutilizável que mostra um indicador de carregamento (loading).
 */
const AuthButton = ({ title, loading = false, ...props }: AuthButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, (props.disabled || loading) ? styles.buttonDisabled : null]}
      disabled={props.disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b82f6',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthButton;
