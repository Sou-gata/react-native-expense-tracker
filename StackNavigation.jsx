import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import Home from "./src/pages/Home";
import Header from "./src/components/Header";
import AddData from "./src/pages/AddData";
import ViewData from "./src/pages/ViewData";
import EditData from "./src/pages/EditData";
import AddParticipents from "./src/pages/AddParticipents";
import ViewDetails from "./src/pages/ViewDetails";
import PersonalDetails from "./src/pages/PersonalDetails";

const Stack = createStackNavigator();

const StackNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ header: Header }}>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ title: "Expense Tracker", animation: "timing" }}
            />
            <Stack.Screen
                name="AddData"
                component={AddData}
                options={{
                    title: "Add Data",
                    animation: "timing",
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            />
            <Stack.Screen
                name="ViewData"
                component={ViewData}
                options={{
                    title: "View Data",
                    animation: "timing",
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            />
            <Stack.Screen
                name="EditData"
                component={EditData}
                options={{
                    title: "Edit Data",
                    animation: "timing",
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            />
            <Stack.Screen
                name="AddParticipents"
                component={AddParticipents}
                options={{
                    title: "Add Participent",
                    animation: "timing",
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            />
            <Stack.Screen
                name="ViewDetails"
                component={ViewDetails}
                options={{
                    title: "View Details",
                    animation: "timing",
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            />
            <Stack.Screen
                name="PersonalDetails"
                component={PersonalDetails}
                options={{
                    title: "Personal Details",
                    animation: "timing",
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            />
        </Stack.Navigator>
    );
};

export default StackNavigation;
