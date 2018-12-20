var roleUpgrader = require('role.upgrader');
var common = require('common');

var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.room.controller.level < 2) { // we are at RCL 1, need to rush 2
            roleUpgrader.run(creep);
        } else {
            if(creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
            }
            if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('🚧 build');
            }

            if(creep.memory.building) {
                //console.log(creep.name + " is building");
                if(!creep.memory.currentTargetId || !Game.getObjectById(creep.memory.currentTargetId)) { // we don't have a target or it disappeared

                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES).filter(s => s.structureType != STRUCTURE_ROAD); // deprioritize roads
                    if(!targets.length) targets = creep.room.find(FIND_CONSTRUCTION_SITES);

                    if(targets.length) { // there's something to build
                        if(targets.length > 1) { // there's more than one
                            targets.sort((a,b) => b.progress - a.progress );
                        }
                        if(targets[0].progress == 0) { // nothing has been started yet, let's pick the closest thing
                            creep.memory.currentTargetId = creep.pos.findClosestByPath(targets).id;
                        } else {
                            creep.memory.currentTargetId = targets[0].id;
                        }

                    } else { // nothing to build, let's see if there's anything to repair
                        console.log("Worker " + creep.name + " looking for things to repair");
                        targets = creep.room.find(FIND_MY_STRUCTURES,{filter:(s) => s.hits < s.hitsMax*0.8});
                        console.log(JSON.stringify(targets));
                        if(!targets.length) { // there are no buildings to repair, look for broken roads
                            targets = creep.room.find(FIND_STRUCTURES,{filter:(s) => s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax*0.6});
                        }
                        if(targets.length > 1) { // there's more than one, find the most broken one
                            targets.sort((a,b) => (a.hits/a.hitsMax - b.hits/b.hitsMax ));
                        };
                        console.log("Sorted: " + JSON.stringify(targets));
                        if(targets.length) {
                            creep.memory.currentTargetId = targets[0].id;
                            console.log("Worker " + creep.name + " repairing " + targets[0].id);
                        }
                    }
                }
                var target = null;
                if(creep.memory.currentTargetId) {target = Game.getObjectById(creep.memory.currentTargetId)};

                if(target) {
                    common.doWork(creep, target);
                } else roleUpgrader.run(creep); // nothing to do at all, let's go upgrade

            } else {
                var source = common.findClosestEnergySource(creep);
                if(source) common.getEnergy(creep, source);
            }
        }
    }
};

module.exports = roleWorker;