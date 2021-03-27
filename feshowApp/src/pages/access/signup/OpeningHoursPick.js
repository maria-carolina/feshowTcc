import React, { useContext, useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../../../styles';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import ProfileUpdateContext from '../../../contexts/profileUpdate';


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

function OpeningHoursPick(props){

    const [selected, setSelected] = useState({
        initialDay: '',
        finalDay: '',
        initialHour: '',
        finalHour: '',
    });
    const navigation = useNavigation();

    useEffect(() => {
        if(props.route.params.period){
            const {initialDay, finalDay, initialHour, finalHour} = props.route.params.period;
            console.log(props.route.params.period);
            setSelected({
                initialDay: initialDay.id,
                finalDay: finalDay.id,
                initialHour,
                finalHour,
            })
        }
    }, [])
    
    const advance = () => {
        if(selected.initialDay != '' && selected.finalDay === ''){
            Alert.alert('', 'Escolha até que dia o espaço funciona ou deixe os ambos campos vazios se for o caso.');
        }else{
            let user = props.route.params.user;
            user.profile.openinghours = selected;
            navigation.navigate('genrePick', {user: user})
        }
    }

    const finishUpdate = () => {
        const { alterProfile } = useContext(ProfileUpdateContext);
        alterProfile('openinghours', selected);
        navigation.navigate('profileEditPage');
    }

    const dayPickerHandleChange = (value, firstInput) => {
        let selectedAux = selected;

        if(value == 0) value = '';

        if(firstInput){
            selectedAux.initialDay = value;
        }else{
            selectedAux.finalDay = value;
        }
        
        setSelected({...selectedAux});
    }

    const timePickerHandleChange = (date, firstInput) => {
        let selectedAux = selected;
        let time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

        if(firstInput){
            selectedAux.initialHour = time;
        }else{
            selectedAux.finalHour = time;
        }

        setSelected({...selectedAux});
    }

    return(
        <View style = {styles.container}>
            <Text 
                style = {{...styles.title, fontSize: 20}}
            >
                Qual período o espaço funciona?
            </Text>

            <DayPicker
                selected = {selected}
                handleChange = {dayPickerHandleChange} 
            />
            
            <Text 
                style = {{...styles.title, fontSize: 20}}
            >
                Qual horário o espaço funciona?
            </Text>

            <TimePicker
                selected = {selected}
                handleChange = {timePickerHandleChange}
            />

            <TouchableOpacity 
                style = {styles.button}
                onPress = { props.route.params.period ? finishUpdate : advance}
            >
                <Text style = {styles.buttonLabel}>Avançar</Text>
            </TouchableOpacity>
            
        </View>
    )
    
}

export default OpeningHoursPick;