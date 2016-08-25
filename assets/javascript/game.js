//----------------------------------------------
// RPG game in jquery/html5
//
//  8/20/2016 RJF
//----------------------------------------------

/* --- Design thought process ---

  1) Create an object called Character including name, health, damage, isHero (bool), isEnemy (bool), inBattle (bool), isAlive (bool)
	 Also make functions as part of the object.  The key function will be called Attack(damage). It will be called
	 when the character is "getting attacked".  The "damage" parameter is passed in by the character doing the attacking.
	 The function Attack(damage) essentially does the following:
	 		- Reduces it's own Health by the amount that is passed in by damage
	 		- If health <= 0, then set isAlive = false;
  2) Create an Array (collection) to hold character and enemies objects
  3) Create an initialize function that is called from the body.onload event (use jquery). Initialize should:
		a) populate the Character array with 4 character objects (with properties set appropriately for the true/false fields)
  4) Create 3 new display functions for each Div Section using jQuery :
		a) ShowCharacters(): Loops through your Character array and loads the HeroDiv section
							 Initially, all the isHero fields should be 'true' so everything displays (name, health)
		b) ShowEnemies(): Initially empty, the Enemy Array goes from zero to 3 after the Hero gets selected (name, health)
		c) ShowBattleArena(): Initially blank, but after an Enemy is selected, this function loops thru
							  the Chararchter array looking for the object with IsEnemy==true and InBattle==true 
							  so that it shows the right Defender

   4) Create the Attack button onClick function using jquery.  This funtion should loop thru the character
   	  array and when it finds either:
   	  		isHero==true and isAlive==true, set a variable to that object (i.e. var currentHero = charArray[i])
   	  		isEnemy==true and inBattle==true and isAlive==true, set a variable to that object (i.e. var currentEnemy = charArray[i])
   	  		Now that you have the currently battling Character and Enemy, simply call their Attack functions using 
   	  		the others damage points to inflict:
   	  			currentHero.attack(currentEnemy.damage);
   	  			currentEnemy.attack(currentHero.damage)
   	  		Check both players to see if they are still isAlive==true
   
   5) Create a function to update the scores and text in the battle area.  Maybe try using a replace command on some global text.
   	  For example:
   	  		var battleArenaText = "You attacked %hero.name% for %hero.damage% damage. <BR /><BR ?> %enemy.name% attacked you back for %enemy.damage% damage"
*/		

//One global Array to hold Character Objects
var CharArray = new Array();
var currentHero = null;  // Holds the name of the selected Hero ("Luke Skywalker")
var currentEnemy = null; // Holds the name of the selected Enemy ("Darth Maul")

var currentHeroIndex = null;  // Holds the index of the selected Hero as an integer (CharArray[currentHeroIndex] will give us current hero)  
var currentEnemyIndex = null;  // Holds the index of the selected Hero as an integer (CharArray[currentHeroIndex] will give us current hero)  

var gameOver = false;  //set to true when Hero dies or Enemies all die


function Character(name,hitpoints,damage,isHero,isAlive,isBattle, pic)
{
		this.name = name;
		this.hitpoints = hitpoints;
		this.damage = damage;
		this.isHero = isHero;
		this.isAlive = isAlive;
		this.isBattle = isBattle;
		this.pic = pic;
		this.Attack = function(hitDamage)
		{
			this.hitpoints = this.hitpoints - hitDamage;
			
			if(this.hitpoints <= 0)  //check if you are dead
			{
				 this.isAlive = false;
				 return;
			}
		}
}

