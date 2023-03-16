import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { Icon } from 'react-native-elements'
import { CustomHeader } from '../components/HeaderComponent'
import { getFavorite, baseImage, addFavorite } from '../services/movie'
import { showErrorAlert } from '../services/baseAPI'
import Color from '../constants/Color'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LoadingComponent } from './LoadingComponent'

const FavoriteMovie = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  const [urlImage, setUrlImage] = useState()
  const [favoriteMovie, setFavoriteMovie] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(false)

  const getBaseImage = async () => {
    try {
      const response = await baseImage()
      const beautyResponse = JSON.stringify(response, null, 2);
      setUrlImage(response.base_url + response.backdrop_sizes[1])

    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const getAllFavoriteMovie = async () => {
    setLoadingStatus(true)
    try {
      const response = await getFavorite();
      const beautyResponse = JSON.stringify(response.results, null, 2);
      setFavoriteMovie(response.results)
      console.log("response : ", beautyResponse)
      setLoadingStatus(false)

    } catch (error) {
      showErrorAlert(error.message);
    }
  }


  const addToFavoriteMovie = async (id) => {
    try {
      await addFavorite(id, false)
      console.log("unRated")
      getAllFavoriteMovie();
    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  useEffect(() => { getAllFavoriteMovie(), getBaseImage() }, []);
  useEffect(() => { }, [favoriteMovie]);

  useFocusEffect(
    useCallback(() => {
      getAllFavoriteMovie()
    }, [])
  );

  return (
    <View style={[styles.mainContainer]}>
      <View style={[styles.mainContainer, { marginBottom: tabBarHeight + 30 }]}>
        <CustomHeader
          title={'Favorite'}
          customText={{
            color: Color.WHITE
          }}
          leftIcon={
            <Icon
              name="arrow-left"
              type="material-community"
              color={Color.WHITE}
              onPress={() => navigation.goBack()}
            />
          }
        />
        <FlatList
          data={favoriteMovie}
          style={{
            padding: 10,
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View style={[styles.flatlistContainer]}>
                <TouchableOpacity
                  style={[styles.rowDirection]}
                  onPress={() => navigation.navigate(
                    "DetailMovie", {
                    id: item.id,
                  }
                  )}
                >
                  <Image
                    style={[styles.imageListStyle]}
                    source={{
                      uri: urlImage && item.poster_path ? urlImage + item.poster_path
                        : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHIAyAMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAACAQAHA//EACsQAQEAAQMCBQMEAwEAAAAAAAABMREhQXGBUWGRwfAC0fFCgqGxMnLhEv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDhrMwMzKDFIkhQGVlkBNCkYpATRtFaAyLp0XQB03Za2gDZulh6DYAoWiWAFiGNAWVAZmYGZmBV+lCgMUiECyNosYFVpuvYG06ZYo2eoJp0TfQueGs28f7AfRDvZKA8poVQB03QhoDUWxKAWIdEEZmBmZYCyEkUFKIUBZ2ZdIwFMxmhZBsXjPOGvl/1eeJuum3iCc8Zaz107lp5xLqA3t89kv8AP8/k+6XpxgBueB+3zuVzxqN6duQS5HT5S5THIDeQOjQQLkwuQRmYGVFAoqLAIhhQCXhFm4F6Lxz3ykz3WY8dsAXXTvguN/Dumuvh1IG530zz8wl9i54a+oDc8fPYL7d/yfOYN9vncBuiX588SuczI32AfQSEEGkNAaNMfqAGWsCKigUWJ9KgUKCUAookBTPdeOyTPEXTbtgD9M8r80GXfhddgLXfjv8AMNfbHKa+cbX8cg1u/A32xytvnBuPYGueBuO3zuo32BLmDSoglErQoJc0bghuARGYGWIwFCCFAIoMys2B6NqjAeu/ctQlWUD13bjTA675k811/AFrverWz5lNd8zKePTALrvmdUvl4Ya3fhP/AFr9ga5G3K2jboDcoyWgg1UoJRq0QRmYGZmBSlgKBqk3YD1UZVlA5d+6hF1A9d+7a/gdVnyAWud218PQZd2oLbv5Nrt2TVNQXnKfZuRoLruNrDaDIyUGoLqgMzMDMzAyswF9OF/SzAX3izF6VGApnvG/RejMBc94kxf9b/bMBc94l/x/bWYFvuPF6MwNc/uT6v8AG9PdmBOb1SezMA3NSswCjMDMzA//2Q=="
                    }}
                  />
                  <View style={[styles.secContainer]}>
                    <View style={[styles.rowDirection, styles.spaceBet]}>
                      <View>

                        <Text
                          style={[styles.subBab, { color: Color.WHITE, fontSize: 17, width: 140 }]}
                        >
                          {item.title}
                        </Text>
                      </View>
                      <Icon
                        name='trash'
                        type='entypo'
                        color={Color.WHITE}
                        size={20}
                        onPress={() => addToFavoriteMovie(item.id)}
                      />
                    </View>
                    <Text
                      style={[styles.bab, { color: "white", fontSize: 14, }]}
                    >
                      Popularity
                    </Text>
                    <Text
                      style={[styles.subBab, { color: "white", fontSize: 14, }]}
                    >
                      {item.popularity}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View>
            )
          }}
        />

      </View>
      {
        loadingStatus ? <LoadingComponent /> : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black"
  },
  secContainer: {
    flex: 1
  },
  flatlistContainer: {
    borderWidth: 3,
    borderColor: "white",
    padding: 15,
    margin: 10,
    borderRadius: 15
  },
  rowDirection: {
    flexDirection: "row"
  },
  spaceBet: {
    justifyContent: "space-between"
  },
  createButton: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  imageListStyle: {
    height: 150,
    width: 120
  },
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

export default FavoriteMovie