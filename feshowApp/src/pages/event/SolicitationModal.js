import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, Alert} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SolicitationModal = (props) => {
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [choosenTime, setChoosenTime] = useState(null);

    const sendSolicitation = async () => {
        let values = {
            eventId: props.eventId,
            date: props.limits.start_date,
            time: choosenTime
        }

        try{
            let result = await api.post(
                '/sendSolicitation',
                 values, 
                {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                    }
                }
            );

            if(result.data === 'ok'){
                setChoosenTime(null)
                props.closeModal();
                Alert.alert('Pronto!', 'Sua solicitação foi enviada. Aguarde a resposta.') 
            }else{
                Alert.alert('Ops', result.data.error);
            }
        }catch(e){
            console.log(e)
        }

    }

    const verifyChoosenTime = (date) => {
        setTimePickerVisible(false);
        if(date){
            let time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

            let splittedStart = props.limits.start_time.split(':');
            let splittedEnd = props.limits.end_time.split(':');

            let isTimeBiggerThanStart = date.getHours() > parseInt(splittedStart[0])
            || (date.getHours() == parseInt(splittedStart[0]) && date.getMinutes() > splittedStart[1]);

            let isTimeBiggerThanEnd = date.getHours() > parseInt(splittedEnd[0])
            || (date.getHours() == parseInt(splittedEnd[0]) && date.getMinutes() > splittedEnd[1]);

            let twoDaysEvent =  parseInt(splittedEnd[0]) < parseInt(splittedStart[0]);

            let validTime = (!twoDaysEvent && (isTimeBiggerThanStart) && (!isTimeBiggerThanEnd))
                ||(twoDaysEvent && (isTimeBiggerThanStart || !isTimeBiggerThanEnd));
            
            if(validTime){
                setChoosenTime(time);
            }else{
                Alert.alert('Horário inválido', 
                'O horário escolhido deve estar dentro do horário do evento')
            }
        }
    }

    

    return(
        <Modal
            visible = {props.visible}
            onRequestClose = {() => props.closeModal()}
        >
            <View style = {styles.container}>
                <FontAwesome
                    style = {{
                        position: 'absolute',
                        top: 15,
                        right: 15
                    }}
                    name = {'close'}
                    size = {25}
                    onPress = {() => {
                        props.closeModal();
                        setChoosenTime(null);
                    }}
                />

                {(choosenTime == null &&
                <TouchableOpacity
                    onPress = {() => setTimePickerVisible(true)}
                    style = {{
                        ...styles.outlineButton,
                        width: '70%'
                    }}
                >
                    <Text
                        style = {styles.outlineButtonLabel}
                    >
                        Escolher o horário
                    </Text>
                </TouchableOpacity>) ||

                <View style = {{width: '100%'}}>
                    <Text
                        style = {styles.title}
                    >
                        {`Enviar solicitação para tocar ${choosenTime}?`}
                    </Text>
                    <TouchableOpacity
                        onPress = {() => sendSolicitation()}
                        style = {{
                            ...styles.button, 
                            alignSelf: 'center',
                        }}
                    >
                        <Text
                            style = {styles.buttonLabel}
                        >
                            Enviar
                        </Text>
                    </TouchableOpacity>
                </View>
                }
                {timePickerVisible && <DateTimePicker 
                    value = {new Date()}
                    mode = {'time'}
                    is24Hour = {true}
                    display = "default"
                    onChange = {(event, date) => verifyChoosenTime(date)}
                />}

            </View>
        </Modal>
    )
}

export default SolicitationModal;