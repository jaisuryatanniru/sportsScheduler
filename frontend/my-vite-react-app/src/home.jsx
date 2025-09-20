import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Drawer, ListItemButton, ListItemIcon, ListItemText,
  Card, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Grid, Paper, Chip, Divider, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from './Api';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 260;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, #f5f5f5 0%, #e3f2fd 100%)',
    borderRight: '1px solid #e0e0e0',
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: '0 24px 24px 0',
  margin: '4px 8px',
  padding: '10px 16px',
  '&.Mui-selected': {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    '&:hover': {
      backgroundColor: '#bbdefb',
    },
  },
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  padding: '24px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
  borderRadius: '28px',
  fontWeight: 'bold',
  padding: '10px 24px',
  marginTop: '16px',
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .2)',
  '&:hover': {
    boxShadow: '0 5px 8px 2px rgba(33, 150, 243, .3)',
  },
}));

const items = [
  { id: 'create-sport',    label: 'Create Sport',  icon: <SportsBasketballIcon /> },
  { id: 'create-session',  label: 'Create Session', icon: <EventIcon /> },
  { id: 'reports',         label: 'Reports',        icon: <AssessmentIcon /> },
  { id: 'logout',          label: 'Logout',         icon: <LogoutIcon /> },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('create-sport');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sport, setSport] = useState('');
  const [sessionData, setSessionData] = useState({
    sport: '', team1: '', team2: '',
    additionalPlayers: '', date: '', time: '', venue: ''
  });
  const [reports, setReports] = useState({ sessionCount: 0, popularSports: [] });
  const nav = useNavigate();

  useEffect(() => {
    if (active === 'reports') {
      api.get('/admin/getReports')
        .then(res => setReports(res.data))
        .catch(() => alert('Failed to load reports'));
    }
  }, [active]);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const logout = () => {
    localStorage.removeItem('authToken');
    nav('/login');
  };

  const createSession = async () => {
    const createdBy = localStorage.getItem('userId') || 'adminTest'; 
    const payload = {
      sport: sessionData.sport.trim(),
      team1: sessionData.team1.trim(),
      team2: sessionData.team2.trim(),
      additionalPlayers: Number(sessionData.additionalPlayers),
      date: sessionData.date,
      time: sessionData.time,
      venue: sessionData.venue.trim(),
      createdBy,
    };

    if (Object.values(payload).some(
      v => v === '' || v === null || (typeof v === 'number' && isNaN(v))
    )) {
      return alert('Please fill all fields with valid values.');
    }

    try {
      const { data } = await api.post('/admin/createSession', payload);
      alert(data.message);
      setSessionData({
        sport: '', team1: '', team2: '',
        additionalPlayers: '', date: '', time: '', venue: ''
      });
    } catch (err) {
      console.error('Session creation error:', err.response?.data || err);
      alert(err.response?.data?.error || 'Failed to create session.');
    }
  };

  const createSport = async () => {
    if (!sport.trim()) return alert('Enter a sport name.');
    try {
      const { data } = await api.post('/admin/createSport', { name: sport.trim() });
      alert(data.message);
      setSport('');
    } catch {
      alert('Failed to create sport');
    }
  };

  const drawer = (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {items.map(i => (
        <StyledListItemButton
          key={i.id}
          selected={active === i.id}
          onClick={() => i.id === 'logout' ? logout() : setActive(i.id)}
        >
          <ListItemIcon sx={{ color: active === i.id ? 'primary.main' : 'inherit' }}>
            {i.icon}
          </ListItemIcon>
          <ListItemText 
            primary={i.label} 
            primaryTypographyProps={{ 
              fontWeight: active === i.id ? 'bold' : 'normal'
            }} 
          />
        </StyledListItemButton>
      ))}
    </Box>
  );

  const renderContent = () => {
    switch (active) {
      case 'create-sport':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GradientCard sx={{ width: '100%', maxWidth: 500 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Create New Sport
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add a new sport to the system for session creation
              </Typography>
              
              <TextField
                fullWidth
                label="Sport Name"
                value={sport}
                onChange={e => setSport(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <ActionButton 
                fullWidth 
                onClick={createSport}
                disabled={!sport.trim()}
              >
                Create Sport
              </ActionButton>
            </GradientCard>
          </Box>
        );
      case 'create-session':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GradientCard sx={{ width: '100%', maxWidth: 800 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Create New Session
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Schedule a new game session for players
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sport</InputLabel>
                    <Select
                      value={sessionData.sport}
                      label="Sport"
                      onChange={e => setSessionData({ ...sessionData, sport: e.target.value })}
                    >
                      {['Soccer','Basketball','Tennis','Cricket'].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Additional Players"
                    type="number"
                    value={sessionData.additionalPlayers}
                    onChange={e => setSessionData({ ...sessionData, additionalPlayers: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Team 1"
                    value={sessionData.team1}
                    onChange={e => setSessionData({ ...sessionData, team1: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Team 2"
                    value={sessionData.team2}
                    onChange={e => setSessionData({ ...sessionData, team2: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={sessionData.date}
                    onChange={e => setSessionData({ ...sessionData, date: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={sessionData.time}
                    onChange={e => setSessionData({ ...sessionData, time: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Venue"
                    value={sessionData.venue}
                    onChange={e => setSessionData({ ...sessionData, venue: e.target.value })}
                  />
                </Grid>
              </Grid>
              
              <ActionButton 
                fullWidth 
                onClick={createSession}
                disabled={Object.values(sessionData).some(v => v === '')}
              >
                Create Session
              </ActionButton>
            </GradientCard>
          </Box>
        );
      case 'reports':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
              System Reports
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Overview of system activities and popular sports
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Sessions</Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="primary">
                    {reports.sessionCount}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(145deg, #ffebee 0%, #ffcdd2 100%)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SportsBasketballIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Popular Sports</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {reports.popularSports.length > 0 ? (
                      reports.popularSports.map((sport, index) => (
                        <Chip 
                          key={index} 
                          label={sport} 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2">No data available</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 'logout':
        logout();
        return null;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <StyledAppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ display: { xs: 'block', sm: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Sports Session Manager
          </Typography>
          <Chip icon={<PeopleIcon />} label="Admin" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
        </Toolbar>
      </StyledAppBar>
      
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </StyledDrawer>
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}