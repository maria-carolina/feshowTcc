import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItem';
import styles from '../../../styles';


const genres = ['pop', 'jazz', 'soul', 'rock', 'funk', 'samba', 'hip-hop'];

class GenrePick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: []}
    }

    componentDidMount(){}

    loadGenres = () => {}
    select = (value) => {
        let selected = this.state.selected;
        if(selected.includes(value)){
            selected.splice(selected.indexOf(value), 1);
        }else{
            selected.push(value);
        }
        this.setState({
            selected: selected
        })
    }

    advance = () => {
        let user = this.props.route.params.user;
        user.profile.genres = this.state.selected;
        console.log(user);
        this.props.navigation.navigate('equipmentPick', {user: user});
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Seleciona o genero ai</Text>
                <FlatList
                    style = {styles.list}
                    data = {genres}
                    renderItem = {({item, index}) => (
                        <ListItem
                            item = {item}
                            index = {index}
                            select = {() => this.select(index)}
                            selected = {this.state.selected}
                            singlePick = {false} 
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