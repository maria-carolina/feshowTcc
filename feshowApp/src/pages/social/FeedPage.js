import React, { Component, useContext, useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import SolicitationModal from '../event/SolicitationModal';
import FeedEventItem from './FeedEventItem';
import FeedProfileItem from './FeedProfileITem';
import FilterModal from './FilterModal';
import { useNavigation } from '@react-navigation/native';


function blobTo64data(imageBlob) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();

        var base64data;

        fileReader.readAsDataURL(imageBlob);
        
        fileReader.onload = () => {
            base64data = fileReader.result;
            resolve(base64data);
        }
    }) 
}


const FeedList = (props) => {

    const type = props.type === 'artists' ? 0 : (props.type === 'venues' ? 1 : 2);
    return(
        <View style = {{width: '90%'}}>

            {props.list.map(item => {
                return props.type === 'events' ? 
                (
                    <FeedEventItem
                        key = {item.id.toString()}
                        item = {item}
                        showSolicitationModal = {() => props.showSolicitationModal(item)}
                    />
                )
                :(
                    <FeedProfileItem
                        key = {item.id.toString()}
                        item = {item}
                        type = {type}
                    />
                )
            })}
        </View>
    )
}


const FeedPage = () => {
    const [tabs, setTabs] = useState([
        {label: 'Artistas', value: 'artists'}, 
        {label: 'Eventos', value: 'events'}, 
        {label: 'Espaços', value: 'venues'}, 
        {label: 'Produtores', value: 'producers'}
    ]);
    const [selectedTab, setSelectedTab] = useState('artists');

    const [isSolicitationVisible, setIsSolicitationVisible] = useState(false);
    const [limits, setLimits] = useState(null);
    const [choosenId, setChoosenId] = useState(null);

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    const [suggestions, setSuggestions] = useState({
        artists: null,
        venues: null,
        producers: null,
        events: null
    })

    const authContext = useContext(AuthContext);
    const navigation = useNavigation();
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            let tabToLoad = 'artists';
            if(authContext.user.type === 0){
                setTabs([
                    {label: 'Eventos', value: 'events'},
                    {label: 'Artistas', value: 'artists'}, 
                    {label: 'Espaços', value: 'venues'}, 
                    {label: 'Produtores', value: 'producers'}
                ]);
                setSelectedTab('events');
                
                tabToLoad = 'events';
            }
            loadFeed(tabToLoad);
        })
        

        return unsubscribe;
    }, [])


    const loadFeed = async (tab) => {
        let route;
        let suggestionsAux = suggestions;
        suggestionsAux[tab] = null;
        setSuggestions({...suggestionsAux});

        if(tab === 'events'){
            route = '/feedEvent';
        }else if(tab === 'artists'){
            route = '/feedArtist';
        }else if (tab === 'venues'){
            route = '/feedVenue';
        }else{
            route = '/feedProducer';
        }

        const config = {
            headers: { 
                Authorization: `Bearer ${authContext.token}`
            }
        }

        try{
            let result = await api.get(
                route,
                config
            )
            
            if(!result.data.error){
                for(const item of result.data){
                    if(item.image){
                        let imageBlob = await api.get(
                            `/getUserImage/${item.user_id}`,
                            {...config, responseType: 'blob'},
                        )
    
                        item.image = await blobTo64data(imageBlob.data);
                    }else{
                        item.image = null;
                    }
                }

                suggestionsAux[tab] = result.data;
                setSuggestions({...suggestionsAux});
                
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){
            console.log(e);
        }
    }

    const selectTab = (value) => {
        setSelectedTab(value);

        if(!suggestions[value]){
            loadFeed(value);
        }
    }


    const showSolicitationModal = (event) => {
        var {id, start_date, start_time, end_time} = event;
        setIsSolicitationVisible(true);
        setLimits({start_date, start_time, end_time})
        setChoosenId(id);
    }

    const closeSolicitationModal = () => {
        setIsSolicitationVisible(true);
        setLimits({start_date, start_time, end_time})
        setChoosenId(id);

        loadFeed('events');
    }

    const showFilterModal = () => {
        setIsFilterModalVisible(true)
    }

    const closeFilterModal = () => {
        setIsFilterModalVisible(false)
    }

    const filter = async (profileType, filterType) => {
        let route = '/filter';
        
        if(profileType === 'artists'){
            route += 'Artist';
        }else if (profileType === 'venues'){
            route += 'Venue';
        }else if (profileType ===  'producers'){
            route += 'Producer';
        }else if (profileType ===  'events'){
            route += 'Event';
        }

        route += filterType;
        console.log(route);

        const config = {
            headers: { 
                Authorization: `Bearer ${authContext.token}`
            }
        }

        try{
            let result = await api.get(
                route,
                config
            );
            
            if(!result.data.error){
                for(let item of result.data){
                    if(item.image){
                        let imageBlob = await api.get(
                            `/getUserImage/${item.user_id}`,
                            {...config, responseType: 'blob'},
                        )
    
                        item.image = await blobTo64data(imageBlob.data);
                    }else{
                        item.image = null;
                    }
                }

                console.log(result.data)

                let suggestionsAux = suggestions;
                suggestionsAux[profileType] = result.data;
                setSuggestions({...suggestionsAux});
                setIsFilterModalVisible(false);
            }else{
                Alert.alert('Ops', result.data.error);
            }
            
        }catch(e){
            console.log(e)
        }

    }

    
    return(
        <View style = {styles.container}>

            {(tabs &&
            <ScrollView
                contentContainerStyle = {{
                    alignItems: 'center',
                }}
            >
                <View style = {styles.row}>
                    {tabs.map((item, index) => (
                        <TouchableOpacity
                            style = {selectedTab === item.value ?
                                {
                                    ...styles.quarterRowTab,
                                    borderBottomWidth: 2,
                                    borderBottomColor: '#3F2058'
                                } : styles.quarterRowTab
                            }
                            onPress = {() => selectTab(item.value)}
                            key = {index.toString()}
                        >
                            <Text
                                style = {selectedTab === item.value ?
                                {color: '#3F2058', fontWeight: 'bold'}:
                                {color: '#000', fontWeight: 'normal'}
                                }
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style = {{
                        alignSelf: 'flex-end',
                        marginRight: 20,
                        marginTop: 15,
                        marginBottom: 15,
                    }}
                    onPress = {() => showFilterModal()}
                >
                    <Text
                        style = {{
                            fontSize: 15
                        }}
                    >
                        Filtrar
                    </Text>
                </TouchableOpacity>

                {suggestions[selectedTab] &&
                <FeedList 
                    list = {suggestions[selectedTab]}
                    type = {selectedTab}
                    showSolicitationModal = {(item) => showSolicitationModal(item)}
                />
                }

                {!suggestions[selectedTab] &&
                    <ActivityIndicator 
                        size = 'large'
                        color = '#000'
                    /> 
                }
                
                    
            </ScrollView>
            ) ||
            <ActivityIndicator
                size = 'large'
                color = '#000'
            />}

            <SolicitationModal
                visible = {isSolicitationVisible}
                limits = {limits}
                eventId = {choosenId}
                token = {authContext.token}
                closeModal = {() => closeSolicitationModal()} 
            />

            <FilterModal 
                visible = {isFilterModalVisible}
                selectedTab = {selectedTab}
                applyFilter = {(profileType, filterType) => filter(profileType, filterType)}
                closeModal = {() => closeFilterModal()}
            />
        </View>
    )
    
}

export default FeedPage;