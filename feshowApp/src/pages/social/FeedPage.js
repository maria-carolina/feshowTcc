import React, { Component, useContext } from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import SolicitationModal from '../event/SolicitationModal';
import FeedEventItem from './FeedEventItem';
import FeedProfileItem from './FeedProfileITem';


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


class FeedPage extends Component{
    constructor(props){
        super(props)
        this.onfocus;
        this.state = {
            tabs: [
                {label: 'Artistas', value: 'artists'}, 
                {label: 'Eventos', value: 'events'}, 
                {label: 'Espaços', value: 'venues'}, 
                {label: 'Produtores', value: 'producers'}
            ],
            selectedTab: 'artists',
            solicitationVisible: false,
        }
    }
    
    static contextType = AuthContext;

    componentDidMount(){
        let tabToLoad = 'artists';
        if(this.context.user.type === 0){
            this.setState({
                tabs: [
                    {label: 'Eventos', value: 'events'},
                    {label: 'Artistas', value: 'artists'}, 
                    {label: 'Espaços', value: 'venues'}, 
                    {label: 'Produtores', value: 'producers'}
                ],
                selectedTab: 'events',
            })
            tabToLoad = 'events';

        }

        this.loadFeed(tabToLoad);
        //this.reload = this.props.navigation.addListener('focus', () => {
          //  this.loadFeed(tabToLoad);
        //})
    }

    loadFeed = async (tab) => {

        this.setState({
            [tab]: null
        })

        let route; 

        if(tab === 'events'){
            route = '/feedEvent';
        }else if(tab === 'artists'){
            route = '/feedArtist';
        }else if (tab === 'venues'){
            route = '/feedVenue';
        }else{
            route = '/feedProducer';
        }

        try{
            let result = await api.get(route, {
                    headers: { 
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )
            console.log(result.data[0].genres)
            if(!result.data.error){
                this.setState({
                    [tab]: result.data
                })
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){
            console.log(e)
        }
    }

    selectTab = (value) => {
        this.setState({
            selectedTab: value
        })

        if(!this.state[value]){
            this.loadFeed(value);
        }
    }


    showSolicitationModal = (event) => {
        var {id, start_date, start_time, end_time} = event;
        this.setState({
            solicitationVisible: true,
            limits: {start_date, start_time, end_time},
            choosenId: id
        })
    }

    closeSolicitationModal = () => {
        this.setState({
            solicitationVisible: false,
            limits: null,
            choosenId: null
        })

        this.loadFeed('events');
    }

    search = () => {} 

    filter = () => {}

    handleClick = () => {} 

    loadSearch = () => {}

    openFilterOptions = () => {}

    addAttribute = () => {}

    applyFilter = () => {}

    render(){
        var { tabs, selectedTab, events } = this.state;

        return(
            <View style = {styles.container}>

                {(tabs &&
                <ScrollView
                    contentContainerStyle = {{
                        alignItems: 'center'
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
                                onPress = {() => this.selectTab(item.value)}
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


                    {this.state[selectedTab] &&
                    <FeedList 
                        list = {this.state[selectedTab]}
                        type = {selectedTab}
                        showSolicitationModal = {(item) => this.showSolicitationModal(item)}
                    />
                    }

                    {!this.state[selectedTab] &&
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
                    visible = {this.state.solicitationVisible}
                    limits = {this.state.limits}
                    eventId = {this.state.choosenId}
                    token = {this.context.token}
                    closeModal = {() => this.closeSolicitationModal()} 
                />
            </View>
        )
    }
}

export default FeedPage;