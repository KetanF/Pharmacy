import React, { useState } from 'react';

export const LoadingContext = React.createContext({});

const LoadingProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
        
    return (
        <LoadingContext.Provider value={{isLoading,setIsLoading}}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;