const url = window.location.toString() //The URL of the page we are on
const path = url.split(".")[1] //Server name (f. e.: EUNE, NA)
let lang = url.split("/")[3];

if (lang != "hu" && lang != "fr") {lang = "en"} // TODO: Add all languages, remove this line.

const ranks = [];
ranks["hu"] = [
  "Vendég",
  "Minion",
  "Ágyús Minion",
  "Krug",
  "Gromp",
  "Pengecsőr",
  "Kék Gólem",
  "Vörös Szederhát",
  "Idéző",
  "Idéző mester",
  "Főmágus",
  "Végzetes",
  "Halhatatlan",
  "Legenda"
]

ranks["en"] = [
  "Guest",
  "Minion",
  "Cannon Minion",
  "Krug",
  "Gromp",
  "Razorbeak",
  "Blue Golem",
  "Red Brambleback",
  "Summoner",
  "Master Summoner",
  "Archmage",
  "Undefeated",
  "Undying",
  "Legend"
]

ranks["fr"] = [
  "Invité",
  "Serviteur",
  "Krug",
  "Gromp",
  "Corbin",
  "Sentinelle Bleue",
  "Roncier Rouge",
  "Invocateur",
  "Maître Invocateur",
  "Archimage",
  "Invaincu",
  "Immortel",
  "Légende"
]

const XPrequ = (level) => {
  if (level == 1) {return 50}

  return XPrequ(level-1) + (level * 50) //Get the level with recursion.
}

const returnRank = (point) => {
  if (point < XPrequ(1)) {return ranks[lang][0]} //While this code is good for bigger than level one users, we need to address the lvl1-s with a fix like this.

  for (let i = 1; i <= ranks[lang].length; i++) {
    if (point < XPrequ(i)) return ranks[lang][i-1] //If we find a level, for which the user does not have enough XP yet, set it to the previous level.
  }
}


const getPoints = (element) => { //Element : A profile-hover <a> element.
  let xhr = new XMLHttpRequest()

  xhr.open("GET", "http://boards."+path+".leagueoflegends.com" + element.getAttribute("href")) //Get the profile page of the player

  xhr.responseType = "document" //We want an HTML Document

  xhr.onreadystatechange = () => {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { //If the XHR went through fine...
      let points = xhr.responseXML.getElementsByClassName("lifetime-upvotes")[0].childNodes[1].getAttribute("data-short-number") //...Get the number of upvotes...

      element.getElementsByClassName('username')[0].innerHTML +=  " (" + points + ") [" + ((returnRank(points) === undefined) ? "Too amazing to have a rank" : returnRank(points)) + "]" //...Then put it after their name.

      //console.log(decodeURI(element.getAttribute("href").split("/")[4]) + ": " + points);
    } else if (xhr.status === 404) {
      console.log("Player not found.")
    }
  }

  xhr.send() //Send the request
}

let lastUpdate = 0 //How many posts have we looked up last time?

const updateAll = () => {
  let names = [].slice.call(document.getElementsByClassName("profile-hover")).slice(lastUpdate) //Get all the profile names and turn it into an array

  for (let i = 0; i < names.length; i++) { //Loop trough all the names
    getPoints(names[i]) //XHR the points.
  }

  lastUpdate += names.length //Update this with how many posts we have done
  console.log("Completed " + names.length + " users.")
}

const hook = () => {
  try {
    document.getElementsByClassName("box show-more")[0].addEventListener("click", () => {setTimeout(updateAll, 6000)}) //If a user pushes the load more posts button
  } catch (e) {
    console.log("Hook failed: No button found.") //If the page doesn't have a button (comments)
  }
}

hook()
updateAll() //Let the extension run when we load the website.

console.log("Hello, everything seems to be working.")
