import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../../../styles';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const days = ['','Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']


const DayPicker = (props) => {
    return(
        <View style = {styles.row}>
            <Picker
                selectedValue = {props.selected.initialDay}
                style = {{...styles.picker, width: '40%'}}
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

            <Text style = {{alignSelf: 'center', color: '#3F2058'}}>à</Text>

            <Picker
                selectedValue = {props.selected.finalDay}
                enabled = {props.selected.initialDay != ''}
                style = {{...styles.picker, width: '40%'}}
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
        if(date){
            props.handleChange(date, firstInput);
        }  
    }

    return(
        <View style = {styles.row}>

            <TouchableOpacity
                style = {{...styles.picker, width: '38%'}} 
                onPress = {() => {
                    setVisible(true)
                    setFirstInput(true)
                }}
            >
                <Text style={{color: '#000', fontSize: 16}}>{props.selected.initialHour}</Text>
            </TouchableOpacity>

            <Text style={{alignSelf: 'center', color: '#3F2058'}}> às </Text>
            
            <TouchableOpacity 
                style = {{...styles.picker, width: '38%'}} 
                disabled = {props.selected.initialHour === ''}
                onPress = {() => {
                    setVisible(true)
                    setFirstInput(false)
                }}
            >
                <Text style={{color: '#000', fontSize: 16}}>{props.selected.finalHour}</Text>
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
        this.state = {
            selected: {
                initialDay: '', 
                finalDay: '', 
                initialHour: '', 
                finalHour: ''
             }, 
            timePickerVisible: false
        }
    } 

    
    advance = () => {
        if(this.state.selected.initialDay != '' && this.state.selected.finalDay === ''){
            Alert.alert('', 'Escolha até que dia o espaço funciona ou deixe os ambos campos vazios se for o caso.');
        }else{
            let user = this.props.route.params.user;
            user.profile.openinghours = this.state.selected;
            this.props.navigation.navigate('genrePick', {user: user})
        }
    }

    dayPickerHandleChange = (value, firstInput) => {
        let selected = this.state.selected;
        console.log(value);

        if(value == 0) value = '';

        if(firstInput){
            selected.initialDay = value;
        }else{
            selected.finalDay = value;
        }
        

        this.setState({
            selected: selected
        })
    }

    timePickerHandleChange = (date, firstInput) => {
        let selected = this.state.selected;
        let time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

        if(firstInput){
            selected.initialHour = time;
        }else{
            selected.finalHour = time;
        }

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
        let buttonLabel = Object.keys(this.state.selected).length > 0 ? 'Avançar':'Pular';
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
                    <Text style = {styles.buttonLabel}>{buttonLabel}</Text>
                </TouchableOpacity>
                
            </View>
        )
    }
}

export default OpeningHoursPick;