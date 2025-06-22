// Caminho: frontend/app/(auth)/register.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput, Button, IconButton, Card } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';

// Gerencia a reprodução de áudio na página
import { Audio } from 'expo-av';

// Registra a tradução para português para o calendário
registerTranslation('pt-BR', {
  save: 'Salvar',
  selectSingle: 'Selecione a data',
  selectMultiple: 'Selecione as datas',
  selectRange: 'Selecione o período',
  notAccordingToDateFormat: (inputFormat) => `Formato da data deve ser ${inputFormat}`,
  mustBeHigherThan: (date) => `Deve ser depois de ${date}`,
  mustBeLowerThan: (date) => `Deve ser antes de ${date}`,
  mustBeBetween: (startDate, endDate) => `Deve ser entre ${startDate} - ${endDate}`,
  dateIsDisabled: 'Dia não permitido',
  previous: 'Anterior',
  next: 'Próximo',
  typeInDate: 'Digite a data',
  pickDateFromCalendar: 'Escolha a data do calendário',
  close: 'Fechar',
  hour: 'Hora',
  minute: 'Minuto',
});

// URL do backend
const BACKEND_BASE_URL = 'https://pessoas-api-c5ef63b1acc3.herokuapp.com'; 

type Role = 'ALUNO' | 'PROFESSOR' | 'ADMIN';

// Tipo para as informações do responsável
type ParentInfo = {
    name: string;
    email: string;
    phoneNumber: string;
    relationship: string;
};

const RegisterPage = () => {
    const router = useRouter();
    const { token: invitationToken } = useLocalSearchParams<{ token: string }>();

    // Estados para o player de música
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Estados do formulário
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [enrollmentId, setEnrollmentId] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [parents, setParents] = useState<ParentInfo[]>([]); 
    const [currentParent, setCurrentParent] = useState<ParentInfo>({ name: '', email: '', phoneNumber: '', relationship: '' }); 
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efeito para carregar o som quando a tela monta e descarregar quando sai
    useEffect(() => {
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
               require('../../../assets/audio/Stardew Valley OST - Cloud Country.mp3'),
               { isLooping: true } 
            );
            setSound(sound);
        };

        loadSound();

        // Limpa o recurso de áudio para evitar vazamento de memória
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    // Função para dar play/pause na música
    const handlePlayPause = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const handleAddParent = () => {
        if (!currentParent.name || !currentParent.relationship) {
            Alert.alert('Erro', 'Preencha pelo menos o nome e a relação do responsável.');
            return;
        }
        setParents([...parents, currentParent]);
        setCurrentParent({ name: '', email: '', phoneNumber: '', relationship: '' });
    };

    const handleRemoveParent = (indexToRemove: number) => {
        setParents(parents.filter((_, index) => index !== indexToRemove));
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) return Alert.alert('Erro', 'As senhas não coincidem.');
        if (password.length < 6) return Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
        if (!dateOfBirth) return Alert.alert('Erro', 'Por favor, selecione sua data de nascimento.');
        
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
                    parents: parents 
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
    
    if (isLoading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
    }

    return (
        <View style={{flex: 1}}>
            {/* Botão de Play/Pause da música */}
            <IconButton
                icon={isPlaying ? "pause-circle" : "play-circle"}
                iconColor={isPlaying ? "#FF6347" : "#1E90FF"}
                size={30}
                onPress={handlePlayPause}
                style={styles.playPauseButton}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Complete seu Cadastro</Text>
                <Text style={styles.subtitle}>Seu papel será: {role}</Text>
                
                <TextInput label="Nome Completo" value={name} onChangeText={setName} style={styles.input} mode="outlined" />
                <TextInput label="E-mail" value={email} disabled style={styles.input} mode="outlined" />
                
                <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                    <View pointerEvents="none">
                        <TextInput 
                            label="Data de Nascimento" 
                            value={dateOfBirth ? dateOfBirth.toLocaleDateString('pt-BR') : ''}
                            style={styles.input} 
                            mode="outlined" 
                            right={<TextInput.Icon icon="calendar" />} 
                        />
                    </View>
                </TouchableOpacity>
                <DatePickerModal
                    locale="pt-BR"
                    mode="single"
                    visible={openDatePicker}
                    onDismiss={() => setOpenDatePicker(false)}
                    date={dateOfBirth}
                    onConfirm={(params) => {
                        setOpenDatePicker(false);
                        if (params.date) {
                           setDateOfBirth(params.date);
                        }
                    }}
                />

                <TextInput label="Telefone" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" style={styles.input} mode="outlined" />
                
                {role === 'ALUNO' && (
                    <>
                        <Text style={styles.sectionTitle}>Detalhes do Aluno</Text>
                        <TextInput label="Matrícula (Opcional)" value={enrollmentId} onChangeText={setEnrollmentId} style={styles.input} mode="outlined" />
                        
                        <Text style={styles.sectionTitle}>Responsáveis</Text>
                        {parents.map((parent, index) => (
                            <Card key={index} style={styles.card}>
                                <Card.Title
                                    title={parent.name}
                                    subtitle={parent.relationship}
                                    right={(props) => <IconButton {...props} icon="delete" onPress={() => handleRemoveParent(index)} />}
                                />
                            </Card>
                        ))}
                        <TextInput label="Nome do Responsável" value={currentParent.name} onChangeText={(text) => setCurrentParent({...currentParent, name: text})} style={styles.input} mode="outlined" />
                        <TextInput label="Relação (Pai, Mãe, etc)" value={currentParent.relationship} onChangeText={(text) => setCurrentParent({...currentParent, relationship: text})} style={styles.input} mode="outlined" />
                        <TextInput label="E-mail do Responsável" value={currentParent.email} onChangeText={(text) => setCurrentParent({...currentParent, email: text})} keyboardType="email-address" style={styles.input} mode="outlined" />
                        <TextInput label="Telefone do Responsável" value={currentParent.phoneNumber} onChangeText={(text) => setCurrentParent({...currentParent, phoneNumber: text})} keyboardType="phone-pad" style={styles.input} mode="outlined" />
                        <Button mode="outlined" onPress={handleAddParent} style={styles.input}>Adicionar Responsável</Button>

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f0f2f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, marginTop: 30 },
    subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: 'gray' },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderTopColor: '#ddd', borderTopWidth: 1, paddingTop: 20 },
    input: { marginBottom: 15 },
    button: { marginTop: 20, paddingVertical: 8, marginBottom: 40 },
    card: { marginBottom: 10, backgroundColor: 'white' },
    playPauseButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1, 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 50
    }
});

export default RegisterPage;