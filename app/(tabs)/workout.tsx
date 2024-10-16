import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';


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

    // Function to handle the "Add new workout" button click, opens the add workout modal
    const handleAddExercise = () => {
        setShowAddWorkoutModal(true); // Open the add workout modal
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

            <Button title="Add exercise +" onPress={() => setShowExerciseList(true)} />

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
                        <Button title="Close" onPress={() => setShowExerciseList(false)} />
                    </View>
                </View>
            </Modal>

            {/* Modal to select a specific workout */}
            <Modal visible={showWorkoutList} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Workout for {selectedExercise}</Text>
                        <Button title="Add new workout +" onPress={handleAddExercise} />
                        <FlatList
                            data={[...availableWorkouts, ...(customWorkouts[selectedExercise] || [])]} // Combine predefined and custom workouts
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => handleSelectWorkout(item)}>
                                    <Text style={styles.exerciseItem}>{item}</Text>
                                </Pressable>
                            )}
                        />
                        <Button title="Close" onPress={() => setShowWorkoutList(false)} />
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
                        <Button title="Save" onPress={handleSaveNewWorkout} />
                        <Button title="Cancel" onPress={() => setShowAddWorkoutModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Main workout tab component
const WorkoutTab: React.FC = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
    // State to store the sets for each workout
    const [workoutSets, setWorkoutSets] = useState<{ [workout: string]: { weight: string; reps: string }[] }>({});

    const handleStartWorkout = () => {
        setIsFormVisible(true);
    };

    const handleSelectWorkout = (workout: string) => {
        setSelectedWorkouts((prev) => [...prev, workout]);
        // Initialize the workout with an empty set (weight and reps)
        setWorkoutSets((prevSets) => ({
            ...prevSets,
            [workout]: [{ weight: '', reps: '' }]
        }));
    };

    // Function to handle changes in weight and reps for a given workout and set index
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
    // Function to add a new set for a given workout
    const handleAddSet = (workout: string) => {
        setWorkoutSets((prevSets) => ({
            ...prevSets,
            [workout]: [...(prevSets[workout] || []), { weight: '', reps: '' }],
        }));
    };

    const handleDeleteWorkout = (workoutIndex: number) => {
        // Remove the workout from selectedWorkouts and update the state
        setSelectedWorkouts((prevWorkouts) => prevWorkouts.filter((_, index) => index !== workoutIndex));
    
        // Optionally, remove the associated sets as well
        setWorkoutSets((prevSets) => {
            const updatedSets = { ...prevSets };
            const workoutToRemove = selectedWorkouts[workoutIndex];
            delete updatedSets[workoutToRemove];
            return updatedSets;
        });
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
                    <Button title="Start workout +" onPress={handleStartWorkout} />
                </View>
            )}

            {selectedWorkouts.length > 0 && (
                <View style={styles.exerciseList}>
                    <Text style={styles.exerciseTitle}>Selected Workouts:</Text>
                    {selectedWorkouts.map((workout, workoutIndex) => (
                        <Swipeable
                            key={workoutIndex}
                            renderRightActions={(progress, dragX) => (
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
                                <Button title="Add set +" onPress={() => handleAddSet(workout)} />
                            </View>
                        </Swipeable>
                    ))}
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
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderRadius: 10, // Rounded corners for the main container
    },
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        borderRadius: 10, // Rounded corners
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
        padding: 5,
        fontSize: 20, // Smaller font for better text alignment
        color: 'white',
        backgroundColor: '#2C2C2C', // Dark grey background for main container
        marginVertical: 0,
        borderRadius: 5, // Rounded corners for each exercise item
        borderWidth: 1, // Thickness of the border
        borderColor: '#888',
        paddingHorizontal:0,
    },
    exerciseList: {
        marginTop:10,
        padding: 10,
    },
    exerciseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    workoutBlock: {
        marginBottom: 20,
        backgroundColor: '#444444', // Background for individual workout blocks
        padding: 15,
        borderRadius: 12, // Smooth rounded corners
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
        zIndex: 10,
        width: '100%',
        backgroundColor: '#2C2C2C', // Dark grey background for modal content
        padding: 20,
        borderRadius: 15, // Smooth rounded modal corners
    },
    modalContainer: {
        flex: 1,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 40,
        marginBottom: 5,
        color: 'white', // White text for the modal title
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: 'white', // White button for contrast
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    modalButtonText: {
        color: '#2C2C2C', // Dark grey text inside white button
        fontSize: 16,
        fontWeight: 'bold',
    },
    /* Styles for the delete button */
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        backgroundColor: 'red',
        borderRadius: 5,
        marginVertical: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
/*
// Styling for the components
const styles = StyleSheet.create({
    headerImage: {
        padding: 16,
    },
    workoutContainer: {
        padding: 20,
        alignItems: 'center',
    },
    formContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
        backgroundColor: '#444',
        // smooth background edges
        borderRadius: 10,
    },
    logText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'white',
    },
    input: {
        height: 60,
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor: 'grey',
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '100%',
    },
    exerciseItem: {
        padding: 12,
        fontSize: 27,
        color: 'white',
        backgroundColor: '#444',
        marginVertical: 5,
    },
    exerciseList: {
        marginTop: 20,
    },
    exerciseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    workoutBlock: {
        marginBottom: 20,
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 10,
    },
    modalContent: {
        zIndex: 10,
        width: '95%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
    },
    modalContainer: {
        zIndex: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});
*/
export default WorkoutTab;
