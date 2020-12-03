import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';


class GenrePick extends Component {
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
            <View>
                <Text>Seleciona o genero ai</Text>
                <FlatList />
                <TouchableOpacity>
                    <Text>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default GenrePick;