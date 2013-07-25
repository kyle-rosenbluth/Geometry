var door1 : GameObject;
var door2 : GameObject; 
var OpenAnim : String;

function Awake(){ 
	door1.animation.Stop();
	door2.animation.Stop();
} 

function OnTriggerEnter (){ 
	if(!door1.animation.IsPlaying(OpenAnim) && door2.animation.IsPlaying(OpenAnim)){ 
      	door1.animation.Play(OpenAnim);
      	door2.animation.Play(OpenAnim);
    } 
}