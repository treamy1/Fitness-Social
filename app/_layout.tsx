import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { loaded } from "expo-font/build/memory";
import { ThemedText } from "@/components/ThemedText";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: true, // Show the header
                        title: "Flex", // Customize the header title
                        headerStyle: {
                            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff', // Customize header background color
                        },
                        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000', // Customize header text color
                        headerTitleStyle: {
                            fontSize: 24, // Customize font size
                            fontFamily: 'Arial', // Customize font family
                            color: colorScheme === 'dark' ? '#fff' : '#000', // Customize title color

                        },
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
}
