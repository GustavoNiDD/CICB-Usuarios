// SUBSTITUA O CONTEÚDO DESTE ARQUIVO:
// Caminho: frontend/app/(auth)/register.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

// ATENÇÃO: Use o URL do seu backend. Para testes locais com celular, use o IP da sua máquina.
const BACKEND_BASE_URL = 'https://pessoas-api-c5ef63b1acc3.herokuapp.com'; // <<<<< IP DA SUA MÁQUINA >>>>>

type Role = 'ALUNO' | 'PROFESSOR' | 'ADMIN';

const RegisterPage = () => {
    const router = useRouter();
    const { token: invitationToken } = useLocalSearchParams<{ token: string }>();

    // Estados do formulário
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [enrollmentId, setEnrollmentId] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!invitationToken) {
            Alert.alert('Erro', 'Token de convite não encontrado. Use o link enviado para o seu e-mail.');
            router.replace('/(auth)/login');
            return;
        }

        const validateToken = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BACKEND_BASE_URL}/public/register/validate/${invitationToken}`);
                if (!response.ok) throw new Error('Convite inválido');
                const data: { email: string; role: Role } = await response.json();
                setEmail(data.email);
                setRole(data.role);
            } catch (error) {
                Alert.alert('Erro', 'Seu link de convite é inválido, expirou ou já foi utilizado.');
                router.replace('/(auth)/login');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [invitationToken]);

    const handleRegister = async () => {
        if (password !== confirmPassword) return Alert.alert('Erro', 'As senhas não coincidem.');
        if (password.length < 6) return Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
        
        setIsSubmitting(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const creationDto = {
                uid: user.uid,
                email: user.email,
                name,
                role,
                profile: {
                    dateOfBirth: dateOfBirth.toISOString().split('T')[0],
                    phoneNumber,
                    address: { street, number, city, state, zipCode, complement: '' },
                },
                studentDetails: role === 'ALUNO' ? {
                    enrollmentId,
                    parents: [] 
                } : null,
            };

            const response = await fetch(`${BACKEND_BASE_URL}/public/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creationDto),
            });

            if (!response.ok) {
                const errorData = await response.json();
                await user.delete();
                throw new Error(errorData.message || 'Falha ao registrar no backend.');
            }

            Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso. Faça o login para continuar.');
            router.replace('/(auth)/login');

        } catch (error: any) {
            Alert.alert('Erro no Registro', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Complete seu Cadastro</Text>
            <Text style={styles.subtitle}>Seu papel será: {role}</Text>
            
            <TextInput label="Nome Completo" value={name} onChangeText={setName} style={styles.input} mode="outlined" />
            <TextInput label="E-mail" value={email} disabled style={styles.input} mode="outlined" />
            
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                    <TextInput label="Data de Nascimento" value={dateOfBirth.toLocaleDateString('pt-BR')} style={styles.input} mode="outlined" right={<TextInput.Icon icon="calendar" />} />
                </View>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDateOfBirth(selectedDate);
                    }}
                />
            )}
            <TextInput label="Telefone" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" style={styles.input} mode="outlined" />
            
            {role === 'ALUNO' && (
                <>
                    <Text style={styles.sectionTitle}>Detalhes do Aluno</Text>
                    <TextInput label="Matrícula (Opcional)" value={enrollmentId} onChangeText={setEnrollmentId} style={styles.input} mode="outlined" />
                    
                    <Text style={styles.sectionTitle}>Endereço</Text>
                    <TextInput label="CEP" value={zipCode} onChangeText={setZipCode} keyboardType="numeric" style={styles.input} mode="outlined" />
                    <TextInput label="Rua" value={street} onChangeText={setStreet} style={styles.input} mode="outlined" />
                    <TextInput label="Número" value={number} onChangeText={setNumber} keyboardType="numeric" style={styles.input} mode="outlined" />
                    <TextInput label="Cidade" value={city} onChangeText={setCity} style={styles.input} mode="outlined" />
                    <TextInput label="Estado (UF)" value={state} onChangeText={setState} maxLength={2} style={styles.input} mode="outlined" />
                </>
            )}

            <Text style={styles.sectionTitle}>Defina sua Senha</Text>
            <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} mode="outlined" />
            <TextInput label="Confirmar Senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} mode="outlined" />

            <Button mode="contained" onPress={handleRegister} loading={isSubmitting} disabled={isSubmitting} style={styles.button}>
                Finalizar Cadastro
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f0f2f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: 'gray' },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderTopColor: '#ddd', borderTopWidth: 1, paddingTop: 20 },
    input: { marginBottom: 15 },
    button: { marginTop: 20, paddingVertical: 8, marginBottom: 40 },
});

export default RegisterPage;