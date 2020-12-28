import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import ConfirmationModal from '../event/EventPageInvitation2';


const InvitationModal = (props) => {
    const [choosenArtist, chooseArtist] = useState(null);
    const [list, setList] = useState(props.suggestions);

    const search = async (text) => {
        try{
            let result = await api.post(`/searchArtist/${props.eventId}`, 
            {name: text}, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })

            setList(result.data);
        }catch(e){
            console.log(e)
        }
    }
    
    return(
        <Modal
            visible = {props.visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style = {styles.container}>
                <TextInput
                    style = {styles.textInput} 
                    onChangeText = {(text) => search(text)}
                />
                {list != null && list.map((item) => 
                    (
                        <View 
                            style = {styles.smallCard}
                            key = {item.id}
                        >
                            <Text style = {styles.cardTitle}>
                                {item.name}
                            </Text>
                            <TouchableOpacity
                                style = {styles.cardButton}
                                onPress = {() => {
                                    chooseArtist(item)
                                }}
                            >
                                <Text>Convidar</Text>
                            </TouchableOpacity>
                        </View>
                    )
                 
                )}
               
            </View>

            <ConfirmationModal
                artist = {choosenArtist} 
                limits = {props.limits}
                eventId = {props.eventId}
                token = {props.token}
            />
        </Modal>
        
    )
}

export default InvitationModal;