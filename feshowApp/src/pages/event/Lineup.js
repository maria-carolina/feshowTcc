import React, { useState, useContext } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../../styles';
import { useNavigation } from '@react-navigation/native';
import InvitationModal from './EventPageInvitation';
import AuthContext from '../../contexts/auth';

const Lineup = (props) => {
    const [invitationSuggestions, setInvitationSuggestions] = useState(null);
    const [timeLimits, setTimeLimits] = useState(null);
    const [isInvitationModalVisible, setIsInvitationModalVisible] = useState(false);

    const authContext = useContext(AuthContext);
    const navigation = useNavigation();

    const openInvitationModal = async () => {
        try{
            let suggestionsResult = await api.get(`/getSuggestions/${props.event.id}`, 
                {headers: {
                    Authorization: `Bearer ${authContext.token}`,
                }}
            )

            let limitsResult = await api.get(`/event/getDateTime/${props.event.id}`,
                {headers: {
                    Authorization: `Bearer ${authContext.token}`,
                }}
            )
            
            setInvitationSuggestions(suggestionsResult.data);
            setTimeLimits(limitsResult.data);
            setIsInvitationModalVisible(true);

        }catch(e){
            console.log(e);
        }
    }

    const openLineUpEditPage = async () => {

        let limits;

        if(!timeLimits){
            try{
                var result = 
                await api.get(`/event/getDateTime/${props.event.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authContext.token}`,
                        }
                    }
                )
            }catch(e){
                console.log(e)
            }

            if(!('error' in result.data)){
                limits = result.data;
            }else{
                Alert.alert('Ops', 'Ocorreu um erro, tente novamente.')
            }
        }else{
            limits = timeLimits;
        }

        navigation.navigate('lineUpEditPage', 
            {
                eventId: props.event.id,
                lineup: props.list,
                limits,
            }
        )

    }

    return(
        <View style = {{width: '90%'}}>
            
            {props.isOrganizer && props.list.length > 0 && props.event.status === 1 &&
            <TouchableOpacity
                style = {
                    {
                        ...styles.outlineButton,
                        alignSelf: 'flex-end',
                        right: 10,
                    }
                }
                onPress = {openLineUpEditPage}
            >
                <Text style = {styles.outlineButtonLabel}>
                    Alterar line-up
                </Text>
            </TouchableOpacity>}

            {props.list.map((item) => {
                return(
                    <View 
                        style = {{...styles.row, 
                            borderBottomWidth: .5,
                            padding: 20,
                            position: 'relative'
                        }}
                        key = {props.list.indexOf(item)}
                    >
                        <TouchableOpacity
                            onPress = {() => navigation.navigate('profilePage', {id: 3 /* tochange */})}
                        >
                            <Text style = {{
                                    color: '#000', 
                                    fontWeight: 'bold',
                                    marginLeft: 25
                                }}
                            >
                                {item.artists.name || null}
                            </Text>
                        </TouchableOpacity>

                        <Text style = {{
                            right: 80,
                            position: 'absolute'
                        }}>
                            {item.start_time} 
                        </Text>
                    </View>
                )
            })}

            {props.isOrganizer &&
            <TouchableOpacity
                style = {{
                    ...styles.button, 
                    alignSelf: 'center', 
                    width: '60%', 
                    marginVertical: 15
                }}
                onPress = {openInvitationModal}
            >
                <Text style = {{...styles.buttonLabel, fontSize: 18}}>
                    Convidar artistas
                </Text>
            </TouchableOpacity>}

            <InvitationModal
                visible = {isInvitationModalVisible} 
                suggestions = {invitationSuggestions}
                limits = {timeLimits}
                event = {props.event}
                token = {authContext.token}
                closeModal = {() => setIsInvitationModalVisible(false)}         
            />

        </View>
    )
}

export default Lineup;