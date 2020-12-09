import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import ListItem from './ListItemWithQuantity';
import styles from '../../../styles';
import api from '../../../services/api'



const instruments = ['guitarra', 'baixo', 'bateria', 'teclado']

class InstrumentPick extends Component {
    constructor(props){
        super(props)
        this.state = {instruments: [], selected: []}
    }

    componentDidMount(){
        this.loadInstrument();
    }

    loadInstrument = async () => {
        try{
            var result = await api.get('http://192.168.1.37:3001/getInstruments');
        }catch(e){
            throw e;
        }

        this.setState({
            instruments: result.data
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
        user.profile.instruments = this.state.selected;
        console.log(user);
        this.props.navigation.navigate('paymentPick', {user: user});
    }

    render(){
        return(
            <View style = {styles.container} >
                <Text style = {styles.title}>Seleciona os instrumentos ai</Text>
                <FlatList 
                    style = {styles.list}
                    data = {this.state.instruments}
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
                    <Text style = {styles.buttonLabel}>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default InstrumentPick;