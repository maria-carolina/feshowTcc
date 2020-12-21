import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        
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
        color: '#3F2058',
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
        backgroundColor: '#D8D8D8',
        borderRadius: 5,
        padding: 5,
        width: '70%',
        marginTop: 30,
        fontSize: 16,
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
        color: '#3F2058',
        fontWeight: '100'
    },

    picker: {
        height: 50,
        backgroundColor: '#D8D8D8',
        margin: 10,
        width: '70%', 
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center'
        
    },

    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 0,
        fontStyle: 'italic'
    },

    justifiedText: {
        textAlign: 'center',
        fontFamily: 'Roboto',
        color: '#3F2058',
        width: '70%',
        fontSize: 14,
        marginBottom: 15
    },

    row: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
    },

    rowInput: {
        width: '42%',
        position: 'relative',
        height: 40,
        marginTop: 20,
        backgroundColor: '#D8D8D8',
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },


})

export default Styles;