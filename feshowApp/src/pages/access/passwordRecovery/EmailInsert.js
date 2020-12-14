import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import api from '../../../services/api';
import { useNavigation } from '@react-navigation/native';

const EmailInsert = () => {
    const [emailInput, setEmailInput] = useState(null);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    sendEmail = async (email) => {
        let result = await api.post('/recoverPassword', {email: email});
        console.log(result)
        if(result.data.error === undefined){
            navigation.navigate('codeInsert', {email: email, code: result.data.code});
        }else{
            setError(result.data.error);
        }
    }

    return (
        <View style = {styles.container}>
            {error && <Text style = {styles.error}>{error}</Text>}
            <TextInput
                placeholder = 'Insira seu e-mail...'
                style = {styles.textInput}
                onChangeText = {text => setEmailInput(text)} 
            />
            <TouchableOpacity
                style = {styles.button}
                onPress = {() => sendEmail(emailInput)}
            >
                <Text style = {styles.buttonLabel}>
                    Enviar
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default EmailInsert;