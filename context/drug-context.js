import React, { useState, useEffect } from 'react';
import { firestore } from "../assets/firebase";

export const DrugContext = React.createContext({});

const DrugProvider = ({children}) => {
    const [drugsNamesList,setDrugsNamesList] = useState([]);
    
    const drugsDB = firestore.collection("names");

    useEffect(() => {
        const drugs = [];
        const unsubscribe = drugsDB
        .orderBy("name")
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var drug = doc.data();
                if (!drugs.includes(drug["name"])) {
                    drugs.push(drug["name"]);
                }
            });
            setDrugsNamesList(drugs);
        });
        return unsubscribe;
    }, []);
    
    return (
        <DrugContext.Provider value={{drugsNamesList,setDrugsNamesList}}>
            {children}
        </DrugContext.Provider>
    );
};

export default DrugProvider;