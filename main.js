// Here I attempt to code everything related to one round of scheduling

let cenproActor1 = {
    email: "central.product.actor.1@cenpro.com",
    role: "spec_author",
    timezoneOffset: 3 * 3600,
    startHour: 9,
    endHour: 12
};

let cenproActor2 = {
    email: "central.product.actor.2@cenpro.com",
    role: "spec_author",
    timezoneOffset: - 3 * 3600,
    startHour: 9,
    endHour: 12
};

let techSME1 = {
    email: "tech.sme.1@bu.com",
    role: "tech_sme",
    timezoneOffset: 2 * 3600,
    startHour: 9,
    endHour: 12
};

let techSME2 = {
    email: "tech.sme.2@bu.com",
    role: "tech_sme",
    timezoneOffset: - 7 * 3600,
    startHour: 9,
    endHour: 12
};

let spec1 = {
        id: 1,
        businessUnit: "CNU",
        product: "SOLID Design Principles",
        workgroup: [techSME1]
};
let spec2 = {
    id: 2,
    businessUnit: "DevFactory",
    product: "CodeFix",
    workgroup: [techSME2]
};


let getUnscheduledSpecs = function() {
    return [spec1, spec2];
};

let costByTimezone = function(timeslot, spec) {
//    here I compare the timezone of the spec author, which is timeslot owner, and timezones of the spec.workgroup
//    the largest absolute difference is returned
    let tzDeltas = [];
    for(let i = 0; i < spec.workgroup.length; i++) {
        tzDeltas.push(Math.abs(timeslot.owner.timezoneOffset - spec.workgroup[i].timezoneOffset));
    }
    tzDeltas.sort();
    return tzDeltas[spec.workgroup.length - 1];
};

let findBestTimeslot = function(spec, schedule) {
    let timeslotWithMinCost;
    let minCost = 0;
    for(let i = 0; i < schedule.timeslots.length; i++) {
        let cost = costByTimezone(schedule.timeslots[i], spec) ;
        if(cost < minCost) {
            minCost = cost;
            timeslotWithMinCost = schedule.timeslots[i];
        }
    }
    return timeslotWithMinCost;
};

let createTimeslot = function(duration, startdate, owner) {
    return {
        duration: duration,
        startDate: startdate,
        owner: owner
    };
};

let createSchedule = function (daysAhead, duration, workgroup) {
    let schedule = {
        timeslots: [],
        calendarEvents: []
    };
    for(let i = 1; i < daysAhead; i++) {
        let now = new Date();
        for(let j = 0; j < workgroup.length; j++) {
            let timeslot = createTimeslot(duration, now.getUTCDate() + i, workgroup[j]);
            schedule.timeslots.push(timeslot);
        }
    }
    return schedule;
};

let getCentralProductWorkgroup = function() {
    return [cenproActor1, cenproActor2];
};

let findTimeslotsForActor = function(actor, startDate, schedule) {
    let result = [];
    let timeslots = schedule.timeslots;
    timeslots.forEach((ts) => {
        if(ts.owner === actor && ts.startDate === startDate) {
            result.push(ts);
        }
    });
    return result;
};

let createCalendarEvent = function(spec, timeslot, schedule) {
    let calendarEvent = {
        timeslots: [timeslot],
        spec: spec
    };
    for(let i = 0; i < spec.workgroup.length; i++) {
        let existingTimeslot = findTimeslotsForActor(spec.workgroup[i], timeslot.startDate, schedule);
        if(existingTimeslot.length === 0) {
            let timeslot = createTimeslot(timeslot.duration, timeslot.startDate, spec.workgroup[i]);
            schedule.timeslots.push(timeslot);
            calendarEvent.timeslots.push(timeslot);
        } else {
            calendarEvent.timeslots.push(existingTimeslot);
        }
    }
    return calendarEvent;
};

let main = function (schedule) {
    let specs = getUnscheduledSpecs();
    specs.forEach(spec => {
        let bestTimeslot = findBestTimeslot(spec, schedule);
        let calendarEvent = createCalendarEvent(spec, bestTimeslot, schedule);
        schedule.calendarEvents.push(calendarEvent);
    });
};

// here I just say I need the workgroup, which is array of actors
let workgroup = getCentralProductWorkgroup();

// Here I just say, I want to create the schedule for 2 days ahead, default duration is 2h, actors are Actors
let daysAhead = 3;
let duration = 2 * 60 * 60;
let schedule = createSchedule(daysAhead, duration, workgroup);
console.log(schedule);

// Here I just say, I want to run the main code every 10 seconds
setInterval(() => {
    main(schedule);
    console.log(schedule);
}, 1 * 1000);