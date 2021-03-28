import React, { Component, useState, useEffect, useContext } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import ListItem from './ListItem';
import styles from '../../../styles';
import api from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import ProfileUpdateContext from '../../../contexts/profileUpdate';


function GenrePick(props) {
    const [genres, setGenres] = useState(null);
    const [selected, setSelected] = useState([]);

    const navigation = useNavigation();

    const profileUpdateContext = props.route.params.list ? useContext(ProfileUpdateContext) : null;

    useEffect(() => {
        loadGenres();
    }, [])

    const loadGenres = async () => {

        if(props.route.params.list){
            for(let item of props.route.params.list){
                console.log(item)
                select(item.id);
            }
        }

        try{
            var result = await api.get('/getGenres');
        }catch(e){
            throw e;
        }

        setGenres(result.data);
        
    }

    const select = (value) => {
        let selectedAux = selected;

        if(selectedAux.includes(value)){
            selectedAux.splice(selectedAux.indexOf(value), 1);
        }else{
            selectedAux.push(value);
        }
        
        setSelected([...selectedAux]);
    }

    const advance = () => {
        let user = props.route.params.user;
        user.profile.genres = selected;
        navigation.navigate('equipmentPick', {user: user});
    }

    const finishUpdate = () => {
        profileUpdateContext.alterProfile('genres', genres.filter(item => selected.includes(item.id)));
        navigation.navigate('profileEditPage');
    }

    return(
        <View style = {styles.container}>

            <Text style = {styles.title}>
                Escolha os gêneros que tenham a ver com seu trabalho
            </Text>

            {genres &&
                <>
                <FlatList
                    style = {styles.list}
                    data = {genres}
                    renderItem = {({item}) => (
                        <ListItem
                            item = {item}
                            select = {() => select(item.id)}
                            selected = {selected}
                            singlePick = {false} 
                        />
                    )}
                    keyExtractor = {(item, index) => index.toString()}
                />

                <TouchableOpacity 
                    onPress = {props.route.params.list ? () => finishUpdate() : () => advance()}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonLabel}>
                        {selected.length > 0 ? 'Avançar': 'Pular' }
                    </Text>
                </TouchableOpacity>
                </>
            }

        </View>
    )
    
}

export default GenrePick;