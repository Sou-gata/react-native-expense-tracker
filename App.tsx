import "./gesture-handler";
import { SafeAreaView, StatusBar, useColorScheme, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";
import { useEffect } from "react";
import StackNavigation from "./StackNavigation";
import ContextProvider from "./src/db/Context";
import { createTables } from "./src/db/connectDB";

const App = () => {
    const isDarkMode = useColorScheme() === "dark";
    useEffect(() => {
        createTables();
    }, []);

    const theme = {
        colors: {
            primary: "rgb(120, 69, 172)",
            onPrimary: "rgb(255, 255, 255)",
            primaryContainer: "rgb(240, 219, 255)",
            onPrimaryContainer: "rgb(44, 0, 81)",
            secondary: "rgb(102, 90, 111)",
            onSecondary: "rgb(255, 255, 255)",
            secondaryContainer: "rgb(237, 221, 246)",
            onSecondaryContainer: "rgb(33, 24, 42)",
            tertiary: "rgb(128, 81, 88)",
            onTertiary: "rgb(255, 255, 255)",
            tertiaryContainer: "rgb(255, 217, 221)",
            onTertiaryContainer: "rgb(50, 16, 23)",
            error: "rgb(186, 26, 26)",
            onError: "rgb(255, 255, 255)",
            errorContainer: "rgb(255, 218, 214)",
            onErrorContainer: "rgb(65, 0, 2)",
            background: "rgb(255, 251, 255)",
            onBackground: "rgb(29, 27, 30)",
            surface: "rgb(255, 251, 255)",
            onSurface: "rgb(29, 27, 30)",
            surfaceVariant: "rgb(233, 223, 235)",
            onSurfaceVariant: "rgb(74, 69, 78)",
            outline: "rgb(124, 117, 126)",
            outlineVariant: "rgb(204, 196, 206)",
            shadow: "rgb(0, 0, 0)",
            scrim: "rgb(0, 0, 0)",
            inverseSurface: "rgb(50, 47, 51)",
            inverseOnSurface: "rgb(245, 239, 244)",
            inversePrimary: "rgb(220, 184, 255)",
            elevation: {
                level0: "transparent",
                level1: "rgb(248, 242, 251)",
                level2: "rgb(244, 236, 248)",
                level3: "rgb(240, 231, 246)",
                level4: "rgb(239, 229, 245)",
                level5: "rgb(236, 226, 243)",
            },
            surfaceDisabled: "rgba(29, 27, 30, 0.12)",
            onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
            backdrop: "rgba(51, 47, 55, 0.4)",
        },
    };

    const backgroundStyle = {
        backgroundColor: isDarkMode ? "#222" : "#F3F3F3",
    };

    return (
        <PaperProvider theme={theme}>
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
