// import { Sequelize } from "sequelize";
// import config from "../config/config.json";

// const sequelize = new Sequelize(
//   config.development.database,
//   config.development.username,
//   config.development.password,
//   {
//     host: config.development.host,
//     dialect: "postgres",
//   }
// );

// const db = {
//   sequelize,
//   Sequelize,
// };

// // Import models
// import User from "./user";
// import Organisation from "./organisation";

// // Define associations
// User.belongsToMany(Organisation, { through: "UserOrganisation" });
// Organisation.belongsToMany(User, { through: "UserOrganisation" });

// export { User, Organisation, sequelize, Sequelize };
