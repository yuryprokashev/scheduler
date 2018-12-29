const Entity = require("Entity");

module.exports = class Spec extends Entity {
    constructor(businessUnit, product, actors) {
        super();
        this.businessUnit = businessUnit;
        this.product = product;
        this.actors = actors;
        this.timeslots = [];
    }
};