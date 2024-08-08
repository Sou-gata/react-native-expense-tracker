import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import { Button, Dialog, FAB, Text, TextInput } from "react-native-paper";
import useToaster from "../useToaster";
import connectDB from "../db/connectDB";

const PersonalDetails = () => {
    const toast = useToaster();
    const [details, setDetails] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [inputs, setInputs] = useState({
        add: { place: "", purpose: "", expense: "" },
        edit: { id: "", place: "", purpose: "", expense: "" },
    });
    const [isVisible, setIsVisible] = useState({
        add: false,
        edit: false,
        delete: false,
        details: false,
    });
    const [selected, setSelected] = useState({ id: "", place: "", purpose: "", expense: "" });

    async function fetchData() {
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM personal", [], (_, { rows }) => {
                let data = [];
                for (let i = 0; i < rows.length; i++) {
                    data.push(rows.item(i));
                }
                let total = 0;
                data.forEach((detail) => {
                    let t = parseFloat(detail.expense);
                    if (isNaN(t)) {
                        t = 0;
                    }
                    total += t;
                });
                setTotalExpense(total.toFixed(2));
                setDetails(data);
            });
        });
    }
    async function handleAddData() {
        setIsVisible({ ...isVisible, add: false });
        if (inputs.add.place === "" || inputs.add.purpose === "" || inputs.add.expense === "") {
            toast.error("All fields are required");
            return;
        }
        if (isNaN(parseFloat(inputs.add.expense))) {
            toast.error("Enter valid expense");
            return;
        }
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO personal (place, purpose, expense) VALUES (? ,? ,?)",
                [inputs.add.place, inputs.add.purpose, inputs.add.expense],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        toast.success("Data added successfully");
                        fetchData();
                        setInputs({ ...inputs, add: { place: "", purpose: "", expense: "" } });
                    } else {
                        toast.error("Failed to add data");
                    }
                },
                (error) => toast.error("Failed to add data")
            );
        });
    }
    async function handleUpdateData() {
        setIsVisible({ ...isVisible, edit: false });
        if (inputs.edit.place === "" || inputs.edit.purpose === "" || inputs.edit.expense === "") {
            toast.error("All fields are required");
            return;
        }
        if (isNaN(parseFloat(inputs.edit.expense))) {
            toast.error("Enter valid expense");
            return;
        }
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE personal SET place = ?, purpose = ?, expense = ? WHERE id = ?",
                [inputs.edit.place, inputs.edit.purpose, inputs.edit.expense, selected.id],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        toast.success("Data updated successfully");
                        fetchData();
                        setInputs({
                            ...inputs,
                            edit: { id: "", place: "", purpose: "", expense: "" },
                        });
                    } else {
                        toast.error("Failed to update data");
                    }
                },
                (error) => toast.error("Failed to update data")
            );
        });
    }
    async function handleDeleteData() {
        setIsVisible({ ...isVisible, delete: false });
        const db = await connectDB();
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM personal WHERE id = ?",
                [selected.id],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        toast.success("Data deleted successfully");
                        fetchData();
                    } else {
                        toast.error("Failed to delete data");
                    }
                },
                (error) => toast.error("Failed to delete data")
            );
        });
    }
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={{ height: "100%", padding: 8 }}>
            <Text style={{ marginBottom: 8, fontWeight: "bold", fontSize: 16 }}>
                Total expense: {totalExpense}
            </Text>
            <View style={styles.tableRow}>
                <Text style={[{ width: "33%" }, styles.tableHeaderText]}>Place</Text>
                <Text style={[{ width: "40%" }, styles.tableHeaderText]}>Purpose</Text>
                <Text style={[{ width: "27%" }, styles.tableHeaderText]}>Expense</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {details.map((detail) => (
                    <Pressable
                        key={detail.id + "" + Math.random()}
                        android_ripple={{ color: "#d9d9d9" }}
                        style={styles.tableRow}
                        onPress={() => {
                            setSelected(detail);
                            setIsVisible({ ...isVisible, details: true });
                            setInputs({ ...inputs, edit: detail });
                        }}
                    >
                        <Text style={{ width: "33%", textTransform: "capitalize" }}>
                            {detail.place}
                        </Text>
                        <Text style={{ width: "40%", textTransform: "capitalize" }}>
                            {detail.purpose}
                        </Text>
                        <Text style={{ width: "27%", textTransform: "capitalize" }}>
                            {parseFloat(detail.expense?.toFixed(2)) || "0"}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
            {/* View Dialog */}
            <Dialog
                visible={isVisible.details}
                onDismiss={() => setIsVisible({ ...isVisible, details: false })}
                style={{ maxHeight: "75%", overflow: "hidden", paddingBottom: 10 }}
            >
                <Dialog.Title>Details</Dialog.Title>
                <Dialog.Content>
                    <View style={styles.detailsRow}>
                        <Text>Place: {selected.place}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text>Purpose: {selected.purpose}</Text>
                    </View>
                    <View style={[styles.detailsRow, { borderBottomWidth: 0 }]}>
                        <Text>Expense: {selected.expense}</Text>
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={() => {
                            setIsVisible({ ...isVisible, details: false, delete: true });
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        onPress={() => {
                            setIsVisible({ ...isVisible, details: false, edit: true });
                        }}
                    >
                        Edit
                    </Button>
                    <Button onPress={() => setIsVisible({ ...isVisible, details: false })}>
                        Cancel
                    </Button>
                </Dialog.Actions>
            </Dialog>
            {/* Add Dialog */}
            <Dialog
                visible={isVisible.add}
                onDismiss={() => setIsVisible({ ...isVisible, add: false })}
                style={{ maxHeight: "78%", overflow: "hidden", paddingBottom: 10 }}
            >
                <Dialog.Title>Add Details</Dialog.Title>
                <Dialog.Content>
                    <View style={{ gap: 12 }}>
                        <TextInput
                            label="Place"
                            mode="outlined"
                            value={inputs.add.place}
                            onChangeText={(e) =>
                                setInputs({ ...inputs, add: { ...inputs.add, place: e } })
                            }
                        />
                        <TextInput
                            label="Purpose"
                            mode="outlined"
                            value={inputs.add.purpose}
                            onChangeText={(e) =>
                                setInputs({ ...inputs, add: { ...inputs.add, purpose: e } })
                            }
                        />
                        <TextInput
                            label="Expanse"
                            mode="outlined"
                            keyboardType="numeric"
                            value={inputs.add.expense}
                            onChangeText={(e) =>
                                setInputs({ ...inputs, add: { ...inputs.add, expense: e } })
                            }
                        />
                        <Dialog.Actions>
                            <Button mode="" onPress={handleAddData}>
                                Add
                            </Button>
                            <Button
                                mode=""
                                onPress={() => setIsVisible({ ...isVisible, add: false })}
                            >
                                Cancel
                            </Button>
                        </Dialog.Actions>
                    </View>
                </Dialog.Content>
            </Dialog>
            {/* Edit Dialog */}
            <Dialog
                visible={isVisible.edit}
                onDismiss={() => setIsVisible({ ...isVisible, edit: false })}
                style={{ maxHeight: "78%", overflow: "hidden", paddingBottom: 10 }}
            >
                <Dialog.Title>Edit Details</Dialog.Title>
                <Dialog.Content>
                    <View style={{ gap: 12 }}>
                        <TextInput
                            label="Place"
                            mode="outlined"
                            value={inputs.edit.place}
                            onChangeText={(e) =>
                                setInputs({ ...inputs, edit: { ...inputs.edit, place: e } })
                            }
                        />
                        <TextInput
                            label="Purpose"
                            mode="outlined"
                            value={inputs.edit.purpose}
                            onChangeText={(e) =>
                                setInputs({ ...inputs, edit: { ...inputs.edit, purpose: e } })
                            }
                        />
                        <TextInput
                            label="Expanse"
                            mode="outlined"
                            keyboardType="numeric"
                            value={inputs.edit?.expense?.toString()}
                            onChangeText={(e) =>
                                setInputs({ ...inputs, edit: { ...inputs.edit, expense: e } })
                            }
                        />
                        <Dialog.Actions>
                            <Button mode="" onPress={handleUpdateData}>
                                Update
                            </Button>
                            <Button
                                mode=""
                                onPress={() => setIsVisible({ ...isVisible, edit: false })}
                            >
                                Cancel
                            </Button>
                        </Dialog.Actions>
                    </View>
                </Dialog.Content>
            </Dialog>
            {/* Delete Dialog */}
            <Dialog
                visible={isVisible.delete}
                onDismiss={() => setIsVisible({ ...isVisible, delete: false })}
                style={{ maxHeight: "75%", overflow: "hidden", paddingBottom: 10 }}
            >
                <Dialog.Title>Delete</Dialog.Title>
                <Dialog.Content>
                    <Text>Are you sure you want to delete?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleDeleteData}>Delete</Button>
                    <Button onPress={() => setIsVisible({ ...isVisible, delete: false })}>
                        Cancel
                    </Button>
                </Dialog.Actions>
            </Dialog>
            {!isVisible.add && !isVisible.edit && !isVisible.delete && !isVisible.details && (
                <FAB
                    icon="plus"
                    style={styles.fab}
                    color="white"
                    onPress={() =>
                        setIsVisible({ edit: false, delete: false, details: false, add: true })
                    }
                />
            )}
        </View>
    );
};

export default PersonalDetails;

const styles = StyleSheet.create({
    tableHeaderText: {
        paddingRight: 4,
        fontSize: 12,
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#D1D5DB",
        width: "100%",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: "#5e4996",
    },
    detailsRow: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#D1D5DB",
    },
});
