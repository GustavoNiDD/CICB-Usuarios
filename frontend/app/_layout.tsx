// Caminho: frontend/app/_layout.tsx

import React, { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router'; // 'Redirect' não é mais importado aqui
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

// Impede que a tela de splash nativa se esconda automaticamente
// Isso nos dá controle total sobre quando ela desaparece.
SplashScreen.preventAutoHideAsync();
console.log('--- ROOT LAYOUT: preventAutoHideAsync chamado ---');

export default function RootLayout() {
  // isAuthenticated:
  // null = ainda verificando o estado de autenticação (carregando)
  // true = usuário autenticado
  // false = usuário não autenticado
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  console.log(`--- ROOT LAYOUT: Renderizado. isAuthenticated: ${isAuthenticated}`);

  useEffect(() => {
    console.log('--- ROOT LAYOUT: useEffect de autenticação iniciado ---');

    // Inicia o listener de autenticação do Firebase.
    // Este listener é chamado imediatamente com o estado atual de autenticação,
    // e subsequentemente a cada mudança de estado (login, logout, etc.).
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(`--- ROOT LAYOUT: onAuthStateChanged acionado. User: ${user ? user.uid : 'null'}`);
      // Define o estado de autenticação. '!!user' converte o objeto 'user'
      // (que pode ser null ou um objeto User) para um booleano (true ou false).
      setIsAuthenticated(!!user);
      console.log(`--- ROOT LAYOUT: isAuthenticated definido como: ${!!user}`);

      // Uma vez que o estado inicial de autenticação foi determinado,
      // podemos esconder a tela de splash.
      // É seguro chamar hideAsync aqui porque sabemos que o estado de auth já foi avaliado.
      SplashScreen.hideAsync();
      console.log('--- ROOT LAYOUT: SplashScreen.hideAsync() chamado ---');
    });

    // A função retornada pelo useEffect é executada na limpeza (unmount) do componente.
    // Isso garante que o listener do Firebase seja removido para evitar vazamentos de memória.
    return () => {
      console.log('--- ROOT LAYOUT: useEffect de autenticação limpo ---');
      unsubscribe();
    };
  }, []); // O array de dependências vazio [] garante que este useEffect seja executado apenas uma vez, na montagem do componente.

  // Se 'isAuthenticated' ainda é 'null', significa que o estado de autenticação
  // ainda está sendo verificado. Exibe um indicador de carregamento.
  if (isAuthenticated === null) {
    console.log('--- ROOT LAYOUT: Renderizando tela de carregamento ---');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando aplicativo...</Text>
      </View>
    );
  }

  // Se o aplicativo estiver pronto, o RootLayout sempre renderiza um Stack.
  // A decisão de qual conjunto de telas mostrar (autenticação ou app principal)
  // é feita *dentro* do Stack, através da renderização condicional de Stack.Screen.
  console.log('--- ROOT LAYOUT: Renderizando Stack principal com seleção de grupo ---');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Se o usuário estiver autenticado, mostre o grupo de páginas principais do app.
        // Isso fará com que o Expo Router carregue o _layout.tsx e as rotas dentro de (pages).
        console.log('--- ROOT LAYOUT: Usuário autenticado. Exibindo grupo (pages) ---'),
        <Stack.Screen name="(pages)" />
      ) : (
        // Se o usuário NÃO estiver autenticado, mostre o grupo de páginas de autenticação.
        // Isso fará com que o Expo Router carregue o _layout.tsx e as rotas dentro de (auth).
        console.log('--- ROOT LAYOUT: Usuário NÃO autenticado. Exibindo grupo (auth) ---'),
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

// Estilos para o contêiner de carregamento.
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
