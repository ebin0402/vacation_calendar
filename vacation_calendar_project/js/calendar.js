
// Calendar state
const CalendarState = {
    tse: { year: new Date().getFullYear(), month: new Date().getMonth() },
    pse: { year: new Date().getFullYear(), month: new Date().getMonth() },
    manager: { year: new Date().getFullYear(), month: new Date().getMonth() }
};

// Render calendar for a specific role
function renderCalendar(role) {
    const state = CalendarState[role];
    const calendar = document.getElementById(`${role}Calendar`);
    const monthYear = document.getElementById(`${role}MonthYear`);
    
    const firstDay = new Date(state.year, state.month, 1);
    const lastDay = new Date(state.year, state.month + 1, 0);
    const prevLastDay = new Date(state.year, state.month, 0);
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    monthYear.textContent = `${monthNames[state.month]} ${state.year}`;
    
    let html = '';
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day header">${day}</div>`;
    });
    
    // Previous month days
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevLastDay.getDate() - i;
        html += `<div class="calendar-day other-month">${day}</div>`;
    }
    
    // Current month days
const today = new Date();
const vacations = Storage.getVacationsByRole(role.toUpperCase());

for (let day = 1; day <= lastDay.getDate(); day++) {
    const currentDate = new Date(state.year, state.month, day);
    const dateStr = currentDate.toISOString().split('T');

    let classes = 'calendar-day';
    if (currentDate.toDateString() === today.toDateString()) {
        classes += ' today';
    }

    // Check for vacations on this day
    const dayVacations = vacations.filter(v => {
        const start = new Date(v.startDate);
        const end = new Date(v.endDate);
        return currentDate >= start && currentDate <= end;
    });

    if (dayVacations.length > 0) {
        classes += ' has-vacation';
    }

    html += `<div class="${classes}">
        <div style="font-weight: bold; margin-bottom: 5px;">${day}</div>`;

    // Add names and vacation markers
    dayVacations.forEach(v => {
        const color = CONFIG.leaveTypes[v.leaveType];
        html += `<div style="font-size: 0.75em; padding: 2px; margin: 2px 0; background: ${color}; color: white; border-radius: 3px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${v.memberName} - ${v.leaveType}">${v.memberName}</div>`;
    });

    html += '</div>';
}
    
    // Next month days
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
        html += `<div class="calendar-day other-month">${i}</div>`;
    }
    
    calendar.innerHTML = html;
}

// Show vacations for a specific day
function showDayVacations(dateStr, role) {
    const date = new Date(dateStr);
    const vacations = Storage.getVacationsByRole(role.toUpperCase());
    
    const dayVacations = vacations.filter(v => {
        const start = new Date(v.startDate);
        const end = new Date(v.endDate);
        return date >= start && date <= end;
    });
    
    if (dayVacations.length === 0) {
        alert('No vacations on this day');
        return;
    }
    
    const dateFormatted = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    let message = `Vacations on ${dateFormatted}:

`;
    dayVacations.forEach(v => {
        message += `${v.memberName} - ${v.leaveType}
`;
    });
    
    alert(message);
}

// Navigate to previous month
function previousMonth(role) {
    const state = CalendarState[role];
    state.month--;
    if (state.month < 0) {
        state.month = 11;
        state.year--;
    }
    renderCalendar(role);
}

// Navigate to next month
function nextMonth(role) {
    const state = CalendarState[role];
    state.month++;
    if (state.month > 11) {
        state.month = 0;
        state.year++;
    }
    renderCalendar(role);
}

// Render all calendars
function renderAllCalendars() {
    renderCalendar('tse');
    renderCalendar('pse');
    renderCalendar('manager');
}

