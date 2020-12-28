import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';
import styles from '../../styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';
import ConfirmationModal from '../event/EventPageInvitation2';


const InvitationModal = (props) => {
    const [choosenArtist, chooseArtist] = useState(null)
    
    return(
        <Modal
            visible = {props.visible}
            transparent = {true}
            animationType = 'fade'
        >
            <View style = {styles.container}>
                {props.suggestions != null && props.suggestions.map((item) => 
                    (
                        <View style = {styles.smallCard}>
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