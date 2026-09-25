import mysql2, { type PoolOptions } from "mysql2/promise";
import knex, { type Knex } from "knex";
import dotenv from "dotenv";
import type { Project } from "@/types/project.type.js";

dotenv.config();

// Define your connection config once to avoid duplication
const dbConfig: Knex.MySql2ConnectionConfig & PoolOptions = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Michaelstyqx2001",
    database: process.env.DB || "mkrodsullivan",
    charset: "utf8mb4",
    // We keep your typeCast logic here so Knex inherits it!
    // typeCast: (field, next) => {
    //     const jsonColumns = [
    //         'content',
    //         'encoded_contents',
    //         'aggregated_child_content',
    //         'content_thumbnail',
    //         'artist',
    //         'name',
    //         'user_data',
    //         'others'
    //     ];

    //     if (jsonColumns.includes(field.name)) {
    //         const buf = field.string(); // Get the string representation
    //         if (buf === null) return null;

    //         // Try to parse, but fallback to raw string if it's not JSON
    //         try {
    //             return JSON.parse(buf);
    //         } catch (e) {
    //             return buf;
    //         }
    //     }

    //     // IMPORTANT: Always return next() for fields we aren't handling
    //     return next();
    // },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 50,
};

// 1. Keep your existing mysql2 pool for your other non-knex code
const db = mysql2.createPool(dbConfig);

// 2. Initialize Knex using the same config
const knexDb = knex({
    client: 'mysql2',
    connection: dbConfig,
    pool: { min: 0, max: 10 } // Optional: Let Knex manage 10 connections
});



declare module "knex" {
    namespace Knex {
        interface Tables {
            completed_projects: Project;
        }
    }
}

export { db, knexDb }
