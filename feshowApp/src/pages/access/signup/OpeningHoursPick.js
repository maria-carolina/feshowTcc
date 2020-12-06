import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from '../../../styles';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const days = ['','domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

class OpeningHoursPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: {}, timePickerVisible: false}
    }

    componentDidMount(){}

    loadGenres = () => {}
    select = () => {}
    advance = () => {}

    setTime = (event, date) => {
        let selected = this.state.selected;
        selected.initialHour = `${date.getHours()}:${date.getMinutes()}`;
        this.setState({
            selected: selected,
            timePickerVisible: false
        })
    }

    showTimePicker = (field) => {
        this.setState({
            timePickerVisible: true,
            timeSelection: field
        })
    }

    render(){
        return(
            <View style = {styles.container}>
                <Text style = {{...styles.title, fontSize: 20}}>Qual período o espaço funciona?</Text>
                <Picker
                    selectedValue={this.state.selected.initialDay}
                    style={styles.picker}
                    onValueChange={(value) => {
                        let selected = this.state.selected;
                        selected.initialDay = value
                        this.setState({
                            selected: selected
                        })
                    }}
                    
                >
                    {days.map((day, index) => (
                        <Picker.Item  
                            label = {day} 
                            value = {day} 
                            key = {index}
                        />
                    ))}
                </Picker>

                <Picker
                    selectedValue={this.state.selected.finalDay}
                    style={styles.picker}
                    onValueChange={(value) => {
                        let selected = this.state.selected;
                        selected.finalDay = value
                        this.setState({
                            selected: selected
                        })
                    }}
                    
                >
                    {days.map((day, index) => (
                        <Picker.Item  
                            label = {day} 
                            value = {day} 
                            key = {index}
                        />
                    ))}
                </Picker>

                <Text style = {{...styles.title, fontSize: 20}}>Qual horário o espaço funciona?</Text>
                <TouchableOpacity
                    style = {styles.picker} 
                    onPress = {this.showTimePicker}
                >
                    <Text>{this.state.selected.initialHour || ''}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style = {styles.picker} 
                    onPress = {this.showTimePicker}
                >
                    <Text>{this.state.selected.finalHour || ''}</Text>
                </TouchableOpacity>

                {this.state.timePickerVisible && <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={'time'}
                    is24Hour={true}
                    display="default"
                    onChange={this.setTime}
                />}

                <TouchableOpacity style = {styles.button}>
                    <Text style = {styles.buttonLabel}>Avançar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default OpeningHoursPick;