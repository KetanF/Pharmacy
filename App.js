import React, { useCallback } from "react";
import { View } from 'react-native';
import 'react-native-gesture-handler';
import { Containers } from './containers/Containers';
import { AuthProvider, DrugProvider, LoadingProvider } from "./context";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
    'MontserratLight': require('./assets/fonts/Montserrat-Light.ttf'),
    'MontserratBold': require('./assets/fonts/Montserrat-Medium.ttf'),
    'MontserratThick': require('./assets/fonts/Montserrat-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <LoadingProvider>
        <AuthProvider>
          <DrugProvider>
            <Containers />
            <Loading />
          </DrugProvider>
        </AuthProvider>
      </LoadingProvider>
    </View>
  );
}
