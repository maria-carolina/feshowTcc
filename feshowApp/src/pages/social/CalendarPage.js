import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import api from '../../services/api';
import styles from '../../styles';
import Format from '../utils/Format';
import AuthContext from '../../contexts/auth';


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
        this.state = {}
    }

    static contextType = AuthContext;
    
    componentDidMount(){
        this.loadEvents();
    }

    loadEvents = async () => {
        const userId = this.props.route.params ? 
        this.props.route.params.id : this.context.user.id;
        try{
            let result = await api.get(
                `/schedule/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )

            if(!result.data.error){
                let markedDates = {};
                for(let item of result.data){
                    markedDates[item.start_date] = {marked: true}
                }

                this.setState({
                    markedDates, 
                    events: result.data
                })

            }else{
                Alert.alert('Ops', result.data.error);
            }

        }catch(e){
            console.log(e)
        }
    }

    changeSelectedDay = (dateString) => {
        let eventOnSelectedDay = this.state.events.filter(item => item.start_date === dateString)[0];
        this.setState({
            selectedDay: dateString,
            eventOnSelectedDay
        })
    }

    render(){   
        var {selectedDay, eventOnSelectedDay, markedDates} = this.state;
        if(selectedDay){
            const today = new Date()
            today.toLocaleString('default', { month: 'long' })
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
                        ...markedDates,
                        [selectedDay]:{
                            selected: true
                        }
                    }} 

                    onDayPress = {(day) => this.changeSelectedDay(day.dateString)}
                />

                {eventOnSelectedDay && 
                    <TouchableOpacity
                        style = {{
                            borderTopWidth: 1,
                            borderTopColor: '#cecece',
                            width: '100%',
                            padding: 15
                        }}
                        onPress = {() => this.props.navigation.navigate('eventPage', {id: eventOnSelectedDay.id})}
                    >
                        <Text
                            style = {{
                                fontSize: 18,
                                marginBottom: 10,  
                                fontWeight: 'bold'
                            }}
                        >
                            {Format.formatDate(selectedDay)}
                        </Text>

                        <Text
                            style = {{
                                fontSize: 16,
                                color: '#3F2058'
                            }}
                        >
                            {`${eventOnSelectedDay.name} @ ${eventOnSelectedDay.venue.name} das 18h00 às 23h00`}  
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

export default CalendarPage;