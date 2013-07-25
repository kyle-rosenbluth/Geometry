//variable to hold the config gameobject in order to access the script attached to it
var config : config;

//create a varaible only available to this script to hold the time of day
private var timeOfDay : int;

function Start(){
	
	//wait for the config script to finish parsing the WWW data being retrieved from the web server
	while(!config.allLoaded){
		yield;
	}
	
	//once this has been loaded, set the timeOfDay variable to the value returned by the config script
	timeOfDay = config.getTime();
	
	Debug.Log("Sound Control Script Time: "+timeOfDay);
}

function Update() {

}

//function to get the time from the timeserver
function setEnvironmentSound(serverTime : int){
	
}

function setMenuSound(){
	
}

function buttonSounds(){
	//check to see which button has been pressed and play the relevant sound
}

function startProximitySound(){
	//play this sound when the player triggers the onTriggerEnter	
}

function endProximitySound(){
	//stop the sound onTriggerExit	
}

function playVoiceOver(iPointID : int){
	
}