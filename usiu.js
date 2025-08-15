// Save and load events from localStorage
function loadEvents() {
    let stored = localStorage.getItem("eventData");
    if (stored) {
        return JSON.parse(stored);
    } else {
        return [
            { name: "Cultural Night", slots: 5 },
            { name: "Career Fair", slots: 3 },
            { name: "Sports Day", slots: 2 },
            { name: "Tech Expo", slots: 4 },
            { name: "Music Festival", slots: 0 }
        ];
    }
}

function saveEvents(events) {
    localStorage.setItem("eventData", JSON.stringify(events));
}

let events = loadEvents();

// Update table and dropdown
function updateUI() {
    let tableRows = document.querySelectorAll(".event-list tbody tr");
    let eventSelect = document.getElementById("eventSelect");

    // Clear dropdown
    eventSelect.innerHTML = '<option value="">-- Select an Event --</option>';

    events.forEach((event, index) => {
        let row = tableRows[index];
        let slotCell = row.children[3];
        let button = row.children[4].querySelector("button");

        // Update slots in table
        slotCell.textContent = event.slots;

        // Update button state
        if (event.slots === 0) {
            button.disabled = true;
            button.textContent = "Fully Booked";
        } else {
            button.disabled = false;
            button.textContent = "Register";

            // Add to dropdown if slots > 0
            let option = document.createElement("option");
            option.value = event.name;
            option.textContent = event.name;
            eventSelect.appendChild(option);
        }
    });

    saveEvents(events);
}

// Handle Register button clicks
document.querySelectorAll(".register-btn").forEach((btn, index) => {
    btn.addEventListener("click", function () {
        if (events[index].slots > 0) {
            events[index].slots--;
            alert(`You have registered for: ${events[index].name}`);
            updateUI();
        }
    });
});

// Handle form submission
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let studentId = document.getElementById("studentId").value.trim();
    let eventName = document.getElementById("eventSelect").value;

    if (!name || !/^USIU\d{4}$/.test(studentId) || !eventName) {
        document.getElementById("formMessage").textContent =
            "Please fill all fields correctly (ID format: USIU1234).";
        document.getElementById("formMessage").style.color = "red";
        return;
    }

    let eventIndex = events.findIndex(e => e.name === eventName);
    if (eventIndex !== -1 && events[eventIndex].slots > 0) {
        events[eventIndex].slots--;
        updateUI();
    }

    document.getElementById("formMessage").textContent =
        `Thank you ${name} (ID: ${studentId}) for registering for ${eventName}.`;
    document.getElementById("formMessage").style.color = "green";

    document.getElementById("registerForm").reset();
});

// Initialize page
updateUI();
