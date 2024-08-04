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
        });
    };
    const warning = (message) => {
        show({
            message,
            type: "warning",
            position: "top",
            snackbarStyle: {
                backgroundColor: "#ffc107",
                borderRadius: 99,
            },
        });
    };
    const info = (message) => {
        show({
            message,
            type: "info",
            position: "top",
            snackbarStyle: {
                backgroundColor: "#17a2b8",
                borderRadius: 99,
            },
        });
    };
    return { show, success, error, warning, info };
};

export default useToaster;
