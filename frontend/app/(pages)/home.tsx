// Caminho: frontend/app/(pages)/home.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper'; // Reintroduzindo Text e Button do Paper para melhor estética
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth'; // Importa signOut do Firebase Auth
import { auth } from '../../utils/firebaseConfig'; // Importa a instância auth

// <<<<< ENDEREÇO IP ATUALIZADO >>>>>
// Com base no seu 'ipconfig', este é o provável IP da sua máquina na rede local.
// Se estiver testando no NAVEGADOR WEB no seu PC, 'http://localhost:8080' também funcionaria.
const BACKEND_BASE_URL = 'http://localhost:8080'; // <<<<< IP DA SUA MÁQUINA >>>>>


// Definição da interface para o UserDto que virá do backend
interface UserDto {
  uid: string;
  email: string;
  role: 'ADMIN' | 'PROFESSOR' | 'ALUNO' | 'OTHER'; // Adapte os papéis conforme seu backend
  // Adicione outros campos do UserDto aqui, se necessário
}

const HomePage = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null); // Estado para armazenar o papel do usuário
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true); // Estado para indicar carregamento do papel
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false); // Novo estado para controlar o modal
  const [professorEmail, setProfessorEmail] = useState<string>(''); // Estado para o email do professor
  const [isInviting, setIsInviting] = useState<boolean>(false); // Estado para o carregamento do convite

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga o usuário do Firebase
      console.log('✅ Logout bem-sucedido!');
      router.replace('/(auth)/login'); // Redireciona para a tela de login
    } catch (error) {
      console.error('🚨 Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  };

  // useEffect para buscar o papel do usuário quando o componente monta ou o usuário muda
  useEffect(() => {
    const fetchUserRole = async () => {
      setIsRoleLoading(true); // Inicia o carregamento do papel
      const firebaseUser = auth.currentUser; // Obtém o usuário Firebase atualmente logado

      if (!firebaseUser) {
        setUserRole(null);
        setIsRoleLoading(false);
        return;
      }

      try {
        const idToken = await firebaseUser.getIdToken();
        console.log('🚀 ID Token obtido (parcial):', idToken.substring(0, 30) + '...'); 

        const response = await fetch(`${BACKEND_BASE_URL}/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('🚨 Erro ao buscar papel do usuário no backend:', response.status, errorData);
          Alert.alert('Erro', `Não foi possível carregar seu perfil: ${errorData.message || response.statusText}`);
          setUserRole(null);
          return;
        }

        const userData: UserDto = await response.json();
        console.log('✅ Dados do usuário do backend:', userData);
        setUserRole(userData.role);

      } catch (error) {
        console.error('🚨 Erro na comunicação com o backend ou ao obter token:', error);
        Alert.alert('Erro', 'Problema de conexão com o servidor. Verifique o BACKEND_BASE_URL e se o backend está rodando e acessível na rede.');
        setUserRole(null);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // --- NOVA FUNÇÃO PARA ENVIAR CONVITE ---
  const handleInviteProfessor = async () => {
    if (!professorEmail) {
      Alert.alert('Erro', 'Por favor, insira o e-mail do professor.');
      return;
    }

    setIsInviting(true); // Inicia o carregamento do convite
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      Alert.alert('Erro', 'Usuário não autenticado para enviar convite.');
      setIsInviting(false);
      return;
    }

    try {
      const idToken = await firebaseUser.getIdToken();
      console.log('💌 Enviando convite com ID Token (parcial):', idToken.substring(0, 30) + '...');

      const response = await fetch(`${BACKEND_BASE_URL}/api/admin/invitations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: professorEmail, role: 'PROFESSOR' }), // Envia o email e o papel "PROFESSOR"
      });

      if (response.ok) {
        Alert.alert('Sucesso', `Convite enviado para ${professorEmail} com sucesso!`);
        setProfessorEmail(''); // Limpa o campo
        setShowInviteModal(false); // Fecha o modal
      } else {
        const errorData = await response.json();
        console.error('🚨 Erro ao enviar convite:', response.status, errorData);
        Alert.alert('Erro', `Falha ao enviar convite: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('🚨 Erro na requisição de convite:', error);
      Alert.alert('Erro', 'Não foi possível enviar o convite. Verifique sua conexão e o backend.');
    } finally {
      setIsInviting(false); // Finaliza o carregamento do convite
    }
  };
  // --- FIM DA NOVA FUNÇÃO ---

  if (isRoleLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subtitle}>Você acessou a área principal do aplicativo.</Text>

      {userRole && <Text style={styles.roleText}>Seu papel: {userRole}</Text>}

      {/* Botão "Cadastrar Professor" (apenas se for ADMIN) */}
      {userRole === 'ADMIN' && (
        <Button
          mode="contained"
          onPress={() => setShowInviteModal(true)} // Abre o modal
          style={styles.adminButton}
          labelStyle={styles.adminButtonText}
        >
          Cadastrar Professor
        </Button>
      )}

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.logoutButtonText}
      >
        Sair
      </Button>

      {/* --- MODAL PARA CADASTRO DE PROFESSOR --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInviteModal}
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Convidar Novo Professor</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail do professor"
              keyboardType="email-address"
              autoCapitalize="none"
              value={professorEmail}
              onChangeText={setProfessorEmail}
            />
            <Button
              mode="contained"
              onPress={handleInviteProfessor}
              loading={isInviting}
              disabled={isInviting}
              style={styles.inviteButton}
              labelStyle={styles.inviteButtonText}
            >
              {isInviting ? 'Enviando...' : 'Enviar Convite'}
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                setProfessorEmail(''); // Limpa o campo ao fechar
                setShowInviteModal(false);
              }}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
      {/* --- FIM DO MODAL --- */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50', // Verde para destaque do papel
    marginBottom: 20,
  },
  adminButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#007bff', // Azul para o botão de admin
  },
  adminButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    marginTop: 30, // Mais espaçamento para o botão de sair
    paddingVertical: 8,
    backgroundColor: '#dc3545', // Cor vermelha para o botão de sair
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- Estilos do Modal ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escuro transparente
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Largura do modal
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  inviteButton: {
    backgroundColor: '#28a745', // Verde para o botão de enviar
    marginTop: 10,
    paddingVertical: 8,
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderColor: '#6c757d', // Cinza para o botão cancelar
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default HomePage;