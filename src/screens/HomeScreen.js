import { View, Text, Image, FlatList, TouchableOpacity, TextInput, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import Carousel from "react-native-anchor-carousel";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LoadingComponent } from './LoadingComponent';

//import component
import { MediumText, SmallText, LargeText } from '../components/TextComponent';
import Color from '../constants/Color';
import { CustomButton } from '../components/ButtonComponent';
import { showErrorAlert } from '../services/baseAPI';

// import from service
import { getMovie, getGenre, getPopular, baseImage, getOngoing, getTopRated } from '../services/movie';


const HomeScreen = () => {
  const { width, height } = Dimensions.get("window")
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  const [genreMovie, setGenreMovie] = useState([])
  const [popularMovie, setPopularMovie] = useState([])
  const [ongoingMovie, setOngoingMovie] = useState([])
  const [topRatedMovie, setTopRatedMovie] = useState([])
  const [dataByGenre, setDataByGenre] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [urlImage, setUrlImage] = useState("")
  const [background, setBackground] = useState(
    {
      id: "",
      url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHIAyAMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAACAQAHA//EACsQAQEAAQMCBQMEAwEAAAAAAAABMREhQXGBUWGRwfAC0fFCgqGxMnLhEv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDhrMwMzKDFIkhQGVlkBNCkYpATRtFaAyLp0XQB03Za2gDZulh6DYAoWiWAFiGNAWVAZmYGZmBV+lCgMUiECyNosYFVpuvYG06ZYo2eoJp0TfQueGs28f7AfRDvZKA8poVQB03QhoDUWxKAWIdEEZmBmZYCyEkUFKIUBZ2ZdIwFMxmhZBsXjPOGvl/1eeJuum3iCc8Zaz107lp5xLqA3t89kv8AP8/k+6XpxgBueB+3zuVzxqN6duQS5HT5S5THIDeQOjQQLkwuQRmYGVFAoqLAIhhQCXhFm4F6Lxz3ykz3WY8dsAXXTvguN/Dumuvh1IG530zz8wl9i54a+oDc8fPYL7d/yfOYN9vncBuiX588SuczI32AfQSEEGkNAaNMfqAGWsCKigUWJ9KgUKCUAookBTPdeOyTPEXTbtgD9M8r80GXfhddgLXfjv8AMNfbHKa+cbX8cg1u/A32xytvnBuPYGueBuO3zuo32BLmDSoglErQoJc0bghuARGYGWIwFCCFAIoMys2B6NqjAeu/ctQlWUD13bjTA675k811/AFrverWz5lNd8zKePTALrvmdUvl4Ya3fhP/AFr9ga5G3K2jboDcoyWgg1UoJRq0QRmYGZmBSlgKBqk3YD1UZVlA5d+6hF1A9d+7a/gdVnyAWud218PQZd2oLbv5Nrt2TVNQXnKfZuRoLruNrDaDIyUGoLqgMzMDMzAyswF9OF/SzAX3izF6VGApnvG/RejMBc94kxf9b/bMBc94l/x/bWYFvuPF6MwNc/uT6v8AG9PdmBOb1SezMA3NSswCjMDMzA//2Q==",
      title: "",
      vote: "",
      overview: ""
    })

  const getAllPopular = async () => {
    setLoadingStatus(true)
    try {
      const response = await getPopular(1)
      const beautyResponse = JSON.stringify(response.results, null, 2);
      setPopularMovie(response.results)
      setLoadingStatus(false)
    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const getAllOngoing = async () => {
    try {
      const response = await getOngoing(1)
      const beautyResponse = JSON.stringify(ongoingMovie, null, 2);
      setOngoingMovie(response.results)

    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const getAllTopRated = async () => {
    try {
      const response = await getTopRated(1)
      const beautyResponse = JSON.stringify(topRatedMovie, null, 2);
      setTopRatedMovie(response.results)

    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const getAllGenres = async () => {
    try {
      const response = await getGenre()
      const beautyResponse = JSON.stringify(response, null, 2);
      setGenreMovie(response)
      // console.log(beautyResponse)

    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const getMovieGenre = async () => {
    try {
      const response = await getGenre()
      const beautyResponse = JSON.stringify(genreMovie, null, 2);
      setGenreMovie(response)

    } catch (error) {
      console.log(error);
    }
  }

  const getBaseImage = async () => {
    try {
      const response = await baseImage()
      const beautyResponse = JSON.stringify(response, null, 2);
      setUrlImage(response.base_url + response.backdrop_sizes[0])

    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const handleGenreMovie = async (genreId) => {
    setLoadingStatus(true)
    const response = await getPopular(1)
    let setData = []
    response.results.forEach((indexMovie) => {
      indexMovie.genre_ids.forEach((genre_id) => {
        if (genreId == genre_id) {
          setData.push(indexMovie)
        }
      })
    });
    setLoadingStatus(false)
    setDataByGenre(setData)
  }

  const handleCarouselScrollEnd = (item, indexOnScroll) => {
    setBackground({
      id: item.id,
      url: urlImage + item.poster_path,
      title: item.title,
      vote: item.vote_average,
      overview: item.overview,
    })
  }

  const CarouselComponent = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("DetailMovie", {
            id: background.id
          })}
        >
          <Image source={{ uri: urlImage + item.poster_path }}
            style={styles.imagecarousel}

          />
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    getBaseImage();
  }, [urlImage]);

  useEffect(() => {
    getAllPopular();
    getAllOngoing();
    getAllGenres();
    getAllTopRated();
  }, [])

  useEffect(() => {
    // console.log(JSON.stringify(popularMovie, null, 2))
    if (popularMovie.length != 0 && urlImage != "") {
      setBackground({
        id: popularMovie[0]?.id,
        url: urlImage + popularMovie[0]?.poster_path,
        title: popularMovie[0]?.title,
        vote: popularMovie[0]?.vote_average,
        overview: popularMovie[0]?.overview,
      })
    }
  }, [popularMovie, urlImage])

  useEffect(() => {
    // console.log(ongoingMovie)
  }, [ongoingMovie])

  useEffect(() => {
    // console.log(genreMovie)
  }, [genreMovie])

  useEffect(() => {
    // console.log(JSON.stringify(topRatedMovie, null, 2))
  }, [topRatedMovie])

  useEffect(() => {
    // console.log(genreMovie)
  }, [dataByGenre])



  return (
    <View style={[styles.scroll]}>
      <ScrollView style={[styles.scroll, { marginBottom: tabBarHeight }]}>
        <View style={[styles.mainContainer, { backgroundColor: Color.BLACK }]}>
          <View style={[styles.sideContainer]}>

            <ImageBackground
              style={[styles.imagebackground]}
              blurRadius={10}
              source={{ uri: background.url }}
            >
              {urlImage ?
                <View style={{ flex: 1 }}>

                  <View style={[styles.centerItem, { height: 80 }]}>
                    <Text style={[styles.bab, { fontSize: 30 }]}>
                      Popular Movie
                    </Text>
                  </View>

                  <View style={{ display: "flex", marginTop: 20 }}>
                    <Carousel
                      data={popularMovie}
                      itemWidth={200}
                      ref={carouselRef}
                      separatorWidth={100}
                      onScrollEnd={handleCarouselScrollEnd}
                      renderItem={({ item, index }) => (
                        <CarouselComponent item={item} />
                      )}
                    />
                  </View>

                  <View style={{
                    marginTop: 20,
                    paddingRight: 15,
                    justifyContent: 'space-between',
                  }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={[styles.subBab, { width: 200 }]}>{background.title}</Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingLeft: 14 }}>
                      <Image style={{ height: 20, width: 20 }} source={require("../assets/images/star.png")} />
                      <Text style={[styles.subBab2]}>{background.vote}</Text>
                    </View>
                    <Text style={[styles.subBab2, { marginTop: 20, textAlign: "justify" }]}>{background.overview}</Text>
                  </View>

                </View>
                :
                null
              }
            </ImageBackground>

          </View>
        </View>
        {urlImage ?
          <View>

            <FlatList
              data={genreMovie}
              style={{
                marginTop: 25
              }}
              keyExtractor={(item) => item.id}

              horizontal
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleGenreMovie(item.id)}
                  >
                    <View style={{
                      borderRadius: 15,
                      backgroundColor: Color.LIGHTBLUE,
                      marginRight: 15,
                      paddingRight: 15,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <Text style={{
                        color: Color.GREY,
                        fontWeight: 'bold',
                        fontSize: 14,
                        justifyContent: "center",
                        alignItems: "center"
                      }}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
            {
              dataByGenre != 0 ?
                <Carousel
                  data={dataByGenre}
                  itemWidth={100}
                  separatorWidth={70}
                  style={{ marginTop: 25 }}
                  renderItem={({ item }) => {
                    return (
                      <View>

                        <TouchableOpacity
                          onPress={() => navigation.navigate("DetailMovie", {
                            id: item.id
                          })}
                        >

                          <Image source={{ uri: urlImage + item.poster_path }}
                            style={{
                              width: 150,
                              height: 230,
                              borderRadius: 10,
                              alignSelf: 'center',
                            }}
                          />

                        </TouchableOpacity>

                      </View>
                    )
                  }}
                />
                :
                null
            }



            <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between" }}>
              <Text style={[styles.bab]}>Top Rated</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("StatusMovie", {
                  name: "Top Rated",
                })}
              >
                <Text style={{
                  color: Color.LIGHTBLUE,
                  marginRight: 5,
                  marginTop: 3
                }}> See More </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={topRatedMovie}
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
                    <TouchableOpacity
                      onPress={() => navigation.navigate("DetailMovie", {
                        id: item.id
                      })}
                    >
                      <Image
                        source={{ uri: urlImage + item.backdrop_path }}
                        style={[styles.ongoingImage]}
                      />
                      <View style={{
                        marginTop: 3,
                        justifyContent: 'space-between',
                      }}>
                        <Text style={[styles.subBab2]}>{item.title}</Text>
                        <View style={{ flexDirection: "row", paddingLeft: 14 }}>
                          <Image style={{ height: 20, width: 20 }} source={require("../assets/images/star.png")} />
                          <Text style={[styles.subBab2]}>{item.vote_average}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }}
            />
            <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between" }}>
              <Text style={[styles.bab]}>OnGoing</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("StatusMovie", {
                  name: "OnGoing",
                })}
              >
                <Text style={{
                  color: Color.LIGHTBLUE,
                  marginRight: 5,
                  marginTop: 3
                }}> See More </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ongoingMovie}
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
                    <TouchableOpacity
                      onPress={() => navigation.navigate("DetailMovie", {
                        id: item.id
                      })}
                    >
                      <Image
                        source={{ uri: urlImage + item.poster_path }}
                        style={[styles.tvShowImage]}
                      />
                      <View style={{
                        marginTop: 3,
                        justifyContent: 'space-between',
                      }}>
                        <Text style={[styles.subBab2, { width: 150 }]}>{item.title}</Text>
                        <View style={{ flexDirection: "row", paddingLeft: 14 }}>
                          <Image style={{ height: 20, width: 20 }} source={require("../assets/images/star.png")} />
                          <Text style={[styles.subBab2]}>{item.vote_average}</Text>
                        </View>
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
      </ScrollView>
      {
        loadingStatus ? <LoadingComponent /> : null
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
    height: 790,
    alignItems: "center",
    justifyContent: "center",
  },
  centerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagebackground: {
    flex: 1,
    height: "100%",
    width: "100%",
    opacity: 0.7,
    justifyContent: 'flex-start',
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
  imagecarousel: {
    width: 250,
    height: 370,
    borderRadius: 10,
    alignSelf: 'center',
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
    backgroundColor: Color.BLACK,
  },
  inputLabel: {
    paddingHorizontal: 16
  }
});

export default HomeScreen