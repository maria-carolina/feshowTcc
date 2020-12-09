import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItem';
import styles from '../../../styles';
import api from '../../../services/api'



class GenrePick extends Component {
    constructor(props){
        super(props)
        this.state = {genres: [], selected: []}
    }

    componentDidMount(){
        this.loadGenres();
    }

    loadGenres = async () => {
        try{
            var result = await api.get('http://192.168.1.37:3001/getGenres');
        }catch(e){
            throw e;
        }

        this.setState({
            genres: result.data
        })
    }

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
                    data = {this.state.genres}
                    renderItem = {({item}) => (
                        <ListItem
                            item = {item}
                            select = {() => this.select(item.id)}
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