//variable to hold the config script
var config : config;

//variables to control the rotational axis of the cloud mesh
private var xSpeed : float;
private var ySpeed : float;
private var zSpeed : float;

function Start(){
	//check to see if the config file has loaded all data streams
	while(!config.allLoaded){
		yield;
	}
	
	//get the weather code value from config.js and assign it to a local variable
	wCode = config.getWeatherCode();
	
	//set the xSpeed
	setWindSpeed(wCode);
		
}

//set the speed at which the cloud mesh rotates to give the illusions
function setWindSpeed(weather : int){
	//create an array of weather types from the config script
	var weatherTypes = config.getListOfWeatherTypes();
	
	//loop through the array and compare each value to the weather code (wCode)
	//returned from the config, if it matches assign the value to xSpeed
	for(var i = 0; i < weatherTypes.length; i++){
		if(weatherTypes[i].weatherIndex == weather){
			xSpeed = weatherTypes[i].windSpeed;
		}
	}
}

var manual : boolean = false;

//update the rotation of the sky box everyframe based upon the value from config.js
function Update () {
	
	if(!manual){
		transform.RotateAround( transform.position, Vector3.right, ySpeed * Time.deltaTime );
		transform.RotateAround( transform.position, Vector3.up, xSpeed * Time.deltaTime );
		transform.RotateAround( transform.position, Vector3.forward, zSpeed * Time.deltaTime );
		Debug.Log(xSpeed);
	}else{
		if( Input.GetAxis("Horizontal") != 0 ){
			transform.RotateAround( transform.position, Vector3.up, Input.GetAxis("Horizontal")*xSpeed * Time.deltaTime );
		}
		
		if( Input.GetAxis("Vertical") != 0 ){
			transform.RotateAround( transform.position, Vector3.right, Input.GetAxis("Vertical")*ySpeed * Time.deltaTime );
		}
		
	}
	
}