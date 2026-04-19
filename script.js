// Parking Management System JavaScript

// Data storage keys
const STORAGE_KEYS = {
    USERS: 'parking_users',
    MEMBERS: 'parking_members',
    VEHICLES: 'parking_vehicles',
    PARKING: 'parking_records',
    SETTINGS: 'parking_settings',
    CURRENT_USER: 'current_user'
};

// Default settings
const DEFAULT_SETTINGS = {
    costPerHour: 100,
    totalBlocks: 3,
    rowsPerBlock: 5,
    slotsPerRow: 4
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupEventListeners();
    checkLoginStatus();
});

// Initialize data in localStorage
function initializeData() {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    if (!users || !users.find(u => u.username === 'admin@123' && u.role === 'admin')) {
        const defaultUsers = [
            { id: 1, email: 'admin@parking.com', username: 'admin@123', password: 'admin123', role: 'admin' },
            { id: 2, email: 'user@parking.com', username: 'user', password: 'user123', role: 'user' }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PARKING)) {
        localStorage.setItem(STORAGE_KEYS.PARKING, JSON.stringify([]));
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgotPasswordFormElement');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }

    // Member form
    const memberForm = document.getElementById('memberForm');
    if (memberForm) {
        memberForm.addEventListener('submit', handleAddMember);
    }

    // Vehicle form
    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', handleAddVehicle);
    }

    // Entry form
    const entryForm = document.getElementById('entryForm');
    if (entryForm) {
        entryForm.addEventListener('submit', handleCheckIn);
    }

    // Exit form
    const exitForm = document.getElementById('exitForm');
    if (exitForm) {
        exitForm.addEventListener('submit', handleCheckOut);
    }

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSaveSettings);
        loadSettings();
    }

    // Logout buttons
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation
    setupNavigation();
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active class from nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Add active class to nav link
    const targetLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Load section data
    loadSectionData(sectionId);
}

// Load section data
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'profile':
            loadUserProfile();
            break;
        case 'members':
            loadMembers();
            break;
        case 'vehicles':
            loadVehicles();
            break;
        case 'parking':
            loadParking();
            break;
        case 'reports':
            loadReports();
            break;
        case 'adminDashboard':
            loadAdminDashboard();
            break;
        case 'adminUsers':
            loadAdminUsers();
            break;
    }
}

// Check login status
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (currentUser) {
        if (currentUser.role === 'admin') {
            showAdminDashboard();
        } else {
            showMainApp();
        }
    }
}

// Switch login mode
function switchLoginMode(mode) {
    const userBtn = document.getElementById('userModeBtn');
    const adminBtn = document.getElementById('adminModeBtn');
    const loginTitle = document.getElementById('loginTitle');
    const emailLabel = document.getElementById('emailLabel');

    if (mode === 'user') {
        userBtn.classList.add('active');
        adminBtn.classList.remove('active');
        loginTitle.textContent = 'User Login';
        emailLabel.textContent = 'Email:';
    } else {
        adminBtn.classList.add('active');
        userBtn.classList.remove('active');
        loginTitle.textContent = 'Admin Login';
        emailLabel.textContent = 'Username:';
    }
}

// Show signup form
function showSignupForm(event) {
    event.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

// Show login form
function showLoginForm(event) {
    event.preventDefault();
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('forgotPasswordForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// Show forgot password form
function showForgotPasswordForm(event) {
    event.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('forgotPasswordForm').classList.add('active');
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isAdmin = document.getElementById('adminModeBtn').classList.contains('active');
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    let user = null;
    
    if (isAdmin) {
        user = users.find(u => u.username === email && u.role === 'admin');
    } else {
        user = users.find(u => u.email === email && u.role === 'user');
    }
    
    if (user && user.password === password) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        if (user.role === 'admin') {
            showAdminDashboard();
        } else {
            showMainApp();
        }
    } else {
        alert('Invalid credentials');
    }
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    
    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
        alert('User already exists');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        email,
        username,
        password,
        role: 'user'
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    alert('Account created successfully! Please login.');
    showLoginForm(event);
}

// Handle forgot password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    const user = users.find(u => u.email === email);
    
    if (user) {
        alert(`Password reset link sent to ${email}. (Note: This is a demo - password is: ${user.password})`);
    } else {
        alert('Email not found');
    }
}

// Show main app
function showMainApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    showSection('profile');
}

