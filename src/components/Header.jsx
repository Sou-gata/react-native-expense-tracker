import { View, Text, Pressable } from "react-native";
import { useContext, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Menu } from "react-native-paper";
import { Context } from "../db/Context";

const Header = (props) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const { setIsOpened } = useContext(Context);

    return (
        <View
            style={[
                {
                    backgroundColor: "#5e4996",
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 8,
                },
                props.options.title == "Expense Tracker" && {
                    paddingVertical: 16,
                    justifyContent: "space-between",
                },
            ]}
        >
            {props.options.title != "Expense Tracker" && (
                <Pressable
                    style={{
                        marginRight: 8,
                        paddingVertical: 8,
                        paddingRight: 8,
                        justifyContent: "center",
                    }}
                    onPress={() => props.navigation.goBack()}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </Pressable>
            )}
            <Text style={{ color: "white", fontSize: 25 }}>{props.options.title}</Text>
            {props.options.title == "Expense Tracker" && (
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Pressable
                            style={{
                                marginLeft: 8,
                                paddingVertical: 8,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={openMenu}
                        >
                            <Entypo name="dots-three-vertical" size={20} color="white" />
                        </Pressable>
                    }
                >
                    <Menu.Item
                        leadingIcon={() => (
                            <FontAwesome6 name="user-large" size={18} color="black" />
                        )}
                        onPress={() => {
                            props.navigation.navigate("AddParticipents");
                            closeMenu();
                        }}
                        title="Participents"
                    />
                    <Menu.Item
                        leadingIcon={() => (
                            <MaterialIcons size={20} name="calculate" color="black" />
                        )}
                        onPress={() => {
                            props.navigation.navigate("ViewDetails");
                            closeMenu();
                        }}
                        title="View Details"
                    />
                    <Menu.Item
                        leadingIcon={() => (
                            <Ionicons size={22} name="reload-circle" color="black" />
                        )}
                        onPress={() => {
                            closeMenu();
                            setIsOpened(true);
                        }}
                        title="Reset"
                    />
                </Menu>
            )}
        </View>
    );
};

export default Header;
