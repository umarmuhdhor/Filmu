import React from "react";
import { Text, StyleSheet } from "react-native";
import Color from "../constants/Color";

export const SmallText = (props) => {
    const { title, customStyle } = props;
    return (
        <Text style={[styles.small, customStyle]}>{title}</Text>
    )
};

export const MediumText = (props) => {
    const { title, customStyle } = props;
    return (
        <Text style={[styles.medium, customStyle]}>{title}</Text>
    )
};

export const LargeText = (props) => {
    const { title, customStyle } = props;
    return (
        <Text style={[styles.large, customStyle]}>{title}</Text>
    )
};

const styles = StyleSheet.create({
    small: {
        fontSize: 14,
        color: Color.BLACK
    },
    medium: {
        fontSize: 16,
        color: Color.BLACK
    },
    large: {
        fontSize: 20,
        color: Color.BLACK
    }
});