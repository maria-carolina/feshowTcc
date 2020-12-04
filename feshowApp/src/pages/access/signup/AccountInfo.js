import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';


class AccountInfo extends Component {
    constructor(props){
        super(props)
        this.state = {payment: false}
    }

    save = () => {}

    advance = () => {
        this.props.navigation.navigate('profileTypePick');
    }

    render(){
        return(
            <View style = {styles.container}>

                <Text style = {styles.title}>Registre-se</Text>
                <TextInput 
                    placeholder = 'digite o username'
                    style = {styles.textInput}
                />
                <TextInput 
                    placeholder = 'digite o email'
                    style = {styles.textInput}
                />
                <TextInput 
                    placeholder = 'digite a senha'
                    style = {styles.textInput} 
                    
                />
                <TextInput 
                    placeholder = 'repita a senha'
                    style = {styles.textInput} 
                />

                <TouchableOpacity
                    onPress = {() => this.advance()}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonLabel}>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default AccountInfo;