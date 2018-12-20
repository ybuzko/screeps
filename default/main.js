var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleExplorer = require('role.explorer');


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');

    if(miners.length < 1) {
        var newName = 'Miner' + Game.time;
        console.log('Spawning new miner: ' + newName);
        console.log(Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'miner'}}));
    } else {
        //var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
                
        //if(harvesters.length < 2) {
        //    var newName = 'Harvester' + Game.time;
        //    console.log('Spawning new harvester: ' + newName);
        //    Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName,
        //        {memory: {role: 'harvester'}});
        var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
                
        if(haulers.length < 2) {
            var newName = 'Hauler' + Game.time;
            console.log('Spawning new hauler: ' + newName);
            console.log(Game.spawns['Home'].spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'hauler'}}));
        } else {
        
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            //console.log('Harvesters: ' + harvesters.length);
        
            if(builders.length < 2) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], newName,
                    {memory: {role: 'builder'}});
            } else {
                var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
                //console.log('Harvesters: ' + harvesters.length);
            
                if(upgraders.length < 1) {
                    var newName = 'Upgrader' + Game.time;
                    console.log('Spawning new upgrader: ' + newName);
                    Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        {memory: {role: 'upgrader'}});
                }
            }
        }
    }

    
    if(Game.spawns['Home'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Home'].spawning.name];
        Game.spawns['Home'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Home'].pos.x + 1,
            Game.spawns['Home'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
    }
}