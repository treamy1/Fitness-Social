import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
//import { Ionicons } from "@expo/vector-icons/Ionicons";


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
const WorkoutForm: React.FC<{ onAddExercise: () => void, onSelectWorkout: (workout: string) => void }> = ({ onAddExercise, onSelectWorkout }) => {
    const [workoutName, setWorkoutName] = useState(''); // State for the workout name
    const [bodyWeight, setBodyWeight] = useState(''); // State for body weight input
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null); // State to track selected exercise
    const [showExerciseList, setShowExerciseList] = useState(false); // Modal visibility for exercise selection
    const [showWorkoutList, setShowWorkoutList] = useState(false); // Modal visibility for workout selection

    const [availableWorkouts, setAvailableWorkouts] = useState<string[]>([]); // Stores available workouts for selected exercise
    const [customWorkouts, setCustomWorkouts] = useState<{ [key: string]: string[] }>({}); // Stores user-added custom workouts
    const [newWorkoutName, setNewWorkoutName] = useState(''); // State for the name of a new workout being added
    const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false); // Modal visibility for adding new workout

    useEffect(() => {
        console.log("showAddWorkoutModal state has changed:", showAddWorkoutModal);
    }, [showAddWorkoutModal]);

    // Function to handle selecting an exercise (e.g., Chest, Legs)
    const handleSelectExercise = (exercise: string) => {
        const exerciseData = exercises.find((ex) => ex.name === exercise);
        if (exerciseData) {
            setSelectedExercise(exercise); // Set the selected exercise (e.g., Legs)
            setAvailableWorkouts(exerciseData.workouts); // Get the predefined workouts for that exercise group
            setShowExerciseList(false); // Close the exercise selection modal
            setShowWorkoutList(true);   // Open the workout selection modal
        }
    };

    // Function to handle selecting a workout (e.g., Squats, Bench Press)
    const handleSelectWorkout = (workout: string) => {
        setShowWorkoutList(false); // Close the workout selection modal
        onSelectWorkout(workout); // Add selected workout to the list in the parent component
    };
    // function to handle the "add new wrokout" button click, opens the add workout modal
    const handleAddExercise = () => {
        console.log('Opening add workout modal');
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
        <View style={styles.formContainer}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={workoutName}
                onChangeText={setWorkoutName}
            />

            <TextInput
                style={styles.input}
                placeholder="Bodyweight (lb)"
                value={bodyWeight}
                onChangeText={setBodyWeight}
            />

            <Pressable style={styles.modalButton} onPress={() => setShowExerciseList(true)}>
                <Text style={styles.modalButtonText}>Add exercise +</Text>
            </Pressable>

            {/* Modal to select an exercise */}
            <Modal visible={showExerciseList} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Exercise</Text>
                        <FlatList
                            data={exercises}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => handleSelectExercise(item.name)}>
                                    <Text style={styles.exerciseItem}>{item.name}</Text>
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
                        <Text style={styles.modalTitle}>Select Workout for {selectedExercise}</Text>
                        <Pressable style={styles.modalButton} onPress={handleAddExercise}>
                            <Text style={styles.modalButtonText}>Add new workout +</Text>
                        </Pressable>
                        <FlatList
                            data={[...availableWorkouts, ...(customWorkouts[selectedExercise] || [])]} // Combine predefined and custom workouts
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => handleSelectWorkout(item)}>
                                    <Text style={styles.exerciseItem}>{item}</Text>
                                </Pressable>
                            )}
                        />
                        
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
                        <Text style={styles.modalTitle}>Add New Workout for {selectedExercise}</Text>
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
    );
};

const WorkoutTab: React.FC = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
    const [workoutSets, setWorkoutSets] = useState<{ [workout: string]: { weight: string; reps: string }[] }>({});

    const handleStartWorkout = () => {
        setIsFormVisible(true);
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
        setSelectedWorkouts([]); // Clear selected workouts
        setWorkoutSets({}); // Clear workout sets
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
                    <WorkoutForm onAddExercise={() => setIsFormVisible(true)} onSelectWorkout={handleSelectWorkout} />
                ) : (
                    <View style={styles.workoutContainer}>
                        <Text style={styles.logText}>Log</Text>
                        <Pressable style={styles.modalButton} onPress={handleStartWorkout}>
                            <Text style={styles.modalButtonText}>Start workout +</Text>
                        </Pressable>
                    </View>
                )}

                {selectedWorkouts.length > 0 && (
                    <View>
                        {selectedWorkouts.map((workout, workoutIndex) => (
                            <Swipeable
                                key={workoutIndex}
                                renderRightActions={() => (
                                    <Pressable onPress={() => handleDeleteWorkout(workoutIndex)} style={styles.deleteButton}>
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </Pressable>
                                )}
                            >
                                <View style={styles.workoutBlock}>
                                    <Text style={styles.exerciseItem}>{workout}</Text>
                                    {workoutSets[workout]?.map((set, setIndex) => (
                                        <View key={setIndex} style={styles.setContainer}>
                                            <Text style={styles.exerciseItem}>Set {setIndex + 1}</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Weight"
                                                value={set.weight}
                                                onChangeText={(value) => handleSetChange(workout, setIndex, 'weight', value)}
                                            />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Reps"
                                                value={set.reps}
                                                onChangeText={(value) => handleSetChange(workout, setIndex, 'reps', value)}
                                            />
                                        </View>
                                    ))}

                                    <Pressable style={styles.button} onPress={() => handleAddSet(workout)}>
                                        <Text style={styles.buttonText}>Add set +</Text>
                                    </Pressable>
                                </View>
                            </Swipeable>
                        ))}

                        {/* Finish Workout Button, need to add database functionality, to display users data to main screen once done working out*/}
                        <Pressable style={styles.finishWorkoutButton} onPress={handleFinishWorkout}>
                            <Text style={styles.finishWorkoutButtonText}>Finish Workout</Text>
                        </Pressable>
                    </View>
                )}
            </ParallaxScrollView>
        </GestureHandlerRootView>
    );
};


// styling for the components
const styles = StyleSheet.create({
    headerImage: {
        padding: 16,
    },
    workoutContainer: {
        padding: 25,
        alignItems: 'center',
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderRadius: 8, // Rounded corners for the main container
    },
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 8,
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderRadius: 8, // Rounded corners
        paddingBottom: 10, // Add padding to the bottom for better spacing
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
        backgroundColor: '#444444', // Background for individual workout blocks
        padding: 5,
        borderRadius: 8, // Smooth rounded corners
    },
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#333333', // Slightly darker for set container background
        borderRadius: 8, // Rounded set container
    },
    modalCloseButton: {
        backgroundColor: '#4C51BF', // Gradient equivalent color for buttons
        padding: 12,
        marginBottom: 100,
        borderRadius: 8, // Rounded button
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2C2C2C', // Dark grey button
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
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
        shadowColor: '#000',
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker transparent overlay
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
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
export default WorkoutTab;
