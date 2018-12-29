const Entity = require("Entity");

module.exports = class Actor extends Entity {
    constructor(fullName, role) {
        super();
        this.fullName = fullName;
        this.role = role;
    }
};