import "./gesture-handler";
import { SafeAreaView, StatusBar, useColorScheme, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";
import StackNavigation from "./StackNavigation";
import ContextProvider from "./src/db/Context";

const App = () => {
    const isDarkMode = useColorScheme() === "dark";

    const backgroundStyle = {
        backgroundColor: isDarkMode ? "#222" : "#F3F3F3",
    };

    return (
        <PaperProvider>
            <ToastProvider>
                <NavigationContainer>
                    <SafeAreaView style={backgroundStyle}>
                        <StatusBar barStyle="light-content" backgroundColor="#5e4996" />
                        <View style={{ height: "100%", width: "100%" }}>
                            <ContextProvider>
                                <StackNavigation />
                            </ContextProvider>
                        </View>
                    </SafeAreaView>
                </NavigationContainer>
            </ToastProvider>
        </PaperProvider>
    );
};

export default App;
