import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export const LoadingComponent = () => {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size='large' color='blue' />
        </View>
    );
};

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0, right: 0, top: 0, bottom: 0,
        zIndex: 10
    }
});