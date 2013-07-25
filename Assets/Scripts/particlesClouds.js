//varible to hold the config file
var config : config;

//set a variable to hold the weather code
private var wCode : int;

function Start() {
	//check to see if config has finished parsing the data
	while(!config.allLoaded){
		yield;
	}
	
	//once it has loaded, do the following
	wCode = config.getWeatherCode();
	
	setCloudDensity(wCode);
}

//a function that checks the weather code int and sets the cloud density accordingly
function setCloudDensity(weather : int){
	switch(weather){
		default:
		break;
	}
}

//function that deals with windspeed by checking the weather int
function setWindSpeed(weather : int){
	
}