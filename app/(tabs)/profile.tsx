import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from 'react-native';

export default function Tab() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
            headerImage={
            <ThemedText style={styles.headerImage} type="title">Profile</ThemedText>
            }>

        </ParallaxScrollView>

    );
}
const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    headerImage: {
        padding: 16,
    }
});