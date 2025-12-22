
// Initialize the application
function initializeApp() {
    updateStats();
    renderVacationList();
    renderAllCalendars();
    loadNotes();
    renderChangeLogs();

    // Listen for real-time updates
    Storage.onVacationsChange(() => {
        updateStats();
        renderVacationList();
        renderAllCalendars();
    });
}

// Update statistics
function updateStats() {
    Storage.getVacations((vacations) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let totalDays = 0;
        let currentlyOff = 0;

        vacations.forEach(v => {
            const start = new Date(v.startDate);
            const end = new Date(v.endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            totalDays += days;

            if (today >= start && today <= end) {
                currentlyOff++;
            }
        });

        document.getElementById('totalVacations').textContent = vacations.length;
        document.getElementById('totalDays').textContent = totalDays;
        document.getElementById('currentlyOff').textContent = currentlyOff;
    });
}

// Show tab
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabMap = {
        'home': 'homeTab',
        'tse': 'tseTab',
        'pse': 'pseTab',
        'manager': 'managerTab'
    };
    
    document.getElementById(tabMap[tabName]).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Render calendar if switching to calendar tab
    if (tabName !== 'home') {
        renderCalendar(tabName);
    }
}

// Add vacation
function addVacation(event) {
    event.preventDefault();

    const memberName = document.getElementById('memberName').value;
    const role = document.getElementById('memberRole').value;
    const leaveType = document.getElementById('leaveType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
        alert('End date must be after start date');
        return;
    }

    // Check for overlaps
    Storage.checkOverlap(memberName, startDate, endDate, null, (overlap) => {
        if (overlap) {
            const overlapStart = new Date(overlap.startDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            const overlapEnd = new Date(overlap.endDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            alert(`${memberName} already has a vacation from ${overlapStart} to ${overlapEnd}`);
            return;
        }

        const vacation = {
            memberName,
            role,
            leaveType,
            startDate,
            endDate
        };

        Storage.addVacation(vacation, (addedVacation) => {
            Storage.addChangeLog('added', addedVacation);

            // Reset form
            document.getElementById('vacationForm').reset();

            // Update UI
            updateStats();
            renderVacationList();
            renderAllCalendars();
            renderChangeLogs();

            alert('Vacation added successfully!');
        });
    });
}

// Render vacation list
function renderVacationList() {
    Storage.getVacations((vacations) => {
        const container = document.getElementById('vacationList');

        if (vacations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No vacations scheduled yet</p>
                    <p>Add your first vacation using the form above</p>
                </div>
            `;
            return;
        }

        // Sort by start date
        vacations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let html = '';
        vacations.forEach(v => {
            const startDate = new Date(v.startDate);
            const endDate = new Date(v.endDate);

            const startFormatted = startDate.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            const endFormatted = endDate.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            const isCurrentlyOff = today >= startDate && today <= endDate;
            const leaveColor = CONFIG.leaveTypes[v.leaveType];

            html += `
                <div class="vacation-item ${v.role.toLowerCase()}" style="border-left: 5px solid ${leaveColor};">
                    <div class="vacation-info">
                        <h4>
                            ${v.memberName} (${v.role})
                            ${isCurrentlyOff ? '<span style="background: #27ae60; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.75em; margin-left: 10px;">Currently Off</span>' : ''}
                        </h4>
                        <p>
                            <span style="display: inline-block; width: 12px; height: 12px; background: ${leaveColor}; border-radius: 2px; margin-right: 5px;"></span>
                            <strong>${v.leaveType}</strong>: ${startFormatted} - ${endFormatted}
                        </p>
                    </div>
                    <button class="btn-delete" onclick="deleteVacation('${v.id}')">Delete</button>
                </div>
            `;
        });

        container.innerHTML = html;
    });
}

// Delete vacation
function deleteVacation(id) {
    if (!confirm('Are you sure you want to delete this vacation?')) {
        return;
    }

    Storage.deleteVacation(id, (vacation) => {
        Storage.addChangeLog('deleted', vacation);
        updateStats();
        renderVacationList();
        renderAllCalendars();
        renderChangeLogs();
    });
}

// Download CSV
function downloadCSV() {
    const startDate = document.getElementById('downloadStartDate').value;
    const endDate = document.getElementById('downloadEndDate').value;
    const role = document.getElementById('downloadRole').value;

    Storage.getVacations((allVacations) => {
        let vacations = allVacations;

        // Filter by date range
        if (startDate && endDate) {
            Storage.getVacationsInRange(startDate, endDate, role || null, (filtered) => {
                processCSVDownload(filtered);
            });
        } else if (role) {
            Storage.getVacationsByRole(role, (filtered) => {
                processCSVDownload(filtered);
            });
        } else {
            processCSVDownload(vacations);
        }
    });
}

function processCSVDownload(vacations) {
    if (vacations.length === 0) {
        alert('No vacations found for the selected criteria');
        return;
    }

    vacations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    function calculateDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    function getStatus(startDate, endDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (today >= start && today <= end) {
            return 'Currently Off';
        } else if (today > end) {
            return 'Completed';
        } else {
            return 'Upcoming';
        }
    }

    const csv = [
        ['Name', 'Role', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status'],
        ...vacations.map(v => [
            v.memberName,
            v.role.toUpperCase(),
            v.leaveType,
            v.startDate,
            v.endDate,
            calculateDays(v.startDate, v.endDate),
            getStatus(v.startDate, v.endDate)
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vacation-calendar-${new Date().toISOString().split('T')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Toggle collapsible section
function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
}

// Load notes from Firebase
function loadNotes() {
    database.ref('notes').once('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.content) {
            document.getElementById('notesEditor').innerHTML = data.content;
        }
    });
}

function formatText(command, value = null) {
    document.execCommand(command, false, value);
    saveNotes();
}

function insertTable() {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    
    if (!rows || !cols) return;
    
    let table = '<table border="1" style="border-collapse: collapse; width: 100%;"><tbody>';
    for (let i = 0; i < rows; i++) {
        table += '<tr>';
        for (let j = 0; j < cols; j++) {
            table += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>';
        }
        table += '</tr>';
    }
    table += '</tbody></table><p></p>';
    
    document.execCommand('insertHTML', false, table);
    saveNotes();
}

// Save notes to Firebase
function saveNotes() {
    const content = document.getElementById('notesEditor').innerHTML;
    const currentUser = Auth.getCurrentUser();
    const saveStatus = document.getElementById('saveStatus');

    // Show saving status
    if (saveStatus) {
        saveStatus.textContent = 'Saving...';
        saveStatus.style.color = '#95a5a6';
    }

    database.ref('notes').set({
        content: content,
        lastModified: new Date().toISOString(),
        modifiedBy: currentUser
    }).then(() => {
        if (saveStatus) {
            saveStatus.textContent = '✓ Saved';
            saveStatus.style.color = '#27ae60';
            setTimeout(() => {
                saveStatus.textContent = '';
            }, 2000);
        }
    }).catch((error) => {
        console.error('Error saving notes:', error);
        if (saveStatus) {
            saveStatus.textContent = '✗ Error saving';
            saveStatus.style.color = '#e74c3c';
        }
    });
}

function clearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        document.getElementById('notesEditor').innerHTML = '';
        saveNotes();
    }
}

// Auto-save notes
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('notesEditor');
    if (editor) {
        editor.addEventListener('input', saveNotes);
    }
});

function renderChangeLogs(filtered = null) {
    if (filtered) {
        displayChangeLogs(filtered);
    } else {
        Storage.getChangeLogs((logs) => {
            displayChangeLogs(logs);
        });
    }
}

function displayChangeLogs(logs) {
    const container = document.getElementById('changeLog');

    if (logs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No changes recorded yet</p>
                <p>Changes will appear here when vacations are added or removed</p>
            </div>
        `;
        return;
    }

    let html = '';
    logs.forEach(log => {
        const timestamp = new Date(log.timestamp).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const startDate = new Date(log.vacation.startDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        const endDate = new Date(log.vacation.endDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

        const borderColor = log.action === 'added' ? '#3498db' : '#e74c3c';
        const backgroundColor = log.action === 'added' ? '#ebf5fb' : '#fadbd8';

        html += `
            <div class="log-entry ${log.action}" style="border-left: 4px solid ${borderColor}; background: ${backgroundColor};">
                <strong>${log.user}</strong> ${log.action} vacation for
                <strong>${log.vacation.memberName}</strong> (${log.vacation.role})
                <br>
                ${log.vacation.leaveType}: ${startDate} - ${endDate}
                <div class="log-time">${timestamp}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function applyLogFilter() {
    const fromDate = document.getElementById('logFromDate').value;
    const toDate = document.getElementById('logToDate').value;

    if (!fromDate || !toDate) {
        alert('Please select both from and to dates');
        return;
    }

    Storage.getChangeLogs((logs) => {
        const filtered = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= new Date(fromDate) && logDate <= new Date(toDate);
        });
        renderChangeLogs(filtered);
    });
}

function clearLogFilter() {
    document.getElementById('logFromDate').value = '';
    document.getElementById('logToDate').value = '';
    renderChangeLogs();
}
