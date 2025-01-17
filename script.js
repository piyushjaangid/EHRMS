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
  
  // Payroll Management
  function generatePayslip() {
    const payslip = `
      <h3>Payslip</h3>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Position:</strong> Software Engineer</p>
      <p><strong>Salary:</strong> $5,000</p>
    `;
    document.getElementById("payslip").innerHTML = payslip;
  }
  
  // Reports and Analytics
  function generateReport() {
    document.getElementById("report-output").textContent = "Attendance Report: All employees present today.";
  }
  
  // Self-Service Portal
  function viewPayslip() {
    document.getElementById("self-service-output").textContent = "Payslip for January 2025: $5,000.";
  }
  
  function applyLeave() {
    document.getElementById("self-service-output").textContent = "Redirecting to Leave Application...";
  }
  