function Attack()
{

	var str;


	if(gameOver==true)
		return;

	if($(".hero-div img").length > 1)  //just started, need to select a character
	{
		$(".defender-div").html("<p class='action-text-p'></p>");
		$(".action-text-p").html("Please select a Character to get started.");
		return;
	}

	if (!currentEnemy && $(".enemy-div img").length > 0) //No enemy was selected and some are still available show msg to select
	{
		$(".defender-div").html("<p class='action-text-p'></p>");
		$(".action-text-p").html("Please select an Enemy to continue.");
		return;
	}

	//Next 2 lines are key...Hero gets attacked then Enemy gets attacked 
	CharArray[currentHeroIndex].Attack( CharArray[currentEnemyIndex].damage );
	CharArray[currentEnemyIndex].Attack( CharArray[currentHeroIndex].damage );

	//after the attacks, update the hitpoint DIVs on the screen
	$(".hero-damage").text(CharArray[currentHeroIndex].hitpoints);
	$(".defender-damage").text(CharArray[currentEnemyIndex].hitpoints);

	//Play a sound
	// Play fight music
	var audio = new Audio("assets/sounds/Lightsaber.mp3");
	audio.play();

	//Write to the message area everything that is happening for each attack click.  If/Else because check for dead, game over
	if (CharArray[currentHeroIndex].isAlive == true && CharArray[currentEnemyIndex].isAlive == true)
	{
		str = "You attacked " + currentEnemy + " for " + CharArray[currentHeroIndex].damage + " damage.<br /><br />";
		str += currentEnemy + " attacked you back for " + CharArray[currentEnemyIndex].damage + " damage.";

		CharArray[currentHeroIndex].damage += CharArray[currentHeroIndex].damage;  //damage for the hero continually increases
	}
	else  //one of you is dead
	{
		if(CharArray[currentHeroIndex].isAlive == false)   //Is Hero dead?
		{
			str = "You were defeated by " + currentEnemy + ".<br /><br />Game Over.";
			gameOver = true;	
		}
		else   // Enemy Dead
		{	//Good guy won!  But now check if there is anyone else to fight (i.e. are they all dead?  game over if so)
			str = "You were victorious against " + currentEnemy + ".<br /><br />";

			if($(".enemy-div img").length > 0){		//If this myEnemyImg exists, there is another enemy in that DIV
				str += "You can choose to fight another character.";		
			}
			else 
			{
				str += "There are no more Enemies to fight.  Game Over";
				gameOver = true;	
			}
			
			currentEnemy = null;
			currentEnemyIndex = null;	
			
			$(".defender-div").html("<p class='action-text-p'></p>");
		}
		
	}
	$(".action-text-p").html(str);

}


function InitializeGame()
{
	//Clear the divs, starting new game
    clearAllDivs();

	//Load the arrays and set the default properties (i.e. isAlive=true, Ishero=true)
	CharArray.push(new Character("Luke Skywalker",100, 25,true,true,false, "luke-skywalker.jpg"));
	CharArray.push(new Character("Obi Wan",95,8,true,true,false, "obi-wan.jpg"));
	CharArray.push(new Character("Darth Maul",180,25,true,true,false, "darth-maul.png"));
	CharArray.push(new Character("Darth Sidious",150,15,true,true,false, "darth-sidious.png"));

	//Cool built-in function that automatically iterates through our CharArray
	//and calls the function displayHeroes (while staying here at this line)
	CharArray.forEach (displayHeroes);

	//Start the game with a message to select a player.
	$(".defender-div").html("<p class='action-text-p'></p>");
	$(".action-text-p").html("Please select a Hero.");
}

function clearAllDivs()
{
	//Clear Hero and Enemy Divs
	var herobox = document.getElementById( "hero-box" );
	var enemybox = document.getElementById( "enemy-box" );
	herobox.innerHTML = "";
	enemybox.innerHTML = "";

	//Clear Battle Area
	var defenderName = document.getElementById( "defender-div" );
	defenderName.innerHTML = "";
}

function displayAllDivs()
{
	CharArray.forEach (displayHeroes);
	CharArray.forEach (displayEnemies);
	CharArray.forEach (displayBattleArena);
}

function setPlayer(playerId)
{
	CharArray.forEach (updatePlayers);
	clearAllDivs();
	displayAllDivs();
}

function setEnemy(playerId)
{
	CharArray.forEach (updateEnemy);
	clearAllDivs();
	displayAllDivs();
}


