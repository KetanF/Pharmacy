import React from "react";
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useLoading } from "../hooks";
import {colors} from '../styles/Colors';

export default Loading = () => {
    const {isLoading} = useLoading();

    return (<>
        <Spinner
            visible={isLoading}
            size="large"
            color={colors.lightColor2}
            style={styles.spinner}
            overlayColor="rgba(0,0,0,0.5)"
        />
    </>);
}

const styles = StyleSheet.create({
    spinner: {

    },
});