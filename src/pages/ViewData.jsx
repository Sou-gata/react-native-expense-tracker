import { View } from "react-native";
import React, { useState } from "react";
import { Button, Dialog, Text } from "react-native-paper";
import connectDB from "../db/connectDB";
import useToaster from "../useToaster";

const ViewData = ({ route, navigation }) => {
    const { details } = route.params;
    const toast = useToaster();
    const [visible, setVisible] = useState(false);
    async function handleDelete() {
        setVisible(false);
        const id = details.id;
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM expense WHERE id = ?",
                [id],
                (tx, result) => {
                    if (result.rowsAffected > 0) {
                        navigation.navigate("Home");
                        toast.success("Data deleted successfully");
                    }
                },
                (error) => {
                    toast.error("Error in deleting data");
                }
            );
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    padding: 16,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "#6B7280",
                }}
            >
                <Text>Place: </Text>
                <Text style={{ color: "#1F1F37", textTransform: "capitalize" }}>
                    {details.place}
                </Text>
            </View>
            <View
                style={{
                    padding: 8,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "#6B7280",
                }}
            >
                <Text>Purpous: </Text>
                <Text style={{ color: "#1F1F37", textTransform: "capitalize" }}>
                    {details.purpose}
                </Text>
            </View>
            <View
                style={{
                    padding: 8,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "#6B7280",
                }}
            >
                <Text>Expance By: </Text>
                <Text style={{ color: "#1F1F37", textTransform: "capitalize" }}>{details.by}</Text>
            </View>
            <View
                style={{
                    padding: 8,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "#6B7280",
                }}
            >
                <Text>Cost: </Text>
                <Text style={{ color: "#1F1F37", textTransform: "capitalize" }}>
                    ₹ {parseFloat(parseFloat(details.expense).toFixed(2)).toString()}
                </Text>
            </View>
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    marginTop: 16,
                    flexDirection: "row",
                }}
            >
                <Button
                    mode="contained"
                    onPress={() => {
                        navigation.navigate("EditData", { details });
                    }}
                >
                    Edit
                </Button>
                <Button
                    mode="contained"
                    buttonColor="#dc3545"
                    onPress={() => {
                        setVisible(true);
                        handleDelete();
                    }}
                >
                    Delete
                </Button>
            </View>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Title>Delete</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">Are you sure you want to delete?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button textColor="#dc3545" onPress={handleDelete}>
                        Delete
                    </Button>
                    <Button
                        onPress={() => {
                            setVisible(false);
                        }}
                    >
                        Cancel
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default ViewData;
