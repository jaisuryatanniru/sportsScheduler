import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';

const PlayerDashboard = () => {
  const [activeFeature, setActiveFeature] = useState('view-sessions');
  const [newSession, setNewSession] = useState({
    sport: '',
    team1: '',
    team2: '',
    additionalPlayers: '',
    date: '',
    time: '',
    venue: '',
  });
  const [sessions, setSessions] = useState([]); // Track all sessions
  const [mySessions, setMySessions] = useState([]); // Admin's created sessions
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [loadingSession, setLoadingSession] = useState(false);
  const availableSports = ['Soccer', 'Basketball', 'Tennis', 'Cricket'];

  // Handle session creation
  const handleCreateSession = async () => {
    const { sport, team1, team2, additionalPlayers, date, time, venue } = newSession;

    // Basic validation
    if (
      !sport.trim() ||
      !team1.trim() ||
      !team2.trim() ||
      !additionalPlayers.trim() ||
      isNaN(additionalPlayers) ||
      !date.trim() ||
      !time.trim() ||
      !venue.trim()
    ) {
      alert('Please fill in all fields correctly.');
      return;
    }

    setLoadingSession(true);

    try {
      const sessionData = {
        sport,
        team1,
        team2,
        additionalPlayers: parseInt(additionalPlayers, 10),
        date,
        time,
        venue,
        createdBy: 'You',
      };

      const response = await axios.post(
        'http://localhost:5000/api/v1/authentication/player/createSession',
        sessionData
      );

      alert(response.data.message || 'Session created successfully.');

      // Add new session to list and reset form
      setSessions((prev) => [...prev, { ...sessionData, id: response.data.id || Date.now() }]);
      setNewSession({
        sport: '',
        team1: '',
        team2: '',
        additionalPlayers: '',
        date: '',
        time: '',
        venue: '',
      });
    } catch (error) {
      console.error('Error creating session:', error.response?.data || error.message);
      alert('Failed to create session. Please try again later.');
    } finally {
      setLoadingSession(false);
    }
  };

  // Handle session cancellation
  const handleCancelSession = () => {
    if (!selectedSession || !cancelReason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    setMySessions((prev) =>
      prev.map((session) =>
        session.id === selectedSession.id
          ? { ...session, status: 'Cancelled', cancelReason }
          : session
      )
    );

    alert('Session cancelled successfully.');
    setIsDialogOpen(false);
    setCancelReason('');
  };

  // Render feature content
  const renderContent = () => {
    switch (activeFeature) {
      case 'create-session':
        return (
          <Card sx={{ p: 3, width: '100%' }}>
            <Typography variant="h5">Create a Sport Session</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sport</InputLabel>
                <Select
                  value={newSession.sport}
                  onChange={(e) => setNewSession({ ...newSession, sport: e.target.value })}
                >
                  {availableSports.map((sport) => (
                    <MenuItem key={sport} value={sport}>
                      {sport}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Team 1 Players"
                value={newSession.team1}
                onChange={(e) => setNewSession({ ...newSession, team1: e.target.value })}
              />
              <TextField
                label="Team 2 Players"
                value={newSession.team2}
                onChange={(e) => setNewSession({ ...newSession, team2: e.target.value })}
              />
              <TextField
                label="Additional Players Needed"
                type="number"
                value={newSession.additionalPlayers}
                onChange={(e) => setNewSession({ ...newSession, additionalPlayers: e.target.value })}
              />
              <TextField
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              />
              <TextField
                label="Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={newSession.time}
                onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
              />
              <TextField
                label="Venue"
                value={newSession.venue}
                onChange={(e) => setNewSession({ ...newSession, venue: e.target.value })}
              />
              <Button variant="contained" onClick={handleCreateSession} disabled={loadingSession}>
                {loadingSession ? 'Creating...' : 'Create Session'}
              </Button>
            </Box>
          </Card>
        );
      case 'view-sessions':
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Available Sessions
            </Typography>
            {sessions.length ? (
              sessions.map((session) => (
                <Card key={session.id} sx={{ mb: 2, p: 2 }}>
                  <Typography variant="h6">{session.sport}</Typography>
                  <Typography>
                    Teams: {session.team1} vs {session.team2}
                  </Typography>
                  <Typography>Looking for: {session.additionalPlayers} more players</Typography>
                  <Typography>
                    Date: {session.date}, Time: {session.time}
                  </Typography>
                  <Typography>Venue: {session.venue}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => alert('Join functionality coming soon!')}
                  >
                    Join
                  </Button>
                </Card>
              ))
            ) : (
              <Typography>No sessions available.</Typography>
            )}
          </Box>
        );
      default:
        return <Typography>Select an option</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', bgcolor: '#3a3d45', color: '#fff' },
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton onClick={() => setActiveFeature('create-session')}>
            <ListItemIcon>
              <EventIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Create Session" />
          </ListItemButton>
          <ListItemButton onClick={() => setActiveFeature('view-sessions')}>
            <ListItemIcon>
              <GroupIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="View Sessions" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>{renderContent()}</Box>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Cancel Session</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for cancellation"
            fullWidth
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          <Button onClick={handleCancelSession} color="error">
            Cancel Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlayerDashboard;
