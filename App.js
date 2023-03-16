import React from "react";
import "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigation from "./src/navigation/MainNavigation";
import Orientation from "react-native-orientation-locker";

Orientation.lockToPortrait();

const App = () => {
  return (
    <SafeAreaProvider>
      <MainNavigation/>
    </SafeAreaProvider>
  );
};

export default App;
