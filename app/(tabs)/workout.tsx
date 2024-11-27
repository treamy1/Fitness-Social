import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

// Inside the component:
// const SwipeableSet = ({ workout, onDelete, children }) => {
const SwipeableSet: React.FC<{ workout: string; onDelete: () => void; children: React.ReactNode }> = ({ workout, onDelete, children }) => {
    const translateX = useSharedValue(0);
    const threshold = -500; // Threshold to trigger delete

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationX < 0) {
                translateX.value = event.translationX;
            }
        })
        .onEnd((event) => {
            if (event.translationX < threshold) {
                // Trigger delete if swiped far enough
                runOnJS(onDelete)();
            } else {
                // Reset position if not swiped far enough
                translateX.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[animatedStyle, styles.workoutBlock]}>
                {children}
                {/* <Pressable style={styles.deleteButton} onPress={onDelete}>
                    <Ionicons name="trash" size={24} color="white" />
                </Pressable> */}
            </Animated.View>
        </GestureDetector>
    );
};

// Predefined list of exercises and their specific workouts
const exercises = [
    { id: '1', name: 'Abs', workouts: ['Crunches', 'Plank', 'Leg Raise'] },
    { id: '2', name: 'Chest', workouts: ['Bench Press', 'Push Ups', 'Chest Fly'] },
    { id: '3', name: 'Shoulders', workouts: ['Shoulder Press', 'Lateral Raise', 'Front Raise'] },
    { id: '4', name: 'Back', workouts: ['Pull Ups', 'Deadlift', 'Bent Over Row'] },
    { id: '5', name: 'Biceps', workouts: ['Bicep Curl', 'Hammer Curl', 'Concentration Curl'] },
    { id: '6', name: 'Legs', workouts: ['Squats', 'Lunges', 'Leg Press'] },
    { id: '7', name: 'Triceps', workouts: ['Tricep Dips', 'Skull Crusher', 'Tricep Pushdown'] },
];

