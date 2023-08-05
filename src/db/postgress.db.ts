import { DataSource, Entity } from "typeorm";
import Employee from "../entity/employee.entity";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import Address from "../entity/address.entity";


const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    //port: Number(process.env.POSTGRES_PORT),
    port:8765,
   // username: process.env.POSTGRES_USERNAME,
    //password: process.env.POSTGRES_PASSWORD,
    username:"postgres",
    password:"postgres",
    database: "training",
    entities: ["dist/entity/*.js"],
    logging: true,
    migrations: ["dist/db/migrations/*.js"],
    namingStrategy : new SnakeNamingStrategy()
})
export default dataSource;
