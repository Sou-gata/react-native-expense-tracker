import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, Button, Dialog, RadioButton } from "react-native-paper";
import connectDB from "../db/connectDB";
import useToaster from "../useToaster";

const AddData = ({ navigation }) => {
    const toast = useToaster();
    const [inputs, setInputs] = useState({
        place: "",
        purpose: "",
        by: "",
        expense: "",
        userId: 0,
    });
    const [participents, setParticipents] = useState([]);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState({ id: 0, name: "" });

    useEffect(() => {
        const fetchData = async () => {
            const db = await connectDB();
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM participants",
                    [],
                    (tx, result) => {
                        let temp = [];
                        if (result.rows.length === 0) {
                            setParticipents([]);
                            return;
                        }
                        for (let i = 0; i < result.rows.length; i++) {
                            temp.push(result.rows.item(i));
                        }
                        setParticipents(temp);
                    },
                    (error) => {
                        console.log("Error in creating table", error);
                    }
                );
            });
        };
        fetchData();
    }, []);

    async function handleSave() {
        const db = await connectDB();
        let expense = parseFloat(inputs.expense);
        if (isNaN(expense)) {
            expense = 0;
        }
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO expense (place, purpose, by, expense, userId) VALUES (?, ?, ?, ?, ?)",
                [inputs.place, inputs.purpose, inputs.by, expense, inputs.userId],
                (tx, result) => {
                    if (result.rowsAffected > 0) {
                        setInputs({ place: "", purpose: "", by: "", expense: "" });
                        toast.success("Data saved successfully");
                        navigation.navigate("Home");
                    }
                },
                (error) => {
                    toast.error("Error in saving data");
                }
            );
        });
    }

    return (
        <View style={{ padding: 16, height: "100%" }}>
            <View style={{ gap: 12 }}>
                <TextInput
                    label="Place"
                    mode="outlined"
                    value={inputs.place}
                    onChangeText={(e) => setInputs({ ...inputs, place: e })}
                />
                <TextInput
                    label="Purpose"
                    mode="outlined"
                    value={inputs.purpose}
                    onChangeText={(e) => setInputs({ ...inputs, purpose: e })}
                />
                <TextInput
                    label="Expanse"
                    mode="outlined"
                    keyboardType="numeric"
                    value={inputs.expense}
                    onChangeText={(e) => setInputs({ ...inputs, expense: e })}
                />
                <Pressable
                    onPress={() => setVisible(true)}
                    style={{
                        flexDirection: "row",
                        borderWidth: 1,
                        padding: 12,
                        borderRadius: 6,
                        borderColor: "#5e4996",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: "#1f2937",
                        }}
                    >
                        By: {inputs.by}
                    </Text>
                </Pressable>
                <View
                    style={{
                        marginTop: 16,
                        alignItems: "center",
                    }}
                >
                    <Button mode="contained" onPress={handleSave}>
                        Save
                    </Button>
                </View>
            </View>
            <Dialog
                visible={visible}
                onDismiss={() => setVisible(false)}
                style={{ maxHeight: "75%", overflow: "hidden", paddingBottom: 10 }}
            >
                <Dialog.Title>Select Name</Dialog.Title>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(newValue) => {
                                for (let i = 0; i < participents.length; i++) {
                                    if (participents[i].id === newValue) {
                                        setValue(participents[i]);
                                        break;
                                    }
                                }
                            }}
                            value={value.id}
                        >
                            {participents.map((data) => (
                                <RadioButton.Item
                                    key={data.id + "" + Math.random()}
                                    label={data.name}
                                    value={data.id}
                                />
                            ))}
                        </RadioButton.Group>
                    </Dialog.Content>
                </ScrollView>
                <Dialog.Actions>
                    <Button
                        onPress={() => {
                            setInputs({ ...inputs, by: value.name, userId: value.id });
                            setVisible(false);
                        }}
                    >
                        OK
                    </Button>
                    <Button onPress={() => setVisible(false)}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default AddData;
