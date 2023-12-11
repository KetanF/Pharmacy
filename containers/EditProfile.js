import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import {colors} from '../styles/Colors';
import defaultAvatar from "../assets/default-avatar.jpg";
import { FontAwesome5 } from '@expo/vector-icons';
import { firestore, storage, storageRef, updateUserDocument } from "../assets/firebase";
import { useAuth, useLoading } from "../hooks";
import * as ImagePicker from 'expo-image-picker';

export default EditProfile = ({navigation}) => {
  const {setIsLoading} = useLoading();
  const [name, setName] = useState("");
  const [ID, setID] = useState("");
  const [profileImage, setProfileImage] = useState(defaultAvatar);
  const [image, setImage] = useState(null);
  const [readyToUpdate, setReadyToUpdate] = useState(true);
  const usersDB = firestore.collection("users");
  const {currentUser} = useAuth();

  useEffect(() => {
    const focusHandler = navigation.addListener("focus",() => {
      usersDB
      .where("email", "==", currentUser?.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          setName(user?.name);
          if (user?.profileImage) {
            setProfileImage(user?.profileImage);
            setIsLoading(false);
          }
          setID(doc.id);
        })
      })
      .catch((error) => {
        alert(error);
      });
    });

    return focusHandler;
  }, [navigation])
  

  const updateProfile = async () => {
    setIsLoading(true);
    if (readyToUpdate) {
      usersDB
      .where("email", "==", currentUser?.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateUserDocument(doc.id, {name: name, profileImage: profileImage})
          .then(() => {
            alert("Profile updated successfully!");
            setIsLoading(false);
            navigation.navigate("Profile");
          })
        })
      })
      .catch((error) => {
        alert(error);
        setIsLoading(false);
      });
    }
    else {
      alert("Wait! Your profile picture is being uploaded!");
      setIsLoading(false);
    }
  }

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
    }
    else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const uploadImage = async() => {
      setReadyToUpdate(false);
      const blobImage = await new Promise((resolve,reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        }
        xhr.onerror = function () {
          reject(new TypeError("Network request failed!"));
        }
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });

      const metadata = {
        contentType: 'image/jpeg'
      };

      var uploadTask = storageRef.child('users/' + ID).put(blobImage, metadata);

      uploadTask.on(storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case storage.TaskState.PAUSED: 
              console.log('Upload is paused');
              break;
            case storage.TaskState.RUNNING: 
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
          }
        }, 
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            setProfileImage(downloadURL);
            setIsLoading(false);
            setReadyToUpdate(true);
          });
        }
      );
    }
    if(image !== null) {
      uploadImage();
      setImage(null);
    }
  }, [image])
  

  return (
    <View style={styles.container}>
      <View style={styles.profilecontainer}>
        <View style={styles.profilecontent}>
          <Image
            style={styles.logo}
            source={profileImage === defaultAvatar ? profileImage : {uri: profileImage}}
          />
            <View style={styles.editIconContainer}>
              <TouchableOpacity onPress={pickImage}>
                <FontAwesome5 style={styles.editIcon} name="pen" /> 
              </TouchableOpacity>
            </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={name} onChangeText={(newName) => setName(newName)} />
        <Text style={styles.label}>Name</Text>
      </View>
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={updateProfile}>
          <Text style={styles.submitText}>Update Profile</Text>
        </TouchableOpacity>
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
  editIconContainer: {
    backgroundColor: colors.primaryColor,
    padding: 10,
    borderRadius: 100,
    borderColor: colors.primaryColor,
    borderWidth: 2,
    position: "absolute",
    bottom: 20,
  },
  editIcon: {
    color: colors.white,
    fontSize: 20,
  },
})