// Workout form component to handle exercise and workout selections, and adding new workouts
const WorkoutForm: React.FC<{
    onAddExercise: () => void; 
    onSelectWorkout: (workout: string) => void; 
    workoutName: string; 
    setWorkoutName: React.Dispatch<React.SetStateAction<string>>; 
    bodyWeight: string; 
    setBodyWeight: React.Dispatch<React.SetStateAction<string>>; 
}> = ({ onAddExercise, onSelectWorkout, workoutName, setWorkoutName, bodyWeight, setBodyWeight }) => {
    //
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null); // State to track selected exercise
    const [showExerciseList, setShowExerciseList] = useState(false); // Modal visibility for exercise selection
    const [showWorkoutList, setShowWorkoutList] = useState(false); // Modal visibility for workout selection

    const [availableWorkouts, setAvailableWorkouts] = useState<string[]>([]); // Stores available workouts for selected exercise
    const [customWorkouts, setCustomWorkouts] = useState<{ [key: string]: string[] }>({}); // Stores user-added custom workouts
    const [newWorkoutName, setNewWorkoutName] = useState(''); // State for the name of a new workout being added
    const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false); // Modal visibility for adding new workout

    // Function to handle selecting an exercise (e.g., Chest, Legs)
    const handleSelectExercise = (exercise: string) => {
        const exerciseData = exercises.find((ex) => ex.name === exercise);
        if (exerciseData) {
            setSelectedExercise(exercise); // Set the selected exercise (e.g., Legs)
            setAvailableWorkouts(exerciseData.workouts); // Get the predefined workouts for that exercise group
            setShowExerciseList(false); // Close the exercise selection modal
            setShowWorkoutList(true);  // Open the workout selection modal
        }
    };

    // Function to handle selecting a workout (e.g., Squats, Bench Press)
    const handleSelectWorkout = (workout: string) => {
        setShowWorkoutList(false); // Close the workout selection modal
        onSelectWorkout(workout); // Add selected workout to the list in the parent component
    };
    // function to handle the "add new workout" button click, opens the add workout modal
    const handleAddExercise = () => {
        setShowWorkoutList(false); // Close the workout selection modal
        setShowAddWorkoutModal(true);
    };

    // Function to save the user-added workout to the selected exercise group
    const handleSaveNewWorkout = () => {
        if (selectedExercise && newWorkoutName.trim()) {
            setCustomWorkouts((prev) => ({
                ...prev,
                [selectedExercise]: [...(prev[selectedExercise] || []), newWorkoutName],
            }));
            setShowAddWorkoutModal(false); // Close the add workout modal
            setNewWorkoutName(''); // Clear the input field

            setShowWorkoutList(true); // reopen the workout selection modal
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Name workout, e.g., Chest Day"
                    value={workoutName}
                    onChangeText={setWorkoutName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Bodyweight (lb) optional"
                    value={bodyWeight}
                    onChangeText={setBodyWeight}
                    keyboardType="numeric" // Set num pad for numeric input
                />

                <Pressable style={styles.modalButton} onPress={() => setShowExerciseList(true)}>
                    <Text style={styles.modalButtonText}>Add exercise +</Text>
                </Pressable>
                {/* Modal to select an exercise */}
                <Modal visible={showExerciseList} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* <Text style={styles.modalTitle}>Select Muscle Group:</Text> */}
                            <FlatList
                                data={exercises}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <Pressable onPress={() => handleSelectExercise(item.name)} style={styles.pressable}>
                                        <View style={styles.row}>
                                            <Text style={styles.exerciseItemDesign}>{item.name}</Text>
                                            <Ionicons name="arrow-forward" size={24} color="white" />
                                        </View>
                                    </Pressable>
                                )}
                            />
                            <Pressable style={styles.modalCloseButton} onPress={() => setShowExerciseList(false)}>
                                <Text style={styles.modalButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* Modal to select a specific workout */}
                <Modal visible={showWorkoutList} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={[...availableWorkouts, ...(customWorkouts[selectedExercise] || [])]} // Combine predefined and custom workouts
                                // data={selectedExercise ? [...availableWorkouts, ...(customWorkouts[selectedExercise] || [])] : []} // Combine predefined and custom workouts
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <Pressable onPress={() => handleSelectWorkout(item)} style={styles.pressable}>
                                        <View style={styles.row}>
                                            <Text style={styles.exerciseItemDesign}>{item}</Text>
                                            {/* <Ionicons name="arrow-forward" size={24} color="white" /> */}
                                            <Ionicons name="add-circle-outline" size={24} color="white" />
                                        </View>
                                    </Pressable>
                                )}
                            />
                            {/* <Text style={styles.modalTitle}>Select Workout for {selectedExercise}</Text> */}
                            <Pressable style={styles.modalButton} onPress={handleAddExercise}>
                                <Text style={styles.modalButtonText}>Add new workout +</Text>
                            </Pressable>
                            <Pressable style={styles.modalCloseButton} onPress={() => setShowWorkoutList(false)}>
                                <Text style={styles.modalButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                
                {/* Modal to add a new custom workout */}
                <Modal visible={showAddWorkoutModal} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter new workout"
                                value={newWorkoutName}
                                onChangeText={setNewWorkoutName}
                            />
                            <Pressable style={styles.modalButton} onPress={handleSaveNewWorkout}>
                                <Text style={styles.modalButtonText}>Save</Text>
                            </Pressable>
                            <Pressable style={styles.modalButton} onPress={() => setShowAddWorkoutModal(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
    </SafeAreaView>
    );
};

declare global {
    var endTime: Date;
}

const WorkoutTab: React.FC = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
    const [workoutSets, setWorkoutSets] = useState<{ [workout: string]: { weight: string; reps: string }[] }>({});
    // add new state for recent workouts
    const [recentWorkouts, setRecentWorkouts] = useState<string[]>([]);
    // add new state for recent sets, weight, and reps
    const [recentSets, setRecentSets] = useState<{ [workout: string]: { weight: string; reps: string }[] }>({});

    //-- Add new state for workout start time, end time --//
    const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
    const [workoutEndTime, setWorkoutEndTime] = useState<Date | null>(null);

    // add new state for recent workout modal
    const [showRecentWorkout, setShowRecentWorkout] = useState(false);

    const [workoutName, setWorkoutName] = useState(''); // State for the workout name
    const [bodyWeight, setBodyWeight] = useState(''); // State for body weight input

    // added new state for recent body weight and workout name
    const [recentBodyWeight, setRecentBodyWeight] = useState<string | null>(null);
    const [recentWorkoutName, setRecentWorkoutName] = useState<string | null>(null);
    
    const handleRecentWorkout = () => {
        setIsFormVisible(false);
        setShowRecentWorkout(true); // Show the recent workout modal
        
    };
    const handleStartWorkout = () => {
        setIsFormVisible(true);
        const startTime = new Date();
        setWorkoutStartTime(startTime); // Set the start time for the workout
    };

    const handleSelectWorkout = (workout: string) => {
        setSelectedWorkouts((prev) => [...prev, workout]);
        setWorkoutSets((prevSets) => ({
            ...prevSets,
            [workout]: [{ weight: '', reps: '' }],
        }));
    };

    const handleSetChange = (workout: string, index: number, field: 'weight' | 'reps', value: string) => {
        setWorkoutSets((prevSets) => {
            const updatedSets = [...(prevSets[workout] || [])];
            updatedSets[index] = { ...updatedSets[index], [field]: value };
            return {
                ...prevSets,
                [workout]: updatedSets,
            };
        });
    };

    const handleAddSet = (workout: string) => {
        setWorkoutSets((prevSets) => ({
            ...prevSets,
            [workout]: [...(prevSets[workout] || []), { weight: '', reps: '' }],
        }));
        // add previous set to recent sets
        setRecentSets((prevSets) => ({
            ...prevSets,
            [workout]: [...(prevSets[workout] || []), { weight: '', reps: '' }],
        }));
    };
    // remove selected set
    const handleDeleteSet = (workout: string, setIndex: number) => {
        setWorkoutSets((prevSets) => {
            const updatedSets = [...(prevSets[workout] || [])]; // Copy the existing sets array
            updatedSets.splice(setIndex, 1); // Remove the specified set by index
            return {
                ...prevSets,
                [workout]: updatedSets, // Update the workout with the modified sets array
            };
        });
    };
    
    const handleDeleteWorkout = (workoutIndex: number) => {
        const workoutToRemove = selectedWorkouts[workoutIndex];
        setSelectedWorkouts((prevWorkouts) => prevWorkouts.filter((_, index) => index !== workoutIndex));
        setWorkoutSets((prevSets) => {
            const updatedSets = { ...prevSets };
            delete updatedSets[workoutToRemove];
            return updatedSets;
        });
    };

    // **Ensure handleFinishWorkout is defined here**
    const handleFinishWorkout = () => {
        setIsFormVisible(false); // Hide the workout form

        const endTime = new Date();
        setWorkoutEndTime(endTime); // Set the end time for the workout

        // Store recent workout name and body weight
        setRecentWorkoutName(workoutName);
        setRecentBodyWeight(bodyWeight);

        // Add the current workout name to the recent workouts list
        setRecentWorkouts((prev) => [...prev, workoutName]);

        // // Add completed workouts to the recent workouts list
        setRecentWorkouts((prevWorkouts) => [...prevWorkouts, ...selectedWorkouts]);
        // // Add completed sets to the recent sets list
        setRecentSets((prevSets) => ({ ...prevSets, ...workoutSets }));
        
        // Clear the current workout data for next workout
        setWorkoutName('');
        setBodyWeight('');
        // Clear selected workouts and sets
        setSelectedWorkouts([]);
        setWorkoutSets({});
    };
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={
                    <ThemedText style={styles.headerImage} type="title">
                        Workout
                    </ThemedText>
                }
            >
                {isFormVisible ? (
                    <WorkoutForm onAddExercise={() => setIsFormVisible(true)} onSelectWorkout={handleSelectWorkout}
                        workoutName={workoutName}
                        setWorkoutName={setWorkoutName}
                        bodyWeight={bodyWeight}
                        setBodyWeight={setBodyWeight}
                    />
                ) : (
                    <>
                    <View style={styles.workoutContainer}>
                            <Text style={styles.logText}>Log</Text>
                            <Pressable style={styles.modalButton} onPress={handleStartWorkout}>
                                <Text style={styles.modalButtonText}>Start workout +</Text>
                            </Pressable>
                    </View>
                    <View style={styles.workoutContainer}>
                        <Text style={styles.exerciseTitle}>Recent Workouts</Text>
                        {/* display workout start time and end time, as well as elapsed time and day of month */}
                        {/* Modal to select a specific workout */}
                        
                        <Pressable style={styles.modalButton} onPress={handleRecentWorkout}>
                            <Text style={styles.recentExerciseTime}>
                                Workout Name: {recentWorkoutName || 'No recent workout'} {"\n"}
                                Body Weight: {recentBodyWeight || 'N/A'}
                                    {"\n"}
                                {(workoutStartTime ? workoutStartTime.toLocaleDateString() : 'No date set')}
                            </Text>
                        </Pressable>

                        <Modal visible={showRecentWorkout} transparent={true} animationType="slide">
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                <Text style={styles.recentExerciseTime}>
                                    {`Start Time: ${workoutStartTime ? workoutStartTime.toLocaleTimeString() : 'No start time set'}`}
                                </Text>
                                <Text style={styles.recentExerciseTime}>
                                    {`End Time: ${workoutEndTime ? workoutEndTime.toLocaleTimeString() : 'No end time set'}`}
                                </Text>
                                <Text style={styles.recentExerciseTime}>
                                    {workoutStartTime && workoutEndTime ? (() => {
                                        const elapsedTime = workoutEndTime.getTime() - workoutStartTime.getTime();
                                        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
                                        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
                                        const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
                                        return `Elapsed Time: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                    })() : ''}
                                </Text>
                                    <FlatList
                                    data={recentWorkouts}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.recentWorkoutBlock}>
                                            <Text style={styles.exerciseTitle}>{item}</Text>
                                            {recentSets[item]?.map((set, index) => (
                                                <View key={index}>
                                                    <Text style={styles.recentExerciseItemDesign}>Set {index + 1} Weight: {set.weight} Rep: {set.reps}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                    />
                                    <Pressable style={styles.modalCloseButton} onPress={() => setShowRecentWorkout(false)}>
                                        <Text style={styles.modalButtonText}>Close</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    </>
                )}

                {selectedWorkouts.length > 0 && (
                    <><View style={styles.workout_setContainer}>
                        {selectedWorkouts.map((workout, workoutIndex) => (
                            <SwipeableSet
                            key={workoutIndex}
                            workout={workout}
                            onDelete={() => handleDeleteWorkout(workoutIndex)}
                            >
                                <View style={styles.workoutBlock}>
                                    <Text style={styles.exerciseItemDesign}>{workout}</Text>
                                    {workoutSets[workout]?.map((set, setIndex) => (
                                        <View key={setIndex} style={styles.setContainer}>
                                            <Text style={styles.exerciseItemDesign}>Set {setIndex + 1}</Text>
                                            <TextInput
                                                style={styles.setInput}
                                                placeholder="Weight"
                                                value={set.weight}
                                                onChangeText={(value) => handleSetChange(workout, setIndex, 'weight', value)}
                                                keyboardType="numeric" // Set num pad for numeric input
                                            />
                                            <TextInput
                                                style={styles.setInput}
                                                placeholder="Reps"
                                                value={set.reps}
                                                onChangeText={(value) => handleSetChange(workout, setIndex, 'reps', value)}
                                                keyboardType="numeric" // Set num pad for numeric input
                                            />
                                            {/* Add delete button for each set */}
                                            <Pressable onPress={() => handleDeleteSet(workout, setIndex)} style={styles.minusButton}>
                                                <Ionicons name="remove-circle" size={24} color="white" />
                                            </Pressable>
                                        </View>
                                    ))}

                                    <Pressable style={styles.modalButton} onPress={() => handleAddSet(workout)}>
                                        <Text style={styles.buttonText}>Add set +</Text>
                                    </Pressable>
                                </View>
                            </SwipeableSet>
                        ))}
                    </View><View>
                            {/* Finish Workout Button, need to add database functionality, to display users data to main screen once done working out*/}
                            <Pressable style={styles.finishWorkoutButton} onPress={handleFinishWorkout}>
                                <Text style={styles.finishWorkoutButtonText}>Finish Workout</Text>
                            </Pressable>
                        </View></>
                )}
            </ParallaxScrollView>
        </GestureHandlerRootView>
    );
};


// styling for the components
const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    headerImage: {
        padding: 16,
    },
    workoutContainer: {
        padding: 25,
        alignItems: 'center',
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderRadius: 8, // Rounded corners for the main container
        width: '117%',
        alignSelf: 'center',
    },
    formContainer: {
        padding: 25,
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderRadius: 8, // Rounded corners for the main container
        width: '117%',
        alignSelf: 'center',
    },
    logText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 25,
        color: 'white', // White text for visibility on dark background
    },
    input: {
        height: 50,
        borderColor: '#888', // Light grey border for better contrast
        borderWidth: 1,
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        marginBottom: 12,
        paddingHorizontal: 12, // More padding for a comfortable feel
        borderRadius: 8, // Rounded input fields
        color: 'white', // White text inside the input fields
    },
    setInput: {
        height: 50,
        borderColor: '#888', // Light grey border for better contrast
        borderWidth: 1,
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        marginTop: 6,
        marginBottom: 6,
        paddingHorizontal: 10, // More padding for a comfortable feel
        borderRadius: 8, // Rounded input fields
        color: 'white', // White text inside the input fields
    },
    exerciseItem: {
        paddingVertical: 10, // Adjusted to control vertical padding only
        paddingHorizontal: 25, // Keep horizontal padding for spacing
        fontSize: 22,
        color: 'white',
        backgroundColor: '#2C2C2C',
        marginVertical: 5, // Slight margin between each item
        borderTopWidth: 1, // Border only on the top and bottom
        borderBottomWidth: 1,
        borderColor: '#888',
        borderRadius: 0, // Remove the radius to maintain clean lines
    },
    exerciseList: {
        marginTop:10,
        padding: 10,
    },
    exerciseTitle: {
        fontSize: 20,

        alignItems: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    workoutBlock: {
        marginBottom: 10,
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderColor: '#888', // Light grey border for better contrast
        padding: 10,
        borderRadius: 8, // Smooth rounded corners
        width: '100%',
        alignItems: 'center',
    },
    // recent workout block, designed from the workout block
    recentWorkoutBlock: {
        padding: 5,
        borderRadius: 8, // Smooth rounded corners
        justifyContent: 'space-between',
        marginBottom: 5,
        width: '90%',
        height: 'auto',
        paddingHorizontal: 12, // More padding for a comfortable feel
        color: 'white', // White text inside the input fields
        paddingVertical: 15,
        backgroundColor: '#2C2F48', // Slightly lighter than the background
        marginVertical: 5, // Add spacing between rows
        marginHorizontal: 10, // Add padding from the edges
    },
    recentExerciseTime: {
        fontSize: 15,
        alignItems: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    recentExerciseItem: {
        paddingVertical: 10, // Adjusted to control vertical padding only
        paddingHorizontal: 25, // Keep horizontal padding for spacing
        fontSize: 15,
        color: 'white',
        backgroundColor: '#2C2C2C',
        marginVertical: 5, // Slight margin between each item
        borderTopWidth: 1, // Border only on the top and bottom
        borderBottomWidth: 1,
        borderColor: '#888',
        borderRadius: 0, // Remove the radius to maintain clean lines
    },
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderRadius: 8, // Rounded set container
        width: '90%',
        height: 'auto',
        paddingHorizontal: 12, // More padding for a comfortable feel
        color: 'white', // White text inside the input fields
        paddingVertical: 15,
        backgroundColor: '#2C2F48', // Slightly lighter than the background
        marginVertical: 5, // Add spacing between rows
        marginHorizontal: 10, // Add padding from the edges
    },
    // container for exercise item and set container
    workout_setContainer: {
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderRadius: 8, // Rounded corners for the main container
        width: '117%',
        alignSelf: 'center',
    },
    modalCloseButton: {
        backgroundColor: '#4C51BF', // Gradient equivalent color for buttons
        padding: 12,
        marginBottom: 100,
        borderRadius: 8, // Rounded button
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    modalContent: {
        flex: 1, // Take up the entire screen
        backgroundColor: '#202040', // Darker background for the modal content
        borderRadius: 20, // Rounded corners for smooth modal
        width: '100%',
        paddingTop: 100,
        maxWidth: 500,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Ensure overlay is dark and interactive
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white', // White text color
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#4C51BF', // Gradient equivalent color for buttons
        padding: 15,
        marginBottom: 10,
        borderRadius: 8, // Rounded button
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white', // White text for button
        fontWeight: '600',
        fontSize: 18,
    },
    /* Styles for the finish workout button */
    finishWorkoutButton: {
        backgroundColor: '#4C51BF', // Similar gradient or dark button color
        padding: 15,
        borderRadius: 8,
        marginTop: 122,
        alignSelf: 'center',
        width: '100%',
    },
    finishWorkoutButtonText: {
        color: 'white', // White text
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    /* Styles for the delete button */
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        backgroundColor: 'red',
        borderRadius: 8,
        marginBottom: 10,
    },
    minusButton:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        borderRadius: 8,
        height: 35,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pressable: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#2C2F48', // Slightly lighter than the background
        borderRadius: 8,
        marginVertical: 5, // Add spacing between rows
        marginHorizontal: 10, // Add padding from the edges
    },
    exerciseItemDesign: {
        fontSize: 20,
        color: 'white',
    },
    recentExerciseItemDesign: {
        fontSize: 20,
        color: 'white',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 8,
        padding: 8,
        marginBottom: 5,
    },
});
export default WorkoutTab;
