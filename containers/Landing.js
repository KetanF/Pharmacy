import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {colors} from '../styles/Colors';
import {Button} from '../components';
import logo from '../assets/appLogo.png';

export default Landing = ({navigation}) => {
    const handleRegister = () => {
        navigation.navigate("Register", {userType: "User"});
    }
    const handleLogin = () => {
        navigation.navigate("Login", {userType: "User"});
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Neo Care</Text>
            <Image style={styles.logo} source={logo} />
            <View style={styles.buttonContainer}>
                <Button onPress={handleRegister} text="Register" />
                <Button onPress={handleLogin} text="Login" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        backgroundColor: colors.lightColor2,
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        fontFamily: "MontserratBold",
    },
    subtitle: {
        fontSize: 23,
        fontFamily: "MontserratBold",
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
        width: "60%",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        marginHorizontal: 15,
    },
});