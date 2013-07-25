//function to trigger GUI text when an info point is clicked on
function Update(){
	iPointVisited();
}
function iPointVisited(){ 
     if (Input.GetMouseButtonDown (0)) { 
          var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition); 
          var hit : RaycastHit = new RaycastHit (); 
          if (Physics.Raycast (ray, hit))
               Debug.Log (hit.collider.gameObject.name); 
          else 
               Debug.Log ("Nothing"); 
     } 
}