function updatePlayers(value, index, arr)
{
	if (CharArray[index].name == currentHero){
		CharArray[index].isHero = true; 
		CharArray[index].isBattle = true;
		currentHeroIndex = index;  // we will use this in attack function
	}
	else {
		CharArray[index].isHero = false; 
		CharArray[index].isBattle = false;	
	}	
}

// Called when an enemy is selected to do battle.  Just
//sets isBattle = true so the enemy displays in the Battle Area	
function updateEnemy(value, index, arr)
{
	
	if (CharArray[index].name == currentEnemy)
	{
	  CharArray[index].isBattle = true;
	  currentEnemyIndex = index;  // we will use this in attack function
	}
	else
	{
		CharArray[index].isBattle = false;
	}
}

//Displays heroes (at the beginning of the game, everyone is a hero)
function displayHeroes(value, index, arr)
{
	var herobox = document.getElementById( "hero-box" );
 	
 	if (CharArray[index].isHero == true && CharArray[index].isAlive == true )
 	{
	 	var str; // = herobox.innerHTML;
		str ="<div class='hero-div'><a href='#'>";
		str += "<img class='myHeroImg' id='";
		str += CharArray[index].name + "' ";
		str += "src='assets//images//" + CharArray[index].pic + "'>";
		str += "</img></a>";
		str += "<p class='hero-p'>" + CharArray[index].name + "</p>";
		str += "<p class='hero-damage'>" + CharArray[index].hitpoints + "</p></div>";

		$( herobox ).append( str );
	}
}

//Displays enemies in the middle of the screen (after a hero is selected, the other 3 players become enemies)
function displayEnemies(value, index, arr)
{
	var enemybox = document.getElementById( "enemy-box" );
 	
 	// If IsHero is false and still alive and Not currently battling (isBattle), then display in the middle Enemies section
 	if (CharArray[index].isHero == false && CharArray[index].isAlive == true && CharArray[index].isBattle == false)
 	{
	 	var str; // = enemybox.innerHTML;
		str ="<div class='enemy-div'><a href='#'>";
		str += "<img class='myEnemyImg' id='";
		str += CharArray[index].name + "' ";
		str += "src='assets//images//" + CharArray[index].pic + "'>";
		str += "</img></a>";
		str += "<p class='enemy-p'>" + CharArray[index].name + "</p>";
		str += "<p class='enemy-damage'>" + CharArray[index].hitpoints + "</p></div>";
		
		//$( enemybox ).html( str );
		$( enemybox ).append( str );
	}
}

//Displays only one enemy character that has isHero==false and isBattle==true;
function displayBattleArena(value, index, arr)
{
	var defenderbox = document.getElementById( "defender-div" );
 	var str; 
	
	// If IsHero is false and still alive and Not currently battling (isBattle), then display in the middle Enemies section
 	if (CharArray[index].isHero == false && CharArray[index].isAlive == true && CharArray[index].isBattle == true)
 	{
		str ="<p id='defender-name' class='defender-p'>" + CharArray[index].name;
		str += "<img class='myEnemyImg' id='" + CharArray[index].name + "' src='assets//images//" + CharArray[index].pic + "'></img>";
		str += "<p id='action-text' class='action-text-p'></p><p class='defender-damage'>" + CharArray[index].hitpoints + "</p>";
		$( defenderbox ).append( str );
	}
	
}


// --- EVENT HANDLERS BELOW ---

// --- Called when the hmtl document is ready (loaded) ---
$( document ).ready(function() 
{
  //console.log( "Initialized!" );
  InitializeGame();
});

$(document).on('click', '#attack', function(){
   Attack();
});


$(document).on('click', '.myHeroImg', function(){
    currentHero = event.target.id;
   	setPlayer(currentHero);
    } );


$(document).on('click', '.myEnemyImg', function(){
	
		//console.log($(".myEnemyImg"));
		if(currentEnemy != null)
			return;

	currentEnemy = event.target.id;
   	setEnemy(currentEnemy);
});

