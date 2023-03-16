import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SmallText } from '../components/TextComponent'
import { Icon } from 'react-native-elements'
import { getReqToken } from '../services/movie'
import Color from '../constants/Color'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StorageKey from '../constants/StorageKey'
import { Host } from 'react-native-portalize/lib/Host'

//import Screen
import ListScreen from '../screens/ListScreen'
import ProfileScreen from '../screens/ProfileScreen'
import RatedMovie from '../screens/RatedMovie'
import DetailMovie from '../screens/DetailMovie'
import StatusMovie from '../screens/StatusMovie'
import FavoriteMovie from '../screens/FavoriteMovie'
import HomeScreen from '../screens/HomeScreen'
import CreateListScreen from '../screens/CreateListScreen'
import LoginScreen from '../screens/LoginScreen'
import SearchScreen from '../screens/SearchScreen'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AfterLogin = () => {
  return (
    <Host>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            margin: 20,
            height: 60,
            borderRadius: 20,
            backgroundColor: Color.WHITE
          }
        }}
      >
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <SmallText
                title="Home"
                customStyle={{ color: focused ? 'green' : 'grey' }}
              />
            ),
            tabBarIcon: ({ focused }) => (
              <Icon
                name="home"
                type="material-community"
                color={focused ? 'purple' : 'grey'}
              />
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: 'lavender'
            }
          }}
        />

        <Tab.Screen
          name='Search'
          component={SearchScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <SmallText
                title="Search"
                customStyle={{ color: focused ? 'green' : 'grey' }}
              />
            ),
            tabBarIcon: ({ focused }) => (
              <Icon
                name="search1"
                type="ant-design"
                color={focused ? 'purple' : 'grey'}
              />
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: 'lavender'
            }
          }}
        />

        <Tab.Screen
          name='CreateList'
          component={CreateListScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <SmallText
                title="List"
                customStyle={{ color: focused ? 'green' : 'grey' }}
              />
            ),

            tabBarIcon: ({ focused }) => (
              <Icon
                name="pluscircleo"
                type="ant-design"
                color={focused ? 'purple' : 'grey'}
                size={40}
              />
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: 'lavender'
            }
          }}
        />

        <Tab.Screen
          name='Favorite'
          component={FavoriteMovie}
          options={{
            tabBarLabel: ({ focused }) => (
              <SmallText
                title="Favorite"
                customStyle={{ color: focused ? 'green' : 'grey' }}
              />
            ),
            tabBarIcon: ({ focused }) => (
              <Icon
                name="favorite"
                type="fontisto"
                color={focused ? 'purple' : 'grey'}
              />
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: 'lavender'
            }
          }}
        />

        <Tab.Screen
          name='Profile'
          component={ProfileScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <SmallText
                title="Profile"
                customStyle={{ color: focused ? 'green' : 'grey' }}
              />
            ),
            tabBarIcon: ({ focused }) => (
              <Icon
                name="profile"
                type="ant-design"
                color={focused ? 'purple' : 'grey'}
              />
            ),
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: 'lavender'
            }
          }}
        />
      </Tab.Navigator>
    </Host>
  )
}

const StackNav = (props) => {
  return (

    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      {...props}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AfterLogin" component={AfterLogin} />
      <Stack.Screen name="DetailMovie" component={DetailMovie} />
      <Stack.Screen name="StatusMovie" component={StatusMovie} />
      <Stack.Screen name="ListScreen" component={ListScreen} />
      <Stack.Screen name="CreateList" component={CreateListScreen} />
      <Stack.Screen name="RatedMovie" component={RatedMovie} />
    </Stack.Navigator>

  );
};

const MainNavigation = () => {

  const [session, setSession] = useState("");
  const [status, setStatus] = useState(true);

  const getRequestToken = async () => {
    try {
      const response = await getReqToken()
      const beautyResponse = JSON.stringify(response, null, 2);
      await AsyncStorage.setItem(StorageKey.TOKEN, JSON.stringify(response))
      setStatus(false)
      console.log("response :", beautyResponse)
    } catch (error) {
      console.log(error);
    }
  };

  const auth = async () => {
    const getSession = await AsyncStorage.getItem(StorageKey.SESSION)
    if (JSON.parse(getSession) != null) {
      setSession(JSON.parse(getSession).session_id)
      setStatus(false)
    } else {
      getRequestToken();
    }

  }

  useEffect(() => {
    auth();
  }, [])

  useEffect(() => {
    console.log(session)
  }, [session])

  if (status) {
    return null;
  }

  return (
    <NavigationContainer>
      {
        session ?
          <StackNav initialRouteName="AfterLogin" />
          :
          <StackNav initialRouteName="Login" />
      }
    </NavigationContainer>
  )
}

export default MainNavigation