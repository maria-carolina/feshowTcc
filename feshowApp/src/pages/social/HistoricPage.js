import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator} from 'react-native';
import ListItem from '../event/EventListItem';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import styles from '../../styles';
import { ScrollView } from 'react-native-gesture-handler';



class HistoricPage extends Component{
    constructor(props){
        super(props)
        this.onfocus;
        this.state = {
            pagesLoaded: 0
        }
    }

    static contextType = AuthContext;
    
    componentDidMount(){
        this.onfocus = this.props.navigation.addListener('focus', () => {
            this.loadEvents();
        })
    }

    loadEvents = async () => {
        try{
            let result = await api.get(
                `/pastEvents/${this.props.route.params.id}/1`,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token} `
                    }
                }
            )
            
            if(!('error' in result.data)){
                this.setState({
                    events: result.data,
                    pagesLoaded: 1
                })
            }else{
                Alert.alert("Ops", result.data.error)
            }

        }catch(e){
            console.log(e)
        }
    }

    loadMoreEvents = async () => {
        try{

            this.setState({
                isLoadingAPage: true
            })

            let result = await api.get(
                `/pastEvents/${this.props.route.params.id}/${this.state.pagesLoaded + 1}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token} `
                    }
                }
            )

            if(!('error' in result.data)){
                this.setState({
                    events: this.state.events.concat(result.data),
                    pagesLoaded: this.state.pagesLoaded + 1,
                    isLoadingAPage: false
                })
            }else{
                Alert.alert("Ops", result.data.error)
            }

        }catch(e){
            console.log(e)
        }
    }

    render(){
        var {events, isLoadingAPage} = this.state;
        return(
            <View style={{
                ...styles.container,
                justifyContent: 'flex-start'
            }}>
                {(this.state.events && 
                <ScrollView
                    style = {{
                        width: '100%'
                    }}
                    contentContainerStyle = {{
                        alignItems: 'center'
                    }}
                >
                    <Text style={{
                        ...styles.title,
                        alignSelf: 'flex-start',
                        marginLeft: 5
                    }}>
                        Histórico de Eventos
                    </Text>
                    {this.props.route.params.type === 2 &&
                        <Text style = {{
                            marginLeft: 5,
                            alignSelf: 'flex-start'
                        }}>
                            {`Organizados por ${this.props.route.params.name}`}
                        </Text>
                    }

                    {events.map(item => {
                        return(
                            <ListItem
                                item = {item} 
                                key = {item.id}
                                showStatus = {false}
                            />
                        )
                    })}

                    <TouchableOpacity
                        style = {{
                            ...styles.outlineButton,
                            width:'50%',
                            margin: 5
                        }}
                        onPress = {() => 
                            this.loadMoreEvents()
                        }
                    >
                        {(isLoadingAPage && 
                        <ActivityIndicator 
                            size = 'small'
                            color = '#000'
                        />)
                        || <Text style = {styles.outlineButtonLabel}> Carregar mais </Text>
                        }
                    </TouchableOpacity>
                </ScrollView>
                )||
                <ActivityIndicator 
                    size = 'large'
                    color = '#000'
                />
                }
        </View>
        )
    }
}

export default HistoricPage;