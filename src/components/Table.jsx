import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";

const Table = ({ navigation, details }) => {
    return (
        <View style={{ width: "100%" }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#D1D5DB",
                    width: "100%",
                }}
            >
                <Text
                    style={{
                        width: "32%",
                        paddingRight: 4,
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Place
                </Text>
                <Text
                    style={{
                        width: "25%",
                        paddingRight: 4,
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Purpose
                </Text>
                <Text
                    style={{
                        width: "25%",
                        paddingRight: 4,
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    By
                </Text>
                <Text
                    style={{
                        width: "18%",
                        paddingRight: 4,
                        fontSize: 12,
                        fontWeight: "bold",
                    }}
                >
                    Expense
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ paddingBottom: 32 }}>
                    {details.map((data) => (
                        <Pressable
                            onPress={() => {
                                navigation.navigate("ViewData", { details: data });
                            }}
                            key={data.id}
                            android_ripple={{ color: "#d9d9d9" }}
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 8,
                                borderBottomWidth: 1,
                                borderBottomColor: "#D1D5DB",
                            }}
                        >
                            <Text
                                style={{
                                    width: "32%",
                                    paddingRight: 4,
                                    textWrap: "nowrap",
                                    textTransform: "capitalize",
                                }}
                            >
                                {data.place}
                            </Text>
                            <Text
                                style={{
                                    width: "25%",
                                    paddingRight: 4,
                                    textWrap: "nowrap",
                                    textTransform: "capitalize",
                                }}
                            >
                                {data.purpose}
                            </Text>
                            <Text
                                style={{
                                    width: "25%",
                                    paddingRight: 4,
                                    textWrap: "nowrap",
                                    textTransform: "capitalize",
                                }}
                            >
                                {data.by}
                            </Text>
                            <Text
                                style={{
                                    width: "18%",
                                    paddingRight: 4,
                                    textWrap: "nowrap",
                                    textTransform: "capitalize",
                                }}
                            >
                                {data.expense}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Table;
