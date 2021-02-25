import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, ScrollView, ActivityIndicator } from "react-native";
import styles from "../../styles";
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeedEventItem from './FeedEventItem';
import FeedProfileItem from './FeedProfileITem';

const SearchPage = () => {
    const { token } = useContext(AuthContext);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const search = async (text) => {
        setResult(null);
        setLoading(true);

        let result = await api.post(
            'searchFeed', 
            {name: text},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        setLoading(false);

        if(!result.data.error){
            setResult(result.data);
        }else{
            Alert.alert('Ops', result.data.error);
        }
    }

    return(
        <View style = {{
            ...styles.container,
            justifyContent: 'flex-start'
        }}>
            <TextInput
                style = {{
                    ...styles.textInput
                }}
                onChangeText = {(text) => {
                    if(text.length > 0){
                        search(text)
                    }else if(result != null){
                        setResult(null);
                    }
                        
                }} 
            />
            {result && 
                <ScrollView
                    style = {{
                        width: '90%',
                        marginTop: 15
                    }}
                >
                    {result.length > 0 ? 
                        (
                            result.map(item => {
                                return item.type === 3 ? (
                                    <FeedEventItem
                                        key = {item.id.toString()}
                                        item = {item}                            
                                    />
                                ):(
                                    <FeedProfileItem
                                        key = {item.user_id.toString()}
                                        item = {item}
                                        type = {item.type}
                                    />
                                ) 
                            })
                        ):(
                            <View
                                style = {styles.container}
                            >
                                <Text>
                                    Nada encontrado.
                                </Text>
                            </View>
                        )

                    }
                </ScrollView>
            }

            {loading && 
                <View
                    style = {styles.container}
                >
                    <ActivityIndicator
                        size = 'large'
                        color = '#000' 
                    />
                </View>
            }
        </View>
    )
}

export default SearchPage;