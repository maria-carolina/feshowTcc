import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import Format from '../utils/Format';
import { StackActions } from '@react-navigation/native';

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
            onSubmit = {async (values) => {
                const hasSaved = await props.save(values);
                if(hasSaved){
                    let keys = Object.keys(values);
                    for (let key in keys){
                        values[keys[key]] = ''
                    }
                }
            }}
            validationSchema = {FormSchema}
            validateOnChange = {false}
            validateOnBlur = {false}
        >
            {({values, handleChange, handleSubmit, errors}) => (
                
                <>
                    <Text style = {styles.title}>Insira as informações do evento</Text>

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
                            {Format.formatDatetoDMY(values.start_date)}
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
                        style = {{...styles.button, marginVertical: 15}}
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
                                let formattedDate = 
                                `${date.getFullYear().toString()}-${(date.getMonth()+1).toString()}-`+
                                `${date.getDate().toString().padStart(2, '0')}`;
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
                </>

            )}
        </Formik>
    )
}


class NewEventPage extends Component{
    constructor(props){
        super(props);
        this.reload;
        this.state = {
            event: null
        }
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.loadStates();
        this.reload = this.props.navigation.addListener('focus', () => {
            this.loadStates();
        })
    }

    loadStates = () => {
        let isAEdition = this.props.route.params != undefined;
        console.log(this.context.user);

        this.setState({
            event: isAEdition ? this.props.route.params.event : null,
            isAEdition
        })
    }

    save = async (values) => {
        
        if((values.end_date < values.start_date) && values.end_date != ''){
            Alert.alert('Data inválida', 'A data final deve ser posterior a inicial');
        }else{
            const isANewEvent = this.props.route.params ? false : true;


            values.venue_id = isANewEvent ? 
            this.context.user.venueId : this.props.route.params.event.venue_id;
 
            var config = {
                headers: {
                    Authorization: `Bearer ${this.context.token}`
                }
            }

            try{
                if(isANewEvent){
                    var result = await api.post('/event/store', values, config);
                }else{
                    var result = await api.put(`/event/update/${this.props.route.params.event.id}`, values, config);
                }


                if(!('error' in result.data)){
                    this.setState({
                        event: null,
                        isAEdition: undefined
                    });
                    this.props.navigation.navigate('eventPage', {id: isANewEvent ? result.data.id : this.props.route.params.event.id});
                    Alert.alert('Pronto!', `Evento ${isANewEvent ? 'cadastrado':'editado'} com sucesso!`);
                    return true;
                }else{
                    Alert.alert('Ops', result.data.error);
                    return false;
                }
            }catch(e){
                console.log(e);
            }
        }
    }

    loadCancelConfirmation = () => {
        Alert.alert(
            'Opa',
            'Realmente quer cancelar esse evento?',
            [
                {
                    text: 'Sim',
                    onPress: () => this.cancelEvent()
                },
                {
                    text: 'Não',
                    style: 'cancel'
                }
            ]
        )
    }

    cancelEvent = async () => {
        try{
            let result = await api.get(
                `/event/delete/${this.state.event.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            );
            if(!result.data.error){
                Alert.alert('Pronto!', 'O evento foi cancelado.');
                this.props.navigation.dispatch(StackActions.popToTop());
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){
            console.log(e)
        }
    }

    render(){

        return(
            <View style = {styles.container}>
                <ScrollView contentContainerStyle = {styles.center}>
                    {((this.state.isAEdition && this.state.event !== null) || 
                    this.state.isAEdition === false)
                    &&
                    <Form
                        save = {(values) => this.save(values)}
                        event = {this.state.event}
                    />
                    }
                    {this.state.isAEdition && 
                    <TouchableOpacity
                        onPress = {this.loadCancelConfirmation}
                    >
                        <Text style = {{color: '#FD0505'}}>
                            Cancelar evento
                        </Text>
                    </TouchableOpacity>}
                </ScrollView>
            </View>
        )
    }
}

export default NewEventPage;