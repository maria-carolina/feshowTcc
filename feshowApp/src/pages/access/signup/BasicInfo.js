import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import { Formik } from 'formik';
import * as yup from 'yup';

const FormSchema = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    numberProp: yup.string().required('Campo obrigatório')
})

const FormSchemaProducer = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
})


const Form = (props) => {
    let firstLabel = 'Qual nome deseja ser identificado?', secondLabel;
    if(props.type === 0){
        firstLabel = 'Qual o nome do seu projeto/banda?'
        secondLabel = 'Quantos membros tem na banda?'
    }else if(props.type === 1){
        firstLabel = 'Qual o nome do seu espaço?'
        secondLabel = 'Quantas pessoas cabem no espaço?'
    }
    return(
        <Formik
            initialValues = {{
                name: '',
                numberProp: ''
            }}

            onSubmit = {(values) => {
                props.advance(values)
            }}

            validationSchema = {props.type != 2 ? FormSchema : FormSchemaProducer}
            validateOnBlur = {false}
            validateOnChange = {false}
        >
            {({values, handleChange, handleSubmit, errors}) => (
                <View style = {styles.container}>

                    <Text style = {styles.title}>Registre-se</Text>
                    <TextInput 
                        placeholder = {firstLabel}
                        style = {{...styles.textInput, fontSize: 15}}
                        value = {values.name}
                        onChangeText = {handleChange('name')}
                    />
                    {errors.name && 
                        <Text style = {styles.error}>{errors.name}</Text>}

                    {props.type != 2 &&
                        <TextInput 
                            placeholder = {secondLabel}
                            style = {{...styles.textInput, fontSize: 15}}
                            value = {values.numberProp}
                            onChangeText = {handleChange('numberProp')}
                            keyboardType = 'numeric'
                        />
                    }
                    {errors.numberProp && 
                            <Text style = {styles.error}>{errors.numberProp}</Text>}

                    <TouchableOpacity
                        onPress = {handleSubmit}
                        style = {styles.button}
                    >
                        <Text style = {styles.buttonLabel}>Avançar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    )
}


class BasicInfo extends Component {
    constructor(props){
        super(props)
        this.state = {type: this.props.route.params.user.type}
    }


    advance = (values) => {
        let user = this.props.route.params.user;
        let nextPage = 'localizationPick'

        if(this.state.type === 0){
            values.members = values.numberProp
        }else if (this.state.type === 1){
            values.capacity = values.numberProp
            nextPage = 'address'
        }

        delete values.numberProp;

        user.profile = values;
        console.log(user);

        this.props.navigation.navigate(nextPage, {user: user});
    }

    render(){
        return(
            <Form 
                type = {this.state.type}
                advance = {(values) => this.advance(values)}
            />
        )
    }
}

export default BasicInfo;