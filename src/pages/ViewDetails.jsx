import { View } from "react-native";
import { Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import connectDB from "../db/connectDB";
import useToaster from "../useToaster";

const ViewDetails = () => {
    const toast = useToaster();
    const [info, setInfo] = useState({
        totalExpense: 0,
        numberOfPeople: 0,
        expensePerPeople: 0,
        peopleInfo: [],
    });
    function numToString(num) {
        let temp = parseFloat(num);
        if (isNaN(temp)) {
            return "0.00";
        } else {
            return temp.toFixed(2);
        }
    }
    useEffect(() => {
        async function fetchData() {
            const db = await connectDB();
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM expense",
                    [],
                    (_, res) => {
                        const result = [];
                        const people = [];
                        if (res.rows.length > 0) {
                            for (let i = 0; i < res.rows.length; i++) {
                                result.push(res.rows.item(i));
                            }
                            tx.executeSql(
                                "SELECT * FROM participants",
                                [],
                                (_, resp) => {
                                    if (resp.rows.length > 0) {
                                        for (let i = 0; i < resp.rows.length; i++) {
                                            people.push(resp.rows.item(i));
                                        }
                                        let totalExpense = 0;
                                        let peopleInfo = [];
                                        for (let i = 0; i < result.length; i++) {
                                            let exp = parseFloat(result[i].expense);
                                            totalExpense += isNaN(exp) ? 0 : exp;
                                        }
                                        let numberOfPeople = people.length;
                                        let expensePerPeople = totalExpense / numberOfPeople;
                                        for (let i = 0; i < people.length; i++) {
                                            let personExpense = 0;
                                            for (let j = 0; j < result.length; j++) {
                                                if (result[j].by === people[i].name) {
                                                    let exp = parseFloat(result[j].expense);
                                                    personExpense += isNaN(exp) ? 0 : exp;
                                                }
                                            }
                                            peopleInfo.push({
                                                name: people[i].name,
                                                expense: numToString(personExpense),
                                                receive: numToString(
                                                    personExpense - expensePerPeople
                                                ),
                                            });
                                        }

                                        setInfo({
                                            totalExpense: numToString(totalExpense),
                                            numberOfPeople: numberOfPeople,
                                            expensePerPeople: numToString(expensePerPeople),
                                            peopleInfo: peopleInfo,
                                        });
                                    }
                                },
                                (error) => {
                                    toast.error("Error in fetching participents");
                                }
                            );
                        }
                    },
                    (error) => {
                        toast.error("Error in fetching data");
                    }
                );
            });
        }
        fetchData();
    }, []);

    return (
        <View style={{ height: "100%" }}>
            <View
                style={{
                    flexDirection: "row",
                    padding: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#9CA3AF",
                }}
            >
                <Text>Total Expense: </Text>
                <Text>₹ {info.totalExpense}</Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    padding: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#9CA3AF",
                }}
            >
                <Text>Number of people: </Text>
                <Text>{info.numberOfPeople}</Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    padding: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#9CA3AF",
                }}
            >
                <Text>Expense per people: </Text>
                <Text>₹ {info.expensePerPeople}</Text>
            </View>
            <View style={{ marginTop: 12 }}>
                <View
                    style={{
                        flexDirection: "row",
                        padding: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: "#9CA3AF",
                    }}
                >
                    <Text
                        style={{
                            width: "40%",
                            fontSize: 12,
                            color: "#374151",
                        }}
                    >
                        Name
                    </Text>
                    <Text
                        style={{
                            width: "20%",
                            fontSize: 12,
                            color: "#374151",
                        }}
                    >
                        Paid
                    </Text>
                    <Text
                        style={{
                            width: "40%",
                            fontSize: 12,
                            color: "#374151",
                        }}
                    >
                        Remaining/Receive
                    </Text>
                </View>
            </View>
            {info.peopleInfo.map((person, index) => (
                <View
                    key={index}
                    style={{
                        flexDirection: "row",
                        padding: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: "#9ca3af ",
                    }}
                >
                    <Text
                        style={{
                            width: "40%",
                            fontSize: 10,
                            color: "#374151",
                        }}
                    >
                        {person.name}
                    </Text>
                    <Text
                        style={{
                            width: "20%",
                            fontSize: 10,
                            color: "#374151",
                        }}
                    >
                        ₹ {person.expense}
                    </Text>
                    <Text
                        style={[
                            {
                                width: "40%",
                                fontSize: 10,
                                color: "#374151",
                            },
                            parseFloat(person.receive) < 0
                                ? { color: "#dc2626" }
                                : { color: "#16a34a" },
                        ]}
                    >
                        {parseFloat(person.receive) < 0 ? "Give" : "Receive"} ₹{" "}
                        {Math.abs(person.receive)}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default ViewDetails;
