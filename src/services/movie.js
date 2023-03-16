import getClient from "./baseAPI";
import Constant from "../constants/Constant";
import StorageKey from "../constants/StorageKey";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getDetail = async (movie_id) => {
    try {
        const response = await getClient.get(`movie/${movie_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDetailAccount = async () => {
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.get(`account`, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getReqToken = async () => {
    try {
        const response = await getClient.get(`authentication/token/new`);
        return response.data;
    } catch (error) {

    }
}

export const getGenre = async () => {
    try {
        const response = await getClient.get(`genre/movie/list`);
        return response.data.genres;
    } catch (error) {
        throw error;
    }
}

export const getPopular = async (accesPage) => {
    try {
        const response = await getClient.get(`movie/popular`, {
            params: {
                page: accesPage
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOngoing = async (accesPage) => {
    try {
        const response = await getClient.get(`movie/now_playing`, {
            params: {
                page: accesPage
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTopRated = async (accesPage) => {
    try {
        const response = await getClient.get(`movie/top_rated`, {
            params: {
                page: accesPage
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRecomen = async (accesPage, movie_id) => {
    try {
        const response = await getClient.get(`movie/${movie_id}/recommendations`, {
            params: {
                page: accesPage
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getVideo = async (movie_id) => {
    try {
        const response = await getClient.get(`movie/${movie_id}/videos`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getImage = async (movie_id) => {
    try {
        const response = await getClient.get(`movie/${movie_id}/images`,);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const baseImage = async () => {
    try {
        const response = await getClient.get(`configuration`);
        return response.data.images;
    } catch (error) {
        throw error;
    }
}

export const validateToken = async (data) => {
    try {
        const response = await getClient.post(`authentication/token/validate_with_login`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const generateSessionId = async (reqToken) => {
    try {
        const response = await getClient.post(`authentication/session/new`, reqToken);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const rateMovie = async (movie_id, rating) => {
    console.log(movie_id)
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)

    try {
        const response = await getClient.post(`movie/${movie_id}/rating`, { value: rating }, {
            params: {
                session_id: objSession.session_id
            }
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const addFavorite = async (media_id, ident) => {
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    const data = {
        "media_type": "movie",
        "media_id": media_id,
        "favorite": ident
    }
    try {
        const response = await getClient.post(`account/{account_id}/favorite`, data, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getFavorite = async () => {
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.get(`account/{account_id}/favorite/movies`, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createListMovie = async (data) => {
    const addLanguage = {
        ...data,
        language: "en"
    }

    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.post(`list`, addLanguage, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRatedMovie = async () => {
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.get(`account/{account_id}/rated/movies`, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteRateMovie = async (movie_id) => {
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.delete(`movie/${movie_id}/rating`, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getListMovie = async () => {
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.get(`account/{account_id}/lists`, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const deleteListMovie = async (list_id) => {
    console.log(list_id)
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.delete(`list/${list_id}`, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response;
    } catch (error) {
        console.log("a")
    }
}

export const addMovieToList = async (list_id, id) => {
    // console.log(list_id)
    const addMedia = {
        "media_id": id
    }
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.post(`list/${list_id}/add_item`, addMedia, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDetailList = async (list_id) => {
    try {
        const response = await getClient.get(`list/${list_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteMovieAtList = async (list_id, id) => {
    const addMedia = {
        "media_id": id
    }
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    const objSession = JSON.parse(getSession)
    try {
        const response = await getClient.post(`list/${list_id}/remove_item`, addMedia, {
            params: {
                session_id: objSession.session_id,
            }
        });
        return response;
    } catch (error) {
        console.log("a")
    }
}

export const searchMovie = async (keyword) => {
    try {
        const response = await getClient.get(`search/movie`, {
            params: {
                query: keyword,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}



