import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList, Alert} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';


const InvitationModal = (props) =>{
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [showtime, setShowtime] = useState(null)

    const sendInvitation = async () => {
        let values = {
            artistId: props.artist.id,
            eventId: props.eventId,
            date: props.limits.start_date,
            time: showtime
        }
        let res = await api.post('/storeInvitation', values, 
            {headers: {
                Authorization: `Bearer ${props.token}`,
            }}
        );
        console.log(values)
        console.log(res.data)
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
            visible = {!!props.artist}
            transparent = {true}
            animationType = 'fade'
        >
            <View style = {styles.container}>

                {props.artist != null &&
                <Text style = {styles.title}>{props.artist.name}</Text>}

                {(showtime == null &&
                <TouchableOpacity
                    onPress = {() => setTimePickerVisible(true)}
                >
                    <Text>Escolher horário</Text>
                </TouchableOpacity>) ||
                <View>
                    <Text>{showtime}</Text>
                    <TouchableOpacity
                        style = {styles.button}
                        onPress = {() => sendInvitation()}
                    >
                        <Text style = {styles.buttonLabel}>Enviar</Text>
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

export default InvitationModal;