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
        backgroundColor: '#F2F2F2'
    },

    button: {
        backgroundColor: '#3F2058',
        width: '70%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 25,
        marginBottom: 5,
    },

    outlineButton: {
        borderWidth: .5,
        borderColor: '#3F2058',
        padding: 5,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        color: '#3F2058',
        fontWeight: 'bold',
        fontFamily: 'roboto',
    },

    buttonLabel: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },

    outlineButtonLabel: {
        fontSize: 15,
        color: '#3F2058',
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
        borderBottomColor: '#cecece',
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

    smallCard: {
        position: 'relative',
        width: '90%',
        height: 75,
        borderWidth: .5,
        padding: 5,
        margin: 5,
        borderColor: '#3F2058',
        borderRadius: 5,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3F2058'
    },

    cardButton: {
        position: 'absolute',
        marginTop: 5,
        top: '30%',
        right: 5,
        width: 100,
        height: 30,
        borderWidth: 1,
        borderColor: '#3F2058',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
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

    rowTab: {
        alignItems: 'center',
        padding: 18,
        height: 50,
    },

    halfRowTab: {
        alignItems: 'center',
        padding: 18,
        height: 50,
        width: '50%'
    },

    selectedHalfRowTab:{
        alignItems: 'center',
        padding: 18,
        height: 50,
        width: '50%',
        borderBottomWidth: 2,
        borderBottomColor: '#3F2058',
    },

    purpleText: {
        color: '#3F2058'
    },

    modalBox: {
        width: '70%',
        height: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },

    profileHeadInfos: {
        fontSize: 16
    }

})

export default Styles;