import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import React from "react";
import { MediumText } from "./TextComponent";

export const CustomButton = (props) => {
    const { buttonColor, textColor, moreButtonStyle, isIcon, moreTextStyle } = props;

    return (
        <TouchableOpacity
            style={[styles.casualButton, { backgroundColor: buttonColor }, moreButtonStyle]}
            {...props}
        >
            {
                isIcon ?
                    <View style={styles.iconContainer}>
                        <Icon
                            size={20}
                            {...props}
                        />
                    </View>
                    :
                    null
            }

            <MediumText
                customStyle={[styles.casualButtonText, { color: textColor } , moreTextStyle]}
                {...props}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    casualButton: {
        margin: 16,
        padding: 16,
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: 'center'
    },
    casualButtonText: {
        fontWeight: "bold",
        textAlign: "center"
    },
    iconContainer: {
        marginRight: 8
    }
});