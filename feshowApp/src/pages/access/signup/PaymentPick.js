import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';


class PaymentPick extends Component {
    constructor(props){
        super(props)
        this.state = {payment: ''}
    }

    save = (payment) => {
        let user =  this.props.route.params.user;
        user.profile.cache = payment;
        this.props.navigation.navigate('imagePick', {user: user});

        console.log(user);
    }

    render(){
        let buttonLabel = this.state.payment != '' ? 'Avançar' : 'Pular';
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Tem cachê fixo?</Text>
                <Text style = {styles.justifiedText}>
                    Esse valor é apenas informativo. Esse aplicativo não realiza pagamentos.
                </Text>
                <TextInput 
                    placeholder = 'digite o valor' 
                    style = {styles.textInput}
                    keyboardType = 'numeric'
                    onChangeText = {(text) => this.setState({
                        payment: text
                    })}
                />
                <TouchableOpacity 
                    style = {styles.button}
                    onPress = {() => this.save(this.state.payment)}
                >
                    <Text style = {styles.buttonLabel}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default PaymentPick;