import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';


class BasicInfo extends Component {
    constructor(props){
        super(props)
        this.state = {payment: false}
    }

    save = () => {}

    advance = () => {
        console.log(this.props);
        this.props.navigation.navigate('localizationPick');
    }

    render(){
        return(
            <View style = {styles.container}>

                <Text style = {styles.title}>Registre-se</Text>
                <TextInput 
                    placeholder = 'qual o nome do espaço?'
                    style = {styles.textInput}
                />
                <TextInput 
                    placeholder = 'qual é a capacidade do espaço?'
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

export default BasicInfo;