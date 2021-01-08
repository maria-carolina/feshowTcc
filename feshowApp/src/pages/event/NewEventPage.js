import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator} from 'react-native';
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
            initialValues = {props.event == null ? {
                name: '',
                start_date: '',
                start_time: '',
                end_time: '',
                description:  ''
            }:
            {
                name: props.event.name,
                start_date: props.event.start_date,
                start_time: props.event.start_time,
                end_time: props.event.end_time,
                description: props.event.description
            }

            }
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
                
                    <ScrollView contentContainerStyle = {styles.center}>
                        <Text style = {styles.title}>Insira as informações do evento</Text>
                        <Text style = {{
                            marginBottom: 20,
                            fontSize: 16
                        }}>
                            Local: {props.event != null ? props.event.venue.name : 'X'}
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
                                    {values.start_date}</Text> :
                                <Text style = {{
                                    color: '#8E8E8E',
                                    fontSize: 16,
                                }}>
                                    Data do evento
                                </Text>}

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
                            >
                                {props.event != null ? 'Salvar alterações':'Criar evento'}
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


class NewEventPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            event: null
        }
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.setState({
            event: this.props.route.params != undefined ? this.props.route.params.event : null
        })
    }

    save = async (values) => {
        
        if((values.end_date < values.start_date) && values.end_date != ''){
            Alert.alert('Data inválida', 'A data final deve ser posterior a inicial');
        }else{
            let splitted = values.start_date.split('/');
            values.start_date = `${splitted[2]}-${splitted[1]}-${splitted[0]}`;

            values.venue_id = 1;

            var config = {
                headers: {
                    Authorization: `Bearer ${this.context.token}`
                }
            }

            try{
                if(this.props.route.params == undefined){
                    var result = await api.post('/event/store', values, config);
                }else{
                    var result = await api.put(`/event/update/${this.props.route.params.event.id}`, values, config);
                }

                if(!('error' in result.data)){
                    this.setState({
                        event: null
                    });
                    this.props.navigation.navigate('eventPage');
                    Alert.alert('Pronto!', 'Evento cadastrado com sucesso!')
                }
            }catch(e){
                console.log(e);
            }
        }
    }

    render(){
        return(
            <View style = {styles.container}>
                
                    <Form
                        save = {(values) => this.save(values)}
                        event = {this.state.event}
                    />
                
            </View>
        )
    }
}

export default NewEventPage;