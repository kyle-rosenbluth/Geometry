import System;

//create a variable to hold the config file
var config : config;

var date = DateTime.Now;
var timeDisplay : GUIText;
 
function Start() {
	InvokeRepeating("Increment", 1.0, 1.0);
}
function Update () {
	var seconds : float = date.TimeOfDay.Ticks / 10000000;
	transform.rotation = Quaternion.LookRotation(Vector3.up);
	transform.rotation *= Quaternion.AngleAxis(seconds/86400*360,Vector3.down);
	if (timeDisplay) timeDisplay.text = date.ToString("f");
}
 
function Increment() {
	date += TimeSpan(0,0,0, 1);
}

function setIntensity(time : int){
	if(time < 12 || time > 6){
		intensity = 0.2;	
	}
}