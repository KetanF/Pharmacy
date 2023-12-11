import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {colors} from '../styles/Colors';

export default Button = ({children, text, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                {children}
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primaryColor,
        paddingVertical: 7,
        paddingHorizontal: 18,
        borderRadius: 8,
        borderColor: colors.primaryColor,
        borderWidth: 2,
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        color: colors.white,
        fontFamily: "Montserrat",
        width: "100%",
    },
    
});