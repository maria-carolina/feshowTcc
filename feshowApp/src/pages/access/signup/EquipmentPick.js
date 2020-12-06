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

    quantityHandleChange = (num, index) => {

        let selected = this.state.selected.map((item) => {
            if(item.id === index){
                console.log('passa')
                return {id: index, quantity: num}
            }
            return item;
        })

        this.setState({
            selected: selected
        })

    }

    advance = () => {
        let user = this.props.route.params.user;
        let nextPage = user.type === 0 ? 'instrumentPick' : 'initialPage'
        user.profile.equipment = this.state.selected;
        console.log(user);
        this.props.navigation.navigate(nextPage, {user: user});
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
                            quantityHandleChange = {this.quantityHandleChange}
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