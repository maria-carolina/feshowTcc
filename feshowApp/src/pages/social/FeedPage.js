import React, { Component, useContext } from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Format from '../utils/Format';
import SolicitationModal from '../event/SolicitationModal';
import { useNavigation } from '@react-navigation/native';



const FeedEventItem = (props) => {
    const { user } = useContext(AuthContext);
    return(
        <View
            style = {{
                width: '100%',
                height: user.type === 0 ? 175 : 125,
                backgroundColor: 'white',
                marginBottom: 15,
                padding: 10
            }}
            key = {props.item.id.toString()}
        >
            <View 
                style = {{
                    width: '100%',
                    height: '50%',
                    flex: 1,
                    position: 'relative',
                    marginTop: 10, 
                    paddingLeft: 15
                }}
            >
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
                paddingTop: user.type === 0 ? 10 : 30
            }}>

                {(props.item.lineup.length > 0 &&
                    <View style = {{...styles.row, marginBottom: 15}}>
                        <Text style = {{
                            color: '#3F2058', 
                            fontWeight: 'bold',
                            fontSize: 16
                        }}> 
                            {'Lineup: '} 
                        </Text>
                        {props.item.lineup.map((item, index) => {
                            let artistName = index === 0 ? item.name : ` | ${item.name}`;
                            return (
                                <Text 
                                    key = {item.id}
                                    style = {{fontSize: 16}}
                                >
                                    {artistName}
                                </Text>
                            );
                        })}
                    </View>) ||
                    <Text style = {{marginBottom: 15}}>Ainda não há ninguém no line-up</Text>
                }
                
                {user.type === 0 && !props.item.inEvent &&
                <TouchableOpacity
                    style = {{
                        ...styles.outlineButton,
                        height: '50%',
                    }}
                    onPress = {props.showSolicitationModal}
                >
                    
                    <Text style = {{
                        ...styles.outlineButtonLabel,
                        fontSize: 14
                    }}>
                        Participar desse evento
                    </Text>
                    
                </TouchableOpacity>
                }

                {user.type === 0 && props.item.inEvent &&
                <Text>
                    Você já está no line-up!
                </Text>
                }
            </View>

            
        </View>
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

    const navigation = useNavigation();

    handleButtonClick = () => {
        if(props.type === 'artists'){
            navigation.navigate('profilePageInvitation', {artist: props.item})
        }else if(props.type == 'venues'){
            navigation.navigate('requestPage', {venue: props.item})
        }
    }

    return(
        <View
            style = {{
                width: '100%',
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
                            return <Text key={item.artist_genres.genre_id}>{genreName}</Text>;
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
                    onPress = {handleButtonClick}
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
        </View>
    )
}

const FeedList = (props) => {
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
                        type = {props.type}
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