import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import api from '../../../services/api'
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as yup from 'yup';

0
const FormSchema = yup.object().shape({
    username: yup.string().required('Campo obrigatório')
    .min(5, 'O nome deve conter menos 5 caracteres'),
    email: yup.string().required('Campo obrigatório').email('Digite um email'),
    password: yup.string().required('Campo obrigatório')
    .min(6, 'A senha deve conter pelo menos 6 caracteres'),
    passwordRepetition: yup.string().required('Campo obrigatório')
    .oneOf([yup.ref('password'), null], 'Digite a mesma senha...')
})

const Form = (props) => {
    
    return(
        <Formik
            initialValues = {{
                username: '',
                email: '',
                password: '',
                passwordRepetition: ''
            }}

            onSubmit = {(values) => {      
                props.advance(values);                
            }}
            
            validationSchema = {FormSchema}
            validateOnChange = {false}
            validateOnBlur = {false}
        >
            {
                ({values, handleChange, handleSubmit, errors}) => (
                    <View style = {styles.container}>

                        <Text style = {styles.title}>Registre-se</Text>

                        {props.verifiedError && 
                        <Text style = {styles.error}>{props.verifiedError}</Text>}

                        <TextInput 
                            placeholder = 'Escolha um username...'
                            style = {styles.textInput}
                            value = {values.username}
                            onChangeText = {text => 
                                handleChange('username')(text.replace(/\s/g, ''))
                            }
                        />
                        {errors.username && 
                        <Text style = {styles.error}>{errors.username}</Text>}

                        <TextInput 
                            placeholder = 'Digite seu e-mail...'
                            style = {styles.textInput}
                            value = {values.email}
                            onChangeText = {handleChange('email')}
                        />
                        {errors.email && 
                        <Text style = {styles.error}>{errors.email}</Text>}


                        <View style = {{...styles.row, width: '70%'}}>
                            <TextInput 
                                placeholder = 'Escolha uma senha...'
                                style = {{...styles.textInput, width: '100%'}}
                                secureTextEntry = {!props.passwordVisible[0]}
                                value = {values.password}
                                onChangeText = {text => 
                                    handleChange('password')(text.replace(/\s/g, ''))
                                }
                            />
                            <FontAwesome 
                                name = {'eye'} 
                                size = {30}
                                style = {{position: 'absolute', right: 10, bottom: 5}}
                                color = {props.passwordVisible[0] ? '#FFF': '#000'}
                                onPress = {() => props.changePasswordVisibility(0)}
                            />
                        </View>

                        {errors.password 
                        && <Text style = {styles.error}>{errors.password}</Text> }

                        <View style = {{...styles.row, width: '70%'}}>
                            <TextInput 
                                placeholder = 'Repita a senha...'
                                style = {{...styles.textInput, width: '100%'}}
                                secureTextEntry = {!props.passwordVisible[1]}
                                value = {values.passwordRepetition}
                                onChangeText = {text => 
                                    handleChange('passwordRepetition')(text.replace(/\s/g, ''))
                                }
                            />
                            <FontAwesome 
                                name = {'eye'} 
                                size = {30}
                                style = {{position: 'absolute', right: 10,  bottom: 5}}
                                color = {props.passwordVisible[1] ? '#FFF': '#000'}
                                onPress = {() => props.changePasswordVisibility(1)}
                            />
                        </View>

                        {errors.passwordRepetition && 
                        <Text style = {styles.error}>{errors.passwordRepetition}</Text> }

                        <TouchableOpacity
                            onPress = {handleSubmit}
                            style = {styles.button}
                        >
                            <Text style = {styles.buttonLabel}>Avançar</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </Formik>
    )

}


class AccountInfo extends Component {
    constructor(props){
        super(props)
        this.state = {verifiedError: null, passwordVisible: [false, false]}
    }

    advance = async (values) => {
        try{
           let response = await api.post('/verifyUsername', {username: values.username});

           if(response.data.error == undefined){
               response = await api.post('/verifyEmail', {email: values.email});
               if(response.data.error == undefined){
                    delete values.passwordRepetition;
                    this.props.navigation.navigate('profileTypePick', {user: values});
               }
           }

           if(response.data.error != undefined){
               this.setState({
                   verifiedError: response.data.error
               })
           }
        }catch(e){
            console.log(e)
        }
        
    }

    changePasswordVisibility = (field) =>{
        let passwordVisible = this.state.passwordVisible;
        passwordVisible[field] = !passwordVisible[field];
        this.setState({
            passwordVisible: passwordVisible
        })
    }

    render(){
        return(
            <Form 
                advance = {(values) => this.advance(values)}
                verifiedError = {this.state.verifiedError}
                passwordVisible = {this.state.passwordVisible}
                changePasswordVisibility = {(field) => this.changePasswordVisibility(field)}
            />
        )
    }
}

export default AccountInfo;