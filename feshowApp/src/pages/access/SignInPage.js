import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

const signInPage = () => {
    signIn = () => {}
    return(
        <View>
            <TextInput placeholder='username'/>
            <TextInput placeholder='senha'/>
            <TouchableOpacity><Text>Esqueci a senha</Text></TouchableOpacity>
        </View>
    )
}

export default signInPage;