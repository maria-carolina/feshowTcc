import {StyleSheet} from 'react-native';

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
        margin: 10,
    },

    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'roboto',
        marginBottom: 20
    },

    buttonLabel: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'roboto'

    },

    textInput: {
        borderBottomWidth: .5,
        borderBottomColor: 'grey',
        padding: 1,
        width: '70%',
        margin: 15,
        fontSize: 20,
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
        backgroundColor: '#6A356F',
        margin: 20,
        width: '70%', 
        color: 'white',
        
    }

})

export default Styles