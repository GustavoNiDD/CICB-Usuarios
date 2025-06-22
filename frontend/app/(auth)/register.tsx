// Caminho: frontend/app/(auth)/register.tsx

import React, { useState, useEffect } from 'react'; // Importe useEffect
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Importe useLocalSearchParams
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig'; // Sua instância do Firebase auth

const BACKEND_BASE_URL = 'https://pessoas-api-c5ef63b1acc3.herokuapp.com'; // Certifique-se de que este é o seu backend real

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // NOVO: Hook para obter parâmetros da URL
  const { token: invitationTokenFromUrl } = useLocalSearchParams();
  const [invitationToken, setInvitationToken] = useState<string | string[] | null>(null);

  // NOVO: useEffect para pegar o token da URL assim que o componente montar
  useEffect(() => {
    if (invitationTokenFromUrl) {
      setInvitationToken(invitationTokenFromUrl);
      console.log('✅ Token de convite encontrado na URL:', invitationTokenFromUrl);
      // Opcional: Se o email do convite puder ser pré-preenchido, você faria isso aqui.
    } else {
      console.log('ℹ️ Nenhum token de convite encontrado na URL.');
      // Opcional: Alertar o usuário ou redirecioná-lo se um token for obrigatório para o registro
      // Alert.alert("Convite Necessário", "Você precisa de um link de convite para se registrar.");
      // router.replace('/(auth)/login');
    }
  }, [invitationTokenFromUrl]);


  const handleRegister = async () => {
    console.log('--- handleRegister foi chamado ---');

    // Novos logs para depuração
    console.log('Verificando campos...');
    if (!email || !password || !confirmPassword) {
      console.log('Erro de validação: campos vazios');
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    console.log('Campos preenchidos.');

    console.log('Verificando senhas...');
    if (password !== confirmPassword) {
      console.log('Erro de validação: senhas não coincidem');
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    console.log('Senhas coincidem.');

    console.log('Verificando comprimento da senha...');
    if (password.length < 6) {
      console.log('Erro de validação: senha curta');
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    console.log('Comprimento da senha OK.');

    setIsLoading(true);
    console.log('Iniciando bloco try...catch para createUserWithEmailAndPassword...');
    try {
      // 1. Cria o usuário no Firebase Authentication
      console.log('Tentando chamar createUserWithEmailAndPassword...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Usuário Firebase criado:', userCredential.user.email);

      // NOVO: 2. Obter o ID Token do Firebase para autenticar no backend
      const firebaseIdToken = await userCredential.user.getIdToken();
      console.log('🚀 ID Token do Firebase obtido (parcial):', firebaseIdToken.substring(0, 30) + '...');

      // NOVO: 3. Chamar o endpoint de registro do backend para atribuir o papel
      console.log('Chamando backend para completar o registro e atribuir papel...');
      const backendResponse = await fetch(`${BACKEND_BASE_URL}/public/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Não precisa de Authorization aqui, pois é um endpoint /public
          // O token FirebaseIdToken é enviado no corpo da requisição conforme seu DTO
        },
        body: JSON.stringify({
          firebaseIdToken: firebaseIdToken,
          invitationToken: invitationToken // Envia o token extraído da URL
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error('🚨 Erro no Backend ao completar registro:', backendResponse.status, errorData);
        Alert.alert('Erro no Registro', `Falha ao finalizar o registro no backend: ${errorData.message || backendResponse.statusText}`);
        // IMPORTANTE: Se o registro no backend falhar, você pode querer deletar o usuário do Firebase
        // para evitar contas "órfãs" sem papel.
        await userCredential.user.delete();
        console.warn('⚠️ Usuário Firebase deletado devido a falha no registro do backend.');
        return;
      }

      const backendUserData = await backendResponse.json();
      console.log('✅ Registro no backend (atribuição de papel) concluído. Dados do usuário:', backendUserData);

      Alert.alert('Sucesso', 'Sua conta foi criada e seu papel atribuído! Agora faça o login.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);

    } catch (error: any) {
      console.error('🚨 Erro CAPTURADO no try/catch:', error);
      let errorMessage = 'Não foi possível criar a conta. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Escolha uma mais forte.';
      } else if (error.message && error.message.includes("auth is not initialized")) {
          errorMessage = "Erro de inicialização do Firebase Auth. Verifique seu firebaseConfig.ts";
      }
      Alert.alert('Erro de Registro', errorMessage);
    } finally {
      setIsLoading(false);
      console.log('Finally block executado. isLoading definido como false.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Conta</Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={isLoading}
        disabled={isLoading || !invitationToken} // Desabilita se não houver token (opcional, mas recomendado)
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        {isLoading ? 'Registrando...' : 'Registrar'}
      </Button>

      <Button
        mode="text"
        onPress={() => router.replace('/(auth)/login')}
        style={styles.textButton}
        labelStyle={styles.textButtonLabel}
      >
        Já tem uma conta? Faça login.
      </Button>

      {/* NOVO: Aviso se não houver token de convite */}
      {!invitationToken && (
        <Text style={styles.warningText}>
          Atenção: Nenhum token de convite encontrado na URL. Seu registro pode não atribuir um papel específico.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    paddingVertical: 8,
    marginTop: 20,
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  textButton: {
    marginTop: 15,
  },
  textButtonLabel: {
    color: '#007bff',
  },
  // NOVO: Estilo para a mensagem de aviso
  warningText: {
    marginTop: 20,
    fontSize: 14,
    color: '#FF6347', // Cor de alerta
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});

export default RegisterPage;
