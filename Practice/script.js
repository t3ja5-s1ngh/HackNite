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
async function poemFetch() {
    try {
        const randomLineCount = Math.floor(Math.random() * 10) + 1;
        console.log(`Searching for a poem with exactly ${randomLineCount} lines...`);
        
        const response = await fetch(`https://poetrydb.org/linecount,random/${randomLineCount};1`);
        const data = await response.json();

        if (data && data.length > 0 && !data.status) {
            const poem = data[0];
            document.getElementById("poem").innerHTML = poem.lines.join('<br>');
            document.getElementById("poemAuthor").innerHTML = `— ${poem.author}`;
        } 
        else {
            console.warn(`No poem found for linecount ${randomLineCount}. Retrying...`);
            poemFetch(); 
        }

    } catch (error) {
        console.error("Connection Error:", error);
    }
}

poemFetch();
//###########################################################################################
