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
            date: '2021-02-19',
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
                setChoosenTime(null);
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
            animationType = 'fade'
            transparent = {true}
            onRequestClose = {props.closeModal}
        >
            <View style = {{
                ...styles.container,
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
                <View
                    style = {{
                        width: '80%',
                        height: 250,
                        backgroundColor: '#FFF',
                        borderColor: '#cecece',
                        padding: 15,
                        alignItems: 'center'
                    }}
                >

                    {(choosenTime == null &&
                    <View
                        style = {{
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style = {{
                                ...styles.title,
                                fontSize: 18
                            }}
                        >
                            Escolha um horário de sua preferência
                        </Text>

                        <Text style = {{
                            ...styles.observationText,
                            margin: 15
                        }}> 
                            Esse horário poderá ser reajustado futuramente caso necessário
                        </Text>

                        <TouchableOpacity
                            onPress = {() => setTimePickerVisible(true)}
                            style = {{
                                ...styles.outlineButton,
                                width: '70%',
                                marginBottom: 15
                            }}
                        >
                            <Text
                                style = {styles.outlineButtonLabel}
                            >
                                Escolher o horário
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress = {props.closeModal}
                        >
                            <Text
                                style = {{
                                    color: '#3F2058',
                                    fontWeight: 'bold'
                                }}
                            >
                                Deixa quieto
                            </Text>
                        </TouchableOpacity>
                    </View>) ||

                    <View style = {{
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text
                            style = {{
                                ...styles.title,
                                fontSize: 18,
                            }}
                        >
                            {`Enviar solicitação para tocar ${choosenTime}?`}
                        </Text>
                        
                        <Text style = {{
                            ...styles.observationText,
                            margin: 15
                        }}> 
                            Esse horário poderá ser reajustado futuramente caso necessário
                        </Text>

                        <TouchableOpacity
                            onPress = {() => sendSolicitation()}
                            style = {{
                                ...styles.button, 
                                marginTop: 0,
                                marginBottom: 15
                            }}
                        >
                            <Text
                                style = {styles.buttonLabel}
                            >
                                Enviar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress = {() => setChoosenTime(null)}
                        >
                            <Text
                                style = {{
                                    color: '#3F2058',
                                    fontWeight: 'bold'
                                }}
                            >
                                Trocar horário
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                </View>
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