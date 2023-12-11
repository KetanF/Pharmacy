import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import {colors} from '../styles/Colors';
import { auth, credentialsGenerator } from '../assets/firebase';
import { useAuth, useLoading } from "../hooks";

export default ChangePassword = ({navigation}) => {
    const {setIsLoading} = useLoading();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const {currentUser} = useAuth();

    const updatePassword = () => {
        setIsLoading(true);
        if(newPassword !== confirmNewPassword) {
            alert("New password does not match!");
            setIsLoading(false);
            return;
        }
        if (currentUser?.email) {
            const credentialObject = credentialsGenerator(currentUser?.email, currentPassword);
            auth?.currentUser
            .reauthenticateWithCredential(credentialObject)
            .then((userCredentials) => {
                const user = userCredentials.user;
                if (currentPassword === newPassword) {
                    alert("New password cannot be the same as old password!");
                    setIsLoading(false);
                    return;
                }
                user.updatePassword(newPassword)
                .then(() => {
                    alert("Your password has been updated successfully!");
                    setIsLoading(false);
                    navigation.navigate("Profile");
                })
                .catch((error) => {
                    alert(error.message);
                    setIsLoading(false);
                });
            })
            .catch(error => {
                alert(error.message);
                setIsLoading(false);
            });
        }
    }

    return (
        <>
        <View style={styles.container}>
            <Text style={[styles.title, {marginBottom: 30}]}>Change Password</Text>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={currentPassword} onChangeText={(newCurrentPassword) => setCurrentPassword(newCurrentPassword)} />
                <Text style={styles.label}>Current Password</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={newPassword} onChangeText={(newNewPassword) => setNewPassword(newNewPassword)} />
                <Text style={styles.label}>New Password</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={confirmNewPassword} onChangeText={(newConfirmNewPassword) => setConfirmNewPassword(newConfirmNewPassword)} />
                <Text style={styles.label}>Confirm New Password</Text>
            </View>
            <View style={styles.submitContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={updatePassword}>
                    <Text style={styles.submitText}>Change</Text>
                </TouchableOpacity>
            </View>
        </View>
        </>
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
        fontSize: 26,
        marginBottom: 20,
        fontFamily: "MontserratBold",
    },
    subtitle: {
        fontSize: 25,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: "row",
        marginTop: 20,
        width: "65%",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        marginHorizontal: 15,
    },
    buttonIcon: {
        fontSize: 55,
        color: colors.white,
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    buttonIconContainer: {
        backgroundColor: colors.primaryColor,
        padding: 15,
        borderRadius: 100,
        borderColor: colors.primaryColor,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        marginTop: 10,
        fontSize: 18,
    },
    inputContainer: {
        width: "80%",
        marginBottom: 30,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 17,
        borderColor: colors.primaryColor,
        borderWidth: 1,
        fontFamily: "Montserrat",
    },
    label: {
        position: "absolute",
        fontSize: 14,
        top: -12,
        left: 10,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 10,
        color: colors.white,
        fontFamily: "MontserratBold",
    },
    submitContainer: {
        width: "80%",
    },
    submitButton: {
        width: "100%",
        backgroundColor: colors.primaryColor,
        paddingVertical: 13,
        borderRadius: 10,
        marginTop: -5,
    },
    submitText: {
        textAlign: "center",
        justifyContent: "center",
        fontSize: 18,
        color: colors.white,
        fontFamily: "MontserratBold",
    },
    backButton: {
        textAlign: "center",
        justifyContent: "center",
        color: colors.white,
        backgroundColor: colors.primaryColor,
        position: "absolute",
        top: 10,
        left: 10,
        borderRadius: 5,
    },
    backButtonIcon: {
        fontSize: 30,
        paddingHorizontal: 8,
        paddingVertical: 5,
        color: colors.white,
    },
});