import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, Alert, TextInput} from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ScrollView } from 'react-native-gesture-handler';
import api from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const FormSchema = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    start_date: yup.string().required('Campo obrigatório'),
    start_time: yup.string().required('Campo obrigatório'),
    end_time: yup.string().required('Campo obrigatório'),
    note: yup.string().required('Campo obrigatório'),
})


const Form = (props) => {
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedPicker, setSelectedPicker] = useState(null);

    return(
        <Formik
            initialValues = {{
                name: '',
                start_date: '',
                start_time: '',
                end_time: '',
                note:  ''
            }}
            onSubmit = {(values) => {
                props.save(values);
                let keys = Object.keys(values);
                for (let key in keys){
                    values[keys[key]] = ''
                }
            }}
            validationSchema = {FormSchema}
            validateOnChange = {false}
            validateOnBlur = {false}
        >
            {({values, handleChange, handleSubmit, errors}) => (
                <ScrollView
                    style = {{width: '90%'}}
                    contentContainerStyle = {styles.center}
                >
                    <Text
                        style = {{
                            ...styles.title,
                            alignSelf: 'flex-start',
                            marginLeft: '5%'
                        }}
                    >
                        Marcar evento
                    </Text>

                    <Text
                        style = {{
                            alignSelf: 'flex-start',
                            marginLeft: '5%',
                            fontSize: 16
                        }}
                    >
                        @ {props.venue.name}
                    </Text>

                    {Object.keys(errors).length > 0 && 
                         <Text style = {styles.error}>Preencha todos os campos</Text>}

                    <TextInput 
                        placeholder = 'Nome do evento'
                        style = {{...styles.textInput, width: '90%'}}
                        value = {values.name}
                        onChangeText = {handleChange('name')}
                    />

                    <TouchableOpacity 
                        style = {{
                            ...styles.rowInput, 
                            width: '90%',
                            alignItems: 'flex-start'
                        }}
                        onPress = {() => {
                            setSelectedPicker('start_date');
                            setDatePickerVisible(true);
                        }}
                    >
                        {values.start_date != '' ? 
                        <Text style = {{ color: '#000' }}>
                            {values.start_date}
                        </Text> :
                        <Text style = {{
                            color: '#8E8E8E',
                            fontSize: 16,
                        }}>
                            Data do evento
                        </Text>}

                    </TouchableOpacity>

                    <View style = {styles.row}>

                        <TouchableOpacity 
                            style = {{...styles.rowInput, marginRight: '6%'}}
                            onPress = {() => {
                                setSelectedPicker('start_time');
                                setTimePickerVisible(true);
                            }}
                        >
                            {values.start_time != '' ? 
                            <Text style = {{ color: '#000' }}>
                                {values.start_time}</Text> :
                            <Text style = {{
                                color: '#8E8E8E',
                                fontSize: 16
                            }}>Horário de início</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style = {styles.rowInput}
                            onPress = {() => {
                                setSelectedPicker('end_time');
                                setTimePickerVisible(true);
                            }}
                        >
                            {values.end_time != '' ? 
                            <Text style = {{ color: '#000' }}>
                                {values.end_time}</Text> :
                            <Text style = {{
                                color: '#8E8E8E',
                                fontSize: 16
                            }}>Horário de fim</Text>}
                        </TouchableOpacity>

                    </View>

                    <TextInput
                        placeholder = 'Escreva algo que ajude na aprovação do dono do espaço'
                        style = {{...styles.textInput,
                            width: '90%', 
                            height: 100, 
                            textAlignVertical: 'top'
                        }}
                        multiline = {true}
                        value = {values.note}
                        onChangeText = {handleChange('note')} 
                    />

                    <TouchableOpacity
                        style = {styles.button}
                        onPress = {handleSubmit}
                    >
                        <Text 
                            style = {styles.buttonLabel}
                        >
                            Enviar
                        </Text>
                    </TouchableOpacity> 


                    {isDatePickerVisible && <DateTimePicker
                        value = {new Date()}
                        mode = {'date'}
                        is24Hour = {true}
                        display = "default"
                        onChange = {(event, date) => {
                            setDatePickerVisible(false);
                            if(date){
                                let currentDate = new Date().getTime().toString().slice(0, 5) ;
                                if(currentDate < date.getTime().toString().slice(0, 5)){
                                    console.log(date.getMonth())
                                    let formattedDate = 
                                    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString()}/`+
                                    `${date.getFullYear().toString()}`;
                                    handleChange(selectedPicker)(formattedDate);
                                }else{
                                    Alert.alert('Data inválida', 
                                    'Não é possível marcar um evento para o dia atual ou data anterior.')
                                }
                            }
                        }} 
                    />}

                    {isTimePickerVisible && <DateTimePicker
                        value = {new Date()}
                        mode = {'time'}
                        is24Hour = {true}
                        display = "default"
                        onChange = {(event, date) => {
                            setTimePickerVisible(false);
                            if(date) {
                                let time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                                handleChange(selectedPicker)(time);
                            }
                        }} 
                    />}   

                </ScrollView>
            )}
        </Formik>
    )
}

class RequestPage extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    static contextType = AuthContext;
    
    sendRequest = async (values) => {
        let splitted = values.start_date.split('/');
        values.start_date = `${splitted[2]}-${splitted[1]}-${splitted[0]}`;

        values.venue_id = this.props.route.params.venue.venueId;
        
        try{
            let result = await api.post(
                '/sendOrganizationRequest', 
                values,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )

            
            if(result.data === 'ok'){
                Alert.alert('Pronto', 'Aguarde a aprovação do espaço');
                this.props.navigation.navigate('profilePage', {id: 2});
            }else{
                Alert.alert('Ops', result.data.error);
            }
        }catch(e){
            console.log(e)
        }
    }

    render(){

        return(
            <View
                style = {styles.container}
            >
                <Form 
                    save = {(values) => this.sendRequest(values)}
                    venue = {this.props.route.params.venue}
                />
            </View>
        )
    }
}

export default RequestPage;