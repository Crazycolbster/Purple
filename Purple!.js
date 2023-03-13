/// <reference path="/home/killmore/.config/OpenRCT2/plugin/openrct2.d.ts" />
//Script that colors everything possible Purple. Yes, this is a necessary function to enjoy the game.

const namespace = 'purple';
const setGuestClothingKey = namespace + ".setGuestClothing"
const setStaffClothingKey = namespace + ".setStaffClothing"
const setRideColorKey = namespace + ".setRideColor"
const setSceneryColorKey = namespace + ".setSceneryColor"
const setSurfaceColorKey = namespace + ".setSurfaceColor"
const setBannerColorKey = namespace + ".setBannerColor"

function main() {
    ui.registerMenuItem('Purple!', function() {
        showWindow();
    });
}

function makePurple() {
    if (getConfig(setGuestClothingKey, true)) {
        console.log("Changing Guest Clothes")
        setGuestClothing(5,30)//These numbers are indexes pointing to one of the shades of purple
    }
    if (getConfig(setStaffClothingKey, true)) {
        console.log("Changing Staff Clothes")
        setStaffClothing(5)
    }
    if (getConfig(setRideColorKey, true)) {
        console.log("Changing Ride Colors")
        setRideColor(3, 4, 5, 29)
    }
    if (getConfig(setSceneryColorKey, true)) {
        console.log("Changing Scenery Colors")
        setSceneryColor(3, 4, 5)
    }
    if (getConfig(setSurfaceColorKey, true)) {
        console.log("Changing Surface Colors")
        setSurfaceColor(10)
    }
    if (getConfig(setBannerColorKey, true)) {
        console.log("Changing Banner Colors")
        setBannerColor(5,11)
    }
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

// Retrieve given key from sharedStorage, returns defaultValue if not found.
const getConfig = function(key, defaultValue) {
    return context.sharedStorage.get(key, defaultValue);
}

// Stores given value under given key in sharedStorage.
const setConfig = function(key, value) {
    return context.sharedStorage.set(key, value)
}

// Configuration window
const showWindow = function() {
    const window = ui.getWindow('namespace');
    //Attempt to bring the current Purple! window to the front. Opens if it fails.
    try {
        currentWindow = ui.getWindow('Purple!');
        currentWindow.bringToFront();
    }
    catch (error) {
    ui.openWindow({
        classification: 'Purple!',
        width: 240,
        height: 102,
        title: 'Purple!',
        colours: [5,30],
        widgets: [
            {
                name: 'guestCheck',
                type: 'checkbox',
                x: 5,
                y: 20,
                width: 210,
                height: 10,
                tooltip: "Every guest will be unique! Uniquely one color anyways",
                text: "Guest Colors",
                isChecked: getConfig(setGuestClothingKey, true),
                onChange: function (params) { setConfig(setGuestClothingKey, params), updateText()}
            },
            {
                name: 'staffCheck',
                type: 'checkbox',
                x: 5,
                y: 40,
                width: 210,
                height: 10,
                tooltip: "Work sucks, but it would suck a lot less if you were forecd to wear bright purple!",
                text: "Staff Colors",
                isChecked: getConfig(setStaffClothingKey, true),
                onChange: function (params) { setConfig(setStaffClothingKey, params), updateText()}
            },
            {
                name: 'rideCheck',
                type: 'checkbox',
                x: 5,
                y: 60,
                width: 110,
                height: 10,
                tooltip: "These coasters will be so purple, even your vomit will be violet!",
                text: "Ride Colors",
                isChecked: getConfig(setRideColorKey, true),
                onChange: function (params) { setConfig(setRideColorKey, params), updateText()}
            },
            {
                name: 'sceneryCheck',
                type: 'checkbox',
                x: 115,
                y: 20,
                width: 210,
                height: 10,
                tooltip: "Why build a brown wall, when you could build a purple wall?",
                text: "Scenery Colors",
                isChecked: getConfig(setSceneryColorKey, true),
                onChange: function (params) { setConfig(setSceneryColorKey, params), updateText()}
            },
            {
                name: 'surfaceCheck',
                type: 'checkbox',
                x: 115,
                y: 40,
                width: 210,
                height: 10,
                tooltip: "The system! Is down! The system! Is down!",
                text: "Surface Color",
                isChecked: getConfig(setSurfaceColorKey, true),
                onChange: function (params) { setConfig(setSurfaceColorKey, params), updateText()}
            },
            {
                name: 'bannerCheck',
                type: 'checkbox',
                x: 115,
                y: 60,
                width: 210,
                height: 10,
                tooltip: "Purple Text on a Purple Border. This is 100% readable and color blind friendly",
                text: "Banner Color",
                isChecked: getConfig(setBannerColorKey, true),
                onChange: function (params) { setConfig(setBannerColorKey, params), updateText()}
            },
            {
                name: 'runPurple',
                type: 'button',
                x: 5,
                y: 75,
                width: 230,
                height: 21,
                text: "Purple!",
                tooltip: "Pick your settings, and Purple your Park!",
                isPressed: false,
                onClick: function (params) { makePurple(),params}
            }
        ],
    });
    updateText();
    return;}
    updateText();
}

var updateText = function() {//Checks if every checkbox is ticked, and if so, updates the button text for the execute button.
    currentWindow = ui.getWindow('Purple!')
    button = currentWindow.findWidget('runPurple');
    if (getConfig(setGuestClothingKey,true) && getConfig(setStaffClothingKey, true) && getConfig(setRideColorKey, true) && getConfig(setSceneryColorKey, true) && getConfig(setSurfaceColorKey,true) && getConfig(setBannerColorKey, true) == true) {
        button.text = "Maximum Purple!";
    }// Checks if every button is not selected, and is sad if that's the case.
    else if ((getConfig(setGuestClothingKey,true) || getConfig(setStaffClothingKey, true) || getConfig(setRideColorKey, true) || getConfig(setSceneryColorKey, true) || getConfig(setSurfaceColorKey,true) || getConfig(setBannerColorKey, true)) == false) {
        button.text = ":("
    }
    else {
        button.text = "Purple!";
    }
}

registerPlugin({
    name: 'Purple!',
    version: '1.1',
    authors: ['Crazycolbster'],
    type: 'remote',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});
