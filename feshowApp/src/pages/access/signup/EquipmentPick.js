import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItemWithQuantity';
import styles from '../../../styles';
import api from '../../../services/api'


class EquipmentPick extends Component {
    constructor(props){
        super(props)
        this.state = {equipment: [],selected: []}
    }

    componentDidMount(){
        this.loadEquipment();
    }

    loadEquipment = async () => {
        try{
            var result = await api.get('/getEquipments');
        }catch(e){
            throw e;
        }

        this.setState({
            equipment: result.data
        })
    }

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
        let nextPage = user.type === 0 ? 'instrumentPick' : 'imagePick'
        user.profile.equipment = this.state.selected;
        console.log(user);
        this.props.navigation.navigate(nextPage, {user: user});
    }

    render(){
        let title = this.props.route.params.user.type === 1 ? 
        'o espaço tem disponível':'você precisa para tocar';
        let buttonLabel = this.state.selected.length > 0 ? 'Avançar':'Pular';

        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>{`Escolha o equipamento que ${title}`}</Text>
                <Text style = {styles.justifiedText}>
                    Essa informação servirá apenas para auxiliar na organização de eventos, não será exibida publicamente.
                </Text>
                <FlatList 
                    style = {styles.list}
                    data = {this.state.equipment}
                    renderItem = {({item}) => (
                        <ListItem
                            item = {item}
                            select = {() => this.select(item.id)}
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
                    <Text style = {styles.buttonLabel}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default EquipmentPick;