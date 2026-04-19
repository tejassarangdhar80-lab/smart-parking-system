# Parking Management System

This is a comprehensive parking management system built with HTML, CSS, and JavaScript. It features user authentication, member management, vehicle registration, parking tracking, and admin dashboard.

## Features

- **User Authentication**: Login, signup, and password reset functionality
- **Admin Dashboard**: System overview, user management, and settings
- **Member Management**: Add, view, and delete members
- **Vehicle Management**: Register vehicles for members
- **Parking Management**: Check-in/check-out vehicles with automatic billing
- **Reports**: Parking statistics and revenue reports
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Local Storage for data persistence

## Getting Started

1. Open `index.html` in a web browser
2. The system will initialize with default data

## Default Credentials

- **Admin**: 
  - Username: admin@123
  - Password: admin123
- **User**: 
  - Email: user@parking.com
  - Password: user123

## How to Use

### For Users:
1. Login with user credentials
2. View your profile and parking history
3. Add members and register vehicles
4. Check vehicles in and out of parking

### For Admins:
1. Login with admin credentials
2. View system statistics and manage users
3. Configure parking settings
4. Generate reports

## Data Storage

The system uses browser localStorage to store data:
- User accounts
- Member information
- Vehicle registrations
- Parking records
- System settings

**Note**: Data is stored locally in the browser and will be lost if browser data is cleared.

## Features Overview

### Authentication
- User/Admin login modes
- Account registration
- Password reset (demo functionality)

### Dashboard
- Real-time statistics
- Parking slot availability
- Revenue tracking

### Management Modules
- **Members**: CNIC, name, contact, address management
- **Vehicles**: Registration, engine details, vehicle information
- **Parking**: Automated check-in/out with cost calculation

### Admin Features
- System configuration (cost per hour, parking layout)
- User management
- Data clearing functionality

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

- Database integration
- Real-time notifications
- Payment gateway integration
- Mobile app version
- Advanced reporting