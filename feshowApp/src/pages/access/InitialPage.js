import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles';

const InitialPage = () => {
    const navigation = useNavigation();
    const openSignUp = () => {}

    const openSignInPage = () => {
        navigation.navigate('accountInfo');
    }
    return (
        <View style = {styles.container}>
            <Text>
                O logo aqui
            </Text>
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