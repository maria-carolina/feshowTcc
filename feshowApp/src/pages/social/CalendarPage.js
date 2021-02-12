import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import api from '../../services/api';
import styles from '../../styles';
import Format from '../utils/Format';

LocaleConfig.locales['br'] = {
    monthNames: ['Janeiro','Fevereiro','Março','Abril',
    'Maio','Junho','Julho','Agosto',
    'Setembro','Outubro','Novembro','Dezembro'],

    monthNamesShort: [
        'jan.', 'fev.', 'mar.', 'abr.',
        'mai.', 'jun.', 'jul.', 'aug.',
        'set.', 'out.', 'nov.', 'dez.'
    ],

    dayNames: ['Domingo','Segunda-Feira','Terça-Feira',
    'Quarta-Feira','Quinta-Feira','Sexta-Feira','Sábado'],

    dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sab.'],
    today: 'Hoje'
}; 

LocaleConfig.defaultLocale = 'br';

class CalendarPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            markedDates: {
                '2021-02-16': {
                    marked: true,
                },
                '2021-02-18': {
                    marked: true
                },
                '2021-02-20': {
                    marked: true
                },
            }
        }
    }
    
    componentDidMount(){}

    loadEvents = () => {}

    changeSelectedDay = (dateString) => {
        this.setState({
            selectedDay: dateString
        })
    }

    render(){

        if(this.state.selectedDay){
            const today = new Date()
            today.toLocaleString('default', { month: 'long' })
            console.log(today)
        }
        
        return(
            <View
                style = {{
                    ...styles.container, 
                    justifyContent: 'flex-start'
                }}
            >
                <Calendar
                    style = {{
                        width: 325,
                        marginTop: 15
                    }}

                    theme = {{
                        calendarBackground: '#F2F2F2',
                        selectedDayBackgroundColor: '#3F2058',
                        arrowColor: '#3F2058'

                    }}

                    markedDates = {{
                        
                        '2021-02-16': {
                            marked: true,

                        },
                        '2021-02-18': {
                            marked: true
                        },
                        '2021-02-20': {
                            marked: true
                        },
                        [this.state.selectedDay]:{
                            selected: true,
                        }, 
                        
                    }} 

                    onDayPress = {(day) => this.changeSelectedDay(day.dateString)}
                />

                {this.state.selectedDay && 
                    <View
                        style = {{
                            borderTopWidth: 1,
                            borderTopColor: '#cecece',
                            width: '100%',
                            padding: 15
                        }}
                    >
                        <Text
                            style = {{
                                fontSize: 18,
                                marginBottom: 10,  
                                fontWeight: 'bold'
                            }}
                        >
                            {Format.formatDate(this.state.selectedDay)}
                        </Text>

                        <Text
                            style = {{
                                fontSize: 16,
                                color: '#3F2058'
                            }}
                        >
                            Show do Cleber @ Bar da Lu das 18h00 às 23h00
                        </Text>
                    </View>
                }
            </View>
        )
    }
}

export default CalendarPage;