import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, ActivityIndicator, SwipeableListView, Alert} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import { ScrollView } from 'react-native-gesture-handler';



const ListItem = (props) => {
    let splitted = props.startDate.split('-');
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
            key = {props.id}
        >
            <Text>{formattedDate}</Text>
            <Text
                style = {{
                    marginLeft: 20,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#3F2058',
                }}
            >
                {props.name}
            </Text>
            <Text 
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontWeight: 'bold',
                    color: '#3F2058',
                }}
            >
                {props.status == 1 ? 'aberto' : 'feshow!'}
            </Text>
        </View>
    )
}

class FutureEventsPage extends Component{
    constructor(props){
        super(props)
        this.reload;
        this.state = {}
    }

    static contextType = AuthContext;
    
    componentDidMount(){
        this.loadEvents();
        this.reload = this.props.navigation.addListener('focus', () => {
            this.loadEvents();
        })
    }

    loadEvents = async () => {
        try{
            let result = await api.get(
                'futureEvents/1',
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )
            
            if(!('error' in result.data)){
                let events = result.data;
                let tabs;
                if(this.context.user.type == 0){

                    tabs = [
                        {
                            label: 'Participação', 
                            value: 'artistEvents', 
                            selected: true,
                            pagesLoaded: 1
                        },
                        {
                            label: 'Organização', 
                            value: 'events', 
                            selected: false,
                            pagesLoaded: 1
                        },
                    ]
                }else if (this.context.user.type == 1){
                    tabs = [
                        {
                            label: 'Acontecerão no espaço', 
                            value: 'venueEvents', 
                            selected: true,
                            pagesLoaded: 1
                        },
                        {
                            label: 'Organização', 
                            value: 'events', 
                            selected: false,
                            pagesLoaded: 1
                        },
                    ]
                }else{
                    events = {
                        events: result.data
                    };
                    tabs = {
                        pagesLoaded: 1
                    };
                }

            
                this.setState({
                    tabs: tabs,
                    events: events,
                })
            }
        }catch(e){
            console.log(e)
        }

        
    }

    loadMoreEvents = async (tab) => {
        let index = tab.pagesLoaded;

        try{
            let result = await api.get(
                `futureEvents/${index+1}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )

            if(!('error' in result.data)){
                let events = this.state.events
                let newEvents = events[(tab.value||'events')].concat(result.data[(tab.value||'events')])
                //events.concat(DATA1);
                events[(tab.value||'events')] = newEvents;
                tab.pagesLoaded++;
    
                let newTabs;
                if(this.context.user.type != 2){
                    newTabs = this.state.tabs;
                    newTabs[this.state.tabs.indexOf(tab)] = tab;
                }else{
                    newTabs = tab;
                }
                
                this.setState({
                    events,
                    tabs: newTabs
                })
            }

        }catch(e){
            console.log(e)
        }
        
    }

    handleClick = () => {}

    changeTab = (index) => {
        let tabs = this.state.tabs.map(item => {
                if(this.state.tabs.indexOf(item) == index){
                    item.selected = true
                }else{
                    item.selected = false
                }

                return item;
            }
        );
        
        this.setState({
            tabs: tabs
        })
    }

    render(){
        var isProducer = this.context.user.type == 2;
        var selectedTab;
        if(this.state.tabs && !isProducer){
            selectedTab = this.state.tabs.filter(item => item.selected == true)[0];
        }else if (isProducer){
            selectedTab = this.state.tabs
        } 

        return(
            <View style = {{...styles.container, justifyContent: 'flex-start'}}>
                {this.state.tabs && !isProducer &&
                    <View style = {styles.row}>

                        <TouchableOpacity
                            style = {
                                this.state.tabs[0].selected ?
                                styles.selectedHalfRowTab : styles.halfRowTab
                            }
                            onPress = {() => this.changeTab(0)}
                        >
                            <Text>{this.state.tabs[0].label}</Text>
                        </TouchableOpacity>

                        
                        <TouchableOpacity
                            style = {
                                this.state.tabs[1].selected ?
                                styles.selectedHalfRowTab : styles.halfRowTab
                            }
                            onPress = {() => this.changeTab(1)}
                        >
                            <Text>{this.state.tabs[1].label}</Text>
                        </TouchableOpacity>
                    

                    </View>
                }

                {   
                    (   
                        this.state.events && 
                        <View style ={{
                            width: '90%'
                        }}>
                            <ScrollView
                                onScrollEndDrag = {() => {this.loadMoreEvents(selectedTab)}}
                                contentContainerStyle = {styles.center}
                            >
                                {this.state.events[(selectedTab.value||'events')].map(item => {
                                    return <ListItem 
                                        name = {item.name}
                                        startDate = {item.start_date}
                                        status = {item.status}
                                        key = {item.id}
                                    />
                                })}
                            </ScrollView>
                        </View>
                    )
                    ||
                    <ActivityIndicator 
                        size = 'large'
                        color = '#000'
                    />
                }
                
            </View>
        )
    }
}

export default FutureEventsPage;