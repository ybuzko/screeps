var claimRoom = {

    /** @param {Creep} creep **/
    run: function(room) {

        // Set global variable
        if(!Memory.claimingRoom) Memory.claimingRoom = room;
        
        // check if there is an explorer, if not - create one
        if(!creepsByRole['explorer'].length) common.spawnCreep(baseSpawn, 'explorer')

        
        
        
        
    }
}
module.exports = claimRoom;