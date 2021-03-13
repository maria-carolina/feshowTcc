import React, { useState, useEffect, useContext } from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import ListItem from './ListItemWithQuantity';
import styles from '../../../styles';
import api from '../../../services/api'
import { useNavigation } from '@react-navigation/native';


function InstrumentPick(props){
    const [instruments, setInstruments] = useState(null);
    const [selected, setSelected] = useState(null);
    const { alterProfile } = useContext(ProfileUpdateContext);
    const navigation = useNavigation();

    useEffect(() => {
        loadInstruments();
    }, []);

    const loadInstruments = async () => {
        try{
            var result = await api.get('/getInstruments');
        }catch(e){
            throw e;
        }

        setInstruments(result.data);
    }

   const select = (value) => {
        let selectedAux = selected;
        if(selectedAux.some(item => item.id === value)){
            let filtered = selectedAux.filter(item => item.id != value);
            selectedAux = filtered;
        }else{
            selectedAux.push({id: value, quantity: 1});
        }

        setSelected(selectedAux);
    }

    const quantityHandleChange = (num, index) => {
        let selectedAux = selected.map((item) => {
            if(item.id === index){
                return {id: index, quantity: num}
            }
            return item;
        });

        setSelected(selectedAux);
    }


    const advance = () => {
        let user = this.props.route.params.user;
        user.profile.instruments = this.state.selected;
        console.log(user);
        this.props.navigation.navigate('paymentPick', {user: user});
    }

    const finishUpdate = () => {
        alterProfile('instruments', instruments.filter(item => selected.includes(item.id)));
        navigation.navigate('profileEditPage');
    }

    let buttonLabel = selected.length > 0 ? 'Avançar':'Pular';

    return(
        <View style = {styles.container} >
            <Text style = {styles.title}>Seleciona os instrumentos utilizados no seu show</Text>
            <FlatList 
                style = {styles.list}
                data = {instruments}
                renderItem = {({item}) => (
                    <ListItem
                        item = {item}
                        select = {() => select(item.id)}
                        selected = {selected} 
                        quantityHandleChange = {quantityHandleChange}
                    />
                )}
                keyExtractor = {(item, index) => index.toString()}
            />

            <TouchableOpacity 
                onPress = {props.route.params.list ? () => finishUpdate() : () => advance()}
                style = {styles.button}
            >
                <Text style = {styles.buttonLabel}>{buttonLabel}</Text>
            </TouchableOpacity>
        </View>
    )
    
}

export default InstrumentPick;