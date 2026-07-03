const events = [
    {
        id: "EV001",
        title: "Tech Career Fair",
        date: "2026-08-10",
        venue: "Kuala Lumpur Convention Centre",
        availableSeats: 120
    },
    {
        id: "EV002",
        title: "Web Development Bootcamp",
        date: "2026-08-15",
        venue: "Digital Learning Hub",
        availableSeats: 35
    },
    {
        id: "EV003",
        title: "AI for Business Workshop",
        date: "2026-08-20",
        venue: "Innovation Centre",
        availableSeats: 50
    }
];

// Write your code below

const eventList = document.getElementById("eventList");
const statusText = document.getElementById("statusText");

events.forEach(event => {
    const listItem = document.createElement("li");

    let text = `${event.title} - ${event.date} - ${event.venue} - ${event.availableSeats} seats available`;

    if (event.availableSeats < 50) {
        text += " - Limited seats";
    }

    listItem.textContent = text;
    eventList.appendChild(listItem);
});

statusText.textContent = `${events.length} event(s) displayed.`;