// Switch login mode
function switchLoginMode(mode) {
    const userBtn = document.getElementById('userModeBtn');
    const adminBtn = document.getElementById('adminModeBtn');
    const loginTitle = document.getElementById('loginTitle');
    const emailLabel = document.getElementById('emailLabel');

    if (mode === 'user') {
        userBtn.classList.add('active');
        adminBtn.classList.remove('active');
        loginTitle.textContent = 'User Login';
        emailLabel.textContent = 'Email:';
    } else {
        adminBtn.classList.add('active');
        userBtn.classList.remove('active');
        loginTitle.textContent = 'Admin Login';
        emailLabel.textContent = 'Username:';
    }
}

// Show signup form
function showSignupForm(event) {
    event.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

// Show login form
function showLoginForm(event) {
    event.preventDefault();
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('forgotPasswordForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// Show forgot password form
function showForgotPasswordForm(event) {
    event.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('forgotPasswordForm').classList.add('active');
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    
    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
        alert('User already exists');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        email,
        username,
        password,
        role: 'user'
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    alert('Account created successfully! Please login.');
    showLoginForm(event);
}

// Handle forgot password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    const user = users.find(u => u.email === email);
    
    if (user) {
        alert(`Password reset link sent to ${email}. (Note: This is a demo - password is: ${user.password})`);
    } else {
        alert('Email not found');
    }
}

// Show main app
function showMainApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    showSection('profile');
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    showSection('adminDashboard');
}

// Handle logout
function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('loginContainer').classList.add('active');
}

// Load user profile
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (!currentUser) return;
    
    document.getElementById('userNameDisplay').textContent = currentUser.username;
    document.getElementById('userEmailDisplay').textContent = currentUser.email;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileLoginTime').textContent = new Date().toLocaleString();
    document.getElementById('profileLastUpdated').textContent = new Date().toLocaleString();
    
    // Load user vehicles
    loadUserVehicles();
    
    // Load user parking history
    loadUserParkingHistory();
}

// Load user vehicles
function loadUserVehicles() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
    const userVehicles = vehicles.filter(v => v.memberId == currentUser.id);
    
    const container = document.getElementById('userVehiclesList');
    container.innerHTML = '';
    
    if (userVehicles.length === 0) {
        container.innerHTML = '<p class="empty-message">No vehicles registered yet</p>';
        return;
    }
    
    userVehicles.forEach(vehicle => {
        const vehicleDiv = document.createElement('div');
        vehicleDiv.className = 'vehicle-item';
        vehicleDiv.innerHTML = `
            <h4>${vehicle.name} (${vehicle.model})</h4>
            <p><strong>Reg No:</strong> ${vehicle.regNo}</p>
            <p><strong>Color:</strong> ${vehicle.color}</p>
        `;
        container.appendChild(vehicleDiv);
    });
}

// Load user parking history
function loadUserParkingHistory() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    const parking = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARKING));
    const userParking = parking.filter(p => p.memberId == currentUser.id);
    
    const tbody = document.querySelector('#userParkingTable tbody');
    tbody.innerHTML = '';
    
    userParking.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.vehicleName}</td>
            <td>${record.checkIn}</td>
            <td>${record.checkOut || '-'}</td>
            <td>${record.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle add member
function handleAddMember(event) {
    event.preventDefault();
    
    const cnic = document.getElementById('mCnic').value;
    const name = document.getElementById('mName').value;
    const fname = document.getElementById('mFname').value;
    const contact = document.getElementById('mContact').value;
    const address = document.getElementById('mAddress').value;
    
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    const newMember = {
        id: Date.now(),
        cnic,
        name,
        fname,
        contact,
        address
    };
    
    members.push(newMember);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    
    // Clear form
    event.target.reset();
    
    // Reload members
    loadMembers();
    
    alert('Member added successfully!');
}

// Load members
function loadMembers() {
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    const tbody = document.querySelector('#membersTable tbody');
    tbody.innerHTML = '';
    
    members.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.cnic}</td>
            <td>${member.name}</td>
            <td>${member.fname}</td>
            <td>${member.contact}</td>
            <td>${member.address}</td>
            <td><button onclick="deleteMember(${member.id})" class="btn btn-danger">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
    
    // Update vehicle form member options
    updateMemberOptions();
}

// Delete member
function deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
        const filtered = members.filter(m => m.id != id);
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(filtered));
        loadMembers();
    }
}

// Update member options
function updateMemberOptions() {
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    const selects = ['vMemberId', 'eMemberId'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Member</option>';
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = `${member.name} (${member.cnic})`;
                select.appendChild(option);
            });
        }
    });
}

