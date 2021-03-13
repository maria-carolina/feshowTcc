import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, Alert} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const InvitationTimePick = (props) => {
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [showtime, setShowtime] = useState(null)

    const sendInvitation = async () => {
        let splitted = props.event.start_date.split('/');
        let formattedDate = `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
        let values = {
            artistId: (props.artist.artistId||props.artist.id),
            eventId: props.event.id,
            date: formattedDate,
            time: showtime
        }

        try{
            let result = await api.post('/storeInvitation', values, 
                {headers: {
                    Authorization: `Bearer ${props.token}`,
                }}
            );

            if(result.data === 'ok'){
                props.closeModal();
                props.finishInvitation();
                Alert.alert('Pronto!', 'O artista foi convidado para o evento. Aguarde a resposta.') 
            }else{
                console.log(result.data)
                Alert.alert('Ops.', 'Já há um artista encaixado nesse horário.')
            }
        }catch(e){
            console.log(e)
        }
    }

    const verifyChoosenTime = (date) => {
        setTimePickerVisible(false)
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
                setShowtime(time)
            }else{
                Alert.alert('Horário inválido', 
                'O horário escolhido deve estar dentro do horário do evento')
            }
        }
    }

    return(
        <Modal
            visible = {props.visible}
            transparent = {true}
            animationType = 'fade'
            onRequestClose = {() => { 
                setShowtime(null);
                props.closeModal(); 
            }}
        >

            {props.artist != null && props.event != null &&
            <View style = {styles.container}>
                <FontAwesome
                    style = {{
                        position: 'absolute',
                        top: 5,
                        right: 5
                    }}
                    name = {'close'}
                    size = {25}
                    onPress = {() => {
                        setShowtime(null);
                        props.closeModal();
                    }}
                />
                <Text 
                    style = {{
                        ...styles.title, 
                        fontSize: 20,
                        marginBottom: 5
                    }
                    }>
                        Artista: {props.artist.name}
                </Text>

                <Text 
                    style = {{
                        ...styles.title, 
                        fontSize: 20,
                        marginBottom: 5
                    }
                    }>
                        Evento: {props.event.name}
                </Text>
                

                {(showtime == null &&

                <TouchableOpacity
                    onPress = {() => setTimePickerVisible(true)}
                    style = {{
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#3F2058',
                        padding: 5,
                        marginTop: 20
                    }}
                >
                    <Text>Escolher horário</Text>
                </TouchableOpacity>) 

                ||
                <View 
                    style = {{...styles.center,
                        width: '50%'
                    }}
                >
                    <Text 
                        style = {{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginTop: 15,
                        }}
                    >
                        {`Para tocar ${showtime}`}
                    </Text>

                    <Text
                        style = {{
                            textAlign: 'center'
                        }}
                    >
                        Esse horário poderá ser reajustado posteriormente.
                    </Text>

                    <TouchableOpacity
                        onPress = {() => sendInvitation()}
                        style = {{
                            ...styles.button, 
                            width:'100%',
                        }}
                    >
                        <Text style = {styles.buttonLabel}>
                            Enviar convite
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress = {() => setTimePickerVisible(true)}
                        style = {styles.outlineButton}
                    >
                        <Text style = {{...styles.outlineButtonLabel}}>
                            Trocar horário
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
                
            </View>}
        </Modal>
        
    )
}

export default InvitationTimePick;