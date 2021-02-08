import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, ActivityIndicator, Modal} from 'react-native';
import api from '../../services/api';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';
import { ScrollView } from 'react-native-gesture-handler';



const DetailModal = (props) => {
    return(
        <Modal
            visible = {props.visible}
            animationType = 'fade'
            transparent = {true}
            onRequestClose = {props.closeModal}
        >
            <View
                style = {{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {props.details &&
                <View
                    style = {{
                        width: '80%',
                        backgroundColor: '#FFF',
                        borderRadius: 5,
                        borderColor: '#cecece',
                        padding: 15
                    }}
                >
                    
                    <Text
                        style = {{
                            fontWeight: 'bold',
                            color: '#3F2058',
                            fontSize: 16
                        }}
                    >
                        {props.details.name}
                    </Text>

                    <Text
                        style = {{
                            marginBottom: 15
                        }}
                    >
                        Organizado por: {props.details.organizer_name}
                    </Text>

                    <View style = {styles.row}>

                        <Text
                            style = {{
                                marginRight: 25
                            }}
                        >
                            {props.details.start_date}
                        </Text>

                        <Text>
                            {props.details.start_time} as {props.details.end_time}
                        </Text>

                    </View>

                    <Text
                        style = {{
                            marginTop: 15
                        }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    </Text>
                </View>
                }
            </View>
        </Modal>
    )
}

const RequestListItem = (props) => {
    return(
        <View
            style = {{
                ...styles.row,
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: '#cecece',
                height: 110,
            }}
            key = {props.item.id}
        >
            <View
                style = {{
                    width: '60%'
                }}
            >
                
                <Text
                    style = {{
                        marginTop: 25
                    }}
                >
                    {`${props.item.organizer_name} ` +
                    `quer marcar um show aí dia ${props.item.start_date}`
                    } 
                </Text>

                <TouchableOpacity
                    style = {{
                        alignSelf: 'flex-end',
                        marginTop: 10
                    }}
                    onPress = {() => props.showModal(props.item)}
                >
                    <Text>Ver mais</Text>
                </TouchableOpacity>
            </View>

            <View 
                style = {{
                    width: '40%',
                }}
            >
                <View style = {{
                    ...styles.row, 
                    alignSelf: 'flex-end'
                }}>
                    <TouchableOpacity>
                        <Text 
                            style = {{
                                color: '#3F2058',
                            }}
                        >
                            Aceitar
                        </Text>
                    </TouchableOpacity>

                    <Text> | </Text>

                    <TouchableOpacity>
                        <Text
                            style = {{
                                color: 'red'
                            }}
                        >
                            Recusar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

class RequestListPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            requests: [
                {
                    id: '0',
                    organizer_name: 'Diego Freitas',
                    name: 'Evento X',
                    start_date: '26/02/2021',
                    start_time: '18h30',
                    end_time: '23h30',
                },
                {
                    id: '1',
                    organizer_name: 'Maria Carolina',
                    name: 'Evento Y',
                    start_date: '19/02/2021',
                    start_time: '17h30',
                    end_time: '22h30',
                }
            ],
            isModalVisible: false
        }
    }
    
    respondRequest = () => {}

    showModal = (item) => {
        this.setState({
            isModalVisible: true,
            selectedRequest: item
        })
    }

    render(){
        var { requests, isModalVisible, selectedRequest } = this.state;
        return(
            <View
                style = {{
                    ...styles.container,
                    justifyContent: 'flex-start'
                }}
            >
                <ScrollView
                    style = {{
                        width: '90%'
                    }}
                >
                    {(requests && 
                        requests.map(item => {
                            return(
                                <RequestListItem
                                    item = {item} 
                                    showModal = {(item) => this.showModal(item)}
                                />
                            )
                        })
                    )|| 
                    <ActivityIndicator 
                        size = 'large'
                        color = '#000'
                    />}

                </ScrollView>

                <DetailModal 
                    visible = {isModalVisible}
                    details = {selectedRequest}
                    closeModal = {() => {
                        this.setState({
                            isModalVisible: false
                        })
                    }}
                />
            </View>
        )
    }
}

export default RequestListPage;