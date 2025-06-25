// SUBSTITUA O CONTEÚDO DESTE ARQUIVO:
// Caminho: frontend/app/(pages)/home.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Modal, TextInput as RNTextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';

// ATENÇÃO: Use o URL do seu backend. Para testes locais com celular, use o IP da sua máquina.
const BACKEND_BASE_URL = 'https://pessoas-api-c5ef63b1acc3.herokuapp.com'; // <<<<< IP DA SUA MÁQUINA >>>>>

// --- NOVAS INTERFACES TYPESCRIPT ---
interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}
interface UserProfile {
    dateOfBirth: string;
    phoneNumber: string;
    address: Address;
}
interface StudentDetails {
    id: string;
    enrollmentId: string;
    parents: any[]; // Simplificado por enquanto
}
interface UserDetailsDto {
    id: string;
    uid: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'PROFESSOR' | 'ALUNO';
    profile: UserProfile | null;
    studentDetails: StudentDetails | null;
}
// --- FIM DAS INTERFACES ---

const HomePage = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<UserDetailsDto | null>(null); // Armazena todos os dados do usuário
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // --- LÓGICA DO MODAL ---
    const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
    const [inviteEmail, setInviteEmail] = useState<string>('');
    const [inviteRole, setInviteRole] = useState<'PROFESSOR' | 'ALUNO'>('PROFESSOR');
    const [isInviting, setIsInviting] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) {
                setIsLoading(false);
                router.replace('/(auth)/login');
                return;
            }
            try {
                const idToken = await firebaseUser.getIdToken();
                const response = await fetch(`${BACKEND_BASE_URL}/api/users/me`, {
                    headers: { 'Authorization': `Bearer ${idToken}` },
                });
                if (!response.ok) throw new Error('Falha ao buscar dados do usuário.');
                const data: UserDetailsDto = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Erro ao buscar perfil do usuário:', error);
                Alert.alert('Erro', 'Não foi possível carregar seu perfil.');
                signOut(auth);
                router.replace('/(auth)/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/(auth)/login');
    };

    const openInviteModal = (role: 'PROFESSOR' | 'ALUNO') => {
        setInviteRole(role);
        setShowInviteModal(true);
    };
    
    const handleInvite = async () => {
        if (!inviteEmail) return Alert.alert('Erro', 'Por favor, insira um e-mail.');
        setIsInviting(true);
        try {
            const idToken = await auth.currentUser?.getIdToken();
            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/invitations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao enviar convite');
            }
            Alert.alert('Sucesso', `Convite para ${inviteRole.toLowerCase()} enviado para ${inviteEmail}!`);
            setShowInviteModal(false);
            setInviteEmail('');
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        } finally {
            setIsInviting(false);
        }
    };

    if (isLoading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007bff" /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo, {userData?.name || 'Usuário'}!</Text>
            <Text style={styles.subtitle}>Você está logado como: {userData?.role}</Text>

            {userData?.role === 'ADMIN' && (
                <View style={styles.adminSection}>
                    <Text style={styles.adminTitle}>Painel do Administrador</Text>
                    <Button mode="contained" onPress={() => openInviteModal('PROFESSOR')} style={styles.button}>
                        Convidar Professor
                    </Button>
                    <Button mode="contained" onPress={() => openInviteModal('ALUNO')} style={styles.button}>
                        Convidar Aluno
                    </Button>
                </View>
            )}

            <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
                Sair
            </Button>

            <Modal visible={showInviteModal} onRequestClose={() => setShowInviteModal(false)} transparent>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Convidar Novo {inviteRole === 'PROFESSOR' ? 'Professor' : 'Aluno'}</Text>
                        <RNTextInput
                            style={styles.input}
                            placeholder="E-mail do convidado"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={inviteEmail}
                            onChangeText={setInviteEmail}
                        />
                        <Button mode="contained" onPress={handleInvite} loading={isInviting} disabled={isInviting}>
                            {isInviting ? 'Enviando...' : 'Enviar Convite'}
                        </Button>
                        <Button mode="text" onPress={() => setShowInviteModal(false)} style={{marginTop: 10}}>
                            Cancelar
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// ... (Estilos - podem ser mantidos ou adaptados)
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f0f2f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 18, color: 'gray', marginBottom: 30 },
    adminSection: { width: '100%', alignItems: 'center', padding: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 30 },
    adminTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    button: { width: '80%', marginVertical: 10 },
    logoutButton: { width: '80%', borderColor: 'red' },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', width: '90%' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 }
});


export default HomePage;