import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import styles from '../../styles';
import Auth from '../../services/auth';
import { Formik } from 'formik';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';


const Form = (props) => {
    return (
        <Formik
            initialValues = {{
                username: '',
                password: ''
            }}
            onSubmit = {(values) => {
                props.signIn(values);
            }}
        >
            {({values, handleChange, handleSubmit}) => (
                <View style = {styles.container}>
                    <Text style = {styles.title}>Bem-vindo de volta!</Text>

                    {
                        props.error && <Text>{props.error}</Text>
                    }

                    <TextInput 
                        placeholder = 'Digite seu username...'
                     
                        style = {styles.textInput}
                        value = {values.username}
                        onChangeText = {handleChange('username')}
                    />
                    <View style = {{...styles.row, width: '70%'}}>
                        <TextInput 
                            placeholder = 'Insira a senha...'
                            style = {{...styles.textInput, width: '100%'}}
                            secureTextEntry = {!props.passwordVisible}
                            value = {values.password}
                            onChangeText = {handleChange('password')}
                        />
                        <FontAwesome 
                            name = {'eye'} 
                            size = {30}
                            style = {{position: 'absolute', right: 10, marginTop: 32}}
                            color = {props.passwordVisible ? '#DDD': '#000'}
                            onPress = {props.setPasswordVisible}
                        />
                    </View>
                    
                    <TouchableOpacity
                        style = {styles.button} 
                        onPress = {handleSubmit}
                    >
                        <Text style = {styles.buttonLabel}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    )
}

const SignInPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [error, setError] = useState(null);

    const signIn = async (values) => {
        let result = await Auth.signIn(values);
        if(!result.error){
            Alert.alert('Sucesso');
            setError(null);
        }else {
            setError(result.error)
        }
    }
    return(
        <Form 
            signIn = {signIn}
            passwordVisible = {passwordVisible}
            setPasswordVisible = {() => setPasswordVisible(!passwordVisible)}
            error = {error}
        />
    )
}

export default SignInPage;