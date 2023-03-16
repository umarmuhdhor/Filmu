import axios from "axios";
import Constant from "../constants/Constant";
import { Alert } from "react-native";

const getClient = axios.create({
    baseURL: Constant.BASE_URL
});

getClient.interceptors.request.use((config) => {
    config.headers.Accept = "application/json";
    config.params = { ...config.params, api_key: Constant.API_KEY }
    return config;
});

export const getErrorMessage = (error) => {
    console.log(error)
    if (error.message === 'Network Error') {
        throw Error('Please check your connection!')
    } else if (error.response.data) {
        const errorFromAPI = error.response.data;
        throw Error(errorFromAPI.error.errors[0].message);
    }
};

export const showErrorAlert = (errorMessage) => {
    Alert.alert('Something went wrong!', errorMessage,
        [
            { text: 'Okay' }
        ]
    );
};

export const showSuccessAlert = (Message) => {
    Alert.alert('Success', Message 
    [
        { text: 'Okay' }
    ]
    );
};


export default getClient;