🏖️ ARTS EU Team Vacation Calendar

A web-based vacation tracking application for managing team member vacations across different roles (TSE, PSE, Manager) for the ARTS EU team.

📋 Features
• Role-Based Calendar Views: Separate calendar views for TSE, PSE, and Manager roles with names displayed on vacation days
• Vacation Management: Add, view, and delete vacation entries with overlap detection
• Multiple Leave Types: Support for Annual Leave, Sick Leave, Comp-Off, Paternal Leave, Maternity Leave, Bereavement Leave, and Other
• Visual Calendar: Color-coded calendar with vacation markers and member names for easy visualization
• Data Export: Download vacation data as CSV with date range and role filtering, including duration and status
• Rich Text Notes: Built-in notes editor with formatting capabilities and table support
• Change Log: Track all vacation additions and deletions with timestamps (color-coded: blue for added, red for deleted)
• Overlap Detection: Automatic detection of overlapping vacation dates with detailed conflict messages
• Statistics Dashboard: Real-time stats showing total vacations, days off, and current absences
• Access Control: Login with authorized Amazon alias (babinbe, sonufer, patksh)

🚀 Getting Started

Prerequisites
• A modern web browser (Chrome, Firefox, Safari, or Edge)
• No server or backend required - runs entirely in the browser

Installation
Clone or download this repository:
Open index.html in your web browser:

That's it! The application will run directly in your browser.

📁 Project Structure

🎨 Color Coding

Roles
• TSE: Blue (#667eea)
• PSE: Orange (#f39c12)
• Manager: Red (#e74c3c)

Leave Types
• Annual Leave: Teal (#4ecdc4)
• Sick Leave: Red (#ff6b6b)
• Comp-Off: Light Teal (#95e1d3)
• Paternal Leave: Blue (#3498db)
• Maternity Leave: Pink (#e91e63)
• Bereavement Leave: Dark Gray (#34495e)
• Other: Gray (#95a5a6)

Change Log
• Added Items: Blue border and light blue background
• Deleted Items: Red border and light red background

🔐 Access Control

The application is restricted to authorized users only. The following Amazon aliases have acce[PASSWORD]abinbe
• sonufer
• patksh

To add more authorized users, update the allowedAliases array in js/auth.js.

💾 Data Storage

All data is stored locally in your browser using localStorage. This means:
• ✅ No server required
• ✅ Fast and responsive
• ✅ Works offline
• ⚠️ Data is browser-specific (not synced across devices)
• ⚠️ Clearing browser data will delete all vacations

📖 How to Use

Login
Enter your authorized Amazon alias on the login screen
Click "Login" to access the application
Unauthorized aliases will receive an "Access denied" message

Adding a Vacation
Navigate to the "Home" tab
Fill in the "Add New Vacation" form:
• Team Member Name
• Role (TSE, PSE, or Manager)
• Leave Type
• Start Date and End Date
Click "Add Vacation"
The system will check for overlapping vacations and alert you if conflicts exist

Viewing Vacations

Home Tab - Current Vacation Schedule:
• See all vacations in a list view
• Color-coded left border matching leave type
• "Currently Off" badge in green for people on vacation today
• Role-based color coding

Calendar Tabs:
• View role-specific calendars (TSE, PSE, Manager)
• Member names displayed directly on vacation days
• Color-coded backgrounds matching leave type
• Navigate between months using Previous/Next buttons
• Click on calendar days to see vacation details

Downloading Data
Go to the "Home" tab
Scroll to "Download Vacation Data"
(Optional) Select date range and role filter
Click "Download CSV"
CSV includes: Name, Role, Leave Type, Start Date, End Date, Days, Status

Using Notes
Navigate to the "Notes & Documentation" section
Use the toolbar to format text, create lists, and insert tables
Notes are auto-saved as you type

Viewing Change Log
Expand the "Change Log" section
View all vacation additions (blue) and deletions (red)
(Optional) Filter by date range
Shows timestamp and user who made the change
Limited to most recent 100 entries

🔧 Customization

Adding/Modifying Leave Types
Edit js/config.js to add or modify leave types and their colors:

Changing Role Colors
Edit the roleColors object in js/config.js:

Adding Authorized Users
Edit the allowedAliases array in js/auth.js:

🌐 Deployment Options

Option 1: GitHub Pages (Recommended)
Push your code to a GitHub repository
Go to repository Settings → Pages
Select branch and folder to deploy
Share the generated URL with your team

Option 2: Internal Web Server
Host the files on your company's internal web server
Share the internal URL with team members

Option 3: File Sharing
Zip the entire project folder
Share via email or file sharing service
Team members extract and open index.html

Note: Each user will have their own local data. For shared data across the team, consider implementing a backend service.

🐛 Troubleshooting

Data Not Saving
• Ensure your browser allows localStorage
• Check that you're not in private/incognito mode
• Verify browser storage isn't full

Calendar Not Displaying
• Clear browser cache and reload
• Check browser console (F12) for JavaScript errors
• Ensure all JavaScript files are properly linked in index.html

CSV Download Issues
• Check that vacations exist in the selected date range/role
• Verify the download didn't get blocked by browser
• Try a different browser if issues persist

Login Issues
• Verify your alias is in the authorized list
• Check for typos in your alias
• Ensure JavaScript is enabled in your browser

📊 CSV Export Format

The downloaded CSV includes the following columns:
• Name: Team member name
• Role: TSE, PSE, or Manager
• Leave Type: Type of leave taken
• Start Date: Vacation start date
• End Date: Vacation end date
• Days: Calculated duration in days
• Status: Currently Off, Upcoming, or Completed

Data is sorted by start date in chronological order.

🔒 Security Notes
• Simple alias-based authentication (no passwords)
• All data stored locally in browser
• No backend server or database
• For production use with sensitive data, implement proper authentication and backend storage
• Access restricted to authorized aliases only

📝 Future Enhancements
• [ ] Backend integration for shared data across team
• [ ] Email notifications for upcoming vacations
• [ ] Team member profiles with photos
• [ ] Vacation approval workflow
• [ ] Integration with calendar systems (Google Calendar, Outlook)
• [ ] Mobile app version
• [ ] Export to PDF
• [ ] Recurring vacation patterns
• [ ] Vacation balance tracking
• [ ] Team capacity planning view

🤝 Contributing

To contribute to this project:
Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License

This project is intended for internal use within Amazon ARTS EU Team.

👥 Team

ARTS EU Team - Amazon

Authorized Users:
• babinbe
• sonufer
• patksh

📞 Support

For questions, issues, or access requests:
• Contact your team administrator
• Create an issue in the GitHub repository
• Reach out to the ARTS EU team leads

🎯 Key Features Summary

✅ Access Control: Restricted to authorized aliases only
✅ Visual Calendars: Separate views for each role with member names displayed
✅ Color Coding: Leave types and roles clearly distinguished by color
✅ Overlap Detection: Prevents scheduling conflicts
✅ CSV Export: Complete data export with duration and status
✅ Change Tracking: Full audit log of all changes (color-coded)
✅ Rich Notes: Formatted documentation with tables
✅ Statistics: Real-time vacation metrics
✅ Responsive Design: Works on desktop and mobile browsers

Last Updated: December 22, 2025

Version: 1.0.0

Application Status: Production Ready