//alt1 base libs, provides all the commonly used methods for image matching and capture
//also gives your editor info about the window.alt1 api
import * as a1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";
import * as OCR from "@alt1/ocr";
import * as Chatbox from "@alt1/chatbox";


import * as $ from "jquery";

//import font from "@alt1/font-loader";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

var bolttype = {
	Ascendri:                "Ascendri",
	Ascension:               "Ascension",
	Blight:                  "Blight",
	Diamond_bakriminel:      "Diamond bakriminel",
	Dragonstone_bakriminel:  "Dragonstone bakriminel",
	Emerald_bakriminel:      "Emerald bakriminel",
	Hydrix_bakriminel:       "Hydrix bakriminel",
	Jade_bakriminel:         "Jade bakriminel",
	Onyx_bakriminel:         "Onyx bakriminel",
	Opal_bakriminel:         "Opal bakriminel",
	Pearl_bakriminel:        "Pearl bakriminel",
	Red_topaz_bakriminel:    "Red_topaz bakriminel",
	Ruby_bakriminel:         "Ruby bakriminel",
	Sapphire_bakriminel:     "Sapphire bakriminel" 
	
}


const appColor = a1lib.mixColor(255, 255, 255);



// Set Chat reader
let chatReader = new Chatbox.default();
chatReader.readargs = {
  colors: [
    a1lib.mixColor(255, 255, 255), //white
  ]
};

//Find all visible chatboxes on screen
let findChat = setInterval(function () {
  if (chatReader.pos === null)
  chatReader.find();
  else {
    clearInterval(findChat);
    chatReader.pos.boxes.map((box, i) => {
      $(".chat").append(`<option value=${i}>Chat ${i}</option>`);
    });

    if (localStorage.quiverChat) {
		$(".chat").val(localStorage.quiverChat);
		chatReader.pos.mainbox = chatReader.pos.boxes[localStorage.quiverChat];
    } else {
      //If multiple boxes are found, this will select the first, which should be the top-most chat box on the screen.
      chatReader.pos.mainbox = chatReader.pos.boxes[0];
    }
    showSelectedChat(chatReader.pos);
    //build table from saved data, start tracking.
  
    setInterval(function () {
      readChatbox();
    }, 50);
  }
}, 50);

function showSelectedChat(chat) {
	//Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
	try {
	  alt1.overLayRect(
		appColor,
		chat.mainbox.rect.x,
		chat.mainbox.rect.y,
		chat.mainbox.rect.width,
		chat.mainbox.rect.height,
		2000,
		5
	  );
	} catch { }
  }
  
  //Reading and parsing info from the chatbox.
  function readChatbox() {
	var opts = chatReader.read() || [];
	var chat = "";
  
	for (const a in opts) {
	  chat += opts[a].text + " ";
	}

	if (chat.indexOf("Your quiver will now use the following:") > -1) {
		let getItem = {
		item: chat.match("(?<=Your quiver will now use the following:)(.*)(?=bolts)")[0].trim()		
	  	};	 
		 // console.log(getItem.item)
	  for (const [key] of Object.entries(bolttype))
	  {
		  
			if (getItem.item == bolttype[key])
				{
					(document.getElementById(`HTMLBoltImage`) as HTMLImageElement).src = `./Images/${bolttype[key]}.PNG` 
				}
	  }
	}
}

$(document).ready(function() {
	 // Settings	 
	 $(".chat").change(function () {
		chatReader.pos.mainbox = chatReader.pos.boxes[$(this).val() as string];
		showSelectedChat(chatReader.pos);
		localStorage.setItem("quiverchat", $(this).val() as string);
	  });

});


if (window.alt1) {
	//tell alt1 about the app
	//this makes alt1 show the add app button when running inside the embedded browser
	//also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig.json");
}