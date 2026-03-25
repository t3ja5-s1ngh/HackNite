const custom_greeting = document.getElementById('greeting');
const now = new Date();
const hour =now.getHours();

let inject="Placeholder";

if(hour>6 && hour<11)inject="Good Morning";
else if(hour >=11 && hour<16)inject="Good Afternoon";
else if(hour >=16 && hour<21)inject ="Good Evening";
else inject="Go To Bed";

custom_greeting.textContent=inject;