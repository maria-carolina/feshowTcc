import React, { Component, useState, useEffect, useContext } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItemWithQuantity';
import styles from '../../../styles';
import api from '../../../services/api'
import ProfileUpdateContext from '../../../contexts/profileUpdate';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../../contexts/auth';


function EquipmentPick(props){

    const [equipment, setEquipment] = useState(null);
    const [selected, setSelected] = useState([]);
    const { alterProfile } = useContext(ProfileUpdateContext);
    const authContext = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        loadEquipment();
    }, []);

    const loadEquipment = async () => {

        if(props.route.params.list){
            for(let item of props.route.params.list){
                select({id: item.id, quantity: item.quantity});
                console.log(item);
            }
        }

        try{
            var result = await api.get('/getEquipments');
        }catch(e){
            throw e;
        }

        setEquipment(result.data);
    }

    const select = (equipment) => {
        let selectedAux = selected;
        if(selectedAux.some(item => item.id === equipment.id)){
            let filtered = selectedAux.filter(item => item.id != equipment.id);
            selectedAux = filtered;
        }else{
            selectedAux.push(equipment);
        }
        
        setSelected([...selectedAux])
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
        let user = props.route.params.user;
        let nextPage = user.type === 0 ? 'instrumentPick' : 'imagePick';
        user.profile.equipment = selected;
        navigation.navigate(nextPage, {user: user});
    }

    const finishUpdate = () => {
        alterProfile('equipment', equipment.filter(item => selected.includes(item.id)));
        navigation.navigate('profileEditPage');
    }

    

    let userType = props.route.params.user ? props.route.params.user.type : authContext.type;

    let title = userType === 1 ? 
    'o espaço tem disponível':'você precisa para tocar';


    let buttonLabel = selected.length > 0 ? 'Avançar':'Pular';

    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>{`Escolha o equipamento que ${title}`}</Text>
            <Text style = {styles.justifiedText}>
                Essa informação servirá apenas para auxiliar na organização de eventos, não será exibida publicamente.
            </Text>
            <FlatList 
                style = {styles.list}
                data = {equipment}
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
                <Text style = {styles.buttonLabel}>{buttonLabel}</Text>
            </TouchableOpacity>
        </View>
    )
    
}

export default EquipmentPick;