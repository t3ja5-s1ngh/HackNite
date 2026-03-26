//###########################################################################################
const custom_greeting = document.getElementById('greeting');
const now = new Date();
const hour =now.getHours();
let greeting_inject="Placeholder";

if(hour>6 && hour<11)greeting_inject="Good Morning";
else if(hour >=11 && hour<16)greeting_inject="Good Afternoon";
else if(hour >=16 && hour<21)greeting_inject ="Good Evening";
else greeting_inject="Go To Bed";

custom_greeting.textContent=greeting_inject;
//###########################################################################################
const time_obj=document.getElementById('time');
const minutes = now.getMinutes();

let hour_inject = String(hour).padStart(2,'0');
let minute_inject = String(minutes).padStart(2,'0');
let time_inject = `${hour_inject} : ${minute_inject}`;

time_obj.textContent=time_inject;
//###########################################################################################
const searchForm = document.getElementById('searching');
const searchBox = document.getElementById('search_bar');

searchBox.focus();
searchForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    let query = searchBox.value;
    if(query)window.location.href = `https://www.google.com/search?q=${query}`; 
});
//###########################################################################################

