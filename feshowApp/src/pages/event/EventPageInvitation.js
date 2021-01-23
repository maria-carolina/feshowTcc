import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import ConfirmationModal from '../event/EventPageInvitation2';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const InvitationModal = (props) => {
    const [choosenArtist, chooseArtist] = useState(null);
    const [searchResult, setSearchResult] = useState(null);

    const search = async (text) => {
        try{
            let result = await api.post(`/searchArtist/${props.eventId}`, 
            {name: text}, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            console.log(result.data)
            setSearchResult(result.data);
        }catch(e){
            console.log(e)
        }
    }

    const cancelChoice = () => {
        chooseArtist(null)
    }
    
    return(
        <Modal
            visible = {props.visible}
            transparent = {true}
            animationType = 'fade'
            onRequestClose = {props.closeModal}
            
        >
            <View style = {{...styles.container, justifyContent: 'flex-start'}}>
                <FontAwesome
                    style = {{
                        position: 'absolute',
                        top: 5,
                        right: 5
                    }}
                    name = {'close'}
                    size = {25}
                    onPress = {props.closeModal}
                />
                <View style = {styles.row}>
                    <TextInput
                        style = {{...styles.textInput,
                            margin: 15
                        }} 
                        onChangeText = {(text) => search(text)}
                    />
                    <FontAwesome
                        style = {{
                            position: 'absolute',
                            top: '42%',
                            right: 25
                        }}
                        name = {'search'}
                        size = {25}
                        color = {'#696969'}
                        onPress = {props.closeModal}
                    />
                </View>
                <Text
                    style = {{
                        fontSize: 18,
                        fontWeight: 'bold',
                        alignSelf: 'flex-start',
                        marginLeft: 25,
                        marginBottom: 15
                    }}
                >
                    Sugestões de artistas
                </Text>
                {props.suggestions != null && 
                (searchResult||props.suggestions).map((item) => 
                    (
                        <View 
                            style = {styles.smallCard}
                            key = {item.id}
                        >
                            <Text style = {styles.cardTitle}>
                                {item.name}
                            </Text>
                            <Text>
                                {item.city}
                            </Text>
                            <View style = {styles.row}>
                                {item.genres.map((item) => 
                                <Text key={item.id}>
                                    {item.name}
                                </Text>)}
                            </View>
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
                closeModal = {() => cancelChoice()}
                finishInvitation = {props.closeModal}
            />

        </Modal>
        
    )
}

export default InvitationModal;