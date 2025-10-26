// Select important elements from the DOM
const addTimerBtn = document.getElementById("add_timer")  // "Add Timer" button
const modal = document.getElementById("modal")            // Modal box container
const saveBtn = document.getElementById("save_timer")     // "Save" button inside modal
const cancelBtn = document.getElementById("cancel")       // "Cancel" button inside modal
const timersRow = document.getElementById("timers_row")   // Container where all timers will be displayed


// Open Modal when user clicks on "Add Timer" button
addTimerBtn.addEventListener("click", () => {
  modal.style.display = "flex"
})

// Close Modal when user clicks on "Cancel" button
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none"
})

// ENTER KEY functionality
modal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent default submit or reload
    saveBtn.click(); // trigger save button
  }
});

// When user clicks the "Save" button inside modal
saveBtn.addEventListener("click", () => {
  // Get the selected date and time values from the modal inputs
  const date = document.getElementById("modal_date").value
  const time = document.getElementById("modal_time").value

   // Check if both date and time are selected
  if (date && time) {
    // Create a new timer card (Bootstrap column)
    const col = document.createElement("div")
    col.classList.add("col-md-4")

    // Generate unique ID for each timer using current timestamp
    const timerId = "timer_" + Date.now()

    // Add HTML structure for the timer
    col.innerHTML = `
      <div class="countdown_timer" id="${timerId}">
        <div class="timer_head">
          <span>${date} &nbsp;&nbsp; ${time}</span> 
          <i class="delete_timer fa-solid fa-trash-can"></i>
        </div>        
        
        <div class="timer">
          <div class="time-box">
          <span class="countdown_days">00</span>
          <span class="label">D</span>
        </div>
        <div class="time-box">
          <span class="countdown_hours">00</span>
          <span class="label">H</span>
        </div>
        <div class="time-box">
          <span class="countdown_minutes">00</span>
          <span class="label">M</span>
        </div>
        <div class="time-box">
          <span class="countdown_seconds">00</span>
          <span class="label">S</span>
        </div>
        </div>

         <!-- Timer control buttons -->
        <div class="buttons">
          <button class="main_btn play"><i class="fa-solid fa-play"></i></button>
          <button class="main_btn stop"><i class="fa-solid fa-stop"></i></button>
          <button class="main_btn reset"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
      </div>
    `
    // Append new timer card into the timer section on the page
    document.getElementById("timers_row").appendChild(col);

    // Close modal after saving
    modal.style.display = "none"

    // -------- Timer Logic ----------

    // Select elements for countdown display
    const timerEl = document.getElementById(timerId)
    const daysEl = timerEl.querySelector(".countdown_days")
    const hoursEl = timerEl.querySelector(".countdown_hours")
    const minutesEl = timerEl.querySelector(".countdown_minutes")
    const secondsEl = timerEl.querySelector(".countdown_seconds")

    // Select timer control buttons
    const playBtn = timerEl.querySelector(".play")
    const stopBtn = timerEl.querySelector(".stop")
    const resetBtn = timerEl.querySelector(".reset")

    // Handle delete button click
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("delete_timer")) {
        e.target.closest(".col-md-4").remove();  // remove the entire col
      }
    });

    // Calculate the end time for countdown
    const endTime = new Date(date + " " + time).getTime()

    let intervalId = null   // store interval reference

    // Function to update countdown values every second
    function updateCountdown() {
      const now = new Date().getTime()
      const distance = endTime - now

      // If countdown is complete
      if (distance <= 0) {
        clearInterval(intervalId)
        daysEl.innerText = "00"
        hoursEl.innerText = "00"
        minutesEl.innerText = "00"
        secondsEl.innerText = "00"
        
        const targetDateTime = new Date(endTime).toLocaleString()

         // Show notification modal when timer ends
        document.getElementById("notifyMessage").innerText =
          `Your timer has finished!\nTarget was: ${targetDateTime}`

        // Show the Bootstrap modal
        const notifyModalEl = document.getElementById("notifyModal")
        const notifyModal = new bootstrap.Modal(notifyModalEl)
        notifyModal.show()

        // Play alarm sound
        const alarmEl = document.getElementById("alarmSound")
        alarmEl.currentTime = 0
        alarmEl.play()

        // Flashing effect for finished timer
        timerEl.classList.add("flash")

        // Stop alarm and remove flash when modal closed
        notifyModalEl.addEventListener("hidden.bs.modal", () => {
          alarmEl.pause()
          alarmEl.currentTime = 0
          timerEl.classList.remove("flash")

        },
        {once: true}
        )
        return
      }
 
      // Convert remaining milliseconds to D/H/M/S format
      const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Format and update UI
      const daysStr    = String(days).padStart(2, "0");
      const hoursStr   = String(hours).padStart(2, "0");
      const minutesStr = String(minutes).padStart(2, "0");
      const secondsStr = String(seconds).padStart(2, "0");
     
      daysEl.innerText = daysStr
      hoursEl.innerText = hoursStr
      minutesEl.innerText = minutesStr
      secondsEl.innerText = secondsStr
    }

    // Play button → start countdown
    playBtn.addEventListener("click", () => {
      if (!intervalId) {
        intervalId = setInterval(updateCountdown, 1000)
      }
    })

    // Stop button → pause countdown
    stopBtn.addEventListener("click", () => {
      clearInterval(intervalId)
      intervalId = null
    })

    // Reset button → clear countdown display
    resetBtn.addEventListener("click", () => {
      clearInterval(intervalId)
      intervalId = null
      daysEl.innerText = "00"
      hoursEl.innerText = "00"
      minutesEl.innerText = "00"
      secondsEl.innerText = "00"
    })
  }
})



