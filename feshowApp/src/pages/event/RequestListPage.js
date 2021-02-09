import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, ActivityIndicator, Modal} from 'react-native';
import api from '../../services/api';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';
import { ScrollView } from 'react-native-gesture-handler';
import Format from '../utils/Format';



const DetailModal = (props) => {

    if(props.details){
        var date = Format.formatDate(props.details.solicitation.start_date);
        var start_time = Format.formatTime(props.details.solicitation.start_time);
        var end_time = Format.formatTime(props.details.solicitation.end_time);
    }
    
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
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                {props.details &&
                <View
                    style = {{
                        width: '80%',
                        backgroundColor: '#FFF',
                        borderColor: '#cecece',
                        padding: 15,
                    }}
                >
                    
                    <Text
                        style = {{
                            fontWeight: 'bold',
                            color: '#3F2058',
                            fontSize: 18
                        }}
                    >
                        {props.details.solicitation.name}
                    </Text>

                    <Text
                        style = {{
                            marginBottom: 15,
                            fontWeight: 'bold',
                            fontSize: 16
                        }}
                    >
                        Organizado por: {props.details.organizer.name}
                    </Text>

                    <View style = {styles.row}>

                        <Text
                            style = {{
                                marginRight: 25
                            }}
                        >
                            {date}
                        </Text>

                        <Text>
                            {start_time} as {end_time}
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

    var date = Format.formatDate(props.item.solicitation.start_date)
    return(
        <View
            style = {{
                ...styles.row,
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: '#cecece',
                height: 110,
            }}
            key = {props.item.solicitation.id}
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
                    {`${props.item.organizer.name} ` +
                    `quer marcar um show aí dia ${date}`
                    } 
                </Text>

                <TouchableOpacity
                    style = {{
                        alignSelf: 'flex-end',
                        marginTop: 10
                    }}
                    onPress = {() => props.showModal(props.item)}
                >
                    <Text
                        style = {{
                            color: '#3F2058',
                            fontWeight: 'bold'
                        }}
                    >
                        Ver mais
                    </Text>
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
            isModalVisible: false
        }
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.loadRequests();
    }

    loadRequests = async () => {
        try{
            let result = await api.get(
                'indexRequests',
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )

            if(!('error' in result.data)){
                
                
                
                this.setState({
                    requests: result.data
                })
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){

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