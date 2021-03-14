import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import styles from '../../../styles';
import {apiIbge as api} from '../../../services/api'


class LocalizationPick extends Component{
    constructor(props){
        super(props)
        this.state = {
            ufs: [], 
            cities: [], 
            selectedUf:'-', 
            selectedCity: '', 
            choosenCityName: ''
        }
    }

    componentDidMount(){
        this.loadUFs(); 
    }

    loadUFs = async () => {
        try{
            var result = await api.get();
        }catch(e){return;}

        this.setState({
            ufs: result.data
        })
        
    }

    loadCities = async (uf) => {
        console.log(uf)
        let cities;
        if(uf!=0){
            let result = await api.get(`/${uf}/municipios`);
            cities = result.data;
        }else{
            cities = [''];
        }

        this.setState({
            cities: cities,
            selectedUf: uf
        })
    }

    getCurrentLocalization = () => {}

    advance = () => {
        if(this.state.choosenCityName != ''){
            let user = this.props.route.params.user;
            let nextPage = user.type === 2 ? 'imagePick' : 'genrePick';
            user.profile.city = this.state.choosenCityName;
            console.log(user)
            this.props.navigation.navigate(nextPage, {user: user});
        }else{
            Alert.alert('','Escolha sua cidade.');
        }
    }

    render(){

        let ufs = [<Picker.Item label = {'UF'} value = {0} key = {0}/>].concat(
            this.state.ufs.map((item) => 
                <Picker.Item  
                    label = {item.nome} 
                    value = {item.id} 
                    key = {item.id}
                />
        ));

        let cities = [<Picker.Item label = {'Cidade'} value = {0} key = {0}/>].concat(
            this.state.cities.map((item) => 
            <Picker.Item  
                label = {item.nome} 
                value = {item.id} 
                key = {item.id}
            />
        ));

        return(
            <View style = {styles.container}>
                <Text style = {styles.title}>Selecione a localização</Text>

                <Picker
                    selectedValue={this.state.selectedUf}
                    style={styles.picker}
                    onValueChange={(value) => this.loadCities(value)}
                >
                    {ufs}
                </Picker>

                <Picker
                    selectedValue={this.state.selectedCity}
                    style={styles.picker}
                    onValueChange={(value, index) => 
                        this.setState({
                            selectedCity: value,
                            choosenCityName: this.state.cities[index - 1].nome
                        })}
                >
                    {cities}
                </Picker>

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

export default LocalizationPick;