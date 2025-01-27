// Utility: Terminal Log Function
function logToTerminal(message, isError = false) {
  const terminalLog = document.getElementById("terminal-log");
  const line = document.createElement("div");

  const timestamp = new Date().toLocaleTimeString();
  line.textContent = `[${timestamp}] ${isError ? "ERROR: " : ""}${message}`;
  line.style.color = isError ? "red" : "green";

  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight; // Auto-scroll to the latest log
}

// Attendance Management
function clockIn() {
  try {
    const now = new Date();
    const status = `Clocked in at ${now.toLocaleTimeString()}`;
    document.getElementById("attendance-status").textContent = status;
    logToTerminal(status);
  } catch (error) {
    logToTerminal("Failed to clock in: " + error.message, true);
  }
}

function clockOut() {
  try {
    const now = new Date();
    const status = `Clocked out at ${now.toLocaleTimeString()}`;
    document.getElementById("attendance-status").textContent = status;
    logToTerminal(status);
  } catch (error) {
    logToTerminal("Failed to clock out: " + error.message, true);
  }
}

// Leave Management
document.getElementById("leave-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent page reload

  try {
    const leaveType = document.getElementById("leave-type").value;
    const leaveStart = document.getElementById("leave-start").value;
    const leaveEnd = document.getElementById("leave-end").value;

    // Validate inputs
    if (!leaveType || !leaveStart || !leaveEnd) {
      const error = "Please fill out all fields before submitting.";
      document.getElementById("leave-status").textContent = error;
      logToTerminal(error, true);
      return;
    }

    const startDate = new Date(leaveStart);
    const endDate = new Date(leaveEnd);

    if (startDate > endDate) {
      const error = "Leave start date cannot be after the end date.";
      document.getElementById("leave-status").textContent = error;
      logToTerminal(error, true);
      return;
    }

    // Display confirmation message
    const success = `Leave application submitted for ${leaveType} from ${leaveStart} to ${leaveEnd}.`;
    document.getElementById("leave-status").textContent = success;
    logToTerminal(success);
  } catch (error) {
    logToTerminal("Failed to submit leave application: " + error.message, true);
  }
});

// Utility: Reset attendance or leave status
function resetStatus() {
  try {
    document.getElementById("attendance-status").textContent = "";
    document.getElementById("leave-status").textContent = "";
    logToTerminal("Status reset successfully.");
  } catch (error) {
    logToTerminal("Failed to reset status: " + error.message, true);
  }
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

  <div id="terminal" style="margin-top: 20px; background-color: black; color: white; font-family: monospace; padding: 10px; height: 200px; overflow-y: auto;">
    <h3>Terminal Logs</h3>
    <div id="terminal-log" style="overflow-y: auto; max-height: 150px;"></div>
  </div>
`;
