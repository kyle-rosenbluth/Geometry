//import the system class in order to access the String splitting methods of the .NET library
//without this import the string returned from ParseRSS.php cannot be split
import System;

//exposed variables to hold the baseHref of the URL, the path to the weather script
//and the path to the timeScript. Declared as exposed to enable easy changing of URLS if
//the applications config files move to a new server
var basePath : String;
var weatherScript : String;
var timeScript : String;

//declare a variable to hold the main source of light for the world
//set to public to enable access from other scripts
var sun : Light;
var ambient : Light;

//positions for sun rise and sunset
//set to public to enable access from other scripts
var sunrise : Transform;
var sunset : Transform;

//create some public variables to hold the time, weather code and weather type
//set to public to enable access from other scripts
static var globalTime : int;
static var globalWeatherCode : int;
static var globalWeatherType : String;

//variable to hold a boolean value that all other scripts can check - if returned as true
//all other scripts can execute
static var allLoaded : boolean;

//declare an array with enough indexes to hold all of the possible weather conditions
//returned from the Yahoo! weather RSS feed
var weatherArray = new Array(50);

//variables to hold the skybox Materials
var day_stormy : Material;
var day_clear : Material;
var day_overcast : Material;
var day_normal : Material;
var day_foggy : Material;
var day_sunny : Material;
var night : Material;

//variables for particle materials
var snow : Material;
var rain : Material;
var hail : Material;

//-------- Methods to be carried out on load --------//

//Start() is called once when the script is loaded - here is where all of the 
//functions will be called to create the skybox, based on the variable received 
//from the system clock and the Yahoo! weather feed

function Awake(){
	
	//set the global boolean to false so no other scripts execute on their Start() methods
	allLoaded = false;
	
	//set the feed for the weather feed
	var weatherURL = basePath + weatherScript;
	
	//set the URL for retreiving the time
	var timeURL = basePath + timeScript;
	
	//call the load function which parses the returned values returned by the above WWW objects into 
	//arrays that Unity can understand.
	load(weatherURL,timeURL);
	
}

function load(wURL : String, tURL : String){
	
		//create new WWW objects that take in the URL's formed above as a parameter and return the value
		//of the HTML. In this case the URL's link to .php scripts that retreive Yahoo! weather data
		//and parse it into values, these values are returned to Unity.
		var weatherData : WWW = new WWW(wURL);
		var timeData : WWW = new WWW(tURL);
		
		//wait for all of the data to be downloaded by the unity player before continuing, 
		//once the data has been downloaded, execute the rest of the commands and communicate this to the
		//other scripts
		yield weatherData;
		yield timeData;
	
		//if allLoaded = false then nothing has finished downloading, wait for an interval and
		//try again
		
		Debug.Log("All data has been parsed, execute other scripts");
	
		//assign the data returned from the weatherFeed request
		var weatherString : String = weatherData.data;
	
		//assign the data returned from the timeURLRequest
		var timeString : String = timeData.data;
	
		//Get the array values from the CheckWeather function and assign them to a global array
		var weatherArray = CheckWeather(weatherString);
		//Get the array values from the checkTime function and assign them to a global array
		var timeArray = getServerTime(timeString);
	
		//get the weather and time index's set them to variables
		setWeatherType(weatherArray[1]);
		setWeatherCode(weatherArray[2]); 
		setTime(parseInt(timeArray[0]));
		
		//set the global boolean to true so that all other scripts can execute
		allLoaded = true;
	
}

	
//private function that sets the weather type
private function setWeatherType(type : String){
	globalWeatherType = type;	
}

//private function that sets the weather code
private function setWeatherCode(code : String){
	var tempCode = parseInt(code);
	globalWeatherCode = tempCode;	
}

//function to return the weather code
public function getWeatherType() : String {
	return globalWeatherType;
}

//function to return the weather code
public function getWeatherCode() : int {
	return globalWeatherCode;	
}

//private function that sets the server time
private function setTime(time : int){
	globalTime = time;
}

//get the server time
public function getTime(){
	return globalTime;	
}

