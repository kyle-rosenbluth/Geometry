//create an instance of a GUIText Object for the GameObject LoadingText to be dragged onto
var loadingText : GUIText;

//OnGUI is called every frame until a button is pressed
function OnGUI () {
	
	// Make a background box for the menu
	GUI.Box (Rect (320,100,250,100), "Welcome to UWE");

	// Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
	// and the uwe map is loaded
	if (GUI.Button (Rect (345,130,200,20), "Enter Virtual UWE")) {
		Application.LoadLevel(1);
		loadingText.text = "Loading...";
		
	}
	
	//if this button is pressed the users room is loaded
	if (GUI.Button (Rect (345,160,200,20), "UWE Map")) {
		Application.LoadLevel(2);
	}
}