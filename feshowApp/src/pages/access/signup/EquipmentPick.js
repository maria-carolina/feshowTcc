import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItem';
import styles from '../../../styles';


const equipment = ['Microfone', 'Mic Stand', 'Amplificador', 'Monitor']

class EquipmentPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: []}
    }

    componentDidMount(){}

    loadEquipment = () => {}
    select = () => {}
    advance = () => {
        let nextPage = this.props.route.params.type === 'Artista' ? 
        'instrumentPick' : 'openingHoursPick'
        this.props.navigation.navigate(nextPage, {...this.props.route.params});
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Seleciona o equipamento ai</Text>
                <FlatList 
                    style = {styles.list}
                    data = {equipment}
                    renderItem = {({item}) => (
                        <ListItem
                            item = {item}
                            select = {() => this.select(item)}
                            selected = {this.state.selected} 
                        />
                    )}
                    keyExtractor = {(item, index) => index.toString()}
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

export default EquipmentPick;