//function to check time and return the values as an array
function getServerTime(time : String) : Array {
	//Set an array of seperators to use as splitters for the string.
	var seperators : String[] = [":",":"];
	
	//split string into values of an array
	var timeString = time;
	var items = timeString.Split(seperators, StringSplitOptions.None);
	
	//return the time as an array
	return items;	
}


//function to take in the string returned from parseRSS.php and split it into
//array values ready for use in other functions
function CheckWeather(weather : String) : Array {
	
	//Set an array of seperators to use as splitters for the string.
	var seperators : String[] = ["var:"];
	
	//split string into values of an array
	var weatherString = weather;
	
	//splits the string based upon the values in the seperators array. The php script is written to
	//insert the var: line to make splitting the string easier
	var items = weatherString.Split(seperators, StringSplitOptions.None);
	
	//return the items as an array
	return items;
}

//create a new class to act as the basis for an array of possible weather types
class weatherCondition {
	public var weatherIndex : int;
	public var weatherType : String;
	public var skyMaterial : Material;
	
	//test values
	public var windSpeed : float;
	public var cloudSize : int;
	public var particleTexture : Material;
	public var particleEmit : boolean;
	public var particleYVelocity : int;
	public var particleEmission : int;
}

//create an array to store all the possible values returned from Yahoo! weather and return it
function getListOfWeatherTypes() : Array {
	
	//create a new weatherCondition to hold each possible value
	for(i = 0; i < weatherArray.length; i++){
		weatherArray[i] = new weatherCondition();
	}
	
	//assign the yahoo weather types to the indexes created above
	weatherArray[0].weatherIndex = 0; //index to use for comparing numbers
	weatherArray[0].weatherType = "tornado"; //name according to yahoo API
	weatherArray[0].skyMaterial = day_stormy; //the texture to be used on the sky dome
	weatherArray[0].windSpeed = 1; //a value between 0 & 1
	weatherArray[0].cloudSize = 100; //this sets the maximum size of the particle (100 light cloud - 1000 thick cloud)
	weatherArray[0].particleEmit = true; //whether the particle system for the rain should be emitting or not
	weatherArray[0].particleYVelocity = -10; //how heavy the preciptitation is (a negative value as Y axis is up)
	weatherArray[0].particleEmission = 1000; //The number of particles emitted (100 = light shower 1000 = heavy rain/storm)
	weatherArray[0].particleTexture = rain; //the texture for the particle renderer to use (snow, rain, hail or null)
	
	weatherArray[1].weatherIndex = 1;
	weatherArray[1].weatherType = "tropical storm";
	weatherArray[1].skyMaterial = day_stormy;
	weatherArray[1].windSpeed = 1;
	weatherArray[1].cloudSize = 100;
	weatherArray[1].particleEmit = true;
	weatherArray[1].particleYVelocity = -10;
	weatherArray[1].particleEmission = 1000;
	weatherArray[1].particleTexture = rain;
	
	weatherArray[2].weatherIndex = 2;
	weatherArray[2].weatherType = "hurricane";
	weatherArray[2].skyMaterial = day_stormy;
	weatherArray[2].windSpeed = 1;
	weatherArray[2].cloudSize = 100;
	weatherArray[2].particleEmit = true;
	weatherArray[2].particleYVelocity = -10;
	weatherArray[2].particleEmission = 1000;
	weatherArray[2].particleTexture = rain;
	
	weatherArray[3].weatherIndex = 3;
	weatherArray[3].weatherType = "severe thunder storms";
	weatherArray[3].skyMaterial = day_stormy;
	weatherArray[3].windSpeed = 0.7;
	weatherArray[3].cloudSize = 100;
	weatherArray[3].particleEmit = true;
	weatherArray[3].particleYVelocity = -10;
	weatherArray[3].particleEmission = 1000;
	weatherArray[3].particleTexture = rain;
	
	weatherArray[4].weatherIndex = 4;
	weatherArray[4].weatherType = "thunderstorms";
	weatherArray[4].skyMaterial = day_stormy;
	weatherArray[4].windSpeed = 0.7;
	weatherArray[4].cloudSize = 100;
	weatherArray[4].particleEmit = true;
	weatherArray[4].particleYVelocity = -10;
	weatherArray[4].particleEmission = 1000;
	weatherArray[4].particleTexture = rain;
	
	weatherArray[5].weatherIndex = 5;
	weatherArray[5].weatherType = "mixed rain and snow";
	weatherArray[5].skyMaterial = day_overcast;
	weatherArray[5].windSpeed = 0.5;
	weatherArray[5].cloudSize = 1000;
	weatherArray[5].particleEmit = false;
	weatherArray[5].particleYVelocity = -4;
	weatherArray[5].particleEmission = 500;
	weatherArray[5].particleTexture = rain;
	
	weatherArray[6].weatherIndex = 6;
	weatherArray[6].weatherType = "mixed rain and sleet";
	weatherArray[6].skyMaterial = day_overcast;
	weatherArray[6].windSpeed = 0.5;
	weatherArray[6].cloudSize = 1000;
	weatherArray[6].particleEmit = true;
	weatherArray[6].particleYVelocity = -10;
	weatherArray[6].particleEmission = 500;
	weatherArray[6].particleTexture = rain;
	
	weatherArray[7].weatherIndex = 7;
	weatherArray[7].weatherType = "mixed snow and sleet";
	weatherArray[7].skyMaterial = day_overcast;
	weatherArray[7].windSpeed = 0.5;
	weatherArray[7].cloudSize = 1000;
	weatherArray[7].particleEmit = true;
	weatherArray[7].particleYVelocity = -4;
	weatherArray[7].particleEmission = 500;
	weatherArray[7].particleTexture = rain;
	
	weatherArray[8].weatherIndex = 8;
	weatherArray[8].weatherType = "freezing drizzle";
	weatherArray[8].skyMaterial = day_overcast;
	weatherArray[8].windSpeed = 0.5;
	weatherArray[8].cloudSize = 500;
	weatherArray[8].particleEmit = false;
	weatherArray[8].particleYVelocity = -4;
	weatherArray[8].particleEmission = 500;
	weatherArray[8].particleTexture = rain;
	
	weatherArray[9].weatherIndex = 9;
	weatherArray[9].weatherType = "drizzle";
	weatherArray[9].skyMaterial = day_overcast;
	weatherArray[9].windSpeed = 0.2;
	weatherArray[9].cloudSize = 500;
	weatherArray[9].particleEmit = true;
	weatherArray[9].particleYVelocity = -2;
	weatherArray[9].particleEmission = 500;
	weatherArray[9].particleTexture = rain;
	
	weatherArray[10].weatherIndex = 10;
	weatherArray[10].weatherType = "freezing rain";
	weatherArray[10].skyMaterial = day_overcast;
	weatherArray[10].windSpeed = 0.5;
	weatherArray[10].cloudSize = 500;
	weatherArray[10].particleEmit = true;
	weatherArray[10].particleYVelocity = -4;
	weatherArray[10].particleEmission = 500;
	weatherArray[10].particleTexture = rain;
	
	weatherArray[11].weatherIndex = 11;
	weatherArray[11].weatherType = "showers";
	weatherArray[11].skyMaterial = day_overcast;
	weatherArray[11].windSpeed = 0.3;
	weatherArray[11].cloudSize = 400;
	weatherArray[11].particleEmit = true;
	weatherArray[11].particleYVelocity = -3;
	weatherArray[11].particleEmission = 600;
	weatherArray[11].particleTexture = rain;
	
	weatherArray[12].weatherIndex = 12;
	weatherArray[12].weatherType = "showers";
	weatherArray[12].skyMaterial = day_overcast;
	weatherArray[12].windSpeed = 0.3;
	weatherArray[12].cloudSize = 400;
	weatherArray[12].particleEmit = true;
	weatherArray[12].particleYVelocity = -3;
	weatherArray[12].particleEmission = 600;
	weatherArray[12].particleTexture = rain;
	
	weatherArray[13].weatherIndex = 13;
	weatherArray[13].weatherType = "snow flurries";
	weatherArray[13].skyMaterial = day_overcast;
	weatherArray[13].windSpeed = 0.5;
	weatherArray[13].cloudSize = 800;
	weatherArray[13].particleEmit = true;
	weatherArray[13].particleYVelocity = -3;
	weatherArray[13].particleEmission = 800;
	weatherArray[13].particleTexture = snow;
	
	weatherArray[14].weatherIndex = 14;
	weatherArray[14].weatherType = "light snow showers";
	weatherArray[14].skyMaterial = day_overcast;
	weatherArray[14].windSpeed = 0.3;
	weatherArray[14].cloudSize = 800;
	weatherArray[14].particleEmit = true;
	weatherArray[14].particleYVelocity = -2;
	weatherArray[14].particleEmission = 400;
	weatherArray[14].particleTexture = snow;
	
	weatherArray[15].weatherIndex = 15;
	weatherArray[15].weatherType = "blowing snow";
	weatherArray[15].skyMaterial = day_overcast;
	weatherArray[15].windSpeed = 0.6;
	weatherArray[15].cloudSize = 600;
	weatherArray[15].particleEmit = true;
	weatherArray[15].particleYVelocity = -5;
	weatherArray[15].particleEmission = 600;
	weatherArray[15].particleTexture = snow;
	
	weatherArray[16].weatherIndex = 16;
	weatherArray[16].weatherType = "snow";
	weatherArray[16].skyMaterial = day_overcast;
	weatherArray[16].windSpeed = 0.4;
	weatherArray[16].cloudSize = 1000;
	weatherArray[16].particleEmit = true;
	weatherArray[16].particleYVelocity = -3;
	weatherArray[16].particleEmission = 900;
	weatherArray[16].particleTexture = snow;
	
	weatherArray[17].weatherIndex = 17;
	weatherArray[17].weatherType = "hail";
	weatherArray[17].skyMaterial = day_overcast;
	weatherArray[17].windSpeed = 0.5;
	weatherArray[17].cloudSize = 400;
	weatherArray[17].particleEmit = true;
	weatherArray[17].particleYVelocity = -5;
	weatherArray[17].particleEmission = 500;
	weatherArray[17].particleTexture = hail;
	
	weatherArray[18].weatherIndex = 18;
	weatherArray[18].weatherType = "sleet";
	weatherArray[18].skyMaterial = day_overcast;
	weatherArray[18].windSpeed = 0.5;
	weatherArray[18].cloudSize = 600;
	weatherArray[18].particleEmit = true;
	weatherArray[18].particleYVelocity = -4;
	weatherArray[18].particleEmission = 700;
	weatherArray[18].particleTexture = rain;
	
	weatherArray[19].weatherIndex = 19;
	weatherArray[19].weatherType = "dust";
	weatherArray[19].skyMaterial = day_overcast;
	weatherArray[19].windSpeed = 0.1;
	weatherArray[19].cloudSize = 100;
	weatherArray[19].particleEmit = false;
	weatherArray[19].particleYVelocity = 0;
	weatherArray[19].particleEmission = 0;
	weatherArray[19].particleTexture = null;
	
	weatherArray[20].weatherIndex = 20;
	weatherArray[20].weatherType = "foggy";
	weatherArray[20].skyMaterial = day_foggy;
	weatherArray[20].windSpeed = 0.1;
	weatherArray[20].cloudSize = 500;
	weatherArray[20].particleEmit = false;
	weatherArray[20].particleYVelocity = 0;
	weatherArray[20].particleEmission = 0;
	weatherArray[20].particleTexture = null;
	
	weatherArray[21].weatherIndex = 21;
	weatherArray[21].weatherType = "haze";
	weatherArray[21].skyMaterial = day_foggy;
	weatherArray[21].windSpeed = 0.1;
	weatherArray[21].cloudSize = 200;
	weatherArray[21].particleEmit = false;
	weatherArray[21].particleYVelocity = 0;
	weatherArray[21].particleEmission = 0;
	weatherArray[21].particleTexture = null;
	
	weatherArray[22].weatherIndex = 22;
	weatherArray[22].weatherType = "smokey";
	weatherArray[22].skyMaterial = day_foggy;
	weatherArray[22].windSpeed = 0.1;
	weatherArray[22].cloudSize = 300;
	weatherArray[22].particleEmit = false;
	weatherArray[22].particleYVelocity = 0;
	weatherArray[22].particleEmission = 0;
	weatherArray[22].particleTexture = null;
	
	weatherArray[23].weatherIndex = 23;
	weatherArray[23].weatherType = "blustery";
	weatherArray[23].skyMaterial = day_foggy;
	weatherArray[23].windSpeed = 0.7;
	weatherArray[23].cloudSize = 300;
	weatherArray[23].particleEmit = false;
	weatherArray[23].particleYVelocity = 0;
	weatherArray[23].particleEmission = 0;
	weatherArray[23].particleTexture = null;
	
	weatherArray[24].weatherIndex = 24;
	weatherArray[24].weatherType = "windy";
	weatherArray[24].skyMaterial = day_foggy;
	weatherArray[24].windSpeed = 0.8;
	weatherArray[24].cloudSize = 400;
	weatherArray[24].particleEmit = false;
	weatherArray[24].particleYVelocity = 0;
	weatherArray[24].particleEmission = 0;
	weatherArray[24].particleTexture = null;
	
	weatherArray[25].weatherIndex = 25;
	weatherArray[25].weatherType = "cold";
	weatherArray[25].skyMaterial = day_foggy;
	weatherArray[25].windSpeed = 0.1;
	weatherArray[25].cloudSize = 200;
	weatherArray[25].particleEmit = false;
	weatherArray[25].particleYVelocity = 0;
	weatherArray[25].particleEmission = 0;
	weatherArray[25].particleTexture = null;
	
	weatherArray[26].weatherIndex = 26;
	weatherArray[26].weatherType = "cloudy";
	weatherArray[26].skyMaterial = day_foggy;
	weatherArray[26].windSpeed = 0.3;
	weatherArray[26].cloudSize = 700;
	weatherArray[26].particleEmit = false;
	weatherArray[26].particleYVelocity = 0;
	weatherArray[26].particleEmission = 0;
	weatherArray[26].particleTexture = null;
	
	weatherArray[27].weatherIndex = 27;
	weatherArray[27].weatherType = "mostly cloudy (night)";
	weatherArray[27].skyMaterial = night;
	weatherArray[27].windSpeed = 0.2;
	weatherArray[27].cloudSize = 600;
	weatherArray[27].particleEmit = false;
	weatherArray[27].particleYVelocity = 0;
	weatherArray[27].particleEmission = 0;
	weatherArray[27].particleTexture = null;
	
	weatherArray[28].weatherIndex = 28;
	weatherArray[28].weatherType = "mostly cloudy (day)";
	weatherArray[28].skyMaterial = day_overcast;
	weatherArray[28].windSpeed = 0.3;
	weatherArray[28].cloudSize = 600;
	weatherArray[28].particleEmit = false;
	weatherArray[28].particleYVelocity = 0;
	weatherArray[28].particleEmission = 0;
	weatherArray[28].particleTexture = null;

	weatherArray[29].weatherIndex = 29;
	weatherArray[29].weatherType = "partly cloudy (night)";
	weatherArray[29].skyMaterial = night;
	weatherArray[29].windSpeed = 0.1;
	weatherArray[29].cloudSize = 200;
	weatherArray[29].particleEmit = false;
	weatherArray[29].particleYVelocity = 0;
	weatherArray[29].particleEmission = 0;
	weatherArray[29].particleTexture = null;
	
	weatherArray[30].weatherIndex = 30;
	weatherArray[30].weatherType = "partly cloudy (day)";
	weatherArray[30].skyMaterial = day_normal;
	weatherArray[30].windSpeed = 0.5;
	weatherArray[30].cloudSize = 200;
	weatherArray[30].particleEmit = false;
	weatherArray[30].particleYVelocity = 0;
	weatherArray[30].particleEmission = 0;
	weatherArray[30].particleTexture = null;
	
	weatherArray[31].weatherIndex = 31;
	weatherArray[31].weatherType = "clear (night)";
	weatherArray[31].skyMaterial = night;
	weatherArray[31].windSpeed = 0.1;
	weatherArray[31].cloudSize = 0;
	weatherArray[31].particleEmit = false;
	weatherArray[31].particleYVelocity = 0;
	weatherArray[31].particleEmission = 0;
	weatherArray[31].particleTexture = null;
	
	weatherArray[32].weatherIndex = 32;
	weatherArray[32].weatherType = "sunny";
	weatherArray[32].skyMaterial = day_sunny;
	weatherArray[32].windSpeed = 0.1;
	weatherArray[32].cloudSize = 0;
	weatherArray[32].particleEmit = false;
	weatherArray[32].particleYVelocity = 0;
	weatherArray[32].particleEmission = 0;
	weatherArray[32].particleTexture = null;
	
	weatherArray[33].weatherIndex = 33;
	weatherArray[33].weatherType = "fair (night)";
	weatherArray[33].skyMaterial = night;
	weatherArray[33].windSpeed = 0.2;
	weatherArray[33].cloudSize = 100;
	weatherArray[33].particleEmit = false;
	weatherArray[33].particleYVelocity = 0;
	weatherArray[33].particleEmission = 0;
	weatherArray[33].particleTexture = null;
	
	weatherArray[34].weatherIndex = 34;
	weatherArray[34].weatherType = "fair (day)";
	weatherArray[34].skyMaterial = day_clear;
	weatherArray[34].windSpeed = 0.2;
	weatherArray[34].cloudSize = 100;
	weatherArray[34].particleEmit = false;
	weatherArray[34].particleYVelocity = 0;
	weatherArray[34].particleEmission = 0;
	weatherArray[34].particleTexture = null;
	
	weatherArray[35].weatherIndex = 35;
	weatherArray[35].weatherType = "mixed rain and hail";
	weatherArray[35].skyMaterial = day_overcast;
	weatherArray[35].windSpeed = 0.3;
	weatherArray[35].cloudSize = 400;
	weatherArray[35].particleEmit = true;
	weatherArray[35].particleYVelocity = -3;
	weatherArray[35].particleEmission = 500;
	weatherArray[35].particleTexture = rain;
	
	weatherArray[36].weatherIndex = 36;
	weatherArray[36].weatherType = "hot";
	weatherArray[36].skyMaterial = day_clear;
	weatherArray[36].windSpeed = 0;
	weatherArray[36].cloudSize = 0;
	weatherArray[36].particleEmit = false;
	weatherArray[36].particleYVelocity = 0;
	weatherArray[36].particleEmission = 0;
	weatherArray[36].particleTexture = null;
	
	weatherArray[37].weatherIndex = 37;
	weatherArray[37].weatherType = "isolated thunderstorms";
	weatherArray[37].skyMaterial = day_stormy;
	weatherArray[37].windSpeed = 0.6;
	weatherArray[37].cloudSize = 400;
	weatherArray[37].particleEmit = true;
	weatherArray[37].particleYVelocity = -6;
	weatherArray[37].particleEmission = 0;
	weatherArray[37].particleTexture = rain;
	
	weatherArray[38].weatherIndex = 38;
	weatherArray[38].weatherType = "scattered thunderstorms";
	weatherArray[38].skyMaterial = day_stormy;
	weatherArray[38].windSpeed = 0.5;
	weatherArray[38].cloudSize = 400;
	weatherArray[38].particleEmit = true;
	weatherArray[38].particleYVelocity = -6;
	weatherArray[38].particleEmission = 800;
	weatherArray[38].particleTexture = rain;
	
	weatherArray[39].weatherIndex = 39;
	weatherArray[39].weatherType = "scattered thunderstorms";
	weatherArray[39].skyMaterial = day_stormy;
	weatherArray[39].windSpeed = 0.6;
	weatherArray[39].cloudSize = 600;
	weatherArray[39].particleEmit = true;
	weatherArray[39].particleYVelocity = -4;
	weatherArray[39].particleEmission = 800;
	weatherArray[39].particleTexture = rain;
	
	weatherArray[40].weatherIndex = 40;
	weatherArray[40].weatherType = "scattered showers";
	weatherArray[40].skyMaterial = day_overcast;
	weatherArray[40].windSpeed = 0.5;
	weatherArray[40].cloudSize = 500;
	weatherArray[40].particleEmit = true;
	weatherArray[40].particleYVelocity = -3;
	weatherArray[40].particleEmission = 400;
	weatherArray[40].particleTexture = rain;
	
	weatherArray[41].weatherIndex = 41;
	weatherArray[41].weatherType = "heavy snow";
	weatherArray[41].skyMaterial = day_overcast;
	weatherArray[41].windSpeed = 0.8;
	weatherArray[41].cloudSize = 10;
	weatherArray[41].particleEmit = true;
	weatherArray[41].particleYVelocity = -4;
	weatherArray[41].particleEmission = 1000;
	weatherArray[41].particleTexture = snow;
	
	weatherArray[42].weatherIndex = 42;
	weatherArray[42].weatherType = "scattered snow showers";
	weatherArray[42].skyMaterial = day_overcast;
	weatherArray[42].windSpeed = 0.4;
	weatherArray[42].cloudSize = 400;
	weatherArray[42].particleEmit = true;
	weatherArray[42].particleYVelocity = -3;
	weatherArray[42].particleEmission = 700;
	weatherArray[42].particleTexture = snow;
	
	weatherArray[43].weatherIndex = 43;
	weatherArray[43].weatherType = "heavy snow";
	weatherArray[43].skyMaterial = day_overcast;
	weatherArray[43].windSpeed = 0.4;
	weatherArray[43].cloudSize = 800;
	weatherArray[43].particleEmit = true;
	weatherArray[43].particleYVelocity = -5;
	weatherArray[43].particleEmission = 900;
	weatherArray[43].particleTexture = snow;
	
	weatherArray[44].weatherIndex = 44;
	weatherArray[44].weatherType = "partly cloudy";
	weatherArray[44].skyMaterial = day_clear;
	weatherArray[44].windSpeed = 0.1;
	weatherArray[44].cloudSize = 200;
	weatherArray[44].particleEmit = false;
	weatherArray[44].particleYVelocity = 0;
	weatherArray[44].particleEmission = 0;
	weatherArray[44].particleTexture = null;
	
	weatherArray[45].weatherIndex = 45;
	weatherArray[45].weatherType = "thunderstorms";
	weatherArray[45].skyMaterial = day_stormy;
	weatherArray[45].windSpeed = 0.8;
	weatherArray[45].cloudSize = 10;
	weatherArray[45].particleEmit = true;
	weatherArray[45].particleYVelocity = -8;
	weatherArray[45].particleEmission = 800;
	weatherArray[45].particleTexture = rain;
	
	weatherArray[46].weatherIndex = 46;
	weatherArray[46].weatherType = "snow showers";
	weatherArray[46].skyMaterial = day_overcast;
	weatherArray[46].windSpeed = 0.3;
	weatherArray[46].cloudSize = 600;
	weatherArray[46].particleEmit = true;
	weatherArray[46].particleYVelocity = -6;
	weatherArray[46].particleEmission = 800;
	weatherArray[46].particleTexture = snow;
	
	weatherArray[47].weatherIndex = 47;
	weatherArray[47].weatherType = "isolated thunderstorms";
	weatherArray[47].skyMaterial = day_stormy;
	weatherArray[47].windSpeed = 4;
	weatherArray[47].cloudSize = 10;
	weatherArray[47].particleEmit = true;
	weatherArray[47].particleYVelocity = -6;
	weatherArray[47].particleEmission = 100;
	weatherArray[47].particleTexture = rain;
	
	weatherArray[48].weatherIndex = 3200;
	weatherArray[48].weatherType = "not available";
	weatherArray[48].skyMaterial = day_clear;
	weatherArray[48].windSpeed = 0.2;
	weatherArray[48].cloudSize = 100;
	weatherArray[48].particleEmit = false;
	weatherArray[48].particleYVelocity = 0;
	weatherArray[48].particleEmission = 0;
	weatherArray[48].particleTexture = null;
	
	//return the array
	return weatherArray;
}