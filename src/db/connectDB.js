import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({ name: "expense.db", location: "default" });
const createTableQuery = `CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`;

const createTable = async () => {
    db.transaction((tx) => {
        tx.executeSql(
            createTableQuery,
            [],
            () => {
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS expense (id INTEGER PRIMARY KEY AUTOINCREMENT, place TEXT NOT NULL, purpose TEXT NOT NULL, by TEXT NOT NULL, expense REAL NOT NULL, userId INTEGER)",
                    [],
                    () => {},
                    () => console.log("Error in creating table")
                );
            },
            (error) => {
                console.log("Error in creating table", error);
            }
        );
    });
    return db;
};

export default createTable;
