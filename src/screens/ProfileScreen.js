import { View, Text, Image, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Color from '../constants/Color'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StorageKey from '../constants/StorageKey'
import { CustomHeader } from '../components/HeaderComponent'
import { Icon } from 'react-native-elements'
import { Modalize } from 'react-native-modalize'
import { CustomButton } from '../components/ButtonComponent'
import { Portal } from 'react-native-portalize'
import { MediumText } from '../components/TextComponent'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'
import { getDetailAccount } from '../services/movie'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { showErrorAlert } from '../services/baseAPI'
import { LoadingComponent } from './LoadingComponent'


const ProfileScreen = () => {
  const modalizeRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [detailProfile, setDetailProfile] = useState()
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigation = useNavigation();

  const checkConditions = async () => {
    try {
      const data = await AsyncStorage.getItem(StorageKey.PROFILE_DATA);
      console.log("profile : ", data)
      const objectData = JSON.parse(data);
      setProfile(objectData);
    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const DetailAccount = async () => {
    console.log("tes")
    try {
      console.log("tes2")
      const response = await getDetailAccount();
      console.log("tes3")
      setDetailProfile(response)
      console.log("a : ", response)

    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const showBottomSheets = () => {
    modalizeRef.current?.open();
  };

  const onClickLogout = () => {
    setShowLogoutModal(!showLogoutModal);
  }

  const logout = async () => {
    try {
      onClickLogout();
      modalizeRef.current?.close();
      await AsyncStorage.clear();
      console.log(profile)

      setTimeout(() => {
        navigation.replace('Login');
      }, 1000);

    } catch (error) {
      showErrorAlert(error.message);
    }
  }

  useEffect(() => {
    checkConditions()
  }, [])
  useEffect(() => {
    DetailAccount()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {
        profile ?

          <View style={{ flex: 1, backgroundColor: "black" }}>
            <CustomHeader
              title="Profile"
              customText={{
                color: Color.WHITE
              }}
              rightIcon={
                <Icon
                  name="dots-three-vertical"
                  type="entypo"
                  color={Color.WHITE}
                  onPress={() => showBottomSheets()}
                />
              }
            />
            <View style={{ flexDirection: "row" }}>
              {/* <Image
                style={{ height: 50, width: 50, borderRadius: 100 }}
              /> */}
              <TextInput
                style={[styles.input, { backgroundColor: "black", color: Color.WHITE, borderColor: Color.WHITE, borderWidth: 3, }]}
                placeholderTextColor={'white'}
                value={profile.username}
              />
            </View>

            <View style={{ borderColor: Color.WHITE, borderWidth: 3, borderRadius: 10, margin: 20,marginTop:100 }}>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingLeft: 30, margin: 10 }}
              >
                <Icon
                  name="favorite"
                  type="fontisto"
                  color={Color.WHITE}
                  style={{ width: 30 }}
                  size={30}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text style={{ color: Color.WHITE, marginLeft: 10 }}>Favorite Movie</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("RatedMovie")}
                style={{ flexDirection: "row", paddingLeft: 30, margin: 10 }}
              >
                <Icon
                  name="star"
                  type="fontisto"
                  color={Color.WHITE}
                  size={30}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text style={{ color: Color.WHITE, marginLeft: 10, justifyContent: "center" }}>Rating Movie</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateList")}
                style={{ flexDirection: "row", paddingLeft: 30, margin: 10 }}>
                <Icon
                  name="pluscircleo"
                  type="ant-design"
                  color={Color.WHITE}
                  size={30}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text style={{ color: Color.WHITE, marginLeft: 10, justifyContent: "center" }}>Create List</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Portal>
              <Modalize ref={modalizeRef} adjustToContentHeight>
                <CustomButton
                  title={"LogOut"}
                  onPress={() => onClickLogout()}
                  isIcon={
                    <Icon
                      name="dots-three-vertical"
                      type="entypo"
                      color={Color.BLACK}
                    />
                  }
                />
              </Modalize>
            </Portal>
          </View>
          :
          null
      }
      <Modal
        isVisible={showLogoutModal}
        onBackButtonPress={() => onClickLogout()}
        onBackdropPress={() => onClickLogout()}
        useNativeDriverForBackdrop={true}
      >
        <View style={{ backgroundColor: 'white', borderRadius: 30, padding: 15 }} adjustToContentHeight>
          <MediumText
            title="Are you sure want to logout?"
            customStyle={{ textAlign: "center" }}
          />
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <CustomButton
              title="YES"
              buttonColor={Color.BLACK}
              textColor={Color.WHITE}
              onPress={
                () => logout()
              }
            />
            <CustomButton
              title="NO"
              buttonColor={Color.BLACK}
              textColor={Color.WHITE}
              onPress={() => onClickLogout()}
            />
          </View>
        </View>
      </Modal>
    </View >

  )
}

const styles = StyleSheet.create({
  input: {
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: 0,
    opacity: 1
  }
})

export default ProfileScreen