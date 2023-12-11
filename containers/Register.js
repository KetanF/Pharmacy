import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import {colors} from '../styles/Colors';
import { auth, createUserDocument, firestore } from '../assets/firebase';
import { useAuth, useLoading } from "../hooks";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default Register = ({route, navigation}) => {
    const {setIsLoading} = useLoading();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {userType} = route.params;
    const {setCurrentUser} = useAuth();

    const handleSignUp = () => {
        setIsLoading(true);
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCredentials) => {
            const user = userCredentials.user;
            await createUserDocument(user, {name, userType});
            firestore.collection("users")
            .where("email", "==", user?.email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data()?.userType === userType) {
                        AsyncStorage
                        .setItem('currentUser',JSON.stringify(doc.data()))
                        .then(() => {
                            setCurrentUser(doc.data());
                            setIsLoading(false);
                        })
                        .catch((err) => {
                            console.log(err);
                            setIsLoading(false);
                        });
                    }
                    else {
                        alert(`You are not registered as ${userType}`);
                        setIsLoading(false);
                    }
                })
            })
            .catch((error) => {
                alert(error);
                setIsLoading(false);
            });
        })
        .catch(error => {
            alert(error.message);
            setIsLoading(false);
        })
    }

    return (
        <>
        <View style={styles.container}>
            {(userType === "Admin" || userType === "User") &&
                <>
                    <Text style={[styles.title, {marginBottom: 30}]}>{userType} Registration</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} value={name} onChangeText={(newName) => setName(newName)} />
                        <Text style={styles.label}>Name</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput keyboardType="email-address" style={styles.input} value={email} onChangeText={(newEmail) => setEmail(newEmail)} />
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} value={password} onChangeText={(newPassword) => setPassword(newPassword)} />
                        <Text style={styles.label}>Password</Text>
                    </View>
                    <View style={styles.submitContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSignUp}>
                            <Text style={styles.submitText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
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