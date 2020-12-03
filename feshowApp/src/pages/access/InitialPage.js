import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const InitialPage = () => {
    openSignUp = () => {}
    openSignInPage = () => {}
    return (
        <View>
            <Text>
                O logo aqui
            </Text>
            <TouchableOpacity><Text>Cadastrar-se</Text></TouchableOpacity>
            <TouchableOpacity><Text>Entrar</Text></TouchableOpacity>
        </View>
    )
}

export default InitialPage;