var common = {

    err: {
        "0": "OK",
        "-1": "ERR_NOT_OWNER",
        "-2": "ERR_NO_PATH",
        "-3": "ERR_NAME_EXISTS",
        "-4": "ERR_BUSY",
        "-5": "ERR_NOT_FOUND",
        "-6": "ERR_NOT_ENOUGH_ENERGY",
        "-6": "ERR_NOT_ENOUGH_RESOURCES",
        "-7": "ERR_INVALID_TARGET",
        "-8": "ERR_FULL",
        "-9": "ERR_NOT_IN_RANGE",
        "-10": "ERR_INVALID_ARGS",
        "-11": "ERR_TIRED",
        "-12": "ERR_NO_BODYPART",
        "-6": "ERR_NOT_ENOUGH_EXTENSIONS",
        "-14": "ERR_RCL_NOT_ENOUGH",
        "-15": "ERR_GCL_NOT_ENOUGH"
    },

    spawnCreep: function(spawn, role) {

        var newName = role + Game.time;
        var config = [];
        if(role == 'hauler-long') {
            var maxCapacity = Game.spawns[spawn].room.energyAvailable;
        } else {
            var maxCapacity = Math.min(Game.spawns[spawn].room.energyAvailable, 1000); // for non-longrange creeps, cap the size
        }
        var remainingCapacity = maxCapacity;
        var addPart = function(part) {
            if (remainingCapacity >= BODYPART_COST[part]) {
            config.push(part);
            remainingCapacity-=BODYPART_COST[part];
            };
        };
        switch(role) {
            case "miner":
                addPart(MOVE);
                addPart(MOVE);
                addPart(MOVE);
                while(remainingCapacity >= BODYPART_COST[WORK]) addPart(WORK);
                if(remainingCapacity >= BODYPART_COST[MOVE]) addPart(MOVE);
                break;
            case "upgrader":
            case "worker":
                addPart(MOVE);
                if(maxCapacity > 400) addPart(MOVE);
                while(remainingCapacity >= BODYPART_COST[WORK]) {
                    addPart(WORK);
                    try {
                        addPart(CARRY)
                    } catch(err) {};
                };
                break;
            case "hauler-long":
                while(remainingCapacity > 0) {
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(MOVE)} catch(err) {};
                };
                break;
            case "hauler":
                while(remainingCapacity > 0) {
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(CARRY)} catch(err) {};
                    try {addPart(MOVE)} catch(err) {};
                };
                break;
        };
        
        var res = Game.spawns[spawn].spawnCreep(config, newName, {memory: {role: role}});
        console.log(Game.time + ' Spawning "' + newName + '" at "' + spawn + '", capacity=' + maxCapacity + ', config=[' + config.join(',') + ']: ' + common.err(res));
        //console.log(res);
    },

    findClosestEnergySource: function(creep) {
        // 1) Container is preferable
        var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&  _.sum(s.store) >= creep.carryCapacity
        });
        // 2) If there's no container, let's look for dropped energy
        if(!source) {
            creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: (d) => d.resourceType == RESOURCE_ENERGY && d.amount >= creep.carryCapacity/2}); // only consider drops that are worth half our tank or more
        }
        // 3) There's no container and nothing dropped, resort to mining
        if(!source) {
            source = creep.pos.findClosestByPath(FIND_SOURCES);
        }
        return source;
    },

    getEnergy: function(creep, source){
        var res;
        if(source instanceof Resource) res = creep.pickup(source);
        if(source instanceof StructureContainer || source instanceof StructureStorage) res = creep.withdraw(source,RESOURCE_ENERGY);
        if(source instanceof Source) res = creep.harvest(source);

        if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    doWork: function(creep, target){
        var res;
        if(target instanceof ConstructionSite) res = creep.build(target);
        if(target instanceof StructureController) {
            res = creep.upgradeController(target);
        } else {
            if(target instanceof Structure) {
                res = creep.repair(target);
                if(target.hits == target.hitsMax) creep.memory.currentTargetId = null; // done repairing
            }
        }
        if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    }

};

module.exports = common;
