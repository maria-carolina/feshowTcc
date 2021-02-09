import React, { Component } from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import ListItem from '../event/EventListItem';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';


class FutureEventsPage extends Component{
    constructor(props){
        super(props)
        this.onfocus;
        this.state = {
            isFirstTabSelected: true,
            isAllPagesLoaded: [false, false]
        }
    }

    static contextType = AuthContext;
    
    componentDidMount(){
        this.onfocus = this.props.navigation.addListener('focus', () => {
            this.loadEvents(true);
        })
        
    }

    loadEvents = async (isEventsToOrganize) => {

        this.setState({
            eventsToOrganize: undefined,
            eventsToParticipate: undefined,
        })

        var url = isEventsToOrganize ? 
        '/futureEventsOrganizer/1':'/futureEventsParticipation/1';

        try{
            let result = await api.get(
                url, 
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )
            
            if(!('error' in result.data)){
                let newState = isEventsToOrganize ?
                {
                    eventsToOrganize: result.data,
                    pagesLoaded: [1, 0]
                }:
                {
                    eventsToParticipate: result.data,
                    pagesLoaded: [1, 1]
                }

                this.setState(newState);
            }

        }catch(e){
            console.log(e)
        }
    }

    loadMoreEvents = async (isEventsToOrganize, page) => {
        var url = isEventsToOrganize ? 
        '/futureEventsOrganizer':'/futureEventsParticipation';
        console.log(page);
        try{

            this.setState({
                isLoadingAPage: true
            })

            let result = await api.get(
                `${url}/${page}`, 
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )
            
            if(!('error' in result.data)){
                let newData;
                let newState;
                let pagesLoaded = this.state.pagesLoaded;

                if(isEventsToOrganize){
                    pagesLoaded[0]++
                    newData = this.state.eventsToOrganize.concat(result.data);
                    newState = {eventsToOrganize: newData, pagesLoaded}
                }else{
                    pagesLoaded[1]++
                    newData = this.state.eventsToParticipate.concat(result.data);
                    newState = {eventsToParticipate: newData, pagesLoaded}
                }

                newState.isLoadingAPage = false;

                this.setState(newState);
            }

        }catch(e){
            console.log(e)
        }
    }

    changeTab = () => {
        
        console.log(this.state.isFirstTabSelected);

        if(this.state.isFirstTabSelected && !this.state.eventsToParticipate){
            this.loadEvents(false);
        }else if(!this.state.isFirstTabSelected && !this.state.eventsToOrganize){
            this.loadEvents(true);
        }

        this.setState({
            isFirstTabSelected: !this.state.isFirstTabSelected
        })

    }

    render(){
        var { isFirstTabSelected, isLoadingAPage } = this.state;

        var isProducer = this.context.user.type === 2;

        var isDataReady = isFirstTabSelected ? 
        !!this.state.eventsToOrganize : !!this.state.eventsToParticipate;

        var listToRender = isFirstTabSelected ? 
        this.state.eventsToOrganize : this.state.eventsToParticipate;

        if(!!this.state.pagesLoaded){
            var nextPage = isFirstTabSelected ? 
            this.state.pagesLoaded[0]+1 : this.state.pagesLoaded[1]+1;
        }
        
        return(
            <View
                style ={{
                    ...styles.container,
                    justifyContent: 'flex-start'
                }}
            >

                <Text 
                    style = {{
                        ...styles.title,
                        alignSelf: 'flex-start', 
                        marginLeft: 15
                    }}
                >
                    Eventos futuros
                </Text>
                
                {!isProducer &&
                    <View style = {styles.row}>
                        <TouchableOpacity
                            style = {
                                isFirstTabSelected ?
                                styles.selectedHalfRowTab : styles.halfRowTab 
                            }
                            onPress = {() => !isFirstTabSelected && this.changeTab()}
                        >
                            <Text style = {
                                isFirstTabSelected ? 
                                {
                                    fontWeight:'bold',
                                    color: '#3F2058'
                                }:
                                {
                                    fontWeight: 'normal',
                                    color: '#000'
                                }
                            } 
                            >
                                Organização
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style = {
                                isFirstTabSelected ?
                                styles.halfRowTab : styles.selectedHalfRowTab
                            }
                            onPress = {() => isFirstTabSelected && this.changeTab()}
                        >
                            <Text style = {
                                !isFirstTabSelected ? 
                                {
                                    fontWeight:'bold',
                                    color: '#3F2058'
                                }:
                                {
                                    fontWeight: 'normal',
                                    color: '#000'
                                }
                            } 
                            >
                                Participação
                            </Text>
                        </TouchableOpacity>
                        
                    </View>
                }

                {(
                    isDataReady && 
                    
                        <ScrollView
                            style = {{width: '100%'}}
                            contentContainerStyle = {styles.center}
                        >
                            {listToRender.map(item => {
                                return <ListItem 
                                    item = {item} 
                                    key = {item.id}
                                    showStatus = {true}
                                />
                            })}

                            {(listToRender.length > 0 &&
                                <TouchableOpacity
                                    style = {{
                                        ...styles.outlineButton,
                                        width:'50%',
                                        margin: 5
                                    }}
                                    onPress = {() => 
                                        this.loadMoreEvents(isFirstTabSelected, nextPage)
                                    }
                                >
                                    {(isLoadingAPage && 
                                    <ActivityIndicator 
                                        size = 'small'
                                        color = '#000'
                                    />)
                                    || <Text style = {styles.outlineButtonLabel}> Carregar mais </Text>
                                    }
                                </TouchableOpacity>) ||
                                <Text
                                    style = {{ marginTop: 15}}
                                >
                                    Nenhum evento
                                </Text>
                            }
                        </ScrollView> 
                    
                ) ||
                    <ActivityIndicator 
                        color = '#000'
                        size = 'large'
                    />
                }

            </View>
        )
    }

}
export default FutureEventsPage;