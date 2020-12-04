import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import ListItem from './ListItem';
import styles from '../../../styles';


const instruments = ['guitarra', 'baixo', 'bateria', 'teclado']

class InstrumentPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: []}
    }

    componentDidMount(){}

    loadInstrument = () => {}
    select = () => {}
    advance = () => {
        this.props.navigation.navigate('paymentPick', {...this.props.route.params});
    }

    render(){
        return(
            <View style = {styles.container} >
                <Text style = {styles.title}>Seleciona os instrumentos ai</Text>
                <FlatList 
                    style = {styles.list}
                    data = {instruments}
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

export default InstrumentPick;