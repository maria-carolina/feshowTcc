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


    select = (index) => {
        this.setState({
            selected: index
        })
    }

    advance = () => {
        let user = this.props.route.params.user;
        user.type = this.state.selected;
        this.props.navigation.navigate('basicInfo', {user: user})
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Escolha um tipo de perfil</Text>
                <FlatList 
                    style={styles.list}
                    data = {TYPES}
                    renderItem = {({item, index}) => (
                        <ListItem 
                            item = {item}
                            index = {index}
                            select = {() => this.select(index)}
                            selected = {this.state.selected}
                            singlePick = {true}
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