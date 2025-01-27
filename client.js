// Attendance Management
function clockIn() {
  const now = new Date();
  document.getElementById("attendance-status").textContent = `Clocked in at ${now.toLocaleTimeString()}`;
}

function clockOut() {
  const now = new Date();
  document.getElementById("attendance-status").textContent = `Clocked out at ${now.toLocaleTimeString()}`;
}

// Leave Management
document.getElementById("leave-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page reload

  const leaveType = document.getElementById("leave-type").value;
  const leaveStart = document.getElementById("leave-start").value;
  const leaveEnd = document.getElementById("leave-end").value;

  // Validate inputs
  if (!leaveType || !leaveStart || !leaveEnd) {
    document.getElementById("leave-status").textContent = "Please fill out all fields before submitting.";
    return;
  }

  const startDate = new Date(leaveStart);
  const endDate = new Date(leaveEnd);

  if (startDate > endDate) {
    document.getElementById("leave-status").textContent = "Leave start date cannot be after the end date.";
    return;
  }

  // Display confirmation message
  document.getElementById("leave-status").textContent = `Leave application submitted for ${leaveType} from ${leaveStart} to ${leaveEnd}.`;
});

// Utility: Reset attendance or leave status
function resetStatus() {
  document.getElementById("attendance-status").textContent = "";
  document.getElementById("leave-status").textContent = "";
}

// Example DOM elements for testing
document.body.innerHTML = `
  <div>
    <h2>Attendance Management</h2>
    <button onclick="clockIn()">Clock In</button>
    <button onclick="clockOut()">Clock Out</button>
    <p id="attendance-status"></p>
  </div>

  <div>
    <h2>Leave Management</h2>
    <form id="leave-form">
      <label for="leave-type">Leave Type:</label>
      <select id="leave-type">
        <option value="">--Select Leave Type--</option>
        <option value="Casual Leave">Casual Leave</option>
        <option value="Sick Leave">Sick Leave</option>
        <option value="Annual Leave">Annual Leave</option>
      </select><br><br>

      <label for="leave-start">Leave Start Date:</label>
      <input type="date" id="leave-start"><br><br>

      <label for="leave-end">Leave End Date:</label>
      <input type="date" id="leave-end"><br><br>

      <button type="submit">Submit Leave Application</button>
    </form>
    <p id="leave-status"></p>
  </div>

  <button onclick="resetStatus()">Reset Status</button>
`;
