import React, { Component, useState, useEffect, useContext } from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator} from 'react-native';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import styles from '../../styles';
import { useNavigation } from '@react-navigation/native';

const TABS = [
    {label: 'Recebidos', value: 'received'},
    {label: 'Enviados', value: 'sent'}
]

const InvitationsPage = () => {
    const [selectedTab, setSelectedTab] = useState(TABS[0]);
    const [invitations, setInvitations] = useState(null);

    const authContext = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadInvitations();
        })

        return unsubscribe;
    }, [])

    const loadInvitations = async () => {
        try{
            let result = await api.get('/invitations', {
                headers: {
                    Authorization: `Bearer ${authContext.token}`
                }
            })

            if(!result.data.error){
                setInvitations(result.data);
            }

        }catch(e){
            console.log(e)
        }
        
    } 

    const cancelInvitation = async (artistId, eventId) => {
        try{
            let result = await api.post(
                '/removeAssociation', 
                {artistId, eventId},
                {  
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!('error' in result)){
                Alert.alert('Pronto', 'O convite foi excluído.')
                loadInvitations();
            }
        }catch(e){
            console.log(e)
        }
    } 

    const loadConfirmation = (artistId, eventId, accepted) => {

        Alert.alert(
            'Opa', 
            `Realmente quer ${accepted ? 'aceitar' : 'recusar'} esse convite?`, 
            [
                {
                    text: 'Sim',
                    onPress: () => respondInvitation(artistId, eventId, accepted)
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ])
    }

    const confirmCancellation = (artistId, eventId) => {
        Alert.alert(
            'Opa', 
            `Realmente quer cancelar esse convite?`, 
            [
                {
                    text: 'Sim',
                    onPress: () => cancelInvitation(artistId, eventId)
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ])
    }

    const respondInvitation = async (artistId, eventId, accepted) => {
        var url = accepted ? '/acceptParticipation' : '/removeAssociation';
        try{
            let result = await api.post(
                url, 
                {artistId, eventId},
                {  
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            let message = accepted ? `${authContext.user.type == 0 ? 'Você' : 'O artista'} foi adicionado ao evento` : 'O convite foi excluído'

            if(!result.error){
                Alert.alert('Pronto', message);
                loadInvitations();
            }

        }catch(e){
            console.log(e)
        }
    }

    const changeTab = (index) => {
        setSelectedTab(TABS[index]);
    }

    return(
        <View
            style = {{...styles.container, justifyContent: 'flex-start'}} 
        >
            <Text
                style = {{
                    fontSize: 18,
                    fontWeight: 'bold',
                    alignSelf: 'flex-start',
                    marginLeft: 15,
                    color: '#3F2058'
                }}
            >
                Convites
            </Text>
            <View style = {styles.row}>

                <TouchableOpacity
                    style = {selectedTab.value === 'received' ? 
                        {
                            ...styles.rowTab,
                            width: '50%',
                            borderBottomWidth: 2,
                            borderBottomColor: '#3F2058',
                        }:
                        {
                            ...styles.rowTab,
                            width: '50%'
                        }

                    }
                    onPress = {() => changeTab(0)} 
                >
                    <Text>{TABS[0].label}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {selectedTab.value === 'sent' ?
                        {
                            ...styles.rowTab,
                            width: '50%',
                            borderBottomWidth: 2,
                            borderBottomColor: '#3F2058',
                        }:
                        {
                            ...styles.rowTab,
                            width: '50%'
                        }
                    }
                    onPress = {() => changeTab(1)} 

                >
                    <Text>{TABS[1].label}</Text>
                </TouchableOpacity>

            </View>
            
            {(invitations && 
            invitations[selectedTab.value].map((item) => {
                let text, options;
                let tab = selectedTab.value;
                let status = item.status;
                
                let eventName = (
                    <Text 
                        onPress = {() => 
                            navigation.navigate(
                                'eventPage', 
                                {id: item.events.id}
                            )}
                        style = {{fontWeight: 'bold'}}
                    >
                        {item.events.name}
                    </Text>
                );

                if(tab === 'sent'){
                    text = (
                    <Text
                        style = {{width: '60%'}}
                    >
                        {(status == 1 &&
                            <Text> 
                                Você convidou {item.artists.name} para o {eventName}
                            </Text>
                        )|| 
                            <Text>
                                Você solicitou participação no {eventName}
                            </Text>
                        }
                    </Text>
                    
                    )
                    options = (
                        <View
                            style = {{
                                position: 'absolute',
                                right: '5%',
                                top: '75%',
                                height: 100,
                                flexDirection: 'row'
                            }}
                        >

                            <TouchableOpacity>
                                <Text
                                    style = {{
                                        color: 'red',
                                        fontWeight: 'bold'
                                    }}
                                    onPress = {() =>
                                            confirmCancellation(item.artists.id, item.events.id)
                                        }
                                >
                                    Cancelar
                                </Text>
                            </TouchableOpacity>   

                        </View>
                    )
                }else{
                    text = (
                    <Text
                        style = {{width: '50%'}}
                    >
                        {(status == 1 &&
                            <Text> 
                                Você foi convidado para tocar no {eventName}
                            </Text>
                        )|| 
                            <Text>
                                {item.artists.name} quer tocar no {eventName}
                            </Text>
                        }
                    </Text>
                    )
                    
                    options = (
                        <View
                            style = {{
                                position: 'absolute',
                                right: 0,
                                top: '75%',
                                flexDirection: 'row'
                            }}
                        >
                            <TouchableOpacity
                                style = {{
                                    padding: 10,
                                    borderRightWidth: 1
                                }}
                                onPress = {() => 
                                    loadConfirmation(item.artists.id, item.events.id, true)}
                            >
                                <Text
                                    style = {{
                                        color: '#3F2058',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Aceitar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                    style = {{
                                    padding: 10
                                }}
                            >
                                <Text
                                    style = {{
                                        color: 'red',
                                        fontWeight: 'bold'
                                    }}
                                    onPress = {() => 
                                        loadConfirmation(item.artists.id, item.events.id, false)}
                                >
                                    Recusar
                                </Text>
                            </TouchableOpacity>
                            
                            
                        </View>
                    )
                }
                

                return(
                    <View
                        style = {{
                            borderBottomWidth: .5,
                            padding: 25,
                            width:'90%',
                            position: 'relative',
                            flexDirection: 'row'
                        }}
                        key = {invitations[selectedTab.value].indexOf(item)}
                    > 
                        {text}

                        {options}
                        
                    </View>
                )
                } //renderiza a lista quando carregada.
            
            )) ||
            <View
                style = {{...styles.center, flex: 1}}
            >
                <ActivityIndicator
                    size = 'large'
                    color = '#000'
                />
            </View>
            }
        </View>
    )
    
    
}

export default InvitationsPage;