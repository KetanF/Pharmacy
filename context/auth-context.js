import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = React.createContext({});

const AuthProvider = ({children}) => {
    const [currentUser,setCurrentUser] = useState(null);

    useEffect(() => {
        getLoginCredentials();
    }, []);

    useEffect(() => {
        console.log("currentUser: ", currentUser);
    }, [currentUser]);

    const getLoginCredentials = () => {
        AsyncStorage
        .getItem('currentUser')
        .then((result) => {
            if (result !== null) {
                setCurrentUser(JSON.parse(result));
            }
            else {
                setCurrentUser(null);
            }
        })
        .catch((err) => console.log(err));
    }
        
    return (
        <AuthContext.Provider value={{currentUser,setCurrentUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;