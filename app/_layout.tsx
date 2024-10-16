//import { auth } from "@/firebaseConfig";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
//import { onAuthStateChanged, User } from "firebase/auth";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
//import "../global.css";



export default function RootLayout() {
/*
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const segments = useSegments();
*/
    const colorScheme = useColorScheme();

/*
    useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setInitializing(false);
        return subscriber;
});
    }, [])

    useEffect(() => {
        if(initializing) return;
        const inTabs = segments[0] == '(tabs)';
        if (user && !inTabs) {
            router.replace('/(tabs)/home')
        } else if (!user && inTabs) {
            router.replace('/')
        }
    }, [user, initializing]);

    if (initializing)

    return (
            <ThemedView className="flex-row flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </ThemedView>
        )
*/
    return (
        <SafeAreaProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                    {/* <Stack.Screen name='index' options={{ headerShown: false, headerTitle: ""}}/> */}
                    {/* <Stack.Screen name='signUpScreen' options={{ headerShown: true, headerTitle: "", headerTransparent: true}}/> */}
                    {/* <Stack.Screen name='signInScreen' options={{ headerShown: true, headerTitle: "", headerTransparent: true}}/> */}
                    <Stack.Screen name='(tabs)' options={{ headerShown: false}}/>
                    {/* <Stack.Screen name='TestScreen' options={{ headerShown: true, headerTitle: "Test Screen", headerTransparent: true}}/> */}
                </Stack>
            </ThemeProvider>
        </SafeAreaProvider>

    )
}