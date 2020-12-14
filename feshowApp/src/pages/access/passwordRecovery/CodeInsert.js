import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import { useNavigation } from '@react-navigation/native';

const CodeInsert = (props) => {
    const [codeInput, setCodeInput] = useState();
    const [error, setError] = useState(false);
    const navigation = useNavigation()

    verifyCode = (code) => {
        if(code == props.route.params.code){
            navigation.navigate('passwordRedefinition', {email: props.route.params.email});
        }else{
            setError(true);
        }
    }
    
    return (
        <View style = {styles.container}>
            {error && <Text style = {styles.error}>Código incorreto</Text>}
            <TextInput
                style = {styles.textInput} 
                onChangeText = {(text) => setCodeInput(text)}
            />
            <TouchableOpacity
                style = {styles.button}
                onPress = {() => verifyCode(codeInput)}
            >
                <Text style = {styles.buttonLabel}>Verificar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CodeInsert;