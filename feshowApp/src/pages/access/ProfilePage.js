import React, { Component, useContext } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../styles';
import Auth from '../../contexts/auth';

const LogoutForTest = () => {
    const { signOut } = useContext(Auth)
    return(
        <TouchableOpacity 
            style = {styles.button}
            onPress = {() => signOut()}
        >
            <Text style = {styles.buttonLabel}> Sair </Text>
        </TouchableOpacity>
    )
}


const artistInvitationModal = () => {
    return;
}

const noticeModal = () => {
    return;
}

class ProfilePage extends Component{
    constructor(props){
        super(props)
        this.state = {type: ''}
    }

    

    componentDidMount(){}
    loadProfileData = () => {}

    openProfileEditPage = () => {}
    openCalendarPage = () => {}
    openHistoricPage = () => {}
    openChatPage = () => {}
    openRequestPage = () => {}
    openNoticeModal = () => {}
    deleteNotice = () => {}

    inviteArtist = () => {}
    
    render(){
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}> OLÁ</Text>
                <LogoutForTest />
            </View>
        )
    }
}

export default ProfilePage;