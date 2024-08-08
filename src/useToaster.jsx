import { useToast } from "react-native-paper-toast";

const useToaster = () => {
    const toast = useToast();
    const show = (...props) => {
        toast.show(props[0]);
    };
    const success = (message) => {
        show({
            message,
            type: "success",
            position: "top",
            snackbarStyle: {
                backgroundColor: "#28a745",
                borderRadius: 99,
            },
            messageContainerStyle: {
                paddingRight: 10,
            },
            messageStyle: {
                fontSize: 14,
                textAlign: "center",
            },
        });
    };
    const error = (message) => {
        show({
            message,
            type: "error",
            position: "top",
            snackbarStyle: {
                backgroundColor: "#dc3545",
                borderRadius: 99,
            },
            messageContainerStyle: {
                paddingRight: 10,
            },
            messageStyle: {
                fontSize: 14,
                textAlign: "center",
            },
        });
    };
    return { show, success, error };
};

export default useToaster;
