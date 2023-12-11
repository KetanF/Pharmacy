import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import {colors} from '../styles/Colors';
import defaultAvatar from "../assets/default-avatar.jpg";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth, useLoading } from "../hooks";
import { firestore } from "../assets/firebase";

export default MyProfile = ({navigation}) => {
  const {setIsLoading} = useLoading();
	const { currentUser } = useAuth();
	const usersDB = firestore.collection("users");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(defaultAvatar);

  useEffect(() => {
    const focusHandler = navigation.addListener("focus",() => {
      setIsLoading(true);
      usersDB
      .where("email", "==", currentUser?.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          setName(user?.name);
          setEmail(user?.email);
          if (user?.profileImage) {
            setProfileImage(user?.profileImage);
            setIsLoading(false);
          }
        })
      })
      .catch((error) => {
        alert(error);
        setIsLoading(false);
      });
    });

    return focusHandler;
  }, [navigation]);
  

  return (
    <View style={styles.container}>
      <View style={styles.profilecontainer}>
        <View style={styles.profilecontent}>
          <Image style={styles.logo} source={profileImage === defaultAvatar ? profileImage : {uri: profileImage}} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.userInfo}>{email}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.buttonContainer}>
        <View style={styles.item}>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            <View style={styles.button}>
              <AntDesign style={styles.buttonIcon} name="profile" /> 
              <Text style={styles.buttonText}>{`Edit${"\n"}Profile`}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.item}>
          <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
            <View style={styles.button}>
              <MaterialCommunityIcons style={styles.buttonIcon} name="account-key" /> 
              <Text style={styles.buttonText}>{`Change${"\n"}Password`}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {currentUser?.userType === "User" &&
          <View style={styles.item}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <View style={styles.button}>
                <FontAwesome5 style={styles.buttonIcon} name="notes-medical" /> 
                <Text style={styles.buttonText}>{`Generate${"\n"}Prescription`}</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
      flex: 1,
      backgroundColor: '#84DCC8',
      alignItems: 'center',
  },
  profilecontainer: {
      paddingTop: 20,
      alignItems: 'center',
      width: '100%',
  },
  profilecontent: {
    padding: 25,
    alignItems: 'center',
  },
  logo:{
      width: 200,
      height: 200,
      borderRadius:100,
      borderWidth: 2,
      borderColor: colors.primaryColor,
      marginBottom: 15,
      backgroundColor: '#F5FFFA',
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontFamily: "MontserratThick",
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 16,
    color: '#000000',
    fontFamily: "MontserratBold",
  },
  divider: {
    height: 1.5,
    width: "100%",
    backgroundColor: colors.primaryColor,
    marginBottom: 35,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "40%",
    marginBottom: 20,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 25,
    color: colors.white,
    marginRight: 26,
  },
  button: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 7,
    paddingHorizontal: 17,
    borderRadius: 8,
    borderColor: colors.primaryColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
    fontFamily: "Montserrat",
    width: "100%",
  },
})
