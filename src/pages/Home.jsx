import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Dialog, FAB, TextInput } from "react-native-paper";
import Table from "../components/Table";
import { Context } from "../db/Context";
import connectDB from "../db/connectDB";
import { useIsFocused } from "@react-navigation/native";
import useToaster from "../useToaster";

const Home = ({ navigation }) => {
    const isFocused = useIsFocused();
    const toast = useToaster();
    const { isOpened, setIsOpened } = useContext(Context);
    const [isVisible, setIsVisible] = useState(false);
    const [text, setText] = useState("");
    const [details, setDetails] = useState([]);

    async function fetchData() {
        try {
            const db = await connectDB();
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM expense",
                    [],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            let temp = [];
                            for (let i = 0; i < result.rows.length; i++) {
                                temp.push(result.rows.item(i));
                            }
                            setDetails(temp);
                        }
                    },
                    (error) => {
                        toast.error("Error in fetching data");
                    }
                );
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function handleReset() {
        if (text === "RESET") {
            const db = await connectDB();
            db.transaction((tx) => {
                tx.executeSql(
                    "DROP TABLE expense",
                    [],
                    () => {},
                    (error) => {
                        toast.error("Error in deleting table");
                    }
                );
                tx.executeSql(
                    "DROP TABLE participants",
                    [],
                    () => {
                        setIsOpened(false);
                        setIsVisible(false);
                        setText("");
                        setDetails([]);
                        toast.success("Reset successful");
                    },
                    (error) => {
                        toast.error("Error in deleting table");
                    }
                );
            });
        } else {
            toast.error("Incorrect input");
            setIsVisible(false);
            setText("");
        }
    }

    useEffect(() => {
        if (isFocused) fetchData();
    }, [isFocused]);

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
                width: "100%",
            }}
        >
            <Table navigation={navigation} details={details} />
            <FAB
                icon="plus"
                style={styles.fab}
                color="white"
                onPress={() => navigation.navigate("AddData")}
            />
            <Dialog visible={isOpened} onDismiss={() => setIsOpened(false)}>
                <Dialog.Title>Reset</Dialog.Title>
                <Dialog.Content>
                    <Text>Are you sure you want to reset?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={() => {
                            setIsOpened(false);
                            setIsVisible(true);
                        }}
                    >
                        Yes
                    </Button>
                    <Button onPress={() => setIsOpened(false)}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog
                visible={isVisible}
                onDismiss={() => {
                    setIsOpened(false);
                    setText("");
                }}
            >
                <Dialog.Title>Reset</Dialog.Title>
                <Dialog.Content>
                    <Text>
                        Type <Text className="text-red-700">'RESET'</Text> to continue
                    </Text>
                    <View className="mt-4">
                        <TextInput
                            label="Type here"
                            mode="outlined"
                            value={text}
                            onChangeText={(e) => setText(e)}
                        />
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button textColor="#dc3545" onPress={handleReset}>
                        Reset
                    </Button>
                    <Button
                        onPress={() => {
                            setIsVisible(false);
                            setText("");
                        }}
                    >
                        Cancel
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: "#5e4996",
    },
});
