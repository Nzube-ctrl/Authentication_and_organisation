import User from "./user.model.js";
import Organisation from "./organisation.model.js";

// Define relationships
User.belongsToMany(Organisation, { through: "UserOrganisations" });
Organisation.belongsToMany(User, { through: "UserOrganisations" });

export { User, Organisation };
