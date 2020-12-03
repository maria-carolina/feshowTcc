import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';

class InstrumentPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: []}
    }

    componentDidMount(){}

    loadInstrument = () => {}
    select = () => {}
    advance = () => {}

    render(){
        return(
            <View>
                <Text>Seleciona os intrumentos ai</Text>
                <FlatList />
                <TouchableOpacity>
                    <Text>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default InstrumentPick;