import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({ name: "expense.db", location: "default" });

const createTable = async () => {
    return db;
};
export const createTables = async () => {
    const db = await createTable();
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`,
            [],
            () => {},
            () => console.log("Error in creating table")
        );
    });
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS expense (id INTEGER PRIMARY KEY AUTOINCREMENT, place TEXT NOT NULL, purpose TEXT NOT NULL, by TEXT NOT NULL, expense REAL NOT NULL, userId INTEGER)",
            [],
            () => {},
            () => console.log("Error in creating table")
        );
    });
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS personal (id INTEGER PRIMARY KEY AUTOINCREMENT, place TEXT NOT NULL, purpose TEXT NOT NULL, expense REAL NOT NULL)",
            [],
            () => {},
            () => console.log("Error in creating table")
        );
    });
};

export default createTable;
