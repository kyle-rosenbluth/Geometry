//variable to hold the config script gameObject
var config : config;

//variables to hold the GUI textures and GUI text objects
var weatherDisplay : GUIText;
var timeOfDay : GUIText;
var location : GUIText;
var clickedOn : GUIText;

function Start() {
	//wait for all of the data in config to be loaded and parsed
	while(!config.allLoaded){
		yield;	
	}
	
	var errorMessage = "Still To Come...";
	
	weatherDisplay.text = config.getWeatherType();
	timeOfDay.text = "Weather Provided by Yahoo! RSS";
	location.text = errorMessage;
	clickedOn.text = errorMessage;
	
}