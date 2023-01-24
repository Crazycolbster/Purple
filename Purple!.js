/// <reference path="/home/killmore/.config/OpenRCT2/plugin/openrct2.d.ts" />
//Script that colors everything possible Purple. Yes, this is a necessary function to enjoy the game.
function main() {
    ui.registerMenuItem('Purple!', function() {
        makePurple();
    });
}

function makePurple() {
    setGuestClothing(30,5)//These numbers are indexes pointing to one of the shades of purple
    setStaffClothing(5)
    setRideColor(3, 4, 5, 29)
    setSceneryColor(3, 4, 5)
    setSurfaceColor(10)
    setBannerColor(5,11)
};

var setGuestClothing = function(tshirtColour, trousersColour) {
    for (var i = 0; i < map.numEntities; i++) {//get every entity on the map
        var entity = map.getEntity(i);//load data for the entity
        if (entity && entity.type === 'guest') {//if we're looking at a guest, do this. Honestly, don't know why 3 &'s though
            entity.tshirtColour = tshirtColour;
            entity.trousersColour = trousersColour;
            entity.balloonColour = tshirtColour;
            entity.hatColour = trousersColour;
            entity.umbrellaColour = tshirtColour;
        }
    }
}

var setStaffClothing = function(colour) {//Same as for guest. Probably should have combined these. Oh well!
    for (var i = 0; i < map.numEntities; i++) {
        var entity = map.getEntity(i);
        if (entity && entity.type === 'staff') {
            entity.colour = colour;
        }
    }
}

var setRideColor = function(Color1, Color2, Color3, Color4) {//We intend to cycle through these colors for variety! 
    colors = [Color1, Color2, Color3, Color4]//Well, so long as you have multiple color schemes on your rides
    for (var rides = 0; rides < map.numRides; rides++) {//go through every ride
        for (var types = 0; types < 5; types++){//Go through each element of the ride: Tracks, supports, cars, etc.
            for (var colorSchemes = 0; colorSchemes < 255; colorSchemes++){//This is to cover every train on the largest ride. Eg, 255 trains
                var ride = map.getRide(rides);//Load info about the ride
                const colorScheme = {ride: rides, type: types, value: (colors[(colorSchemes + types) % 4]), index: colorSchemes}//Give each train a different color
                context.queryAction("ridesetappearance", colorScheme, function(result){//This throws a lot of errors in the console
                    if (!result.error && ride.type != 20)//type 20 is the maze, and it p*cks those up with the color scheme
                        context.executeAction("ridesetappearance", colorScheme);//Purple!
                    })
            }
        }
    }
}

var setSceneryColor = function(Color1, Color2, Color3) {//Colors the scenery in the park

    for (var y = 0; y < map.size.y; y++) {//cover every y coordinate
        for (var x = 0; x < map.size.x; x++) {//cover every x coordinate
            var tile = map.getTile(x, y);//get info about this particular tile

            // Iterate every element on the tile
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);

                // If the element is scenery, color it purple!
                if (element.type === 'small_scenery') {
                    try{
                        element.primaryColour = Color1;
                        element.secondaryColour = Color2;
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (element.type === 'large_scenery') {
                    try{
                        element.primaryColour = Color2;
                        element.secondaryColour = Color3;
                        element.tertiaryColour = Color1;
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (element.type === 'wall') {
                    try{
                        element.primaryColour = Color2;
                        element.secondaryColour = Color3;
                        element.tertiaryColour = Color1;
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
           }
        }
    }
}

var setSurfaceColor = function(Color) {
    for (var y = 0; y < map.size.y; y++) {//cycle through every tile on the y axis
        for (var x = 0; x < map.size.x; x++) {//cycle through every tile on the x axis
            var tile = map.getTile(x, y);//get tile info
            for (var i = 0; i < tile.numElements; i++){
                element = tile.getElement(i)
                if (element.type === 'surface') {
                    try{
                        element.surfaceStyle = Color;
                    }
                    catch (error) {
                        console.log("The fish was delish");
                    }
                }
            }
        }
    }
}

var setBannerColor = function(bannerColor, textColor) {
    for (var i = 0; i < 2000; i++) {//I don't know of a way to see exactly how many banners are in the park. I can't just view the banner index directly
        context.queryAction("bannersetstyle", {id: i, type: 0, parameter: bannerColor}, function(result){
            if (!result.error){
                context.executeAction("bannersetstyle", {id: i, type: 0, parameter: bannerColor});//Set the color of the banner
            }
        })
        context.queryAction("bannersetstyle", {id: i, type: 1, parameter: textColor}, function(result){//Set the color of the text
            if (!result.error){
                context.executeAction("bannersetstyle", {id: i, type: 1, parameter: textColor});
            }
        })
    }
}

registerPlugin({
    name: 'Purple!',
    version: '1.0',
    authors: ['Crazycolbster'],
    type: 'remote',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});
