import {StyleSheet} from 'react-native';
import { PositionError } from 'react-native-geolocation-service';

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6A3A6F',
    },

    button: {
        backgroundColor: '#3F2058',
        width: '70%',
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 25,
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'roboto',
        marginBottom: 20
    },

    buttonLabel: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'

    },

    textInput: {
        backgroundColor: '#6A3F6F',
        borderRadius: 5,
        padding: 5,
        width: '70%',
        marginTop: 30,
        fontSize: 16,
        fontFamily: 'arial',
        fontWeight: '100',
        color: 'white'
    },
    
    list: {
        width: '70%',
        height: '40%',
        flexGrow: 0,
        
    },

    listItem: {
        width: '100%',
        borderBottomWidth: .5,
        borderBottomColor: 'grey',
        padding: 10,
        
    },

    itemText: {
        fontSize: 20,
        fontFamily: 'roboto',
        color: 'white',
        fontWeight: '100'
    },

    picker: {
        height: 50,
        backgroundColor: '#6A3F6F',
        margin: 10,
        width: '70%', 
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
        
    },

    error: {
        fontSize: 14,
        color: 'red',
        marginTop: 0,
        fontStyle: 'italic'
    },

    justifiedText: {
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        width: '70%',
        fontSize: 16
    },

    row: {
        flexDirection: 'row',
        position: 'relative'
    },
    

})

export default Styles