// Caminho: frontend/app/(auth)/login.tsx (Este arquivo agora é o seu login simplificado)

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Text,
  Button,
  Switch,
  TouchableOpacity, // Mantido caso queira usar para "esqueceu a senha" ou "cadastre-se"
  Platform, // Mantido caso precise para outros usos, mas não essencial aqui
} from 'react-native';
import { useRouter } from 'expo-router';

// Importações do Firebase Auth
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Removido GoogleAuthProvider e signInWithCredential

// Opcional: Se você estiver executando isso diretamente fora do contexto do seu 'utils/firebaseConfig.ts',
// adicione a configuração aqui. Caso contrário, você pode importar 'auth' e 'app' de lá.
// Para este exemplo auto-contido, estou incluindo a configuração aqui novamente.
const firebaseConfig = {
  apiKey: "AIzaSyAxwoRf1f0j74QH0sXf9tffLriVbDFd1-4",
  authDomain: "cicb-35c00.firebaseapp.com",
  projectId: "cicb-35c00",
  storageBucket: "cicb-35c00.firebasestorage.app",
  messagingSenderId: "1000928975311",
  appId: "1:1000928975311:web:7fe5f68d71448a034c1aba"
};

// Inicializa o Firebase app e auth.
// Usamos getApps().length para evitar inicializar múltiplas vezes no hot-reload.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Removido WebBrowser.maybeCompleteAuthSession(); pois não há mais login social

const LoginPageContent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Removida configuração para o login com Google usando expo-auth-session

  // Removido useEffect para lidar com a resposta da autenticação do Google

  // Função para exibir mensagens de erro/sucesso temporariamente
  const showMessage = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000); // Mensagem desaparece após 5 segundos
  };

  // Função para lidar com o login por e-mail e senha
  const handleEmailPasswordLogin = async () => { // Renomeado para claridade
    if (!email || !password) {
      showMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Autentica com o Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Login por e-mail/senha bem-sucedido!', user.uid);
      Alert.alert('Sucesso!', `Bem-vindo, ${user.email || 'usuário'}!`);

      // Redireciona para a página principal após o login bem-sucedido.
      router.replace('/(pages)/home');

    } catch (firebaseError: any) {
      console.error('🚨 Erro no login por e-mail/senha:', firebaseError);
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';

      switch (firebaseError.code) {
        case 'auth/invalid-email':
          errorMessage = 'Formato de e-mail inválido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta conta foi desativada.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'E-mail ou senha incorretos.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro desconhecido: ${firebaseError.message}`;
          break;
      }
      showMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Removida Função para lidar com o login do Google

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => showMessage('Funcionalidade de recuperação de senha em desenvolvimento.')}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rememberMeContainer}>
          <Text style={styles.rememberMeLabel}>Lembrar-me</Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={rememberMe ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        <Button
          title={loading ? "Entrando..." : "Entrar"}
          onPress={handleEmailPasswordLogin} // Chamada para a função de login por e-mail/senha
          color="#007bff"
          disabled={loading}
        />

        {/* Removido o separador "OU" e o botão de login com Google */}

        <TouchableOpacity onPress={() => showMessage('Funcionalidade de registro em desenvolvimento.')}>
          <Text style={styles.registerText}>
            Não tem uma conta? <Text style={styles.registerLink}>Cadastre-se aqui</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente Wrapper (não usa PaperProvider aqui pois não estamos usando react-native-paper para UI)
const WrappedLoginPage = () => (
  <LoginPageContent />
);

export default WrappedLoginPage;

// --- Estilos React Native (Puros) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF2F6', // Cor de fundo suave
    padding: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rememberMeLabel: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    marginTop: 5,
    // Estilo do botão nativo (cor é via prop color)
  },
  separatorText: { // Removido do JSX, mas mantido nos estilos por precaução
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
  googleButton: { // Removido do JSX, mas mantido nos estilos por precaução
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  googleButtonDisabled: { // Removido do JSX, mas mantido nos estilos por precaução
    opacity: 0.6,
  },
  googleButtonContent: { // Removido do JSX, mas mantido nos estilos por precaução
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: { // Removido do JSX, mas mantido nos estilos por precaução
    color: '#444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  registerLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500',
  },
});
