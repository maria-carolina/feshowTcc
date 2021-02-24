import React, { Component, useContext, useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import InvitationTimePick from './InvitationTimePick';

const ProfilePageInvitation = (props) => {
    const [eventList, setEventList] = useState(null);
    const [choosenEvent, choseEvent] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        async function loadEvents(){
            try{
                let result = await api.get(
                    `/eventsOrganizer/${props.route.params.artist.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                console.log(result.data)
                
                if(!('error' in result.data)){
                    setEventList(result.data)
                }else{
                    Alert.alert('Ops.', result.data.error)
                }

            }catch(e){
                console.log(e)
            }
        }

        if(eventList === null){
            loadEvents();
        }

    },[])

    return(
        <View style = {{...styles.container, justifyContent: 'flex-start'}}>
            <Text style = {styles.title}>Escolha o evento</Text>

            
            {(eventList !== null &&
            <ScrollView
                style = {{
                    width: '100%'
                }}
                contentContainerStyle = {{
                    alignItems: 'center'
                }}
            >
            {eventList.map(item => {
                return(
                    <TouchableOpacity
                        style = {{
                            padding: 20,
                            borderBottomWidth: 0.5,
                            width: '70%'
                        }}
                        onPress = {() => choseEvent(item)}
                        key = {item.id}
                    >
                        <Text
                            style = {{
                                fontWeight: 'bold'
                            }}
                        >{item.name}</Text>
                    </TouchableOpacity>
                )
            })}
            </ScrollView>
            ) || 
            <ActivityIndicator 
                size = 'large'
                color = '#000'
            />
            }

            <InvitationTimePick
                visible = {!!choosenEvent}
                artist = {props.route.params.artist} 
                limits = {{
                    start_time: '18:00:00',
                    end_time: '23:00:00'
                }}
                event = {choosenEvent}
                token = {token}
                closeModal = {() => choseEvent(null)}
                finishInvitation = {() => props.navigation.goBack()} 
            />
        </View>
    )
}

export default ProfilePageInvitation;