import React, { useState, useContext } from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator} from 'react-native';
import styles from '../../styles';
import Auth from '../../contexts/auth';
import { Formik } from 'formik';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


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
                        onChangeText = {text => 
                            handleChange('username')(text.replace(/\s/g, ''))
                        }
                    />
                    
                    <View style = {{...styles.row, width: '70%'}}>
                        <TextInput 
                            placeholder = 'Insira a senha...'
                            style = {{...styles.textInput, width: '100%'}}
                            secureTextEntry = {!props.passwordVisible}
                            value = {values.password}
                            onChangeText = {text => 
                                handleChange('password')(text.replace(/\s/g, ''))
                            }
                        />
                        <FontAwesome 
                            name = {'eye'} 
                            size = {30}
                            style = {{position: 'absolute', right: 10, top: '30%'}}
                            color = {props.passwordVisible ? '#DDD': '#000'}
                            onPress = {props.setPasswordVisible}
                        />
                    </View>
                    
                    <TouchableOpacity
                        style = {{...styles.button, margin: 20}} 
                        onPress = {handleSubmit}
                    >
                        {props.loading ? 
                        <ActivityIndicator
                            size = 'small'
                            color = '#FFF'
                        />
                        :<Text style = {styles.buttonLabel}>Entrar</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress = {props.openRecovery}
                    >
                        <Text>Esqueci minha senha</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    )
}


const SignInPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useContext(Auth);
    const navigation = useNavigation();

    const handleSignIn = async (values) => {
        setLoading(true);
        setError(null);

        let result = await signIn(values);

        if(result){
            setError(result.error);
            setLoading(false);
        }
          
    }

    const openRecovery = () => {
        navigation.navigate('emailInsert');
    }

    return(
        <Form 
            signIn = {handleSignIn}
            openRecovery = {openRecovery}
            passwordVisible = {passwordVisible}
            setPasswordVisible = {() => setPasswordVisible(!passwordVisible)}
            loading = {loading}
            error = {error}
        />
    )
}

export default SignInPage;