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
  event.preventDefault();
  const leaveType = document.getElementById("leave-type").value;
  const leaveStart = document.getElementById("leave-start").value;
  const leaveEnd = document.getElementById("leave-end").value;

  document.getElementById("leave-status").textContent = `Leave application submitted for ${leaveType} from ${leaveStart} to ${leaveEnd}.`;
});

// More DOM-related functionality here...
