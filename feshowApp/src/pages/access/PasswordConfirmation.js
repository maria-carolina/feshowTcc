import React, { useEffect, useContext, useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Modal} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';


const PasswordConfirmationModal = (props) => {
    const [typedPassword, setTypedPassword] = useState(null);
    const authContext = useContext(AuthContext);
    
    const verifyPassword = async () => {
        try{
            const result = await api.post(
                'verifyPassword',
                {
                    password: typedPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!result.data.error){
                props.deleteProfile();
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){
            console.log(e);
        }
    }

    return(
        <Modal
            visible = {props.visible}
            animationType = 'fade'
            transparent = {true}
            onRequestClose = {props.closeModal}
        >
            <View
                style = {{
                    ...styles.container,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <View
                    style = {{
                        width: '80%',
                        backgroundColor: '#FFF',
                        borderColor: '#cecece',
                        padding: 15,
                        borderRadius: 3
                    }}
                >

                    <Text
                        style = {{
                            alignSelf: 'center',
                            fontSize: 16,
                            letterSpacing: .5,
                        }}
                    >
                        Por favor, confirme sua senha.
                    </Text>

                    <TextInput
                        style = {{
                            borderWidth: .5,
                            borderRadius: 5,
                            marginVertical: 15
                        }} 
                        onChangeText = {text => setTypedPassword(text)}
                        secureTextEntry = {true}
                        
                    />

                    <TouchableOpacity
                        style = {{
                            ...styles.outlineButton,
                            width: '75%',
                            alignSelf: 'center'
                        }}
                        onPress = {verifyPassword}
                    >
                        <Text style = {styles.outlineButtonLabel}>
                            Confirmar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = {{
                            alignSelf: 'center',
                            marginVertical: 10
                        }}
                    >
                        <Text
                            style = {{
                                fontWeight: 'bold',
                                color: '#FD0505'
                            }}
                            onPress = {props.closeModal}
                        >
                            Cancelar
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
}

export default PasswordConfirmationModal;