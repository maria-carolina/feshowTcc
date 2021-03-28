import React, { useState, useEffect, useContext } from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView, Image, ActivityIndicator, Alert} from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Format from '../utils/Format';
import Lineup from './Lineup';
import Posts from './Posts';
import Warnings from './Warnings';
import SolicitationModal from './SolicitationModal';


const TABS = [
    {id: 0, label:'Descrição', value: 'description'},
    {id: 1, label:'Line-up', value: 'lineup'},
    {id: 2, label:'Postagens', value: 'posts'},
    {id: 3, label:'Avisos', value: 'warnings'}, 
]

const EventPage = (props) => {
    const [event, setEvent] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [lineup, setLineup] = useState(null);
    const [posts, setPosts] = useState(null);
    const [warnings, setWarnings] = useState(null);

    const [isContentLoading, setIsContentLoading] = useState(false);

    const [isSolicitationModalVisible, setIsSolicitationModalVisible] = useState(false);
    const [timeLimits, setTimeLimits] = useState(null);

    const [isInvitationModalVisible, setInvitationModalVisible] = useState(false);

    const authContext = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadEvent();
        })
            
        return unsubscribe;
    }, []);

    const loadEvent = async () => {
        try{
            let result = await api.get(
                `/event/show/${props.route.params.id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!result.data.error){
                setEvent(result.data);
                
            }else{
                Alert.alert('Ops', result.data.error);
            }
        }catch(e){
            console.log(e);
        }
    }

    const loadTab = async (tabId) => {
        setSelectedTab(tabId);
        setIsContentLoading(true);

        let route;
        let setData;
        if(tabId === 1){
            route = 'event/showLineup';
            setData = (data) => setLineup(data);
        }else if(tabId === 2){
            route = 'event/showPosts';
            setData = (data) => setPosts(data);
        }else{
            route = 'event/showEquipments';
            setData = (data) => setWarnings(data);
        }

        try{
            let result = await api.get(
                `${route}/${event.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!result.data.error){
                setData(result.data);
                setIsContentLoading(false);
            }else{
                Alert.alert('Ops', result.data.error);
            }
        }catch(e){
            console.log(e);
        }
    }

    const changeStatus = async () => {
        try{
            let result = await api.get(
                `/changeStatus/${event.id}`,
                {
                    headers:{
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            );

            if(!result.data.error){
                setEvent(result.data);
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){
            console.log(e)
        }
    }

    const openSolicitationModal = async () => {
        try{
            let limitsResult = await api.get(`/event/getDateTime/${event.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authContext.token}`,
                    }
                }
            )
            
            setTimeLimits(limitsResult.data);
            setIsSolicitationModalVisible(true);
            

        }catch(e){
            console.log(e);
        }
        
    }

    const closeSolicitationModal = () => {
        setIsSolicitationModalVisible(false);
        loadEvent();
    }

    const loadInvitationResponse = () => {
        Alert.alert(
            'Opa', 
            `Aceita ou recusa esse convite?`, 
            [
                {
                    text: 'Aceitar',
                    onPress: () => respondInvitation(true)
                },
                {
                    text: 'Recusar',
                    onPress: () => respondInvitation(false)
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        )
    }

    const loadRemoveConfirmation = (isArtistInEvent) => {
        const message = isArtistInEvent ? 
        'Realmente quer deixar o evento?':
        'Realmente quer cancelar sua solicitação para participar desse evento?'
        Alert.alert(
            'Opa',
            message,
            [
                {
                    text: 'Sim',
                    onPress: isArtistInEvent ? 
                    () => leaveLineup() :
                    () => respondInvitation(false) 
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        )
    }

    const respondInvitation = async (wasAccepted) => {
        var url = wasAccepted ? '/acceptParticipation' : '/removeAssociation';
        try{
            let result = await api.post(
                url, 
                {
                    artistId: authContext.user.artistId, 
                    eventId: event.id
                },
                {  
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            let message = wasAccepted ? 'Você foi adicionado ao evento' : 'O convite foi excluído'

            if(!result.data.error){
                Alert.alert('Pronto', message);
                loadEvent();
                loadTab(1);
            }else{
                Alert.alert('Ops', result.data.error)
            }

        }catch(e){
            console.log(e)
        }
    }

    const leaveLineup = async () =>{
        try{
            let result = await api.post(
                '/removeAssociation', 
                {
                    artistId: authContext.user.artistId, 
                    eventId: event.id
                },
                {  
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!result.data.error){
                Alert.alert('Pronto','Você foi removido do lineup.');
                loadEvent();
                loadTab(1);
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){

        }
    }

    const openEventEditPage = () => {
        navigation.navigate('newEventPage', {event})
    }


    let mainButton;
    if(event){
        if(authContext.user.id === event.organizer_id){
            mainButton = {
                handleClick: () => changeStatus(),
                label: `${event.status === 0 ? 'Abrir': 'Fechar'} evento`
            }
        }else if(event.status === 0){
            mainButton = {
                label: 'Feshow!'
            }
        }else if(event.artistStatus === 0){
            mainButton = {
                handleClick: () => openSolicitationModal(),
                label: 'Solicitar participação'
            }
        }else if(event.artistStatus === 1){
            mainButton = {
                handleClick: () => loadInvitationResponse(),
                label: 'Responder convite'
            }
        }else if (event.artistStatus === 2){
            mainButton = {
                handleClick: () => loadRemoveConfirmation(false),
                label: 'Desfazer convite'
            }
        }else{
            mainButton = {
                handleClick: () => loadRemoveConfirmation(true),
                label: 'Sair do evento'
            }
        }
    }

    return(
        <View style = {styles.container}>
            {event ? (
                <ScrollView
                    contentContainerStyle = {{
                        ...styles.center, 
                        justifyContent: 'flex-start', 
                    }}
                    style = {{width: '100%'}}
                >
                    <View style = {{alignItems: 'center'}}>
                        <Text
                            style = {{
                                ...styles.title,
                                marginVertical: 10
                            }}
                        >
                            {event.name}
                        </Text>

                        <View style = {styles.row}>
                            <FontAwesome
                                name = {'home'}
                                size = {15}
                                color = {'#3f2058'} 
                            />
                            <Text> {event.venue.name}</Text>
                        </View>

                        <View style = {styles.row}>
                            <FontAwesome
                                name = {'calendar'}
                                size = {15}
                                color = {'#3f2058'} 
                            />
                            <Text> {Format.formatDate(event.start_date)}</Text>
                        </View>

                        <View style = {styles.row}>
                            <FontAwesome
                                name = {'clock-o'}
                                size = {15}
                                color = {'#3f2058'} 
                            />
                            <Text> {event.start_time} às {event.end_time}</Text>
                        </View>

                        <TouchableOpacity
                            onPress = {mainButton.handleClick}
                            style = {{
                                ...styles.outlineButton,
                                marginVertical: 15
                            }}
                        >
                            <Text style = {styles.outlineButtonLabel}>
                                {mainButton.label}
                            </Text>
                        </TouchableOpacity>

                        {authContext.user.id === event.organizer_id &&
                            <TouchableOpacity
                                onPress = {openEventEditPage}
                                style = {{alignSelf: 'center'}}
                            >
                                <Text 
                                    style = {{
                                        color: '#3F2058', 
                                        fontWeight: 'bold'
                                    }
                                }>
                                    Editar evento
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>

                    <View
                        style = {{
                            borderBottomWidth: .5, 
                            width: '100%', 
                            flexGrow: 0,
                            marginTop: 15,
                            marginBottom: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        {TABS.map(item => {
                            return authContext.user.id !== event.organizer_id
                            && item.id === 3 ? 
                            null :
                            (
                                <TouchableOpacity
                                    onPress = {() => loadTab(item.id)}
                                    style = {
                                        selectedTab === item.id ?
                                        {
                                            ...styles.rowTab,
                                            borderBottomWidth: 2,
                                            borderBottomColor: '#3F2058'
                                        } :
                                        styles.rowTab
                                    }
                                    key = {item.id}
                                >
                                    <Text style = {styles.purpleText}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    {selectedTab === 0 && <Text>{event.description}</Text>}

                    {selectedTab === 1 && !!lineup && 
                       <Lineup
                            isOrganizer = {authContext.user.id === event.organizer_id}
                            list = {lineup}
                            event = {event}
                       />
                    }

                    {selectedTab === 2 && !!posts && 
                       <Posts
                            isRelatedToEvent = {
                                event.artistStatus === 3 || 
                                (authContext.user.id === event.organizer_id)
                            }
                            list = {posts}
                            event = {event}
                            reload = {() => loadTab(2)}
                       />
                    }

                    {selectedTab === 3 && !!warnings &&
                        <Warnings
                            list = {warnings} 
                        />
                    }

                    {isContentLoading &&
                        <ActivityIndicator
                            size = 'large'
                            color = '#000'
                        />
                    }
                    <SolicitationModal
                        visible = {isSolicitationModalVisible}
                        limits = {timeLimits}
                        eventId = {event.id}
                        token = {authContext.token}
                        closeModal = {() => closeSolicitationModal()} 
                    />         

                </ScrollView>
            ):(
                <ActivityIndicator 
                    size = 'large'
                    color = '#000'
                />
            )}

            
        </View>
    )
}

export default EventPage;