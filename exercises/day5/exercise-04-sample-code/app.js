const API_BASE_URL = "http://localhost:8081/api";

const loadButton = document.getElementById("loadButton");
const statusText = document.getElementById("statusText");
const eventList = document.getElementById("eventList");

loadButton.addEventListener("click", loadEvents);

async function loadEvents() {
    statusText.textContent = "Loading events...";
    eventList.innerHTML = "";

    try {
        const response = await fetch(`${API_BASE_URL}/events`);

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const events = await response.json();
        renderEvents(events);
        statusText.textContent = `${events.length} event(s) loaded.`;
    } catch (error) {
        statusText.textContent = `Could not load events: ${error.message}`;
    }
}

function renderEvents(events) {
    events.forEach(event => {
        const listItem = document.createElement("li");
        listItem.textContent = `${event.title} - ${event.date} - ${event.venue} - ${event.availableSeats} seats available`;
        eventList.appendChild(listItem);
    });
}

// Challenge task: search for one event by ID
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.id = "eventIdInput";
searchInput.placeholder = "Enter event ID, e.g. EV001";

const searchButton = document.createElement("button");
searchButton.id = "searchButton";
searchButton.textContent = "Find Event";

const searchResult = document.createElement("p");
searchResult.id = "searchResult";

document.body.appendChild(searchInput);
document.body.appendChild(searchButton);
document.body.appendChild(searchResult);

searchButton.addEventListener("click", searchEventById);

async function searchEventById() {
    const id = searchInput.value.trim();

    if (id === "") {
        searchResult.textContent = "Please enter an event ID.";
        return;
    }

    searchResult.textContent = "Searching...";

    try {
        const response = await fetch(`${API_BASE_URL}/events/${id}`);

        if (response.status === 404) {
            searchResult.textContent = `No event found with ID ${id}.`;
            return;
        }

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const event = await response.json();
        searchResult.textContent = `${event.title} - ${event.date} - ${event.venue} - ${event.availableSeats} seats available`;
    } catch (error) {
        searchResult.textContent = `Search failed: ${error.message}`;
    }
}
