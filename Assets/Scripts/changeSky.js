//variable to take in the config script in order to access its methods
var config : config;

//declare a default for the nightsky
var nightSkyMat : Material;

//declare variables to hold the weather code and time of day returned from config.js
private var wCode : int;
private var time : int;

//call the functions
function Start(){
	
	//check the data has been parsed by config.js
	while(!config.allLoaded){
		yield;
	}
	
	//set the variables to the values returned by config.js
	wCode = config.getWeatherCode();
	time = config.getTime();
	
	//if the time is past 8pm then use the night sky
	if(time > 20){
		nightSky();	
	}else{
		setSkyDomeTexture(wCode);
	}
	
	//set the fog depending on the weather
	setFog(wCode,time);		

}

//set the texture of the skybox depending on the weather code
function setSkyDomeTexture(weather : int){
	var weatherTypes = config.getListOfWeatherTypes();
	
	for(var i = 0; i < weatherTypes.length; i++){
		if(weatherTypes[i].weatherIndex == weather){
			this.gameObject.renderer.material = weatherTypes[i].skyMaterial;
		}
	}
}

//use the time of day and weather variable to set the render fog
function setFog(timeInt : int, weather : int){
	Debug.Log("Time"+timeInt);
	Debug.Log(weather);
}

//if the time is past 8pm - set the sky to dark
function nightSky(){
	this.gameObject.renderer.material = nightSkyMat;
}