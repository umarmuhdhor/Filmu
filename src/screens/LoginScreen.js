import { View, Text, ImageBackground, Dimensions, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik'
import * as yup from "yup";
import { CustomButton } from '../components/ButtonComponent';
import { SmallText } from '../components/TextComponent';
import { validateToken } from '../services/movie';
import { getReqToken } from '../services/movie';
import StorageKey from '../constants/StorageKey';
import { generateSessionId } from '../services/movie';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { showErrorAlert } from '../services/baseAPI';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window")

  const [showPassword, setShowPassword] = useState(false);

  const validateLoginForm = yup.object().shape({
    username: yup.string()
      .min(3, ({ min }) => `Username must be at least ${min} characters!`)
      .required("Username is required"),
    password: yup.string()
      .min(6, ({ min }) => `Password must be at least ${min} characters!`)
      .required("Password is required"),
  });

  const onClickLogin = async (dataToSend) => {
    try {
      const reqToken = await AsyncStorage.getItem(StorageKey.TOKEN);
      dataToSend = {
        ...dataToSend,
        request_token: JSON.parse(reqToken).request_token
      }
      console.log(dataToSend)
      const response = await validateToken(dataToSend);
      console.log("token validate : ", response);

      const sendToSession = {
        request_token: response.request_token
      }
      const response2 = await generateSessionId(sendToSession)
      console.log("sesionID : ", response2);

      await AsyncStorage.setItem(StorageKey.SESSION, JSON.stringify(response2))
      console.log("data to send : ", dataToSend)
      await AsyncStorage.setItem(StorageKey.PROFILE_DATA, JSON.stringify(dataToSend))
      navigation.replace("AfterLogin")


    } catch (error) {
      showErrorAlert(error.message);
    }
    // console.log("data: ", dataToSend);
  };

  const onClickPassword = () => {
    setShowPassword(!showPassword)
  }


  return (
    <Formik
      initialValues={{
        username: "",
        password: ""
      }}
      validationSchema={validateLoginForm}
      onSubmit={(data) => onClickLogin(data)}

    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        touched,
      }) => (
        <View>
          <ImageBackground
            style={{ backgroundColor: "black", width: width, height: height, opacity: 0.6 }}
            source={require("../assets/images/background2.jpg")}
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", opacity: 1 }}>
              <View style={{ borderColor: "white", borderWidth: 2, padding: 10, width: width - 130, borderRadius: 5 }}>
                <Text style={{ color: "white", fontWeight: "bold", marginLeft: 15, marginBottom: 5 }}>Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: "black", color: "white" }]}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  placeholder="Input Username"
                  placeholderTextColor={'white'}
                />
                {
                  errors.username && touched.username ?
                    <SmallText
                      title={errors.username}
                      customStyle={styles.errorMessage}
                    />
                    :
                    null
                }
                <Text style={{ color: "white", fontWeight: "bold", marginLeft: 15, marginBottom: 5 }}>Password</Text>
                <View style={[styles.input, { flexDirection: "row", backgroundColor: "black", justifyContent: "space-between" }]}>

                  <TextInput
                    style={{ color: "white" }}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Input Password"
                    placeholderTextColor={'white'}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={{ margin: 10 }}
                    onPress={() => onClickPassword()}
                  >

                    <Icon
                      name={showPassword ? "eye-off" : "eye"}
                      type="ionicon"
                      color={"white"}
                    />


                  </TouchableOpacity>
                </View>
                {
                  errors.password && touched.password ?
                    <SmallText
                      title={errors.password}
                      customStyle={styles.errorMessage}
                    />
                    :
                    null
                }
                <CustomButton
                  title="Login"
                  buttonColor={"white"}
                  textColor={"black"}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
      )}
    </Formik>
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
    color: "red",
    marginBottom: 8,
    marginHorizontal: 16,
    fontWeight: "bold"
  },

});

export default LoginScreen