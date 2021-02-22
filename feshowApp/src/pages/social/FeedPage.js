import React, { Component } from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';

import AuthContext from '../../contexts/auth';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Format from '../utils/Format';



const FeedEventItem = (props) => {
    return(
        <TouchableOpacity
            style = {{
                width: '90%',
                height: props.loggedType === 0 ? 175 : 125,
                backgroundColor: 'white',
                marginBottom: 15,
                padding: 10
            }}
        >
            <View style = {{
                width: '100%',
                height: '50%',
                flex: 1,
                position: 'relative',
                marginTop: 10, 
                paddingLeft: 15
            }}>
                <View style = {styles.row}>
                    <Text 
                        style = {{
                            color: '#3F2058', 
                            fontSize: 22,
                            fontWeight: 'bold'
                        }}
                    >
                        {props.item.name}
                    </Text>

                </View>
                <Text>por {props.item.organizer.name}</Text>

                <View style = {{position: 'absolute', alignSelf: 'flex-end'}}>

                    <View style = {styles.row}>
                        <FontAwesome
                            name = {'home'}
                            size = {15}
                            color = {'#3f2058'} 
                        />
                        <Text> {props.item.venue.name}</Text>
                    </View>

                    <View style = {styles.row}>
                        <FontAwesome
                            name = {'calendar'}
                            size = {15}
                            color = {'#3f2058'} 
                        />
                        <Text> {props.item.start_date}</Text>
                    </View>
                    
                    <View style = {styles.row}>
                        <FontAwesome
                            name = {'clock-o'}
                            size = {15}
                            color = {'#3f2058'} 
                        />
                        <Text> {props.item.start_time} às {props.item.end_time}</Text>
                    </View>
                </View>
            </View>

            <View style = {{
                width: '100%',
                height: '50%',
                alignItems: 'center',
                paddingTop: props.loggedType === 0 ? 10 : 30
            }}>

                {(props.item.lineup.length > 0 &&
                    <View style = {styles.row}>
                        <Text style = {{
                            color: '#3F2058', 
                            fontWeight: 'bold',
                            fontSize: 16
                        }}> 
                            {'Lineup: '} 
                        </Text>
                        {props.item.lineup.map((item, index) => {
                            let artistName = index === 0 ? item.name : ` | ${item.name}`;
                            return <Text style = {{fontSize: 16}}>{artistName}</Text>;
                        })}
                    </View>) ||
                    <Text>Ainda não há ninguém no line-up</Text>
                }
                
                {props.loggedType === 0 && !props.item.inEvent &&
                <TouchableOpacity
                    style = {{
                        ...styles.outlineButton,
                        height: '50%',
                        marginTop: 15
                    }}
                >
                    
                    <Text style = {{
                        ...styles.outlineButtonLabel,
                        fontSize: 14
                    }}>
                        Participar desse evento
                    </Text>
                    
                </TouchableOpacity>
                }

                {props.loggedType === 0 && props.item.inEvent &&
                <Text>
                    Você já está no line-up!
                </Text>
                }
            </View>

            
        </TouchableOpacity>
    )
}

const FeedProfileItem = (props) => {
    var buttonLabel;
    if(props.type === 'artists'){
        buttonLabel = 'Convidar para evento';
    }else if(props.type === 'venues'){
        buttonLabel = 'Marcar show';
    }else{
        buttonLabel = 'Enviar mensagem';
    }
    
    return(
        <TouchableOpacity
            style = {{
                width: '90%',
                height: 160,
                backgroundColor: 'white',
                marginBottom: 15,
                flexDirection: 'row'
            }}
        >
            <View
                style = {{
                    width: '40%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >

                <Image
                    source = {require('../../assets/defaultProfileImage.jpeg')}
                    style = {{
                        width: '80%',
                        height: '80%',
                        borderRadius: 100,
                    }}
                    
                />

            </View>

            <View
                style = {{
                    width: '60%',
                    height: '100%',
                    paddingTop: 15,
                    justifyContent: 'center'
                }}
            >
                <Text
                    style = {{
                        fontSize: 18,
                        marginLeft: 15
                    }}
                >
                    {props.item.name}
                </Text>

                <View
                    style = {{
                        marginLeft: 17
                    }}
                >
                    <Text>{(props.item.city || props.item.address.city)}</Text>
                    {props.type !== 'producers' && 
                    <View style = {styles.row}>
                        {props.item.genres.map((item, index) => {
                            let genreName = index === 0 ? item.name : ` | ${item.name}`;
                            return <Text>{genreName}</Text>;
                        })}
                    </View>}                
                    
                    {(props.type === 'artists' && 
                        <Text>{props.item.members} membros</Text>
                    ) || (props.type === 'venues' &&
                        <Text>{props.item.capacity} pessoas</Text>
                    )}

                </View>

                <TouchableOpacity
                    style = {{
                        ...styles.outlineButton,
                        width: '90%',
                        marginTop: 10
                    }}
                >
                    <Text
                        style = {{
                            ...styles.outlineButtonLabel,
                            fontSize: 14
                        }}
                    >
                       {buttonLabel}
                    </Text>
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
    )
}

class FeedPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            tabs: [
                {label: 'Artistas', value: 'artists'}, 
                {label: 'Eventos', value: 'events'}, 
                {label: 'Espaços', value: 'venues'}, 
                {label: 'Produtores', value: 'producers'}
            ],
            selectedTab: 'artists',
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
                selectedTab: 'events'
            })
            tabToLoad = 'events';
        }

        this.loadFeed(tabToLoad);
    }

    loadFeed = async (tab) => {
        let route; ///= this.state.selectedTab === 'artists' ? '/feedArtist' : '/feedEvent';

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

            console.log(result.data);
            
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

                    {selectedTab === 'events' && 
                    events &&
                    events.map(item => (
                        <FeedEventItem
                            item = {item}
                            loggedType = {this.context.user.type}
                        />
                    ))}

                    {selectedTab !== 'events' &&
                    this.state[selectedTab] &&
                    this.state[selectedTab].map(item => (
                        <FeedProfileItem 
                            item = {item}
                            type = {selectedTab}
                        />
                    ))}

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
            </View>
        )
    }
}

export default FeedPage;