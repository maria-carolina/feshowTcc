import React, { useState, useEffect, useContext } from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView, Image, ActivityIndicator, Alert} from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';



const TABS = [
    {id: 0, label:'Descrição', value: 'description'},
    {id: 1, label:'Line-up', value: 'lineup'},
    {id: 2, label:'Postagens', value: 'posts'},
    {id: 3, label:'Avisos', value: 'warnings'}, 
]

function EventPage(){
    const [event, setEvent] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [isSolicitationModalVisible, setSolicitationModalVisible] = useState(false);
    const [isInvitationModalVisible, setInvitationModalVisible] = useState(false);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        //carrega o evento
    })

    return(
        <View>
            {event ? (
                <ScrollView>
                    <View>
                        <Text>{event.name}</Text>
                        <Text>{event.venue.name}</Text>
                        {/* etc */}
                    </View>

                    <View>
                        {TABS.map(item =>(
                            <TouchableOpacity
                                onPress = {() => setSelectedTab(item.id)}
                            >
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {selectedTab === 0 && (
                        <View>
                            <Text>{event.description}</Text>
                        </View>
                    )}

                    {selectedTab === 1 && <Lineup />}
                    {selectedTab === 2 && <Posts />}
                    {selectedTab === 3 && <Warnings />}


                </ScrollView>
            ):(
                <ActivityIndicator 
                    size = 'large'
                    color = '#000'
                />
            )}
        </View>
    )
}