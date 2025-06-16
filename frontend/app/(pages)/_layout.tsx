// Caminho: frontend/app/(pages)/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';

export default function PagesLayout() {
  return (
    // Este Stack pode ter um cabeçalho visível ou outras opções comuns
    // para as páginas do seu aplicativo.
    <Stack screenOptions={{ headerShown: false }}>
      {/* A tela 'home' corresponde ao arquivo home.tsx dentro de (pages) */}
      <Stack.Screen name="home" options={{ title: 'Página Inicial' }} />
      {/* Adicione outras telas do seu aplicativo principal aqui:
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
      <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      */}
    </Stack>
  );
}
