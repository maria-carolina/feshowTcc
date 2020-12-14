import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';


const InitialPage = () => {
    const navigation = useNavigation();

    const openSignUp = () => {
        navigation.navigate('accountInfo');
    }

    const openSignInPage = () => {
        navigation.navigate('signInPage');
    }
    
    return (
        <View style = {styles.container}>
            <FontAwesome name = {'amplifier'} size = {200} color = {'#3A0E54'}/>
            <TouchableOpacity 
                onPress = {openSignUp}
                style = {styles.button}

            >
                <Text style = {styles.buttonLabel}>Cadastrar-se</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress = {openSignInPage}
                style = {styles.button}
            >
                <Text style = {styles.buttonLabel}>Entrar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default InitialPage;