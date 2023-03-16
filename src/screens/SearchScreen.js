import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Icon } from 'react-native-elements'
import Color from '../constants/Color'
import { SearchBar } from 'react-native-elements'
import { searchMovie } from '../services/movie'
import { useNavigation } from '@react-navigation/native'
import { showErrorAlert } from '../services/baseAPI'
import { LoadingComponent } from './LoadingComponent'

const SearchScreen = () => {
    const navigation = useNavigation();

    const [search, setSearch] = useState();
    const [searchData, setSearchData] = useState([])


    const updateKeyword = async (keyword) => {
        try {
            const response = await searchMovie(keyword)
            setSearch(keyword)
            setSearchData(response.results)
            // console.log(response)
        } catch (error) {
            showErrorAlert(error.message);
        }

    }

    useEffect(() => {
        console.log(searchData)
    }, [searchData])


    return (
        <View style={[styles.mainContainer]}>
            <View style={[styles.input]}>
                <TextInput
                    placeholder={"Search Movie"}
                    style={{ flex: 1 }}
                    onChangeText={(keyword) => updateKeyword(keyword)}
                />
                <Icon
                    name="search1"
                    type="ant-design"
                />
            </View>
            {
                searchData.length != 0 ?
                    <FlatList
                        data={searchData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    {
                                        index < 10 ?
                                            <TouchableOpacity
                                                onPress={()=>navigation.navigate('DetailMovie' , {
                                                    id : item.id
                                                })}
                                            >
                                                <View style={{ flex: 1, margin: 15 }}>
                                                    <Text style={{ color: Color.WHITE, fontSize: 16 }}>
                                                        {item.title}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            :
                                            null
                                    }
                                </View>
                            )
                        }}
                    /> :
                    null
            }

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "black"
    },
    input: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Color.WHITE,
        margin: 8,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 15,
        opacity: 1,
        paddingLeft: 10,
        paddingRight: 10
    },
})

export default SearchScreen