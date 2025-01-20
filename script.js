const songname = document.getElementById(`song-name`);
const bandname = document.getElementById(`band-name`);
const cover = document.getElementById(`cover`);
const song = document.getElementById(`audio`);
const play = document.getElementById(`play`);
const next = document.getElementById(`next`);
const previous = document.getElementById(`previous`);
const current_progress = document.getElementById(`current-progress`);
const progress_container = document.getElementById(`progress-container`);
const shuffle = document.getElementById(`shuffle`);
const repeat = document.getElementById(`repeat`);
const song_time = document.getElementById(`song-time`);
const total_time = document.getElementById(`total-time`);
const like_button = document.getElementById(`like`);


let is_playing = false;
let is_shuffled = false;
let repeat_on = false;
let index = 0;


const DontTreadOnMe = {
    name : "Don't Tread on Me",
    artist : "Metallica",
    file : "songs/Don't Tread On Me.mp3",
    album : "images/Black Album.webp",
    liked : false
}

const Papercut = {
    name : "Papercut",
    artist : "Link Park",
    file : "songs/papercut.mp3",
    album : "images/Hibrid Theory.jpg",
    liked : false
}

const SymphonyOfDestruction = {
    name : "Symphony Of Destruction",
    artist : "Megadeth",
    file : "songs/Symphony Of Destruction.mp3",
    album : "images/Countdown to Extinction.jpg",
    liked : false
}

const DeadMemories = {
    name : "Dead Memories",
    artist : "Slipknot",
    file : "songs/Dead Memories.mp3",
    album : "images/All Hope Is Gone.jpg",
    liked : false
}
const playlist = JSON.parse(localStorage.getItem("playlist")) ?? [DontTreadOnMe, Papercut, SymphonyOfDestruction, DeadMemories];

let sorted_playlist = [...playlist];

function play_song(){
        play.querySelector(".bi").classList.remove("bi-play-circle-fill");
        play.querySelector(".bi").classList.add("bi-pause-circle-fill");
        song.play();
        is_playing = true;
}


function pause_song(){
        play.querySelector(".bi").classList.add("bi-play-circle-fill");
        play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
        song.pause();
        is_playing = false;
}

function play_pause_dicider(){

    if(is_playing){
        pause_song();
    }

    else{
        play_song();
    }

}

function load_song(){
    cover.src = sorted_playlist[index].album;
    song.src = sorted_playlist[index].file;
    songname.innerText = sorted_playlist[index].name;
    bandname.innerText = sorted_playlist[index].artist;
    update_like();
}

function previous_song(){
    if(index === 0){
        index = sorted_playlist.length -1;
    }
    else {
        index -= 1;
    }
    load_song();
    play_song();
}

function next_song(){
    if(index === sorted_playlist.length -1){
        index = 0;
    }
    else {
        index += 1;
    }
    load_song();
    play_song();
}

function update_progress(){
    const bar_width = (song.currentTime / song.duration) *  100;
    current_progress.style.setProperty("--progress",bar_width + "%")
    update_atual_time()
}

function junp_to(event){
    const width = progress_container.clientWidth;
    const click_position = event.offsetX;
    const jump_to_time = (click_position / width) * song.duration;
    song.currentTime = jump_to_time;
}

function shuffle_cliked(){
    if(!is_shuffled){
        is_shuffled = true;
        shuffled_array(sorted_playlist);
        shuffle.classList.add("button-active");
    }
    else{
        is_shuffled = false;
        sorted_playlist = [...playlist];
        shuffle.classList.remove("button-active");
    }
}

function shuffled_array(pre_shuffle_array){
    let size = pre_shuffle_array.length;
    let current_index = size - 1;
    while(current_index > 0){
        let choise = Math.floor((Math.random() * size));
        let aux = pre_shuffle_array[current_index];
        pre_shuffle_array[current_index] = pre_shuffle_array[choise]
        pre_shuffle_array[choise] = aux;
        current_index -= 1;
    }
}

function repeat_cliked(){
    if(!repeat_on){
        repeat_on = true;
        repeat.classList.add("button-active");
    }
    else{
        repeat_on = false;
        repeat.classList.remove("button-active");
    }
}

function next_or_repeat(){
    if(!repeat_on){
        next_song();
    }
    else{
        play_song();
    }
}

function update_atual_time(){
    song_time.innerText = toHHMMSS(song.currentTime);
}

function update_total_time(){
    total_time.innerText = toHHMMSS(song.duration);
    
}

function update_like(){
    if(sorted_playlist[index].liked){
        like_button.classList.add("button-active");
        like_button.querySelector(".bi").classList.add("bi-heart-fill");
        like_button.querySelector(".bi").classList.remove("bi-heart");
    }
    else{
        like_button.classList.remove("button-active");
        like_button.querySelector(".bi").classList.remove("bi-heart-fill");
        like_button.querySelector(".bi").classList.add("bi-heart");
    }
}

function like_cliked(){
    if(!sorted_playlist[index].liked){
        sorted_playlist[index].liked = true;
    }
    else{
        sorted_playlist[index].liked = false;
    }
    update_like();
    localStorage.setItem("playlist",JSON.stringify(playlist));
}

function toHHMMSS(timer){
    let hours = Math.floor( timer / 3600 );
    let minutes = Math.floor((timer - (hours * 3600)) / 60);
    let seconds = Math.floor(( timer - (hours * 3600)) - minutes * 60);
    if(hours > 1){
    return `${hours.toString().padStart(2,0)}:${minutes.toString().padStart(2,0)}:${seconds.toString().padStart(2,0)}`
    }
    else{
        return `${minutes.toString().padStart(2,0)}:${seconds.toString().padStart(2,0)}`
    }
}


load_song();

play.addEventListener("click",play_pause_dicider);
next.addEventListener("click",next_song);
previous.addEventListener("click",previous_song);
song.addEventListener("timeupdate",update_progress);
song.addEventListener("ended",next_or_repeat);
song.addEventListener("loadedmetadata",update_total_time);
progress_container.addEventListener("click",junp_to);
shuffle.addEventListener("click",shuffle_cliked);
repeat.addEventListener("click",repeat_cliked);
like_button.addEventListener("click",like_cliked);


