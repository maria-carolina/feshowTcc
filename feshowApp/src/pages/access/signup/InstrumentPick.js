import React, { useState, useEffect, useContext } from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import ListItem from './ListItemWithQuantity';
import styles from '../../../styles';
import api from '../../../services/api'
import { useNavigation } from '@react-navigation/native';
import ProfileUpdateContext from '../../../contexts/profileUpdate';


function InstrumentPick(props){
    const [instruments, setInstruments] = useState(null);
    const [selected, setSelected] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        loadInstruments();
    }, []);

    const loadInstruments = async () => {
        if(props.route.params.list){
            for(let item of props.route.params.list){
                select(item);
            }
        }

        try{
            var result = await api.get('/getInstruments');
        }catch(e){
            throw e;
        }

        setInstruments(result.data);
    }

   const select = (instrument) => {
        let selectedAux = selected;
        if(selectedAux.some(item => item.id === instrument.id)){
            let filtered = selectedAux.filter(item => item.id != instrument.id);
            selectedAux = filtered;
        }else{

            if(!instrument.quantity) selectedAux.push({...instrument, quantity: 1})
            else selectedAux.push(instrument);
        }
        
        setSelected([...selectedAux])
    }

    const quantityHandleChange = (num, index) => {
        let selectedAux = selected.map((item) => {
            if(item.id === index){
                item.quantity = num;
            }
            return item;
        });

        setSelected([...selectedAux]);
    }


    const advance = () => {
        let user = props.route.params.user;
        user.profile.instruments = selected;
        navigation.navigate('paymentPick', {user});
    }

    const finishUpdate = () => {
            const { alterProfile } = useContext(ProfileUpdateContext);

        alterProfile('instruments', selected);
        navigation.navigate('profileEditPage');
    }


    return(
        <View style = {styles.container} >
            <Text style = {styles.title}>Selecione os instrumentos utilizados no seu show</Text>
            <FlatList 
                style = {styles.list}
                data = {instruments}
                renderItem = {({item}) => (
                    <ListItem
                        item = {item}
                        select = {() => select(item)}
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
                <Text style = {styles.buttonLabel}>Avançar</Text>
            </TouchableOpacity>
        </View>
    )
    
}

export default InstrumentPick;