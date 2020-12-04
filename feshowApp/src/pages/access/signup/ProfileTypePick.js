import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItem';
import styles from '../../../styles';


const TYPES = ['Artista', 'Espaço', 'Produtor'];


class ProfileTypePick extends Component{
    constructor(props){
        super(props);
        this.state = { selected: ''}
    }

    select = (item) => {
        this.setState({
            selected: item
        })
    }

    advance = () => {
        this.props.navigation.navigate('basicInfo', 
        {type: this.state.selected})
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Escolha um tipo de perfil</Text>
                <FlatList 
                    style={styles.list}
                    data = {TYPES}
                    renderItem = {({item}) => (
                        <ListItem 
                            item = {item}
                            select = {() => this.select(item)}
                            selected = {this.state.selected}
                        />
                    )
                    }
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

export default ProfileTypePick;