import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CustomHeader } from '../components/HeaderComponent';
import { getRatedMovie, baseImage, deleteRateMovie } from '../services/movie';
import { Icon } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Color from '../constants/Color';
import { showErrorAlert } from '../services/baseAPI';
import { LoadingComponent } from './LoadingComponent';

const RatedMovie = () => {
    const [ratingMovie, setRatingMovie] = useState();
    const [urlImage, setUrlImage] = useState()
    const { width, height } = Dimensions.get("window")

    const navigation = useNavigation();

    const getRatingMovie = async () => {
        try {
            const response = await getRatedMovie()
            const beautyResponse = JSON.stringify(response.results, null, 2);
            console.log(beautyResponse)
            setRatingMovie(response.results)

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const deleteRatingMovie = async (id) => {
        try {
            const response = await deleteRateMovie(id)
            const beautyResponse = JSON.stringify(response, null, 2);
            console.log(beautyResponse)
            getRatingMovie();

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getBaseImage = async () => {
        try {
            const response = await baseImage()
            const beautyResponse = JSON.stringify(response, null, 2);
            setUrlImage(response.base_url + response.backdrop_sizes[1])

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    useEffect(() => {
        getRatingMovie();
        getBaseImage();
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            <CustomHeader
                title="Rated Movie"
                customText={{
                    color: Color.WHITE
                }}
                leftIcon={
                    <Icon
                        name="arrow-left"
                        type="material-community"
                        color={Color.WHITE}
                        onPress={()=>navigation.goBack()}
                    />
                }
            />
            {
                ratingMovie && urlImage ?
                    <View style={{flex:1}}>
                        <FlatList
                            data={ratingMovie}
                            numColumns={2}
                            style={{
                                padding: 10,
                            }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ margin: 10, flex: 1}}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("DetailMovie", {
                                                id: item.id
                                            })}
                                        >
                                            <Image
                                                source={{ uri: urlImage + item.poster_path }}
                                                style={{ width: width / 2 - 30, height: 250, borderRadius: 10 }}
                                            />

                                        </TouchableOpacity>
                                        <View style={{
                                            marginTop: 3
                                        }}>
                                            <Text style=
                                                {[styles.subBab2,
                                                {
                                                    width: width / 2 - 30,
                                                    marginBottom: 10,
                                                    textAlign: 'center',
                                                    paddingLeft: 0
                                                }]}>{item.title}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: width / 2 - 30 }}>
                                            <View style={{ flexDirection: "row", paddingLeft: 14, paddingBottom: 20 }}>
                                                <Image style={{ height: 20, width: 20 }} source={require("../assets/images/star.png")} />
                                                <Text style={[styles.subBab2, { paddingLeft: 2 }]}>{item.rating}</Text>
                                            </View>
                                            <Icon
                                                name='trash'
                                                type='entypo'
                                                color={Color.WHITE}
                                                size={20}
                                                onPress={()=>deleteRatingMovie(item.id)}
                                            />
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    :
                    null
            }
        </View >
    )
}

const styles = StyleSheet.create({
    input: {
        margin: 8,
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 16,
        marginTop: 0
    },
    errorMessage: {
        color: Color.WHITE
    },
    subBab2: {
        paddingLeft: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        opacity: 1
    },
    subBab: {
        paddingLeft: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 6,
        opacity: 1
    },
    bab: {
        color: Color.WHITE,
        fontSize: 20,
        marginLeft: 10,
        fontWeight: "bold",
        opacity: 1
    }
})

export default RatedMovie