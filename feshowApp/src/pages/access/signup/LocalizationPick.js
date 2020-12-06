import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import styles from '../../../styles';
import api from '../../../services/api'


class LocalizationPick extends Component{
    constructor(props){
        super(props)
        this.state = {ufs: [], cities: [], selectedUf:'-', selectedCity: '', choosenCityName: ''}
    }

    componentDidMount(){
        this.loadUFs(); 
    }

    loadUFs = async () => {
        let result = await api.get('http://servicodados.ibge.gov.br/api/v1/localidades/estados');
        for(uf in result.data){
            delete uf.regiao
            delete uf.sigla
        }

        this.setState({
            ufs: result.data
        })
    }

    loadCities = async (uf) => {
        console.log(uf)
        let cities;
        if(uf!=0){
            let result = await api.get(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
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
        let user = this.props.route.params.user;
        let nextPage = user.type === 2 ? 'initialPage' : 'genrePick';
        user.profile.city = this.state.choosenCityName;
        console.log(user)
        this.props.navigation.navigate(nextPage, {...this.props.route.params});
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
                    style = {styles.button}
                >
                    <Text 
                        style = {{...styles.buttonLabel, fontSize: 18}}
                    > Selecionar localização atual</Text>
                </TouchableOpacity>

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