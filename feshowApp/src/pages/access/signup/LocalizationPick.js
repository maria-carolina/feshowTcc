import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';


class LocalizationPick extends Component{
    constructor(props){
        super(props)
        this.state = {selectedState:'', selectedCity: ''}
    }

    loadCities = () => {}
    getCurrentLocalization = () => {}
    advance = () => {}

    render(){
        return(
            <View>
                <TextInput placeholder='selecione o seu estado'/>
                <TextInput placeholder='seleciona sua cidade' />
                <TouchableOpacity>
                    <Text>Selecionar localização atual</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

export default LocalizationPick;