// Handle add vehicle
function handleAddVehicle(event) {
    event.preventDefault();
    
    const memberId = document.getElementById('vMemberId').value;
    const regNo = document.getElementById('vRegno').value;
    const engNo = document.getElementById('vEngno').value;
    const name = document.getElementById('vName').value;
    const model = document.getElementById('vModel').value;
    const color = document.getElementById('vColor').value;
    const chassis = document.getElementById('vChassis').value;
    
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
    const newVehicle = {
        id: Date.now(),
        memberId: parseInt(memberId),
        regNo,
        engNo,
        name,
        model,
        color,
        chassis
    };
    
    vehicles.push(newVehicle);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    
    // Clear form
    event.target.reset();
    
    // Reload vehicles
    loadVehicles();
    
    alert('Vehicle added successfully!');
}

// Load vehicles
function loadVehicles() {
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    const tbody = document.querySelector('#vehiclesTable tbody');
    tbody.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const member = members.find(m => m.id == vehicle.memberId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.id}</td>
            <td>${member ? member.name : 'Unknown'}</td>
            <td>${vehicle.regNo}</td>
            <td>${vehicle.engNo}</td>
            <td>${vehicle.name}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.color}</td>
            <td><button onclick="deleteVehicle(${vehicle.id})" class="btn btn-danger">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Delete vehicle
function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
        const filtered = vehicles.filter(v => v.id != id);
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(filtered));
        loadVehicles();
    }
}

// Load parking
function loadParking() {
    const parking = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARKING));
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
    const tbody = document.querySelector('#parkingTable tbody');
    tbody.innerHTML = '';
    
    parking.forEach(record => {
        const member = members.find(m => m.id == record.memberId);
        const vehicle = vehicles.find(v => v.id == record.vehicleId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${member ? member.name : 'Unknown'}</td>
            <td>${vehicle ? vehicle.name : 'Unknown'}</td>
            <td>${record.slot}</td>
            <td>${record.checkIn}</td>
            <td>${record.checkOut || '-'}</td>
            <td>${record.status}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update parking slot options
    updateParkingSlots();
}

// Update parking slots
function updateParkingSlots() {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    const parking = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARKING));
    const select = document.getElementById('eParkingSlot');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Slot</option>';
    
    const totalSlots = settings.totalBlocks * settings.rowsPerBlock * settings.slotsPerRow;
    
    for (let i = 1; i <= totalSlots; i++) {
        const occupied = parking.some(p => p.slot == `Slot ${i}` && p.status === 'Active');
        if (!occupied) {
            const option = document.createElement('option');
            option.value = `Slot ${i}`;
            option.textContent = `Slot ${i}`;
            select.appendChild(option);
        }
    }
}

// Handle check in
function handleCheckIn(event) {
    event.preventDefault();
    
    const memberId = document.getElementById('eMemberId').value;
    const slot = document.getElementById('eParkingSlot').value;
    
    const parking = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARKING));
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
    
    // Get member's vehicles
    const memberVehicles = vehicles.filter(v => v.memberId == memberId);
    if (memberVehicles.length === 0) {
        alert('No vehicles registered for this member');
        return;
    }
    
    // For simplicity, use the first vehicle
    const vehicle = memberVehicles[0];
    
    const newRecord = {
        id: Date.now(),
        memberId: parseInt(memberId),
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        slot,
        checkIn: new Date().toLocaleString(),
        checkOut: null,
        status: 'Active'
    };
    
    parking.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.PARKING, JSON.stringify(parking));
    
    // Clear form
    event.target.reset();
    
    // Reload parking
    loadParking();
    
    alert('Vehicle checked in successfully!');
}

// Handle check out
function handleCheckOut(event) {
    event.preventDefault();
    
    const parkingId = document.getElementById('exitParkingId').value;
    const parking = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARKING));
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    
    const record = parking.find(p => p.id == parkingId && p.status === 'Active');
    if (!record) {
        alert('Invalid parking ID or vehicle not checked in');
        return;
    }
    
    // Calculate cost
    const checkInTime = new Date(record.checkIn);
    const checkOutTime = new Date();
    const hours = Math.ceil((checkOutTime - checkInTime) / (1000 * 60 * 60));
    const cost = hours * settings.costPerHour;
    
    record.checkOut = checkOutTime.toLocaleString();
    record.status = 'Completed';
    record.cost = cost;
    
    localStorage.setItem(STORAGE_KEYS.PARKING, JSON.stringify(parking));
    
    // Clear form
    event.target.reset();
    
    // Reload parking
    loadParking();
    
    alert(`Vehicle checked out successfully! Total cost: ₨${cost}`);
}

