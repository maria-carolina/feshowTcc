import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import InitialPage from '../pages/access/InitialPage'
import SignInPage from '../pages/access/SignInPage'

import EmailInsert from '../pages/access/passwordRecovery/EmailInsert';
import CodeInsert from '../pages/access/passwordRecovery/CodeInsert';
import PasswordRedefinition from '../pages/access/passwordRecovery/PasswordRedefinition';


import AccountInfo from '../pages/access/signup/AccountInfo';
import BasicInfo from '../pages/access/signup/BasicInfo';
import EquipmentPick from '../pages/access/signup/EquipmentPick';
import GenrePick from '../pages/access/signup/GenrePick';
import InstrumentPick from '../pages/access/signup/InstrumentPick';
import LocalizationPick from '../pages/access/signup/LocalizationPick';
import Address from '../pages/access/signup/Address';
import PaymentPick from '../pages/access/signup/PaymentPick';
import ProfileTypePick from '../pages/access/signup/ProfileTypePick';
import OpeningHoursPick from '../pages/access/signup/OpeningHoursPick';
import ImagePick from '../pages/access/signup/ImagePicker';


const Stack = createStackNavigator();

const AccessRoute = () => {
    return(
        <Stack.Navigator 
            initialRouteName = 'initialPage'
            headerMode = 'none'
        >
            <Stack.Screen
                component = {InitialPage}
                name = 'initialPage'
            />

            <Stack.Screen
                component = {SignInPage}
                name = 'signInPage'
            />

            <Stack.Screen
                component = {EmailInsert}
                name = 'emailInsert'
            />

            <Stack.Screen
                component = {CodeInsert}
                name = 'codeInsert'
            />

            <Stack.Screen
                component = {PasswordRedefinition}
                name = 'passwordRedefinition'
            />


            <Stack.Screen
                component = {AccountInfo}
                name = 'accountInfo' 
            />

            <Stack.Screen
                component = {ProfileTypePick}
                name = 'profileTypePick'
            />

            <Stack.Screen
                component = {BasicInfo}
                name = 'basicInfo' 
            />


            <Stack.Screen
                component = {LocalizationPick}
                name = 'localizationPick'
            />

            <Stack.Screen
                component = {Address}
                name = 'address'
            />

            <Stack.Screen
                component = {GenrePick}
                name = 'genrePick'
            />

            <Stack.Screen
                component = {EquipmentPick}
                name = 'equipmentPick'
            />

            <Stack.Screen
                component = {InstrumentPick}
                name = 'instrumentPick'
            />

            <Stack.Screen
                component = {OpeningHoursPick}
                name = 'openingHoursPick'
            />

            <Stack.Screen
                component = {PaymentPick}
                name = 'paymentPick'
            />

            <Stack.Screen
                component = {ImagePick}
                name = 'imagePick'
            />


        </Stack.Navigator>
    )
}

export default AccessRoute;