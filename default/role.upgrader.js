var common = require('common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // save controller in memory to avoid problems with workers stepping into adjacent room
        if(!creep.memory.currentControllerId) {creep.memory.currentControllerId = creep.room.controller.id};
        var controller = Game.getObjectById(creep.memory.currentControllerId);

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        else {
            var source = common.findClosestEnergySource(creep);
            if(source) common.getEnergy(creep, source);
        }
    }
};

module.exports = roleUpgrader;