import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItemWithQuantity';
import styles from '../../../styles';


const equipment = ['Microfone', 'Mic Stand', 'Amplificador', 'Monitor']

class EquipmentPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: []}
    }

    componentDidMount(){}

    loadEquipment = () => {}
    select = (value) => {
        let selected = this.state.selected;
        if(selected.some(item => item.id === value)){
            let filtered = selected.filter(item => item.id != value)
            selected = filtered;
        }else{
            selected.push({id: value, quantity: 1});
        }
        console.log(selected);
        this.setState({
            selected: selected
        })
    }
    advance = () => {
        let user = this.props.route.params.user;
        user.profile.equipment = this.state.selected;
        this.props.navigation.navigate('instrumentPick', {user: user});
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Seleciona o equipamento ai</Text>
                <FlatList 
                    style = {styles.list}
                    data = {equipment}
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

export default EquipmentPick;