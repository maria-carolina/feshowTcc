import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../../../styles';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const days = ['','domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']


const DayPicker = (props) => {
    return(
        <View style = {styles.row}>
                <Picker
                    selectedValue = {props.selected.initialDay}
                    style = {{...styles.picker, width: '45%'}}
                    onValueChange = {(value) => props.handleChange(value, true)}
                >
                    {days.map((day, index) => (
                        <Picker.Item  
                            label = {day} 
                            value = {index} 
                            key = {index}
                        />
                    ))}
                </Picker>

                <Text>às</Text>

                <Picker
                    selectedValue = {props.selected.finalDay}
                    enabled = {!!props.selected.initialDay}
                    style = {{...styles.picker, width: '45%'}}
                    onValueChange = {(value) => props.handleChange(value, false)}
                >
                    {days.map((day, index) => (
                        <Picker.Item  
                            label = {day} 
                            value = {index} 
                            key = {index}
                        />
                    ))}
                </Picker>

        </View>
    )
}


const TimePicker = (props) => {
    const [visible, setVisible] = useState(false)
    const [firstInput, setFirstInput] = useState(false)

    const setTime = (event, date) => {
        setVisible(false)
        let selected = props.selected;
        let time = `${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}`;

        if(firstInput){
            selected.initialHour = time;
        }else{
            selected.finalHour = time;
        }

        console.log(selected);
        props.handleChange(selected);  
    }

    return(
        <View style = {styles.row}>

            <TouchableOpacity
                style = {{...styles.picker, width: '45%'}} 
                onPress = {() => {
                    setVisible(true)
                    setFirstInput(true)
                }}
            >
                <Text>{props.selected.initialHour || ''}</Text>
            </TouchableOpacity>

            <Text> às </Text>
            
            <TouchableOpacity 
                style = {{...styles.picker, width: '45%'}} 
                disabled = {!props.selected.initialHour}
                onPress = {() => {
                    setVisible(true)
                    setFirstInput(false)
                }}
            >
                <Text>{props.selected.finalHour || ''}</Text>
            </TouchableOpacity>
  
            {visible && <DateTimePicker
                testID = "dateTimePicker"
                value = {new Date()}
                mode = {'time'}
                is24Hour = {true}
                display = "default"
                onChange = {setTime}
            />}
        </View>
    )
}

class OpeningHoursPick extends Component {
    constructor(props){
        super(props)
        this.state = {selected: {}, timePickerVisible: false}
    } 

    
    advance = () => {
        let user = this.props.route.params.user;
        user.profile.openinghours = this.state.selected;
        console.log(user);
        this.props.navigation.navigate('genrePick', {user: user})
    }

    dayPickerHandleChange = (value, initial) => {
        let selected = this.state.selected;
        if(initial){
            selected.initialDay = value
        }else{
            selected.finalDay = value
        }

        this.setState({
            selected: selected
        })
    }

    timePickerHandleChange = (selected) => {
        this.setState({
            selected: selected
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
                <Text 
                    style = {{...styles.title, fontSize: 20}}
                >Qual período o espaço funciona?</Text>

                <DayPicker
                    selected = {this.state.selected}
                    handleChange = {this.dayPickerHandleChange} 
                />
                

                <Text 
                    style = {{...styles.title, fontSize: 20}}
                >Qual horário o espaço funciona?</Text>


                <TimePicker
                    selected = {this.state.selected}
                    handleChange = {this.timePickerHandleChange}
                />

                <TouchableOpacity 
                    style = {styles.button}
                    onPress = {this.advance}
                >
                    <Text style = {styles.buttonLabel}>Avançar</Text>
                </TouchableOpacity>
                
            </View>
        )
    }
}

export default OpeningHoursPick;