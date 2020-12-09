import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import { Formik } from 'formik';
import * as yup from 'yup';

0
const FormSchema = yup.object().shape({
    username: yup.string().trim('O username não pode conter espaços').required('Campo obrigatório')
    .min(5, 'Pelo menos 5 caracteres'),
    email: yup.string().required('Campo obrigatório').email('Digite um email'),
    password: yup.string().required('Campo obrigatório')
    .min(6, 'Pelo menos 6 caracteres'),
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

                        <TextInput 
                            placeholder = 'Escolha uma senha...'
                            secureTextEntry = {true}
                            style = {styles.textInput} 
                            value = {values.password}
                            onChangeText = {text => 
                                handleChange('password')(text.replace(/\s/g, ''))
                            }
                        />
                        {errors.password 
                        && <Text style = {styles.error}>{errors.password}</Text> }

                        <TextInput 
                            placeholder = 'Repita a senha...'
                            secureTextEntry = {true}
                            style = {styles.textInput} 
                            value = {values.passwordRepetition}
                            onChangeText = {handleChange('passwordRepetition')}
                        />
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
        this.state = {payment: false}
    }

    advance = (values) => {
        delete values.passwordRepetition;
        this.props.navigation.navigate('profileTypePick', {user: values});
    }

    render(){
        return(
            <Form 
                advance = {(values) => this.advance(values)}
            />
        )
    }
}

export default AccountInfo;