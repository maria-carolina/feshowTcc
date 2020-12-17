import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import api from '../../../services/api';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const PasswordRedefinition = (props) => {
    const [passwordInput, setPasswordInput] = useState();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordRepInput, setPasswordRepInput] = useState();
    const [passwordRepVisible, setPasswordRepVisible] = useState(false);
    const [error, setError] = useState(false);
    const navigation = useNavigation();


    const redefine = async (password, passwordRep) => {
        if(password.length >= 6){
            if(password === passwordRep){
                await api.put('/updatePassword', {...props.route.params, password: password})
                navigation.navigate('signInPage');
            }else{
                setError('Digite a mesma senha...')
            }
        }else{
            setError('A senha deve conter pelo menos 6 caracteres');
        }
    }

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}> Redefina sua senha </Text>

            {error && <Text style = {styles.error}>{error}</Text>}

            <View style = {{...styles.row, width: '70%'}}>
                <TextInput 
                    placeholder = 'Insira a nova senha...'
                    style = {{...styles.textInput, width: '100%'}}
                    secureTextEntry = {!passwordVisible}
                    onChangeText = {text => setPasswordInput(text.replace(/\s/g, ''))}
                />
                <FontAwesome 
                    name = {'eye'} 
                    size = {30}
                    style = {{position: 'absolute', right: 10, marginTop: 32}}
                    color = {passwordVisible ? '#DDD': '#000'}
                    onPress = {() => setPasswordVisible(!passwordVisible)}
                />
            </View>

            <View style = {{...styles.row, width: '70%'}}>
                <TextInput 
                    placeholder = 'Repita a senha'
                    style = {{...styles.textInput, width: '100%'}}
                    secureTextEntry = {!passwordRepVisible}
                    onChangeText = {text => setPasswordRepInput(text.replace(/\s/g, ''))}
                />
                <FontAwesome 
                    name = {'eye'} 
                    size = {30}
                    style = {{position: 'absolute', right: 10, marginTop: 32}}
                    color = {passwordRepVisible ? '#DDD': '#000'}
                    onPress = {() => setPasswordRepVisible(!passwordRepVisible)}
                />
            </View>

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