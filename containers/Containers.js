import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Landing, Login, Register, Home, Output, MyProfile, EditProfile, ChangePassword } from '../containers';
import { drawerHeaderStyles, headerStyles } from '../styles/HeaderStyles';
import { useAuth, useLoading } from "../hooks";
import { auth } from "../assets/firebase";
import { colors } from '../styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DrugsNavigator() {
    const Drugs = createNativeStackNavigator();

    return (
        <Drugs.Navigator screenOptions={drawerHeaderStyles} >
            <Drugs.Screen name="Home" component={Home} options={{headerShown: false}} />
            <Drugs.Screen name="Output" component={Output} options={{title: "Prescription", headerShown: false}} />
        </Drugs.Navigator>
    );
}

function ProfileNavigator() {
    const Profile = createNativeStackNavigator();

    return (
        <Profile.Navigator screenOptions={drawerHeaderStyles} initialRouteName="Profile">
            <Profile.Screen name="Profile" component={MyProfile} options={{title: "My Profile", headerShown: false}} />
            <Profile.Screen name="EditProfile" component={EditProfile} options={{title: "Edit Profile", headerShown: false}} />
            <Profile.Screen name="ChangePassword" component={ChangePassword} options={{title: "Edit Profile", headerShown: false}} />
        </Profile.Navigator>
    );
}

function DrawerNavigator() {
    const Drawer = createDrawerNavigator();
	const {currentUser, setCurrentUser} = useAuth();
    const {setIsLoading} = useLoading();

    const handleSignOut = () => {
        setIsLoading(true);
		auth
        .signOut()
        .then(() => {
            AsyncStorage
            .removeItem('currentUser')
            .then(() => {
                setCurrentUser(null);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
        })
        .catch(error => {
            alert(error.message);
            setIsLoading(false);
        })
	}

    return (
        <Drawer.Navigator screenOptions={{...drawerHeaderStyles, headerRight: () => (
				<TouchableOpacity onPress={handleSignOut}>
					<View style={styles.logoutIconContainer}>
						<MaterialIcons style={styles.logoutIcon} name="logout" />
					</View>
				</TouchableOpacity>
        ),}} >
            {(currentUser?.userType === "User") ? (
                <>
                    <Drawer.Screen name="Drugs" component={DrugsNavigator} options={{title: "Home"}} />
                </>
            ) : (
                null
            )}
            <Drawer.Screen name="MyProfile" component={ProfileNavigator} options={{title: "My Profile",unmountOnBlur: true,}} />
        </Drawer.Navigator>
    );
}

export const Containers = ({children, navigation}) => {
    const {currentUser} = useAuth();
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={headerStyles}>
            {(!currentUser?.email) ? (
                <>
                <Stack.Screen name="Landing" component={Landing} options={{title: "Neo Care"}} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} options={{title: "Registration"}} />
                </>
            ) : (
                <>
                <Stack.Screen name="Home Drawer" component={DrawerNavigator} options={{headerShown: false}} />
                </>
            )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    logoutIconContainer: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
	},
	logoutIcon: {
		fontSize: 25,
		marginRight: 12,
		color: colors.white,
	}
});