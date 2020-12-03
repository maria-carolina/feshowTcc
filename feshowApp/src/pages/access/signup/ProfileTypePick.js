import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';


class ProfileTypePick extends Component{
    constructor(props){
        super(props);
        this.state = { selected: ''}
    }

    select = () => {}
    advance = () => {}

    render(){
        return(
            <View>
                <Text>Escolha um tipo de perfil</Text>
                <FlatList />
                <TouchableOpacity>
                    <Text>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

export default ProfileTypePick;