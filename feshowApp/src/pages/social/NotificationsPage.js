import React, { Component } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../styles';


const NotificationListItem = (props) => {
    return(
        <View 
            style = {{
                borderBottomWidth: .5,
                borderBottomColor: '#cecece',
                height: 90,
                padding: 15,
            }}
        >
            <Text
                style = {{
                    marginBottom: 10
                }}
            >
                {props.item.text}
            </Text>

            <Text
                style = {{
                    color: '#3F2058',
                    fontWeight: 'bold'
                }} 
            >
                {props.item.postedAt}
            </Text>
        </View>
    )
}

class NotificationsPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            notifications:[
                {
                    text: "Artista A aceitou o convite para participar do Evento x",
                    postedAt: "há 3 minutos atrás"
                },
                {
                    text: "Artista B aceitou o convite para participar do Evento x",
                    postedAt: "há 4 minutos atrás"
                },
                {
                    text: "Banda C recusou o convite para participar do Evento x",
                    postedAt: "24/01/2021"
                },
                {
                    text: "Artista D aceitou o convite para participar do Evento x",
                    postedAt: "20/01/2021"
                },
            ]
        }
    }
    
    componentDidMount(){}

    loadNotifications = () => {}

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
                        />
                    ))}

                </ScrollView>
            </View>
        )
    }
}

export default NotificationsPage;