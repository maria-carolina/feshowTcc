import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../styles';
import { TouchableHighlight } from 'react-native-gesture-handler';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



class LineUpEditPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            lineup: this.props.route.params.lineup,
            limits: this.props.route.params.limits,
            eventId: this.props.route.params.eventId,
            isTimePickerVisible: false
        }
    }

    static contextType = AuthContext;

    save = async () => {
        console.log(this.state.lineup)
        var values = { 
            lineup: this.state.lineup.map(item => {
                return {
                    'artist_id': item.artists.id, 
                    'time': item.start_time
                }
            })
        }

        try{
            let result = await api.post(`/updateLineup/${this.state.eventId}`, values, 
            {headers: {
                Authorization: `Bearer ${this.context.token}`,
            }})

            if(result.data === 'ok'){
                this.props.navigation.navigate('eventPage');
                Alert.alert('Pronto', 'Line-up alterado com sucesso.')
                
            }else{
                console.log(result.data)
            }

        }catch(e){
            console.log(e)
        }
        
    }

    loadExclusionConfirmation = (artistId) => {
        Alert.alert(
            'Opa',
            'Realmente quer remover esse artista do lineup?',
            [
                {
                    text: 'Sim',
                    onPress: () => this.excludeFromLineup(artistId)
                },
                {
                    text: 'Não',
                    style: 'cancel'
                }
            ],
            
        )
    }

    excludeFromLineup = async (artistId) => {

        try{
            let result = await api.post(
                '/removeAssociation',
                {
                    artistId,
                    eventId: this.state.eventId
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`,
                    }
                }
            )

            if(result.data === 'ok'){
                let newLineup = this.state.lineup.filter(item => 
                    item.artists.id != artistId)

                
                if(newLineup.length > 0){
                    this.setState({
                        lineup: newLineup
                    })
                }else{
                    this.props.navigation.navigate('eventPage');
                }
                
                Alert.alert('Pronto', 'Artista foi removido do evento.');
            }else{
                Alert.alert('Ops', result.data.error);
            }
        }catch(e){
            console.log(e)
        }
    }

    verifyChoosenTime = (date) => {
        this.setState({
            isTimePickerVisible: false
        })

        if(date){
            let time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

            let splittedStart = this.state.limits.start_time.split(':');
            let splittedEnd = this.state.limits.end_time.split(':');

            let isTimeBiggerThanStart = date.getHours() > parseInt(splittedStart[0])
            || (date.getHours() == parseInt(splittedStart[0]) && date.getMinutes() > splittedStart[1]);

            let isTimeBiggerThanEnd = date.getHours() > parseInt(splittedEnd[0])
            || (date.getHours() == parseInt(splittedEnd[0]) && date.getMinutes() > splittedEnd[1]);

            let twoDaysEvent =  parseInt(splittedEnd[0]) < parseInt(splittedStart[0]);


            let validTime = (!twoDaysEvent && (isTimeBiggerThanStart) && (!isTimeBiggerThanEnd))
                ||(twoDaysEvent && (isTimeBiggerThanStart || !isTimeBiggerThanEnd));
            
            if(validTime){
                let equalShowtime = this.state.lineup.find(element => element.start_time === time);
                if(!equalShowtime){
                    let lineup = this.state.lineup.map(item => {
                        console.log(`${this.state.selected}`)
                        if(this.state.lineup.indexOf(item) === this.state.selected){
                            item.start_time = time;
                        }
                        return item;
                    });
                    
                    console.log(lineup)

                    this.setState({
                        lineup: lineup,
                        isTimePickerVisible: false
                    })

                }else{
                    Alert.alert('Horário inválido',
                    'Já existe um artista tocando nesse horário.')
                }
            }else{
                Alert.alert('Horário inválido', 
                'O horário escolhido deve estar dentro do horário do evento.')
            }
        }
    }

    render(){
        return(
            <View style = {{...styles.container, justifyContent: 'flex-start', marginTop: 15}}>
                <Text 
                    style = {
                        {...styles.title, 
                        fontSize: 18}
                    }
                >
                        Altere os horários ou remova alguém
                </Text>
                {this.state.lineup.map(item => {
                    return(
                        <View 
                            style = {{...styles.row, 
                                width: '90%',
                                borderBottomWidth: .5,
                                padding: 20,
                                position: 'relative'
                            }}
                            key = {this.state.lineup.indexOf(item)}
                        >

                            <Text style = {{
                                color: '#000',
                                fontSize: 16,
                                fontWeight: 'bold'
                            }}>
                                {item.artists.name || null}
                            </Text>

                            <TouchableOpacity 
                                style = {{
                                    ...styles.picker,
                                    width: '30%',
                                    right: 50,
                                    position: 'absolute'
                                }}

                                onPress = {() => 
                                    this.setState({
                                        isTimePickerVisible: true,
                                        selected: this.state.lineup.indexOf(item)
                                    })
                                }
                            >
                                <Text>
                                    {item.start_time} 
                                </Text>
                            </TouchableOpacity>
                            
                            <FontAwesome
                                name = {'close'}
                                size = {25}
                                color = {'#000'} 
                                style = {{
                                    position: 'absolute',
                                    right: 20
                                }}
                                onPress = {() => this.loadExclusionConfirmation(item.artists.id)}
                            />
                            
                        </View>
                    )
                })}

                <TouchableHighlight
                    style = {{
                        ...styles.button,
                        marginVertical: 15
                    }}
                >
                    <Text
                        style = {{
                            ...styles.buttonLabel,
                            fontSize: 18
                        }}
                        onPress = {() => this.save()}
                    >
                        Salvar alterações
                    </Text>
                </TouchableHighlight>

                {this.state.isTimePickerVisible &&
                    <DateTimePicker 
                        value = {new Date()}
                        mode = {'time'}
                        is24Hour = {true}
                        display = "default"
                        onChange = {(event, date) => this.verifyChoosenTime(date)}
                    />
                }

            </View>
        )
    }
}

export default LineUpEditPage;