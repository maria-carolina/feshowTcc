import React, { Component } from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';



const ListItem = (props) => {
    const navigation = useNavigation();

    const openEventPage = () => {
        navigation.navigate('eventPage', {eventId: props.item.id})
    }

    let splitted = props.item.start_date.split('-');
    let formattedDate = `${splitted[2]}/${splitted[1]}/${splitted[0]}`
    return(
        <View 
            style = {{
                ...styles.listItem,
                alignItems: 'center',
                flexDirection: 'row',
                height: 60,
                position: 'relative'
            }}
            key = {props.item.id.toString()}
        >
            <Text>{formattedDate}</Text>
            <TouchableOpacity
                onPress = {() => openEventPage()}
            >
                <Text
                    style = {{
                        marginLeft: 20,
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#3F2058',
                    }}
                >
                    {props.item.name}
                </Text>
            </TouchableOpacity>
            <Text 
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 10,
                    fontWeight: 'bold',
                    color: '#3F2058',
                }}
            >
                {props.item.status == 1 ? 'aberto' : 'feshow!'}
            </Text>
        </View>
    )
}

class FutureEventsPage extends Component{
    constructor(props){
        super(props)
        this.reload;
        this.state = {
            isFirstTabSelected: true
        }
    }

    static contextType = AuthContext;
    
    componentDidMount(){
        this.loadEvents(true);
        this.reload = this.props.navigation.addListener('focus', () => {
            this.loadEvents(true);
        })
        
    }

    loadEvents = async (isEventsToOrganize) => {
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

        try{
            let result = await api.get(
                `${url}/${page}`, 
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )
            
            if(!('error' in result.data)){
                console.log(result.data)
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

                this.setState(newState);
            }

        }catch(e){
            console.log(e)
        }
    }

    changeTab = () => {
        this.setState({
            isFirstTabSelected: !this.state.isFirstTabSelected
        })

        if(!this.state.eventsToParticipate){
            this.loadEvents(false);
        } 
        
        console.log(this.state.eventsToOrganize)
    }

    render(){
        var { isFirstTabSelected } = this.state;

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
                            <Text>Organização</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style = {
                                isFirstTabSelected ?
                                styles.halfRowTab : styles.selectedHalfRowTab
                            }
                            onPress = {() => isFirstTabSelected && this.changeTab()}
                        >
                            <Text>Participação</Text>
                        </TouchableOpacity>
                        
                    </View>
                }

                {(
                    isDataReady && 
                    <View style ={{
                        width: '90%'
                    }}>
                        <ScrollView
                            contentContainerStyle = {styles.center}
                            onScrollEndDrag = {() => this.loadMoreEvents(isFirstTabSelected, nextPage)}
                        >
                            {listToRender.map(item => {
                                return <ListItem 
                                    item = {item} 
                                    key = {item.id}
                                />
                            })}
                        </ScrollView>
                    </View>
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