// Caminho: frontend/app/(auth)/register.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { Text, TextInput, Button, IconButton, Card, Modal, Portal, Provider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { Audio } from 'expo-av';

// Configura o idioma do calendário para português
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

// URL da API de backend
const BACKEND_BASE_URL = 'https://pessoas-api-c5ef63b1acc3.herokuapp.com';

// Tipos de papéis e dados da aplicação
type Role = 'ALUNO' | 'PROFESSOR' | 'ADMIN';
type ParentInfo = { name: string; email: string; phoneNumber: string; relationship: string; };

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        onSurfaceVariant: '#333',
        primary: '#1E90FF',
    },
};

const RegisterPage = () => {
    const router = useRouter();
    const { token: invitationToken } = useLocalSearchParams<{ token: string }>();

    // Estados para o player de música
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Estados para o modal de erro
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    // Estados para os campos do formulário
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

    // Estados de controle de fluxo da UI
    const [isLoading, setIsLoading] = useState(true); // Para a validação inicial do token
    const [isSubmitting, setIsSubmitting] = useState(false); // Para o envio do formulário
    const [validationError, setValidationError] = useState<string | null>(null); // NOVO: Para erro fatal de validação

    const showErrorModal = (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsModalVisible(true);
    };

    // --- useEffect para validação do Token ---
    // Este hook roda uma vez quando o componente carrega
    useEffect(() => {
        const validateToken = async () => {
            if (!invitationToken) {
                setValidationError('Token de convite não encontrado. Por favor, use o link que foi enviado para o seu e-mail.');
                setIsLoading(false);
                return;
            }

            try {
                // *** ALTERAÇÃO PRINCIPAL AQUI: Usando query parameter ***
                const response = await fetch(`${BACKEND_BASE_URL}/public/register/validate?token=${invitationToken}`);

                if (!response.ok) {
                    // Apanha erros 404 (inválido, expirado) ou outros erros do servidor
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Convite inválido, expirado ou já utilizado.');
                }

                const data: { email: string; role: Role } = await response.json();
                setEmail(data.email);
                setRole(data.role);
            } catch (error: any) {
                setValidationError(error.message || 'Ocorreu um erro ao validar seu convite.');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [invitationToken]);

    // Exibe o modal assim que um erro de validação for definido
    useEffect(() => {
        if (validationError) {
            showErrorModal('Erro no Convite', validationError);
        }
    }, [validationError]);

    // O restante do seu código permanece praticamente o mesmo...
    // ... (Hooks de som, handlers de formulário, etc)

    useFocusEffect(
        React.useCallback(() => {
            let soundObject: Audio.Sound | null = null;

            const loadSound = async () => {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/audio/Stardew Valley OST - Cloud Country.mp3'),
                    { isLooping: true }
                );
                soundObject = sound;
                setSound(soundObject);
            };

            loadSound();

            return () => {
                if (soundObject) {
                    soundObject.unloadAsync();
                }
                setIsPlaying(false);
            };
        }, [])
    );

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
            showErrorModal('Campo Obrigatório', 'Preencha pelo menos o nome e a relação do responsável.');
            return;
        }
        setParents([...parents, currentParent]);
        setCurrentParent({ name: '', email: '', phoneNumber: '', relationship: '' });
    };

    const handleRemoveParent = (indexToRemove: number) => {
        setParents(parents.filter((_, index) => index !== indexToRemove));
    };

    const validateForm = (): string[] => {
        const errors: string[] = [];

        if (!name.trim()) errors.push('O nome completo é obrigatório.');
        if (!dateOfBirth) errors.push('A data de nascimento é obrigatória.');
        if (!phoneNumber.trim()) errors.push('O telefone é obrigatório.');
        if (password !== confirmPassword) errors.push('As senhas não coincidem.');
        if (password.length < 8) errors.push('A senha deve ter no mínimo 8 caracteres.');
        if (!/[a-z]/.test(password)) errors.push('A senha deve conter pelo menos uma letra minúscula.');
        if (!/[A-Z]/.test(password)) errors.push('A senha deve conter pelo menos uma letra maiúscula.');
        if (!/\d/.test(password)) errors.push('A senha deve conter pelo menos um número.');
        if (!/[@$!%*?&]/.test(password)) errors.push('A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &).');

        if (role === 'ALUNO') {
            if (!street.trim()) errors.push('A rua é obrigatória.');
            if (!number.trim()) errors.push('O número do endereço é obrigatório.');
            if (!city.trim()) errors.push('A cidade é obrigatória.');
            if (!state.trim()) errors.push('O estado (UF) é obrigatório.');
            if (!zipCode.trim()) errors.push('O CEP é obrigatório.');
        }

        return errors;
    };

    const handleRegister = async () => {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            showErrorModal('Formulário Incompleto', validationErrors.join('\n'));
            return;
        }

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
                    dateOfBirth: dateOfBirth!.toISOString().split('T')[0],
                    phoneNumber,
                    address: { street, number, city, state, zipCode, complement: '' },
                },
                studentDetails: role === 'ALUNO' ? {
                    enrollmentId,
                    parents: parents
                } : null,
                invitationToken: invitationToken // Enviando o token para o backend poder invalidá-lo
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

            showErrorModal('Sucesso!', 'Sua conta foi criada. Você será redirecionado para o login.');
            setTimeout(() => {
                setIsModalVisible(false);
                router.replace('/(auth)/login');
            }, 3000);

        } catch (error: any) {
            let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este e-mail já está em uso por outra conta.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            showErrorModal('Erro no Registro', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ---- LÓGICA DE RENDERIZAÇÃO CONDICIONAL ----

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
                <Text style={{ marginTop: 10 }}>Validando seu convite...</Text>
            </View>
        );
    }

    // Se houve um erro de validação, não renderizamos o formulário.
    // O modal de erro já terá sido acionado pelo segundo useEffect.
    // Aqui mostramos uma tela de fundo simples para não deixar o usuário em um limbo.
    if (validationError) {
        return (
            <Provider theme={theme}>
                <ImageBackground
                    source={require('../../assets/images/backgroundRegister.png')}
                    style={styles.background}
                    resizeMode="cover"
                    blurRadius={1}
                >
                    <View style={styles.overlay} />
                    <Portal>
                        <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
                            <Text style={styles.modalMessage}>{modalMessage}</Text>
                            <Button mode="contained" onPress={() => router.replace('/(auth)/login')} style={styles.modalButton}>
                                Voltar para o Login
                            </Button>
                        </Modal>
                    </Portal>
                </ImageBackground>
            </Provider>
        );
    }

    // Se passou pela validação, renderiza o formulário completo
    return (
        <View style={{ flex: 1 }}>
            <Provider theme={theme}>
                <ImageBackground
                    source={require('../../assets/images/backgroundRegister.png')}
                    style={styles.background}
                    resizeMode="cover"
                    blurRadius={1}
                >
                    <View style={styles.overlay} />

                    <Portal>
                        <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
                            <Text style={styles.modalMessage}>{modalMessage}</Text>
                            <Button mode="contained" onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
                                OK
                            </Button>
                        </Modal>
                    </Portal>

                    <IconButton
                        icon={isPlaying ? "pause-circle" : "play-circle"}
                        iconColor={isPlaying ? "#FF6347" : "#1E90FF"}
                        size={30}
                        onPress={handlePlayPause}
                        style={styles.playPauseButton}
                    />

                    <ScrollView contentContainerStyle={styles.container}>
                        <Card style={styles.formCard}>
                            <Card.Content>
                                <Text style={styles.title}>Complete seu Cadastro</Text>
                                <Text style={styles.subtitle}>Seu papel será: {role}</Text>

                                <TextInput label="Nome Completo" value={name} onChangeText={setName} style={styles.input} mode="outlined" />
                                <TextInput label="E-mail" value={email} disabled style={styles.input} mode="outlined" />

                                <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                                    <View pointerEvents="none">
                                        <TextInput label="Data de Nascimento" value={dateOfBirth ? dateOfBirth.toLocaleDateString('pt-BR') : ''} style={styles.input} mode="outlined" right={<TextInput.Icon icon="calendar" />} />
                                    </View>
                                </TouchableOpacity>

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
                                        <TextInput label="Nome do Responsável" value={currentParent.name} onChangeText={(text) => setCurrentParent({ ...currentParent, name: text })} style={styles.input} mode="outlined" />
                                        <TextInput label="Relação (Pai, Mãe, etc)" value={currentParent.relationship} onChangeText={(text) => setCurrentParent({ ...currentParent, relationship: text })} style={styles.input} mode="outlined" />
                                        <TextInput label="E-mail do Responsável (Opcional)" value={currentParent.email} onChangeText={(text) => setCurrentParent({ ...currentParent, email: text })} keyboardType="email-address" style={styles.input} mode="outlined" />
                                        <TextInput label="Telefone do Responsável (Opcional)" value={currentParent.phoneNumber} onChangeText={(text) => setCurrentParent({ ...currentParent, phoneNumber: text })} keyboardType="phone-pad" style={styles.input} mode="outlined" />
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
                            </Card.Content>
                        </Card>
                    </ScrollView>

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
                </ImageBackground>
            </Provider>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        backgroundColor: "white"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 15,
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f7' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#333' },
    subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: 'gray' },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderTopColor: '#eee', borderTopWidth: 1, paddingTop: 20 },
    input: { marginBottom: 15, backgroundColor: 'transparent' },
    button: { marginTop: 20, paddingVertical: 8, },
    card: { marginBottom: 10, backgroundColor: 'white' },
    playPauseButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 50
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    modalButton: {
        marginTop: 10,
    }
});

export default RegisterPage;