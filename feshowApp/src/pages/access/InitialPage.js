import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';


const InitialPage = () => {
    const navigation = useNavigation();
    const openSignUp = () => {}

    const openSignInPage = () => {
        
        navigation.navigate('accountInfo');
    }
    return (
        <View style = {styles.container}>
            <FontAwesome name = {'amplifier'} size = {200} color = {'#3A0E54'}/>
            <TouchableOpacity 
                onPress = {openSignInPage}
                style = {styles.button}

            >
                <Text style = {styles.buttonLabel}>Cadastrar-se</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style = {styles.button}
            >
                <Text style = {styles.buttonLabel}>Entrar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default InitialPage;