import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import api from '../../../services/api';
import { Formik } from 'formik';
import * as yup from 'yup';


const FormSchema = yup.object().shape({
    zipcode: yup.string().required(),
    number: yup.string().required(),
    street: yup.string().required(),
    district: yup.string().required(),
    city: yup.string().required(),
    uf: yup.string().required()
})


const Form = (props) => {
    console.log(props.preloadedAddress != '')
    return(
        <Formik
            enableReinitialize = {true}
            initialValues = {props.preloadedAddress != '' ?
                {
                    zipcode: props.preloadedAddress.cep,
                    street: props.preloadedAddress.logradouro,
                    district: props.preloadedAddress.bairro,
                    city: props.preloadedAddress.localidade,
                    uf: props.preloadedAddress.uf
                }:
                {
                    zipcode: '',
                    street: '',
                    number: '',
                    district: '',
                    city: '',
                    uf: ''
            }}
            onSubmit = {values => props.advance(values)}
            validationSchema = {FormSchema}
            validateOnChange = {false}
            validatteOnBlur = {false}
        >
            {({values, handleChange, handleSubmit, errors}) => (
                <View style = {styles.container}>
                    <Text style = {styles.title}>Cadastre o endereço do espaço</Text>

                    {Object.keys(errors).length > 0 && 
                    <Text style = {styles.error}>Preencha todos os campos</Text>}
                    
                    <View style = {styles.row}>
                        <TextInput
                            placeholder = 'CEP'
                            style = {{...styles.textInput, width: '50%', marginRight: '5%'}}
                            keyboardType = 'numeric'
                            value = {values.zipcode}
                            onChangeText = {handleChange('zipcode')}
                            onEndEditing = {e => props.loadAddress(e.nativeEvent.text)}
                        />
                        
                        <TextInput
                            placeholder = 'nº'
                            style = {{...styles.textInput, width: '15%'}}
                            keyboardType = 'numeric'
                            value = {values.number}
                            onChangeText = {handleChange('number')}
                        />
                    </View>

                    <TextInput
                        placeholder = 'Logradouro'
                        style = {styles.textInput}
                        value = {values.street}
                        onChangeText = {handleChange('street')}
                    />

                    <TextInput
                        placeholder = 'Bairro'
                        style = {styles.textInput}
                        value = {values.district}
                        onChangeText = {handleChange('district')}
                    />

                    <View style = {styles.row}>
                        <TextInput
                            placeholder = 'Cidade'
                            style = {{...styles.textInput, width: '50%', marginRight: '5%'}}
                            value = {values.city}
                            onChangeText = {handleChange('city')}
                        />
                        <TextInput
                            placeholder = 'UF'
                            style = {{...styles.textInput, width: '15%'}}
                            value = {values.uf}
                            onChangeText = {handleChange('uf')}
                        />
                    </View>

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

class Address extends Component{
    constructor(props){
        super(props);
        this.state = {preloadedAddress: ''}
    }

    loadAddressByCep = async (cep) => {
        let result = await api.get(`http://viacep.com.br/ws/${cep}/json/`)
        
        this.setState({
            preloadedAddress: result.data
        })

    }

    advance = (values) => {
        let user = this.props.route.params.user;
        user.profile.address = values;
        this.props.navigation.navigate('openingHoursPick', {user: user});
    }

    render(){
        return (
            <Form 
                advance = {(values) => this.advance(values)}
                loadAddress = {(cep) => this.loadAddressByCep(cep)}
                preloadedAddress = {this.state.preloadedAddress}
            />
        )
    }
}

export default Address;