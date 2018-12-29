const Entity = require("Entity");

module.exports = class Timeslot extends Entity {
    constructor(actor, duration, date, status) {
        super();
        this.actor = actor;
        this.status = status;
    }
};