import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

const FormSchema = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    start_date: yup.string().required('Campo obrigatório'),
    start_time: yup.string().required('Campo obrigatório'),
    end_time: yup.string().required('Campo obrigatório'),
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
                end_date: '',
                start_time: '',
                end_time: '',
                description: ''
            }}
            onSubmit = {(values) => {
                props.save(values);
            }}
            validationSchema = {FormSchema}
            validateOnChange = {false}
            validateOnBlur = {false}
        >
            {({values, handleChange, handleSubmit, errors}) => (
                <View style = {styles.container}>
                    <ScrollView contentContainerStyle = {styles.center}>
                        <Text style = {styles.title}>Insira as informações do evento</Text>
                        <Text style = {{
                            marginBottom: 20,
                            fontSize: 16
                        }}>
                            Local: X
                        </Text>

                        {Object.keys(errors).length > 0 && 
                         <Text style = {styles.error}>Preencha todos os campos</Text>}

                        <TextInput 
                            placeholder = 'Nome do evento'
                            style = {{...styles.textInput, width: '90%'}}
                            value = {values.name}
                            onChangeText = {handleChange('name')}
                        />

                        <View style = {styles.row}>


                            <TouchableOpacity 
                                style = {{...styles.rowInput, marginRight: '6%'}}
                                onPress = {() => {
                                    setSelectedPicker('start_date');
                                    setDatePickerVisible(true);
                                }}
                            >
                                {values.start_date != '' ? 
                                <Text style = {{ color: '#000' }}>
                                    {values.start_date}</Text> :
                                <Text style = {{
                                    color: '#8E8E8E',
                                    fontSize: 16
                                }}>Data do evento</Text>}

                            </TouchableOpacity>


                            <TouchableOpacity 
                                style = {styles.rowInput}
                                onPress = {() => {
                                    setSelectedPicker('end_date');
                                    setDatePickerVisible(true);
                                }}
                            >
                                {values.end_date != '' ? 
                                <Text style = {{ color: '#000' }}>
                                    {values.end_date}</Text> :
                                <Text style = {{
                                    color: '#8E8E8E',
                                    fontSize: 14
                                }}>Data final (opcional)</Text>}

                            </TouchableOpacity>


                        </View>

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
                            placeholder = 'Descrição'
                            style = {{...styles.textInput,
                                width: '90%', 
                                height: 100, 
                                textAlignVertical: 'top'
                            }}
                            value = {values.description}
                            onChangeText = {handleChange('description')} 
                        />

                        <TouchableOpacity
                            style = {styles.button}
                            onPress = {handleSubmit}
                        >
                            <Text 
                                style = {styles.buttonLabel}
                            >Criar evento</Text>
                        </TouchableOpacity>
                    </ScrollView>

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
                                    let formattedDate = 
                                    `${date.getDate().toString().padStart(2, '0')}/${date.getMonth().toString()}/`+
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

                    

                </View>
            )}
        </Formik>
    )
}


class NewEventPage extends Component{
    constructor(props){
        super(props);
    }

    static contextType = AuthContext;

    save = async (values) => {
        if((values.end_time < values.start_time) && values.end_date == '' ){
            Alert.alert('Horário inválida', 
            'Em casos de eventos com um dia só,'+
            'o horário final deve ser posterior ao inicial');
        }else if((values.end_date < values.start_date) && values.end_date != ''){
            Alert.alert('Data inválida', 'A data final deve ser posterior a inicial');
        }else{

            let splitted = values.start_date.split('/');
            values.start_date = `${splitted[2]}-${splitted[1]}-${splitted[0]}`;

            if(values.end_date != ''){
                splitted = values.end_date.split('/');
                values.end_date = `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
            } 

            values.venue_id = 1;

            try{
                console.log(values)
                let result = await api.post('/event/store', values, {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                });
                console.log(result.data)
            }catch(e){
                console.log(e);
            }

        }
    }

    render(){
        return(
            <Form
                save = {(values) => this.save(values)} 
            />
        )
    }
}

export default NewEventPage;