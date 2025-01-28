import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log("Connecté à la base de données PostgreSQL"))
    .catch((err: Error) => console.error("Erreur de connexion à la base :", err.message));

export default pool;
