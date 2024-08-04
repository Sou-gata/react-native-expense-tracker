import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button, Dialog, TextInput } from "react-native-paper";
import connectDB from "../db/connectDB";
import useToaster from "../useToaster";

const AddParticipents = () => {
    const toast = useToaster();
    const [participents, setPerticipents] = useState([]);
    const [ids, setIds] = useState({ edit: -1, delete: -1 });
    const [isOpened, setIsOpened] = useState({
        edit: false,
        delete: false,
        add: false,
    });
    const [inputs, setInputs] = useState({ editName: "", addName: "" });

    async function fetchParticipents() {
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM participants",
                [],
                (tx, result) => {
                    let temp = [];
                    if (result.rows.length === 0) {
                        setPerticipents([]);
                        return;
                    }
                    for (let i = 0; i < result.rows.length; i++) {
                        temp.push(result.rows.item(i));
                    }
                    setPerticipents(temp);
                },
                (error) => {
                    console.log("Error in creating table", error);
                }
            );
        });
    }
    async function handleUpdate() {
        setIsOpened({ ...isOpened, edit: false });
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE participants SET name = ? WHERE id = ?",
                [inputs.editName, ids.edit],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        toast.success("Participant updated successfully");
                        fetchParticipents();
                    }
                },
                (error) => {
                    toast.error("Error in updating participant");
                }
            );
        });
    }
    async function handleDelete() {
        setIsOpened({ ...isOpened, delete: false });
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM participants WHERE id = ?",
                [ids.delete],
                (tx, result) => {
                    if (result.rowsAffected > 0) {
                        toast.success("Participant deleted successfully");
                        fetchParticipents();
                    }
                },
                (error) => {
                    toast.error("Error in deleting participant");
                }
            );
        });
    }
    async function handleAdd() {
        setIsOpened({ ...isOpened, add: false });
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO participants (name) VALUES (?)",
                [inputs.addName],
                (tx, result) => {
                    if (result.rowsAffected > 0) {
                        setPerticipents([
                            ...participents,
                            { id: result.insertId, name: inputs.addName },
                        ]);
                        setInputs({ ...inputs, addName: "" });
                        toast.success("Participant added successfully");
                    }
                },
                (error) => {
                    toast.error("Error in adding participant");
                }
            );
        });
    }

    useEffect(() => {
        fetchParticipents();
    }, []);

    return (
        <View style={{ height: "100%" }}>
            {participents.length > 0 && (
                <View
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderBottomColor: "#D1D5DB",
                        padding: 8,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            width: "60%",
                            color: "#374151",
                        }}
                    >
                        Name
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            width: "20%",
                            color: "#374151",
                        }}
                    >
                        Edit
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            width: "20%",
                            color: "#374151",
                        }}
                    >
                        Delete
                    </Text>
                </View>
            )}
            {participents.map((data) => (
                <View
                    key={data.id}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderBottomColor: "#D1D5DB",
                        padding: 8,
                    }}
                >
                    <Text
                        style={{
                            color: "#374151",
                            width: "60%",
                        }}
                    >
                        {data.name}
                    </Text>
                    <Pressable
                        style={{ width: "20%" }}
                        onPress={() => {
                            setIds({ edit: data.id, delete: -1 });
                            setIsOpened({ ...isOpened, edit: true });
                            setInputs({ ...inputs, editName: data.name });
                        }}
                    >
                        <AntDesign name="edit" size={24} color="#5e4996" />
                    </Pressable>
                    <Pressable
                        style={{ width: "20%" }}
                        onPress={() => {
                            setIds({ edit: -1, delete: data.id });
                            setIsOpened({ ...isOpened, delete: true });
                        }}
                    >
                        <Ionicons name="trash-outline" size={22} color="#dc3545" />
                    </Pressable>
                </View>
            ))}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 16,
                }}
            >
                <Button mode="contained" onPress={() => setIsOpened({ ...isOpened, add: true })}>
                    Add Participent
                </Button>
            </View>
            {/* Edit Dialog */}
            <Dialog
                visible={isOpened.edit}
                onDismiss={() => setIsOpened({ ...isOpened, edit: false })}
            >
                <Dialog.Title>Edit</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Name"
                        mode="outlined"
                        value={inputs.editName}
                        onChangeText={(e) => setInputs({ ...inputs, editName: e })}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleUpdate}>Update</Button>
                    <Button onPress={() => setIsOpened({ ...isOpened, edit: false })}>
                        Cancel
                    </Button>
                </Dialog.Actions>
            </Dialog>
            {/* Delete Dialog */}
            <Dialog
                visible={isOpened.delete}
                onDismiss={() => setIsOpened({ ...isOpened, delete: false })}
            >
                <Dialog.Title>Delete</Dialog.Title>
                <Dialog.Content>
                    <Text>Are you sure you want to delete ?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button textColor="#dc3545" onPress={handleDelete}>
                        Delete
                    </Button>
                    <Button onPress={() => setIsOpened({ ...isOpened, delete: false })}>
                        Cancel
                    </Button>
                </Dialog.Actions>
            </Dialog>
            {/* Add Dialog */}
            <Dialog
                visible={isOpened.add}
                onDismiss={() => setIsOpened({ ...isOpened, add: false })}
            >
                <Dialog.Title>Add Participent</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Name"
                        mode="outlined"
                        value={inputs.addName}
                        onChangeText={(e) => setInputs({ ...inputs, addName: e })}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleAdd}>Add</Button>
                    <Button onPress={() => setIsOpened({ ...isOpened, add: false })}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default AddParticipents;
