import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';


class EquipmentPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: []}
    }

    componentDidMount(){}

    loadEquipment = () => {}
    select = () => {}
    advance = () => {}

    render(){
        return(
            <View>
                <Text>Seleciona o equipamento ai</Text>
                <FlatList />
                <TouchableOpacity>
                    <Text>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default EquipmentPick;