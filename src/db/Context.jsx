import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
    const [isOpened, setIsOpened] = useState(false);
    return <Context.Provider value={{ isOpened, setIsOpened }}>{children}</Context.Provider>;
};

export default ContextProvider;

export { Context };
