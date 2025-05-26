// Utility: Append message to Terminal Log
function logToTerminal(message, isError = false) {
  const terminalLog = document.getElementById("terminal-log");
  const line = document.createElement("div");

  const timestamp = new Date().toLocaleTimeString();
  line.textContent = `[${timestamp}] ${isError ? "ERROR: " : ""}${message}`;
  line.style.color = isError ? "red" : "green";

  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

// Attendance Actions
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

// Leave Form Submission
function handleLeaveSubmission(event) {
  event.preventDefault();

  const leaveType = document.getElementById("leave-type").value;
  const leaveStart = document.getElementById("leave-start").value;
  const leaveEnd = document.getElementById("leave-end").value;

  const leaveStatus = document.getElementById("leave-status");

  if (!leaveType || !leaveStart || !leaveEnd) {
    const errorMsg = "Please fill out all fields before submitting.";
    leaveStatus.textContent = errorMsg;
    logToTerminal(errorMsg, true);
    return;
  }

  const startDate = new Date(leaveStart);
  const endDate = new Date(leaveEnd);

  if (startDate > endDate) {
    const errorMsg = "Leave start date cannot be after the end date.";
    leaveStatus.textContent = errorMsg;
    logToTerminal(errorMsg, true);
    return;
  }

  const successMsg = `Leave application submitted for ${leaveType} from ${leaveStart} to ${leaveEnd}.`;
  leaveStatus.textContent = successMsg;
  logToTerminal(successMsg);
}

// Status Reset
function resetStatus() {
  try {
    document.getElementById("attendance-status").textContent = "";
    document.getElementById("leave-status").textContent = "";
    logToTerminal("Status reset successfully.");
  } catch (error) {
    logToTerminal("Failed to reset status: " + error.message, true);
  }
}

// Initialize DOM elements and event listeners
document.body.innerHTML = `
  <header style="background:#007bff; color:#fff; padding:10px; text-align:center;">
    <h1>E-HRMS - Attendance & Leave Portal</h1>
  </header>

  <section style="margin:20px 0; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
    <h2>Attendance Management</h2>
    <button onclick="clockIn()">Clock In</button>
    <button onclick="clockOut()">Clock Out</button>
    <p id="attendance-status"></p>
  </section>

  <section style="margin:20px 0; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
    <h2>Leave Management</h2>
    <form id="leave-form">
      <label for="leave-type">Leave Type:</label>
      <select id="leave-type" required>
        <option value="">--Select Leave Type--</option>
        <option value="Casual Leave">Casual Leave</option>
        <option value="Sick Leave">Sick Leave</option>
        <option value="Annual Leave">Annual Leave</option>
      </select><br><br>

      <label for="leave-start">Leave Start Date:</label>
      <input type="date" id="leave-start" required><br><br>

      <label for="leave-end">Leave End Date:</label>
      <input type="date" id="leave-end" required><br><br>

      <button type="submit">Submit Leave Application</button>
    </form>
    <p id="leave-status"></p>
  </section>

  <section style="text-align:center; margin-top:10px;">
    <button onclick="resetStatus()">Reset Status</button>
  </section>

  <section style="margin-top:20px; padding:10px; background:#000; color:#fff; font-family:monospace; border-radius:8px;">
    <h3 style="margin-top:0;">Terminal Logs</h3>
    <div id="terminal-log" style="max-height:150px; overflow-y:auto;"></div>
  </section>
`;

// Register event listeners
document.getElementById("leave-form").addEventListener("submit", handleLeaveSubmission);
