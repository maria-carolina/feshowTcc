import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItem';
import styles from '../../../styles';


const genres = ['pop', 'jazz', 'soul', 'rock', 'funk', 'samba', 'hip-hop'];

class GenrePick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: ''}
    }

    componentDidMount(){}

    loadGenres = () => {}
    select = () => {}
    advance = () => {
        this.props.navigation.navigate('equipmentPick', {...this.props.route.params});
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Seleciona o genero ai</Text>
                <FlatList
                    style = {styles.list}
                    data = {genres}
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

export default GenrePick;