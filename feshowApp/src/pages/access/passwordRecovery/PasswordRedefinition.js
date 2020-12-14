import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import api from '../../../services/api';

const PasswordRedefinition = (props) => {
    const [passwordInput, setPasswordInput] = useState();
    const [passwordRepInput, setPasswordRepInput] = useState();
    const [error, setError] = useState(false);

    redefine = async (password, passwordRep) => {
        console.log(password.length)
        if(password.length >= 6){
            if(password === passwordRep){
                await api.put('/updatePassword', {...props.route.params, password: password})
            }else{
                setError('Digite a mesma senha...')
            }
        }else{
            setError('A senha deve conter pelo menos 6 caracteres');
        }
    }

    return (
        <View style = {styles.container}>
            {error && <Text style = {styles.error}>{error}</Text>}
            <TextInput
                placeholder = 'Insira a nova senha...'
                style = {styles.textInput}
                onChangeText = {(text) => setPasswordInput(text)} 
            />
            <TextInput
                placeholder = 'Repita a senha'
                style = {styles.textInput} 
                onChangeText = {(text) => setPasswordRepInput(text)} 
            />
            <TouchableOpacity
                style = {styles.button}
                onPress = {() => redefine(passwordInput, passwordRepInput)}
            >
                <Text style = {styles.buttonLabel}>Pronto</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PasswordRedefinition;