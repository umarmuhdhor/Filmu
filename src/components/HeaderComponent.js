import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { LargeText } from "./TextComponent";

export const CustomHeader = (props) => {
    const { leftIcon, onClickLeftIcon, rightIcon, onClickRightIcon, customText } = props;

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={[styles.icon, { left: 16 }]}
                onPress={onClickLeftIcon}
            >
                {leftIcon}
            </TouchableOpacity>
            <LargeText
                customStyle={[
                    customText
                , {fontWeight: "bold"}]}
                {...props}
            />
            <TouchableOpacity
                style={[styles.icon, { right: 16 }]}
                onPress={onClickRightIcon}
            >
                {rightIcon}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
        alignItems: "center"
    },
    icon: {
        position: "absolute",
        top: 16,
        paddingHorizontal: 8,
    },
});