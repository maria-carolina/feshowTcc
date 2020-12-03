import React from 'react';
import ola from '../pages/ola'
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppRoute = () => {
    return(
        <Stack.Navigator initialRouteName="ola">
            <Stack.Screen
                name="ola"
                component={ola}
            />
        </Stack.Navigator>
    )
}

export default AppRoute;