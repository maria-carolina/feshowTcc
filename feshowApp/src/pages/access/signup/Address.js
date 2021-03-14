import React, { useContext, useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import styles from '../../../styles';
import {apiCep as api} from '../../../services/api';
import { Formik } from 'formik';
import * as yup from 'yup';
import ProfileUpdateContext from '../../../contexts/profileUpdate';
import { useNavigation } from '@react-navigation/native';


const FormSchema = yup.object().shape({
    zipcode: yup.string().required().min(9, 'O cep deve conter menos 9 caracteres'),
    number: yup.string().required(),
    street: yup.string().required(),
    district: yup.string().required(),
    city: yup.string().required(),
    uf: yup.string().required()
})


const Form = (props) => {
    let initialValues;

    if(props.preloadedAddress){
        initialValues = {
            zipcode: props.preloadedAddress.cep,
            street: props.preloadedAddress.logradouro,
            district: props.preloadedAddress.bairro,
            city: props.preloadedAddress.localidade,
            uf: props.preloadedAddress.uf
        }
    }else if(props.address){
        initialValues = {
            zipcode: props.address.zipcode,
            street: props.address.street,
            number: props.address.number,
            district: props.address.district,
            city: props.address.city,
            uf: props.address.uf,
        }
    }else{
        initialValues = {
            zipcode: '',
            street: '',
            number: '',
            district: '',
            city: '',
            uf: ''
        }
    }

    return(
        <Formik
            enableReinitialize = {true}
            initialValues = {initialValues}
            onSubmit = {values => props.advance(values)}
            validationSchema = {FormSchema}
            validateOnChange = {false}
            validatteOnBlur = {false}
        >
            {({values, handleChange, handleSubmit, errors}) => (
                <View style = {styles.container}>
                    <Text style = {styles.title}>Cadastre o endereço do espaço</Text>

                    {Object.keys(errors).length > 0 && 
                    <Text style = {styles.error}>{errors.zipcode}</Text>}
                    
                    <View style = {styles.row}>
                        <TextInput
                            placeholder = 'CEP'
                            style = {{...styles.textInput, width: '50%', marginRight: '5%'}}
                            keyboardType = 'numeric'
                            value = {values.zipcode}
                            onChangeText = {value => {
                                handleChange('zipcode')(value);
                                if(value.length > 7){
                                    props.loadAddress(value);
                                }
                            }}
                            //onEndEditing = {e => props.loadAddress(e.nativeEvent.text)}
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
                        editable = {false}
                        style = {styles.textInput}
                        value = {values.street}
                        onChangeText = {handleChange('street')}
                    />

                    <TextInput
                        placeholder = 'Bairro'
                        editable = {false}
                        style = {styles.textInput}
                        value = {values.district}
                        onChangeText = {handleChange('district')}
                    />

                    <View style = {styles.row}>
                        <TextInput
                            placeholder = 'Cidade'
                            editable = {false}
                            style = {{...styles.textInput, width: '50%', marginRight: '5%'}}
                            value = {values.city}
                            onChangeText = {handleChange('city')}
                        />
                        <TextInput
                            placeholder = 'UF'
                            editable = {false}
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

function Address (props){
    const [address, setAddress] = useState(null)
    const [preloadedAddress, setPreloadedAddress] = useState(null);

    const { alterProfile } = useContext(ProfileUpdateContext);
    const navigation = useNavigation();

    useEffect(() => {
        if(props.route.params.address){
            console.log(props.route.params.address);
            setAddress(props.route.params.address)
        }
    }, [])

    const loadAddressByCep = async (cep) => {
        try{
            let result = await api.get(`http://viacep.com.br/ws/${cep}/json/`);   
            console.log(result.status);    
            setPreloadedAddress(result.data);
        }catch(e){
            Alert.alert('Ops', 'Erro ao encontrar CEP.')
        }
    }

    const advance = (values) => {
        let user = props.route.params.user;
        user.profile.address = values;
        this.props.navigation.navigate('openingHoursPick', {user});
    }

    const finishUpdate = (values) => {
        alterProfile('address', values);
        navigation.navigate('profileEditPage');
    }
    
    return (
        <Form 
            advance = {props.route.params.address ? 
                (values) => finishUpdate(values) : (values) => advance(values)}
            loadAddress = {(cep) => loadAddressByCep(cep)}
            address = {address}
            preloadedAddress = {preloadedAddress}
        />
    )
    
}

export default Address;