// Load reports
function loadReports() {
    const parking = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARKING));
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    
    // Parking arena details
    const totalSlots = settings.totalBlocks * settings.rowsPerBlock * settings.slotsPerRow;
    const occupiedSlots = parking.filter(p => p.status === 'Active').length;
    const availableSlots = totalSlots - occupiedSlots;
    
    document.getElementById('parkingArenaDetails').innerHTML = `
        <p><strong>Total Parking Slots:</strong> ${totalSlots}</p>
        <p><strong>Available Slots:</strong> ${availableSlots}</p>
        <p><strong>Occupied Slots:</strong> ${occupiedSlots}</p>
        <p><strong>Occupancy Rate:</strong> ${((occupiedSlots / totalSlots) * 100).toFixed(1)}%</p>
    `;
    
    // Revenue report
    const completedParking = parking.filter(p => p.status === 'Completed');
    const totalRevenue = completedParking.reduce((sum, p) => sum + (p.cost || 0), 0);
    const totalVehicles = completedParking.length;
    
    document.getElementById('revenueReport').innerHTML = `
        <p><strong>Total Vehicles Parked:</strong> ${totalVehicles}</p>
        <p><strong>Total Revenue:</strong> ₨${totalRevenue}</p>
        <p><strong>Average Revenue per Vehicle:</strong> ₨${totalVehicles > 0 ? (totalRevenue / totalVehicles).toFixed(2) : 0}</p>
    `;
}

// Load admin dashboard
function loadAdminDashboard() {
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
    const parking = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARKING));
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    
    document.getElementById('adminTotalMembers').textContent = members.length;
    document.getElementById('adminTotalVehicles').textContent = vehicles.length;
    document.getElementById('adminActiveParkings').textContent = parking.filter(p => p.status === 'Active').length;
    
    const totalRevenue = parking.filter(p => p.status === 'Completed').reduce((sum, p) => sum + (p.cost || 0), 0);
    document.getElementById('adminTotalRevenue').textContent = `₨${totalRevenue}`;
    
    const totalSlots = settings.totalBlocks * settings.rowsPerBlock * settings.slotsPerRow;
    const availableSlots = totalSlots - parking.filter(p => p.status === 'Active').length;
    const occupiedSlots = parking.filter(p => p.status === 'Active').length;
    
    document.getElementById('totalSlots').textContent = totalSlots;
    document.getElementById('availableSlots').textContent = availableSlots;
    document.getElementById('occupiedSlots').textContent = occupiedSlots;
}

// Load admin users
function loadAdminUsers() {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
    const tbody = document.querySelector('#adminUsersTable tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        // Find member with same id
        const member = members.find(m => m.id == user.id);
        const cnic = member ? member.cnic : '-';
        
        // Find vehicles for this member
        const userVehicles = member ? vehicles.filter(v => v.memberId == member.id) : [];
        const vehicleNumbers = userVehicles.length > 0 ? userVehicles.map(v => v.regNo).join(', ') : '-';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${cnic}</td>
            <td>${vehicleNumbers}</td>
            <td>${user.role}</td>
            <td><button onclick="deleteUser(${user.id})" class="btn btn-danger">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Delete user
function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
        const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
        
        // Delete user
        const filteredUsers = users.filter(u => u.id != id);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
        
        // Delete associated member
        const filteredMembers = members.filter(m => m.id != id);
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(filteredMembers));
        
        // Delete associated vehicles
        const filteredVehicles = vehicles.filter(v => v.memberId != id);
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(filteredVehicles));
        
        loadAdminUsers();
        alert('User and associated data deleted successfully!');
    }
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    document.getElementById('costPerHour').value = settings.costPerHour;
    document.getElementById('totalBlocks').value = settings.totalBlocks;
    document.getElementById('rowsPerBlock').value = settings.rowsPerBlock;
    document.getElementById('slotsPerRow').value = settings.slotsPerRow;
}

// Handle save settings
function handleSaveSettings(event) {
    event.preventDefault();
    
    const settings = {
        costPerHour: parseInt(document.getElementById('costPerHour').value),
        totalBlocks: parseInt(document.getElementById('totalBlocks').value),
        rowsPerBlock: parseInt(document.getElementById('rowsPerBlock').value),
        slotsPerRow: parseInt(document.getElementById('slotsPerRow').value)
    };
    
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    alert('Settings saved successfully!');
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        localStorage.removeItem(STORAGE_KEYS.MEMBERS);
        localStorage.removeItem(STORAGE_KEYS.VEHICLES);
        localStorage.removeItem(STORAGE_KEYS.PARKING);
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.PARKING, JSON.stringify([]));
        location.reload();
    }
}

// Edit user profile (placeholder)
function editUserProfile() {
    alert('Edit profile functionality would be implemented here');
}

// Change password (placeholder)
function changePassword() {
    alert('Change password functionality would be implemented here');
}