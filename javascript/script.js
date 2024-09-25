
let currentSong = new Audio();
let songs;
let currentfolder;

async function getSongs(folder) {

    currentfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            // songs.push(element)
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    // Play the first song of the card


    // SHow all the songs in playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                             <div class="info">
                                 <div> ${song.replaceAll("%20", " ")}</div>
                                 <div>Vikas</div>
                             </div>
 
                             <div class="playnow">
                                 <span>Play Now</span>
                                 <img class="invert" src="img/play.svg" alt="">
 
                             </div>
          </li>`;
        // songul.innerHTML=songul.innerHTML + `<li> ${song} </li>`;
    }




    // Attach an event listener to each Song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {

            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            // Play.src = "img/Pause.svg";


        })
    })

    return songs;

}

function convertSecondsToMinutes(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Used for Songtime 
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedminutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedminutes}:${formattedSeconds}`;
}



const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)
    currentSong.src = `/${currentfolder}/` + track;

    if (!pause) {

        currentSong.play();
        Play.src = "img/Pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";




}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        

        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {

            // let folder = e.href.split("/").slice(-2)[0]     //for online 
            let folder = e.href.split("/").slice(-1)[0]     //for offline             
            console.log(folder)

            //    Get the Metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            // let a = await fetch(`/songs/${folder}/`)
            let response = await a.json();
            // console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `   <div data-folder="${folder}" class="card ">
                        <div  class="play">

                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" id="play">
                                <path fill="#000"
                                    d="M7 17.259V6.741a1 1 0 0 1 1.504-.864l9.015 5.26a1 1 0 0 1 0 1.727l-9.015 5.259A1 1 0 0 1 7 17.259Z">
                                </path>
                            </svg>

                        </div>

                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>

                    </div>`


        }
    } 

    // LOad the PLaylist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        //    console.log(e)
        e.addEventListener("click", async item => {
            console.log("Fetching songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

            // playMusic(songs[0])
            // Play.src = "img/Pause.svg";



        })
    })

    // console.log(anchors)
}


async function main() {
    
    // get the list of all songs 
    await getSongs("songs/cs")
    
    
    playMusic(songs[0], true)
    
    displayAlbums();    
    // Display all the albums in a page


    // Attach event Listener to play ,next and previous songs

    Play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            Play.src = "img/Pause.svg";
        } else {
            currentSong.pause();
            Play.src = "img/play.svg";
        }
    });


    //listen for timeupdate Event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`

        
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        
        if (currentSong.currentTime == currentSong.duration) {
            Play.src = "img/play.svg";


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1])
         

        }

        }




    })

    // Add an event listener to seeker
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;


    })

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //Add an event Listener to  previous song 

    previous.addEventListener("click", () => {
        // console.log("Previous Clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        console.log(songs, index)
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])
   

        }

    })

    //Add an event Listener to  next song  

    next.addEventListener("click", () => {
        // console.log("Next Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        // console.log(songs,index)
        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1])
         

        }
    })


    // add an eventListener to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e,e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100;

        if(currentSong.volume>0){
            document.querySelector(".volume>img").src  = document.querySelector(".volume>img").src.replace("mute.svg","volumeHigh.svg")
        }

    })

    // Add an EventListener to Mute the song 
    document.querySelector(".volume>img").addEventListener("click",e=>{

        if(e.target.src.includes("volumeHigh.svg")){

            e.target.src = e.target.src.replace("volumeHigh.svg","mute.svg")
            currentSong.volume=0.0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volumeHigh.svg")
            currentSong.volume=0.20;
            document.querySelector(".range").getElementsByTagName("input")[0].value=30;
        }

    })
    

}

main()



