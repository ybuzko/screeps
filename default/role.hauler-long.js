var common = require('common');

var roleHaulerLong = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(((creep.memory.collecting && creep.carry.energy < creep.carryCapacity) || (creep.carry.energy < 50))) {
            // creep.say('🔄 collect');

            // 1) Prioritize dropped stuff
            var source = Game.getObjectById('5c1f5e882592234e7ce8960b')
            creep.memory.collecting = true;
            common.getEnergy(creep, source);
        } else {
            creep.memory.collecting = false;
            // creep.say('deliver');

            var target = Game.getObjectById('5c1f4c552592234e7ce894fa')

            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

module.exports = roleHaulerLong;