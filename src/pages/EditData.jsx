import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Dialog, RadioButton, TextInput } from "react-native-paper";
import connectDB from "../db/connectDB";
import useToaster from "../useToaster";

const EditData = ({ route, navigation }) => {
    const toast = useToaster();
    const { details } = route.params;
    const [inputs, setInputs] = useState({
        place: details.place,
        purpose: details.purpose,
        by: details.by,
        expense: details.expense?.toString(),
        userId: details.userId,
    });
    const [participents, setParticipents] = useState([]);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState({ id: 0, name: "" });
    const handleUpdate = async () => {
        const db = await connectDB();
        let expense = parseFloat(inputs.expense);
        if (isNaN(expense)) {
            expense = 0;
        }
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE expense SET place = ?, purpose = ?, by = ?, expense = ?, userId = ? WHERE id = ?",
                [inputs.place, inputs.purpose, inputs.by, expense, inputs.userId, details.id],
                (tx, result) => {
                    if (result.rowsAffected > 0) {
                        toast.success("Data updated successfully");
                        navigation.navigate("Home");
                    }
                },
                (error) => {
                    toast.error("Error in updating data");
                }
            );
        });
    };
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
                        toast.error("Error in fetching participents");
                    }
                );
            });
        };
        fetchData();
    }, [details]);
    return (
        <View
            style={{
                padding: 16,
                height: "100%",
            }}
        >
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
                        borderColor: "#5e4996",
                        borderWidth: 1,
                        padding: 12,
                        borderRadius: 6,
                        flexDirection: "row",
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
                        justifyContent: "center",
                    }}
                >
                    <Button mode="contained" onPress={handleUpdate}>
                        Update
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

export default EditData;
