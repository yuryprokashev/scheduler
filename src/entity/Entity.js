const uuid4 = require("uuid/v4");

module.exports = class Entity {
    constructor() {
        this.id = uuid4();
    }
};