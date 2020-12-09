import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

const Form = () => {
    return;
}

class ProfileEditPage extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    loadUserData = () => {}
    save = () => {}
    deleteProfile = () => {}
    confirmProfileDelete = () => {}
    
    render(){
        return(
            <View>
                <Form />
            </View>
        )
    }
}

export default ProfileEditPage;