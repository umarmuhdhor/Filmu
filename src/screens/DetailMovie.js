import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Icon } from 'react-native-elements'
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native'
import Modal from 'react-native-modal'
import YoutubeIframe from 'react-native-youtube-iframe'
import { LoadingComponent } from './LoadingComponent'

//import services
import {
    getRecomen, baseImage, getDetail, rateMovie, getRatedMovie,
    addMovieToList, getListMovie, addFavorite, getFavorite, getVideo, getDetailList
} from '../services/movie'
import { showErrorAlert, getErrorMessage, showSuccessAlert } from '../services/baseAPI'

//import component
import { CustomHeader } from '../components/HeaderComponent'
import Color from '../constants/Color'

const DetailMovie = () => {
    const route = useRoute();
    const { id } = route.params;
    const { width, height } = Dimensions.get("window")
    const navigation = useNavigation()

    const [recomenMovie, setRecomenMovie] = useState([])
    const [detailMovie, setDetailMovie] = useState([])
    const [favoriteMovie, setFavoriteMovie] = useState([])
    const [urlImage, setUrlImage] = useState()
    const [movieId, setMovieId] = useState(id)
    const [keyVideoTrailer, setKeyVideoTrailer] = useState()
    const [rate, setRate] = useState(0)
    const [rateStatus, setRateStatus] = useState();
    const [ratingMovie, setRatingMovie] = useState([]);
    const [cekRateStatus, setCekRateStatus] = useState(true)
    const [isFavorite, setIsFavorite] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [list, setList] = useState([]);
    const [listId, setListId] = useState([]);
    const [listMovie, setListMovie] = useState([])

    const onClickPlusIcon = () => {
        setShowCreateModal(!showCreateModal);
    }

    const getBaseImage = async () => {
        try {
            const response = await baseImage()
            const beautyResponse = JSON.stringify(response, null, 2);
            setUrlImage(response.secure_base_url + response.backdrop_sizes[1])

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getAllRecomen = async (page, id) => {
        try {
            const response = await getRecomen(page, id)
            const beautyResponse = JSON.stringify(recomenMovie, null, 2);
            setRecomenMovie(response.results)

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getDetailMovie = async (id) => {
        setLoadingStatus(true)
        try {
            const response = await getDetail(id)
            const beautyResponse = JSON.stringify(response, null, 2);
            setDetailMovie(response)
            setLoadingStatus(false)
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const giveRatingMovie = async (id, rate) => {
        try {
            const response = await rateMovie(id, rate)
            const beautyResponse = JSON.stringify(response, null, 2);
            // console.log("rating : ", response)
            setRateStatus(response.success)

        } catch (error) {
            showErrorAlert(error);
        }
    }

    const getRatingMovie = async () => {
        setLoadingStatus(true)
        try {
            const response = await getRatedMovie()
            const beautyResponse = JSON.stringify(response, null, 2);
            setRatingMovie(response.results)
            setLoadingStatus(false)

        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const addMovieToTheList = async (list_id) => {
        try {
            const response = await addMovieToList(list_id, id);
            const beautyResponse = JSON.stringify(response, null, 2);
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getAllLists = async () => {
        try {
            const response = await getListMovie();
            const beautyResponse = JSON.stringify(response.results, null, 2);
            setList(response.results)
            setListId(response.results.id)
            // console.log('testesets')
            // console.log(response.results)
        } catch (error) {
            showErrorAlert(error.message);
        }
    }

    const getDetailMovieList = async (list_id) => {
        // console.log(list_id)
        try {
            const response = await getDetailList(list_id)
            const beautyResponse = JSON.stringify(response, null, 2);
            // console.log(beautyResponse)
            return response.items;
        } catch (error) {
            showErrorAlert(error.message);
        }
    }

    const handleList = async (movie_id) => {
        try {
            list.forEach(async (listdetail,indexList) => {
                const response = await getDetailMovieList(listdetail.id)
                // console.log("abc ",response.name)
                response.forEach((movieOnList) => {
                    if (movieOnList.id == movie_id) {
                        console.log("Movie is on list ", listdetail.name)
                        // console.log(movieOnList.id.indexOf(movie_id))
                        console.log(indexList)
                        list.splice(indexList, 1)
                    }
                })
            })
            // console.log(disableList)
        } catch (error) {
            console.log(error)
        }


    }

    const handleRatingMovie = (movieId) => {
        if (ratingMovie != 0) {
            ratingMovie.every((indexMovie) => {
                if (movieId == indexMovie.id) {
                    console.log("Movie Already rated", movieId)
                    setRateStatus(true)
                    return false;
                } else {
                    // console.log("Movie unRated", indexMovie.id)
                    setRateStatus(false)
                }
                return true;
            });
            setCekRateStatus(false)
        }
    }

    const handleFavoriteMovie = (movieId) => {
        favoriteMovie.forEach((indexMovie) => {
            if (movieId == indexMovie.id) {
                // console.log("Movie on Favorite")
                setIsFavorite(!isFavorite);
            }
        });
    }

    const addToFavoriteMovie = async () => {
        setIsFavorite(!isFavorite);
        try {
            await addFavorite(id, isFavorite)
            if (isFavorite) {
                // console.log("Like")
            } else {
                // console.log("UnLike")
            }
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getFavoriteMovie = async () => {
        try {
            const response = await getFavorite()
            const beautyResponse = JSON.stringify(response, null, 2);
            setFavoriteMovie(response.results)
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const getVideoUrl = async () => {
        try {
            const response = await getVideo(movieId)
            const beautyResponse = JSON.stringify(response.results, null, 2);
            // console.log(response.results[3])
            setKeyVideoTrailer(response.results[3])
        } catch (error) {
            showErrorAlert(error.message);
        }
    }

    useEffect(() => {
        getAllRecomen(1, movieId);
        getDetailMovie(movieId);
    }, [movieId])


    useEffect(() => { getVideoUrl() }, [movieId])

    useEffect(() => {
        handleRatingMovie(movieId)
    }, [ratingMovie, movieId])

    useEffect(() => {
        handleFavoriteMovie(id)
    }, [favoriteMovie, movieId])


    useEffect(() => {
        getBaseImage();
        getRatingMovie();
        getFavoriteMovie();
    }, [])


    useEffect(() => {
        // console.log(keyVideoTrailer)
    }, [recomenMovie, urlImage, detailMovie, rateStatus, rate, keyVideoTrailer, listMovie])

    useEffect(() => {
        handleList(movieId)
    }, [list, listMovie])



    return (

        <ScrollView style={[styles.scroll, { backgroundColor: Color.BLACK }]}>

            <View style={[styles.mainContainer, { backgroundColor: Color.BLACK }]}>
                <View style={[styles.sideContainer]}>
                    <ImageBackground
                        style={[styles.imagebackground]}
                        blurRadius={10}
                        source={{
                            uri: urlImage && detailMovie.poster_path ? urlImage + detailMovie.poster_path
                                : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHIAyAMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAACAQAHA//EACsQAQEAAQMCBQMEAwEAAAAAAAABMREhQXGBUWGRwfAC0fFCgqGxMnLhEv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDhrMwMzKDFIkhQGVlkBNCkYpATRtFaAyLp0XQB03Za2gDZulh6DYAoWiWAFiGNAWVAZmYGZmBV+lCgMUiECyNosYFVpuvYG06ZYo2eoJp0TfQueGs28f7AfRDvZKA8poVQB03QhoDUWxKAWIdEEZmBmZYCyEkUFKIUBZ2ZdIwFMxmhZBsXjPOGvl/1eeJuum3iCc8Zaz107lp5xLqA3t89kv8AP8/k+6XpxgBueB+3zuVzxqN6duQS5HT5S5THIDeQOjQQLkwuQRmYGVFAoqLAIhhQCXhFm4F6Lxz3ykz3WY8dsAXXTvguN/Dumuvh1IG530zz8wl9i54a+oDc8fPYL7d/yfOYN9vncBuiX588SuczI32AfQSEEGkNAaNMfqAGWsCKigUWJ9KgUKCUAookBTPdeOyTPEXTbtgD9M8r80GXfhddgLXfjv8AMNfbHKa+cbX8cg1u/A32xytvnBuPYGueBuO3zuo32BLmDSoglErQoJc0bghuARGYGWIwFCCFAIoMys2B6NqjAeu/ctQlWUD13bjTA675k811/AFrverWz5lNd8zKePTALrvmdUvl4Ya3fhP/AFr9ga5G3K2jboDcoyWgg1UoJRq0QRmYGZmBSlgKBqk3YD1UZVlA5d+6hF1A9d+7a/gdVnyAWud218PQZd2oLbv5Nrt2TVNQXnKfZuRoLruNrDaDIyUGoLqgMzMDMzAyswF9OF/SzAX3izF6VGApnvG/RejMBc94kxf9b/bMBc94l/x/bWYFvuPF6MwNc/uT6v8AG9PdmBOb1SezMA3NSswCjMDMzA//2Q=="
                        }}
                    >
                        <CustomHeader
                            rightIcon={
                                <Icon
                                    name="favorite"
                                    type="fontisto"
                                    color={isFavorite ? Color.WHITE : Color.LIGHTBLUE}
                                    onPress={() => addToFavoriteMovie()}
                                />

                            }

                            leftIcon={
                                <Icon
                                    name="arrow-back"
                                    type="ion-icons"
                                    color={Color.WHITE}
                                    onPress={() => navigation.goBack()}
                                />
                            }
                        />
                        <View
                            style={[styles.imageDetailContainer]}
                        >
                            <Image
                                style={[styles.imageDetail]}
                                source={{ uri: urlImage && detailMovie.poster_path ? urlImage + detailMovie.poster_path : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHIAyAMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAACAQAHA//EACsQAQEAAQMCBQMEAwEAAAAAAAABMREhQXGBUWGRwfAC0fFCgqGxMnLhEv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDhrMwMzKDFIkhQGVlkBNCkYpATRtFaAyLp0XQB03Za2gDZulh6DYAoWiWAFiGNAWVAZmYGZmBV+lCgMUiECyNosYFVpuvYG06ZYo2eoJp0TfQueGs28f7AfRDvZKA8poVQB03QhoDUWxKAWIdEEZmBmZYCyEkUFKIUBZ2ZdIwFMxmhZBsXjPOGvl/1eeJuum3iCc8Zaz107lp5xLqA3t89kv8AP8/k+6XpxgBueB+3zuVzxqN6duQS5HT5S5THIDeQOjQQLkwuQRmYGVFAoqLAIhhQCXhFm4F6Lxz3ykz3WY8dsAXXTvguN/Dumuvh1IG530zz8wl9i54a+oDc8fPYL7d/yfOYN9vncBuiX588SuczI32AfQSEEGkNAaNMfqAGWsCKigUWJ9KgUKCUAookBTPdeOyTPEXTbtgD9M8r80GXfhddgLXfjv8AMNfbHKa+cbX8cg1u/A32xytvnBuPYGueBuO3zuo32BLmDSoglErQoJc0bghuARGYGWIwFCCFAIoMys2B6NqjAeu/ctQlWUD13bjTA675k811/AFrverWz5lNd8zKePTALrvmdUvl4Ya3fhP/AFr9ga5G3K2jboDcoyWgg1UoJRq0QRmYGZmBSlgKBqk3YD1UZVlA5d+6hF1A9d+7a/gdVnyAWud218PQZd2oLbv5Nrt2TVNQXnKfZuRoLruNrDaDIyUGoLqgMzMDMzAyswF9OF/SzAX3izF6VGApnvG/RejMBc94kxf9b/bMBc94l/x/bWYFvuPF6MwNc/uT6v8AG9PdmBOb1SezMA3NSswCjMDMzA//2Q==" }}
                            />
                            <View style={{
                                alignItems: "flex-end",
                                justifyContent: "center",
                                flex: 1,
                            }}>
                                <TouchableOpacity
                                    onPress={() => { onClickPlusIcon(), getAllLists() }}
                                >
                                    <Icon
                                        name="plus"
                                        type="entypo"
                                        style={[styles.addToListIcon]}
                                        size={50}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style={{
                    marginTop: 10,
                    marginLeft: 10,
                }}>
                    <Text style={[styles.bab]}>{detailMovie.title}</Text>
                    <Text style={[styles.subBab2, { paddingBottom: 10 }]}>Realease : {detailMovie.release_date}</Text>
                    <View style={{ flexDirection: "row", paddingLeft: 14, paddingBottom: 20 }}>
                        <Image style={{ height: 20, width: 20 }} source={require("../assets/images/star.png")} />
                        <Text style={[styles.subBab2]}>{detailMovie.vote_average}</Text>
                    </View>
                    {
                        !cekRateStatus ?
                            rateStatus ?
                                null
                                :
                                <View>
                                    <Text style={[styles.bab]}>Rated Movie</Text>
                                    <View style={[styles.rateStyle]}>
                                        <Icon
                                            name="star"
                                            type="ion-icon"
                                            color={rate >= 2 ? "yellow" : null}
                                            size={60}
                                            onPress={() =>
                                                setRate(2)
                                            }
                                        />

                                        <Icon
                                            name="star"
                                            type="ion-icon"
                                            color={rate >= 4 ? "yellow" : null}
                                            size={60}
                                            onPress={() =>
                                                setRate(4)
                                            }
                                        />
                                        <Icon
                                            name="star"
                                            type="ion-icon"
                                            color={rate >= 6 ? "yellow" : null}
                                            size={60}
                                            onPress={() =>
                                                setRate(6)
                                            }
                                        />
                                        <Icon
                                            name="star"
                                            type="ion-icon"
                                            color={rate >= 8 ? "yellow" : null}
                                            size={60}
                                            onPress={() =>
                                                setRate(8)
                                            }
                                        />
                                        <Icon
                                            name="star"
                                            type="ion-icon"
                                            color={rate >= 10 ? "yellow" : null}
                                            size={60}
                                            onPress={() =>
                                                setRate(10)
                                            }
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 5 }}
                                        onPress={() => { giveRatingMovie(movieId, rate) }}
                                    >
                                        <Text style={[styles.subBab2, { paddingBottom: 10 }]}>Give Rating</Text>
                                    </TouchableOpacity>
                                </View>
                            :
                            null

                    }
                </View>

                <View style={{
                    marginTop: 20,
                    marginLeft: 10,
                }}>
                    <Text style={[styles.bab]}>Overview</Text>
                    <Text style={[styles.subBab2, styles.overviewMovie, { width: width - 50 }]}>{detailMovie.overview}</Text>
                </View>

                {
                    keyVideoTrailer ?
                        <View style={{
                            marginTop: 20,
                        }}>
                            <Text style={[styles.bab, { marginBottom: 10 }]}>Trailer</Text>
                            <YoutubeIframe
                                width={width}
                                height={280}
                                play={false}
                                videoId={keyVideoTrailer.key}
                            />
                        </View>
                        :
                        null
                }
            </View>

            {urlImage && recomenMovie != 0 ? <View>
                <Text style={[styles.bab, { marginTop: 8 }]}>Recommendation</Text>
                <FlatList
                    data={recomenMovie}
                    contentContainerStyle={{
                        paddingRight: 14
                    }}
                    style={{
                        margin: 25
                    }}
                    keyExtractor={(item) => item.id}
                    horizontal
                    renderItem={({ item }) => {
                        return (
                            <View>
                                <TouchableOpacity onPress={() => setMovieId(item.id)}>
                                    <Image
                                        source={{ uri: urlImage + item.poster_path }}
                                        style={[styles.tvShowImage]}
                                    />
                                    <View style={{
                                        marginTop: 3,
                                        justifyContent: 'space-between',
                                    }}>
                                        <Text style={[styles.subBab2, { width: 150 }]}>{item.title}</Text>
                                        <Text style={[styles.subBab2]}>{item.vote_average}</Text>
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
            <Modal
                isVisible={showCreateModal}
                onBackButtonPress={() => onClickPlusIcon()}
                onBackdropPress={() => onClickPlusIcon()}
                useNativeDriverForBackdrop={true}
            >
                <View style={[styles.flatlistContainer, { height: list.length != 0 ? 300 : 70 }]}>
                    {list.length != 0 ?
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={[styles.subBab]}>
                                LIST
                            </Text>
                        </View>
                        :
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={[styles.subBab]}>
                                NO LISTS
                            </Text>
                        </View>
                    }

                    <FlatList
                        data={list}
                        style={{
                            padding: 10,
                        }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View style={[styles.modalContainer]}>
                                    <TouchableOpacity
                                        style={{ flexDirection: "row" }}
                                        onPress={() => {addMovieToTheList(item.id), getAllLists()}}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text
                                                    style={[styles.subBab, { color: Color.WHITE, fontSize: 14 }]}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Icon
                                                    name='plus'
                                                    type='entypo'
                                                    color={Color.WHITE}
                                                    size={20}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </View>
            </Modal>
            {
                loadingStatus ? <LoadingComponent /> : null
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    sideContainer: {
        flex: 1,
    },
    imagebackground: {
        height: 480,
        width: "100%",
        opacity: 1,
        justifyContent: 'flex-start',
        backgroundColor: "black"
    },
    imageDetailContainer: {
        flexDirection: "row",
        margin: 10,
        marginTop: 140,
        height: 220,
    },
    rateStyle: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    imageDetail: {
        height: 270,
        width: 200,
        opacity: 1,
        borderRadius: 20,
        justifyContent: 'flex-start',
    },
    overviewMovie: {
        justifyContent: "center",
        textAlign: "justify",
    },
    modalContainer: {
        borderWidth: 3,
        borderColor: Color.WHITE,
        padding: 15,
        margin: 10,
        borderRadius: 15
    },
    input: {
        margin: 8,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        marginTop: 0
    },
    addToListIcon: {
        backgroundColor: "white",
        borderRadius: 100,
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
    },
    flatlistContainer: {
        borderRadius: 30,
        padding: 15,
        borderColor: Color.LIGHTBLUE,
        borderWidth: 3,
        backgroundColor: Color.BLACK,
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
        height: 200,
        width: 300,
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

export default DetailMovie