import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { MediumText } from '../components/TextComponent'
import { FlatList } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useNavigation } from '@react-navigation/native'
import { showErrorAlert } from '../services/baseAPI'
import { LoadingComponent } from './LoadingComponent'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

//import services
import { createListMovie, getListMovie, deleteListMovie, baseImage } from '../services/movie'
//import component
import { CustomButton } from '../components/ButtonComponent'
import { SmallText } from '../components/TextComponent'
import { CustomHeader } from '../components/HeaderComponent'
import Color from '../constants/Color'

const CreateListScreen = () => {
    const tabBarHeight = useBottomTabBarHeight();

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [list, setList] = useState([])
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [cekListStatus, setCekListStatus] = useState(true)

    const navigation = useNavigation()

    //Validation for create List
    const validateCreateList = yup.object().shape({
        name: yup.string()
            .min(3, ({ min }) => `Username must be at least ${min} characters!`)
            .required("Username is required")
    });

    const createList = async (name) => {
        try {
            const response = await createListMovie(name)
            const beautyResponse = JSON.stringify(response, null, 2);
            console.log("response : ", response)
            onClickCreate();
            getAllLists();
        } catch (error) {
            showErrorAlert(error.message);
        }
    }

    const getAllLists = async () => {
        setLoadingStatus(true)
        try {
            const response = await getListMovie();
            const beautyResponse = JSON.stringify(response.results, null, 2);
            setList(response.results)
            console.log("response : ", response.results)
            setCekListStatus(false)
            setLoadingStatus(false)
        } catch (error) {
            showErrorAlert(error.message);
        }
    }

    const deleteList = async (listId) => {
        try {
            const response = await deleteListMovie(listId);
            const beautyResponse = JSON.stringify(response, null, 2);
            console.log("response : ", beautyResponse)
            getAllLists();

        } catch (error) {
            getAllLists();
        }
    }

    //Show Modal for create list
    const onClickCreate = () => {
        setShowCreateModal(!showCreateModal);
    }


    useEffect(() => { getAllLists(); }, [])

    return (
        <View style={[styles.mainContainer]}>
            {/*HEADER SCREEN */}
            <CustomHeader
                title="List"
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
                rightIcon={
                    <Icon
                        name="circle-with-plus"
                        type="entypo"
                        color={Color.WHITE}
                        size={30}
                        onPress={() => onClickCreate()}
                    />
                }
            />

            {
                !cekListStatus ?
                    list.length != 0 ?
                        <View style={[styles.mainContainer, { marginBottom: tabBarHeight + 30 }]}>
                            <FlatList
                                data={list}
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
                                                    "ListScreen", {
                                                    list_id: item.id,
                                                    name: item.name
                                                }
                                                )}
                                            >
                                                <View style={[styles.secContainer]}>
                                                    <View style={[styles.rowDirection, styles.spaceBet]}>
                                                        <View>
                                                            <Text
                                                                style={[styles.bab, { color: Color.WHITE, fontSize: 14, }]}
                                                            >
                                                                Name
                                                            </Text>
                                                            <Text
                                                                style={[styles.subBab, { color: Color.WHITE, fontSize: 15, marginLeft: 10 }]}
                                                            >
                                                                {item.name}
                                                            </Text>
                                                        </View>
                                                        <Icon
                                                            name='trash'
                                                            type='entypo'
                                                            color={Color.WHITE}
                                                            size={20}
                                                            onPress={() => deleteList(item.id)}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={[styles.bab, { color: "white", fontSize: 14, }]}
                                                    >
                                                        Description
                                                    </Text>
                                                    <Text
                                                        style={[styles.subBab, { color: "white", fontSize: 14, }]}
                                                    >
                                                        {item.description}
                                                    </Text>
                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            />

                        </View>
                        :
                        <View style={[styles.createButton]}>
                            <TouchableOpacity
                                style={{ marginTop: -100 }}
                                onPress={() => onClickCreate()}
                            >
                                <Icon
                                    name="circle-with-plus"
                                    type="entypo"
                                    color={Color.WHITE}
                                    size={70}
                                />
                            </TouchableOpacity>
                        </View>
                    :
                    null
            }

            <Formik
                initialValues={{
                    name: "",
                    description: ""
                }}
                validationSchema={validateCreateList}
                onSubmit={(data) => createList(data)}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    errors,
                    touched,
                }) => (
                    <Modal
                        isVisible={showCreateModal}
                        onBackButtonPress={() => onClickCreate()}
                        onBackdropPress={() => onClickCreate()}
                        useNativeDriverForBackdrop={true}
                    >
                        <View style={{ borderRadius: 30, padding: 15, borderColor: Color.LIGHTBLUE, borderWidth: 3, backgroundColor: Color.BLACK }} adjustToContentHeight>
                            <MediumText
                                title="Create Your List"
                                customStyle={{ textAlign: "center", color: Color.WHITE, marginBottom: 20 }}
                            />
                            <Text style={{ color: Color.WHITE, fontWeight: "bold", marginLeft: 15, marginBottom: 5 }}>Name</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: Color.LIGHTBLUE, color: Color.GREY }]}
                                placeholder="Input List Name"
                                placeholderTextColor={Color.GREY}
                                onChangeText={handleChange("name")}
                                onBlur={handleBlur("name")}
                            />
                            {
                                errors.name && touched.name ?
                                    <SmallText
                                        title={errors.name}
                                        customStyle={styles.errorMessage}
                                    />
                                    :
                                    null
                            }

                            <Text style={{ color: Color.WHITE, fontWeight: "bold", marginLeft: 15, marginBottom: 5 }}>Description</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: Color.LIGHTBLUE, color: Color.GREY }]}
                                placeholder="Description"
                                placeholderTextColor={Color.GREY}
                                onChangeText={handleChange("description")}
                                onBlur={handleBlur("description")}
                            />
                            {
                                errors.description && touched.description ?
                                    <SmallText
                                        title={errors.name}
                                        customStyle={styles.errorMessage}
                                    />
                                    :
                                    null
                            }

                            <View style={[styles.button]}>
                                <CustomButton
                                    title="Create"
                                    buttonColor={Color.WHITE}
                                    textColor={Color.GREY}
                                    moreButtonStyle={{ width: 100 }}
                                    moreTextStyle={{ fontSize: 12 }}
                                    onPress={handleSubmit}
                                />
                            </View>
                        </View>
                    </Modal>
                )}
            </Formik>
            {
                loadingStatus ? <LoadingComponent /> : null
            }
        </View >
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

export default CreateListScreen