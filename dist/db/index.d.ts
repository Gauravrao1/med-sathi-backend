import Sqlite from 'better-sqlite3';
import * as schema from './schema.js';
export declare const sqlite: Sqlite.Database;
export declare const db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof schema> & {
    $client: Sqlite.Database;
};
