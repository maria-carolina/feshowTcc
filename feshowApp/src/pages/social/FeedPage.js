import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';


const FeedEventItem = (props) => {
    return(
        <TouchableOpacity
            style = {{
                width: '90%',
                height: 150,
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
                marginTop: 10
            }}>
                <View style = {styles.row}>
                    <Text 
                        style = {{color: '#3F2058', fontWeight: 'bold'}}
                    >
                        {props.item.name}
                    </Text>

                    <Text> @ </Text>
                    <Text
                        style = {{fontWeight: 'bold'}}
                    >
                        {props.item.venue}
                    </Text>
                </View>
                <Text>por {props.item.organizer}</Text>

                <View style = {{position: 'absolute', alignSelf: 'flex-end'}}>
                    <Text>{props.item.start_date}</Text>
                    <Text>{props.item.start_time} as {props.item.end_time}</Text>
                </View>
            </View>

            <View style = {{
                width: '100%',
                height: '50%',
                alignItems: 'center'
            }}>
                <View style={styles.row}>
                    <Text>Lineup: </Text>
                    {props.item.lineup.map((item, index) => {
                        let artistName = index === 0 ? item : ` | ${item}`;
                        return <Text>{artistName}</Text>;
                    })}
                </View>

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
            </View>

            
        </TouchableOpacity>
    )
}

const FeedProfileItem = (props) => {
    var buttonLabel;
    if(props.type === 'artists'){
        buttonLabel = 'Convidar para evento'
    }else if(props.type === 'venues'){
        buttonLabel = 'Marcar show'
    }else{
        buttonLabel = 'Enviar mensagem'
    }
    
    return(
        <TouchableOpacity
            style = {{
                width: '90%',
                height: 155,
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
                <View
                    style = {{
                        width: '80%',
                        borderRadius: 100,
                        backgroundColor: '#C4C4C4',
                        height: '80%',
                    }}
                >
                </View>

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
                    <Text>{props.item.city}</Text>
                    {props.type !== 'producers' && 
                    <View style = {styles.row}>
                        {props.item.genres.map((item, index) => {
                            let genreName = index === 0 ? item : ` | ${item}`;
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
            selectedTab: 'events',
            events: [
                {
                    name: 'Evento X',
                    venue: 'Bar do zé',
                    organizer: 'Matheus Pereira',
                    start_date: '24/01/2021',
                    start_time: '19:30',
                    end_time: '23:00',
                    lineup: ['Tulipa Ruiz', 'Caramelows', 'Tassia Reis']
                },
                {
                    name: 'Evento Z',
                    venue: 'Mundo Pensante',
                    organizer: 'Mundo Pensante',
                    start_date: '25/01/2021',
                    start_time: '19:30',
                    end_time: '23:00',
                    lineup: ['Maglore', 'Vanguart']
                },
                {
                    name: 'Evento Y',
                    venue: 'Bar Verde',
                    organizer: 'Matheus Pereira',
                    start_date: '26/01/2021',
                    start_time: '19:30',
                    end_time: '23:00',
                    lineup: ['Paula Fernandes', 'Henrique & Diego']
                }
            ],
            artists: [
                {
                    name: 'Boogarins',
                    city: 'Goiânia',
                    members: '4',
                    genres: ['rock', 'indie']
                },
                {
                    name: 'Metá Metá',
                    city: 'São Paulo',
                    members: '2',
                    genres: ['jazz', 'mpb', 'samba']
                },
                {
                    name: 'Rancore',
                    city: 'São Paulo',
                    members: '5',
                    genres: ['rock', 'punk']
                }
            ],
            venues: [
                {
                    name: 'Breve',
                    city: 'São Paulo',
                    capacity: '200',
                    genres: ['rock', 'indie']
                },
                {
                    name: 'Blue Note',
                    city: 'São Paulo',
                    capacity: '330',
                    genres: ['jazz', 'mpb']
                },
                {
                    name: 'Hangar 110',
                    city: 'São Paulo',
                    capacity: '600',
                    genres: ['rock', 'punk', 'metal']
                }

            ], 
            producers: [
                {
                    name: 'Matheus Pereira',
                    city: 'Florianópolis'
                },
                {
                    name: 'PWR',
                    city: 'São Paulo'
                },
                {
                    name: 'Boca Santana',
                    city: 'São Paulo'
                }
            ]
        }
    }
    
    static contextType = AuthContext;

    componentDidMount(){
        if(this.context.user.type === 0){
            this.setState({
                tabs: [
                    {label: 'Eventos', value: 'events'},
                    {label: 'Artistas', value: 'artists'}, 
                    {label: 'Espaços', value: 'venues'}, 
                    {label: 'Produtores', value: 'producers'}
                ]
            })
        }
    }

    loadFeed = () => {}

    selectTab = (value) => {
        this.setState({
            selectedTab: value
        })
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