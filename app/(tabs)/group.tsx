import {View, Text, StyleSheet, Image} from 'react-native';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {Collapsible} from "@/components/Collapsible";
import {ExternalLink} from "@/components/ExternalLink";

export default function Tab() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
            headerImage={
                <ThemedText style={styles.headerImage} type="title">Group</ThemedText>
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