import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>

            {/* Home Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />

            {/* Group Tab */}
            <Tabs.Screen
                name="group"
                options={{
                    title: 'Group',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'people-circle' : 'people-circle-outline'} size={24} color={color} />
                    ),
                }}
            />

            {/* Post Tab */}
            <Tabs.Screen
                name="post"
                options={{
                    title: 'Post',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'add-circle' : 'add'} color={color} />
                    ),
                }}
            />

            {/* Workout Tab */}
            <Tabs.Screen
                name="workout"
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'barbell-sharp' : 'barbell-outline'} color={color} style={{ transform: [{ rotate: '-45deg' }] }} />
                    ),
                }}
            />

            {/* Profile Tab*/}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person-circle-sharp' : 'person-circle-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
