import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import styles from '../../../styles';


class OpeningHoursPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: []}
    }

    componentDidMount(){}

    loadGenres = () => {}
    select = () => {}
    advance = () => {}

    render(){
        return(
            <View style = {styles.container}>
                <Text>Seleciona o horario ai</Text>
                <TextInput />
                <TextInput />
                <Text>Seleciona os dias ai</Text>
                <TextInput />
                <TextInput />
                <TouchableOpacity>
                    <Text>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default OpeningHoursPick;