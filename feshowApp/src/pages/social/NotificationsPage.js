import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';


const NotificationListItem = (props) => {
    return(
        <TouchableOpacity 
            style = {{
                borderBottomWidth: .5,
                borderBottomColor: '#cecece',
                height: 80,
                padding: 15,
            }}
            onPress = {props.onClick}
            key = {props.item.id.toString()}
        >
            <Text
                style = {{
                    marginBottom: 10
                }}
            >
                {props.item.message}
            </Text>

            <Text
                style = {{
                    color: '#3F2058',
                    fontWeight: 'bold'
                }} 
            >
                {props.item.time}
            </Text>
        </TouchableOpacity>
    )
}

class NotificationsPage extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    static contextType = AuthContext
    
    componentDidMount(){
        this.loadNotifications();
    }

    loadNotifications = async () => {
        try{
            let result = await api.get(
                '/notifications',
                {
                    headers:{
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )

            if(!result.data.error){
                this.setState({
                    notifications: result.data
                })
            }else{
                Alert.alert('ops', result.data.error)
            }
        }catch(e){

        }
    }

    handleItemClick = (status, id) => {
        if(status !== 0){
            let route = status === 1 ? 'invitationsPage' : 'eventPage';
            let values = status === 1 ? {} : {id};
            this.props.navigation.navigate(route, values);
        }
    }

    render(){
        var { notifications } = this.state;
        return(
            <View
                style = {styles.container}
            >
                <ScrollView
                    style = {{
                        width: '90%'
                    }}
                    
                >
                    <Text style ={{
                        ...styles.title,
                        alignSelf: 'flex-start'
                    }}>
                        Notificações
                    </Text>

                    {notifications && notifications.map(item => (
                        <NotificationListItem
                            item = {item}
                            onClick = {() => this.handleItemClick(item.status, item.auxiliary_id)}
                            key = {item.id}
                        />
                    ))}

                </ScrollView>
            </View>
        )
    }
}

export default NotificationsPage;