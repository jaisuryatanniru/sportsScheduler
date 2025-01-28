import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  Button,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [activeFeature, setActiveFeature] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [sportName, setSportName] = useState('');
  const [loading, setLoading] = useState(false);

  const [sessionName, setSessionName] = useState('');
  const [newSession, setNewSession] = useState({
    sport: '',
    team1: '',
    team2: '',
    additionalPlayers: '',
    date: '',
    time: '',
    venue: '',
  });
  const [team1Players, setTeam1Players] = useState('');
  const [team2Players, setTeam2Players] = useState('');
  const [playersNeeded, setPlayersNeeded] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessions, setSessions] = useState([]); 
  const [mySessions, setMySessions] = useState([]); 
  const [venue, setVenue] = useState('');
  const [loadingSession, setLoadingSession] = useState(false);

  const [reports, setReports] = useState({ sessionCount: 0, popularSports: [] });
  const [loadingReports, setLoadingReports] = useState(false);

  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'create-sports', label: 'Create Sports', icon: <SportsBasketballIcon /> },
    { id: 'create-sessions', label: 'Create Sessions', icon: <EventIcon /> },
    { id: 'reports', label: 'View Reports', icon: <AssessmentIcon /> },
    { id: 'profile', label: 'Profile', icon: <AccountCircleIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: 'logout', label: 'Sign Out', icon: <LogoutIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCreateSport = async () => {
    if (!sportName.trim()) {
      alert('Sport name cannot be empty');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/authentication/admin/createSport', {
        name: sportName,
      });
      alert(response.data.message);
      setSportName('');
      
    } catch (error) {
      console.error('Error creating sport:', error);
      alert(error.response?.data?.message || 'Failed to create sport');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateSession = async () => {
    if (
      sessionName &&
      team1Players &&
      team2Players &&
      playersNeeded &&
      sessionDate &&
      sessionTime &&
      venue
    ) {
      setLoadingSession(true);
      try {
        const sessionData = {
          sport: sessionName,
          team1: team1Players,
          team2: team2Players,
          additionalPlayers: playersNeeded,
          date: sessionDate,
          time: sessionTime,
          venue,
          createdBy: "You", 
        };
  
        
        console.log("Session data being sent:", sessionData);
  
        
        const response = await axios.post(
          'http://localhost:5000/api/v1/authentication/admin/createSession',
          sessionData
        );
  
        
        alert(response.data.message);
  
        
        setSessionName('');
        setTeam1Players('');
        setTeam2Players('');
        setPlayersNeeded('');
        setSessionDate('');
        setSessionTime('');
        setVenue('');
      } catch (error) {
        console.error("Error creating session:", error.response ? error.response.data : error.message);
        alert('Failed to create session');
      } finally {
        setLoadingSession(false);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };
  
  
  useEffect(() => {
    if (activeFeature === 'reports') {
      fetchReports();
    }
  }, [activeFeature]);
  
  

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await axios.get('http://localhost:5000/api/v1/authentication/admin/getReports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeFeature) {
      case 'home':
        return (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <img
              src="https://via.placeholder.com/800x400"
              alt="Dashboard Overview"
              style={{ maxWidth: '100%', borderRadius: '10px' }}
            />
            <Typography variant="h4" sx={{ mt: 2 }}>
              Welcome, Admin!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Manage sports, sessions, and more.
            </Typography>
          </Box>
        );


        case 'create-sports':
  return (
    <Card sx={{ p: 3, width: '100%' }}>
      <Typography variant="h5">Create a Sport</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TextField
          label="Sport Name"
          value={sportName}
          onChange={(e) => setSportName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleCreateSport}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Sport'}
        </Button>
      </Box>
    </Card>
  );

        case 'create-sessions':
return(
        <Card sx={{ p: 3, width: '100%' }}>
        <Typography variant="h5">Create a Sport Session</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sport</InputLabel>
            <Select
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            >
              {['Soccer', 'Basketball', 'Tennis', 'Cricket'].map((sport) => (
                <MenuItem key={sport} value={sport}>
                  {sport}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <TextField
            label="Team 1 Players"
            value={team1Players}
            onChange={(e) => setTeam1Players(e.target.value)}
          />
          <TextField
            label="Team 2 Players"
            value={team2Players}
            onChange={(e) => setTeam2Players(e.target.value)}
          />
          <TextField
            label="Additional Players Needed"
            type="number"
            value={playersNeeded}
            onChange={(e) => setPlayersNeeded(e.target.value)}
          />
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
          <TextField
            label="Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
          />
          <TextField
            label="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
  
          <Button
            variant="contained"
            onClick={handleCreateSession}
            disabled={loadingSession}
          >
            {loadingSession ? 'Creating...' : 'Create Session'}
          </Button>
        </Box>
      </Card>
    );
  
         
      case 'reports':
        return (
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom>
              Reports
            </Typography>
            <Typography variant="body1">
              Sessions Played: {loadingReports ? 'Loading...' : reports.sessionCount}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Popular Sports: {loadingReports ? 'Loading...' : reports.popularSports?.join(', ') || 'None'}
            </Typography>
          </Card>
        );
      case 'profile':
        return (
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h5">Profile</Typography>
            <Typography>Admin Details: Coming Soon</Typography>
          </Card>
        );
      case 'settings':
        return (
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h5">Settings</Typography>
            <Typography>Settings Options: Coming Soon</Typography>
          </Card>
        );
      case 'logout':
        handleLogout();
        return <Typography variant="h5">Signing Out...</Typography>;
      default:
        return <Typography variant="h5">Select an option from the sidebar</Typography>;
    }
  };

  const drawer = (
    <List>
      {sidebarItems.map((item) => (
        <ListItem
          button
          key={item.id}
          onClick={() => setActiveFeature(item.id)}
          sx={{
            bgcolor: activeFeature === item.id ? '#5865f2' : 'inherit',
            color: activeFeature === item.id ? '#fff' : 'inherit',
            '&:hover': { bgcolor: '#7289da', color: '#fff' },
          }}
        >
          <ListItemIcon sx={{ color: activeFeature === item.id ? '#fff' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );

  
    


     
    return (
      <>
        {/* AppBar Component */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                display: { sm: 'none' },
                marginRight: 2, // Add space between the menu icon and text
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
    
        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
          }}
        >
          {/* Temporary Drawer for Mobile */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawer}
          </Drawer>
    
          {/* Permanent Drawer for Desktop */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
    
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            mt: 8, // Offset for AppBar height
          }}
        >
          {renderContent()}
        </Box>
      </>
    );
    
  };

export default AdminDashboard;
