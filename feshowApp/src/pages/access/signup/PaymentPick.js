import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';


class PaymentPick extends Component {
    constructor(props){
        super(props)
        this.state = {payment: false}
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text>Tem cache fixo?</Text>
                <Text>Checkbox aqui</Text>
                <TextInput placeholder='digite o valor' />
                <TouchableOpacity>
                    <Text>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default PaymentPick;