import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import Color from '../constants/Color'
import { Icon } from 'react-native-elements'
import { CustomHeader } from '../components/HeaderComponent'
import { useNavigation } from '@react-navigation/native'
import { baseImage, getOngoing, getTopRated, } from '../services/movie'
import { showErrorAlert } from '../services/baseAPI'
import { LoadingComponent } from './LoadingComponent'

const StatusMovie = () => {
    const route = useRoute();
    const { name } = route.params;
    const { width, height } = Dimensions.get("window")
    const navigation = useNavigation()

    const [dataMovie, setDataMovie] = useState([])
    const [urlImage, setUrlImage] = useState()

    const getAllTopRated = async () => {
        try {
            const response = await getTopRated(2)
            const beautyResponse = JSON.stringify(response.results, null, 2);
            setDataMovie(response.results)

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getAllOngoing = async () => {
        try {
            const response = await getOngoing(2)
            const beautyResponse = JSON.stringify(response.results, null, 2);
            setDataMovie(response.results)

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getBaseImage = async () => {
        try {
            const response = await baseImage()
            const beautyResponse = JSON.stringify(response, null, 2);
            setUrlImage(response.secure_base_url + response.backdrop_sizes[1])

        } catch (error) {
            showErrorAlert(error.message);;
        }
    };

    useEffect(() => {
        getBaseImage()
    }, [])

    useEffect(() => {
        if (name == "Top Rated") {
            getAllTopRated();
        } else if (name == "OnGoing") {
            getAllOngoing();
        }
    }, [])

    return (

        <View style={[styles.mainContainer, { backgroundColor: Color.BLACK }]}>
            <CustomHeader
                title={name}
                customText={{
                    color: Color.WHITE
                }}
                leftIcon={
                    <Icon
                        name="arrow-left"
                        type="material-community"
                        color={Color.WHITE}
                    />
                }
                onClickLeftIcon={() => navigation.goBack()}
            />

            {dataMovie && urlImage ?
                <View style={[styles.sideContainer]}>
                    <FlatList
                        data={dataMovie}
                        numColumns={3}
                        style={{
                            padding: 10,
                        }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("DetailMovie", {
                                            id: item.id
                                        })}
                                    >
                                        <Image
                                            source={{ uri: urlImage + item.poster_path }}
                                            style={[styles.ongoingImage, { width: width / 3 - 25 }]}
                                        />
                                        <View style={{
                                            marginTop: 3,
                                        }}>
                                            <Text style=
                                                {[styles.subBab2,styles.title,{ width: width / 3 - 25,}]}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />

                </View>
                :
                null
            }
        </View>


    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    sideContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        margin: 8,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        marginTop: 0
    },
    title : {
        marginBottom: 10,
        textAlign: 'center',
        paddingLeft: 0
    },
    subBab2: {
        paddingLeft: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        opacity: 0.8
    },
    subBab: {
        paddingLeft: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 6
    },
    bab: {
        color: Color.WHITE,
        fontSize: 20,
        marginLeft: 10,
        fontWeight: "bold"
    },
    ongoingImage: {
        height: 170,
        marginBottom: 8,
        marginRight: 25,
        borderRadius: 15,
        justifyContent: "flex-end",
    },
    tvShowImage: {
        height: 300,
        width: 200,
        marginBottom: 8,
        marginRight: 25,
        borderRadius: 15,
        justifyContent: "flex-end",
    },
    scroll: {
        flex: 1,
    },
    inputLabel: {
        paddingHorizontal: 16
    }
});

export default StatusMovie