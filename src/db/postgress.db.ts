import * as dotenv from "dotenv";
dotenv.config({path:__dirname+'/.env'});

import { DataSource} from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const dataSource = new DataSource({
    type: "postgres",
    host:process.env.POSTGRES_HOST,
    // port: Number(process.env.POSTGRES_PORT),
    // username: process.env.POSTGRES_USERNAME,
    // password: process.env.POSTGRES_PASSWORD,
    // database: process.env.POSTGRES_DATABASE,
    port:8765,
    username:"postgres",
    password: "postgres",
    database:"training",
    entities: ["dist/entity/*.js"],
    migrations: ["dist/db/migrations/*.js"],
    namingStrategy : new SnakeNamingStrategy()
})
export default dataSource;
