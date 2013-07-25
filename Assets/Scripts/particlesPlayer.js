//declare a varible to hold the config script
var config : config;
var ParticleWeatherGUI : GUIText;

//set variables that hold the materials to be applied to the particles depending on the weather conditions
public var rainMaterial : Material;
public var snowMaterial : Material;

function Start(){
	//check to see if the data has been parsed in the config script
	while(!config.allLoaded){
		yield;
	}
	
	var wCode = config.getWeatherCode();
	
	//once it has been parsed set a value to make it rain!
	setParticles(wCode);

}
//weather code returned from yahoo! checked to see if conditions are wet/snowy

function setParticles(weatherCode: int) {
	 switch(weatherCode){
	 	case 1:
	 		Debug.Log("Tropical Storm!");
	 		break;
	 		//set the particles y energy
	 		//set the particles max emission
	 		//set the particle renderers material
	 	case "heavyRain":
	 		Debug.Log("Heavy Rain");
	 		break;
	 		//set the particles y energy
	 		//set the particles max emission
	 		//set the particle renderers material
	 	case "snow":
	 		Debug.Log("Snowing");
	 		break;
	 		//set the particles y energy
	 		//set the particles max emission
	 		//set the particle renderers material
	 	case "intermitantShower":
	 		Debug.Log("Showering .... sometimes!");
	 		break;
	 		//set the particles y energy
	 		//set the particles max emission
	 		//set the particle renderers material
	 	default:
	 		break;
	 		//set particle emission as off
	 }
	
}