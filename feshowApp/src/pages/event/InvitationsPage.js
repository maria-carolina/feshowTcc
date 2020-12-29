import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import styles from '../../styles';

const TABS = [
    {label: 'Recebidos', value: 'received'},
    {label: 'Enviados', value: 'sent'}
]

class InvitationsPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedTab: TABS[0]
        }
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.loadInvitations();
    }


    loadInvitations = async () => {
        try{
            let result = await api.get('/invitations', {
                headers: {
                    Authorization: `Bearer ${this.context.token}`
                }
            })

            this.setState({
                invitations: result.data
            })

        }catch(e){
            console.log(e)
        }
    } 

    cancelInvitation = () => {} 

    loadConfirmation = () => {}

    confirmCancellation = () => {}

    respondParticipation = () => {} //aceitar solicitação de participação de artista em evento 

    respondInvitation = () => {}

    cancelSolicitation = () => {} 

    changeTab = (index) => {
        this.setState({
            selectedTab: TABS[index]
        })
    }

    render(){
        return(
            <View
                style = {{...styles.container, justifyContent: 'flex-start'}} 
            >
                <View style = {styles.row}>

                    <TouchableOpacity
                        style = {this.state.selectedTab.value === 'received' ? 
                            {
                                ...styles.rowTab,
                                width: '50%',
                                borderBottomWidth: 2,
                                borderBottomColor: '#3F2058',
                            }:
                            {
                                ...styles.rowTab,
                                width: '50%'
                            }

                        }
                        onPress = {() => this.changeTab(0)} 
                    >
                        <Text>{TABS[0].label}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = {this.state.selectedTab.value === 'sent' ?
                            {
                                ...styles.rowTab,
                                width: '50%',
                                borderBottomWidth: 2,
                                borderBottomColor: '#3F2058',
                            }:
                            {
                                ...styles.rowTab,
                                width: '50%'
                            }
                        }
                        onPress = {() => this.changeTab(1)} 

                    >
                        <Text>{TABS[1].label}</Text>
                    </TouchableOpacity>

                </View>
                
                {'invitations' in this.state &&
                this.state.invitations[this.state.selectedTab.value]
                .map((item) => {
                    console.log(item)
                    let text, options;
                    let tab = this.state.selectedTab.value;
                    let status = item.status;

                    if(tab === 'sent'){
                        text = status == 1 ?
                        `Você convidou ${item.artists.name} para o ${item.events.name}`:
                        `Você solicitou participação no ${item.events.name}`
                        options = (
                            <View
                                style = {{
                                    position: 'absolute',
                                    right: '5%',
                                    top: '100%',
                                    flexDirection: 'row'
                                }}
                            >

                                <TouchableOpacity>
                                    <Text
                                        style = {{
                                            color: 'red',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>   

                            </View>
                        )
                    }else{
                        text = status == 1 ?
                        `Você foi convidado para tocar no ${item.events.name}`:
                        `${item.artists.name} quer tocar no ${item.events.name}`
                        options = (
                            <View
                                style = {{
                                    position: 'absolute',
                                    right: 0,
                                    top: '75%',
                                    flexDirection: 'row'
                                }}
                            >
                                <TouchableOpacity
                                    style = {{
                                        padding: 10,
                                        borderRightWidth: 1
                                    }}
                                >
                                    <Text
                                        style = {{
                                            color: '#3F2058',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Aceitar
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                     style = {{
                                        padding: 10
                                    }}
                                >
                                    <Text
                                        style = {{
                                            color: 'red',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Recusar
                                    </Text>
                                </TouchableOpacity>
                                
                                
                            </View>
                        )
                    }
                    

                    return(
                        <View
                            style = {{
                                borderBottomWidth: .5,
                                padding: 25,
                                width:'90%',
                                position: 'relative',
                                flexDirection: 'row'
                            }}
                            key = {item.id}
                        > 
                            <Text
                                style ={{
                                    width: '50%'
                                }}
                            >
                                {text}
                            </Text>

                            {options}
                            
                        </View>
                    )
                    }
                )}
            </View>
        )
    }
    
}

export default InvitationsPage;