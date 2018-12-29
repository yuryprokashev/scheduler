const Entity = require("Entity");

module.exports = class CalendarEvent extends Entity {
    constructor(date, duration) {
        super();
        this.timeslots = [];
        this.duration = duration;
        this.date = date;
    }
    get status(){
        return 0;
    }
    addTimeslot(timeslot) {
        this.timeslots.push(timeslot);
    }
};