import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Drawer,
  ListItemButton, ListItemIcon, ListItemText,
  Card, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import api from './Api';

const drawerWidth = 240;
const items = [
  { id: 'create-session', label: 'Create Session', icon: <EventIcon /> },
  { id: 'view-sessions',  label: 'View Sessions',  icon: <GroupIcon /> },
];

export default function PlayerDashboard() {
  const [active, setActive] = useState('view-sessions');
  const [newSess, setNewSess] = useState({
    sport:'', team1:'', team2:'', additionalPlayers:'', date:'', time:'', venue:''
  });
  const [sessions, setSessions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [sel, setSel] = useState(null);

  useEffect(() => {
    api.get('/player/getSessions')
      .then(res => setSessions(res.data))
      .catch(() => alert('Failed to load sessions'));
  }, []);

  const createSession = async () => {
    const createdBy = localStorage.getItem('userId') || 'playerTest';
    const payload = {
      sport: newSess.sport.trim(),
      team1: newSess.team1.trim(),
      team2: newSess.team2.trim(),
      additionalPlayers: Number(newSess.additionalPlayers),
      date: newSess.date,
      time: newSess.time,
      venue: newSess.venue.trim(),
      createdBy,
    };
    if (Object.values(payload).some(v => v === '' || (typeof v==='number' && isNaN(v)))) {
      return alert('Please fill all fields correctly');
    }
    console.log('Player createSession payload:', payload);
    try {
      const { data } = await api.post('/player/createSession', payload);
      alert(data.message);
      setSessions(prev => [...prev, data.session]);
      setNewSess({ sport:'', team1:'', team2:'', additionalPlayers:'', date:'', time:'', venue:'' });
    } catch (err) {
      console.error('Create session error:', err.response?.data || err);
      alert(err.response?.data?.error || 'Failed to create session');
    }
  };

  const joinSession = async (id) => {
    try {
      const { data } = await api.post(`/player/joinSession/${id}`, { userId: 'playerTest' });
      alert(data.message);
      setSessions((await api.get('/player/getSessions')).data);
    } catch {
      alert('Failed to join session');
    }
  };

  const cancelSession = async () => {
    if (!cancelReason.trim()) return alert('Enter cancellation reason');
    try {
      const { data } = await api.post(`/player/cancelSession/${sel._id}`, { cancelReason });
      alert(data.message);
      setSessions((await api.get('/player/getSessions')).data);
      setDialogOpen(false);
    } catch {
      alert('Failed to cancel session');
    }
  };

  const renderContent = () => {
    if (active === 'create-session') {
      return (
        <Card sx={{ p:3, maxWidth:600 }}>
          <Typography variant="h6">Create Session</Typography>
          <Grid container spacing={2} sx={{ mt:1 }}>
            {[
              ['sport','Sport'],
              ['team1','Team 1'],
              ['team2','Team 2'],
              ['additionalPlayers','Additional Players'],
              ['date','Date'],
              ['time','Time'],
              ['venue','Venue'],
            ].map(([key,label]) => (
              <Grid item xs={12} sm={6} key={key}>
                {key==='sport' ? (
                  <FormControl fullWidth>
                    <InputLabel>Sport</InputLabel>
                    <Select
                      value={newSess.sport}
                      label="Sport"
                      onChange={e=>setNewSess({...newSess,sport:e.target.value})}
                    >
                      {['Soccer','Basketball','Tennis','Cricket'].map(s=>
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label={label}
                    type={key==='date'?'date':key==='time'?'time':'text'}
                    InputLabelProps={key==='date'||key==='time'?{shrink:true}:{}}
                    value={newSess[key]}
                    onChange={e=>setNewSess({...newSess,[key]:e.target.value})}
                  />
                )}
              </Grid>
            ))}
          </Grid>
          <Button sx={{ mt:2 }} variant="contained" onClick={createSession}>
            Create Session
          </Button>
        </Card>
      );
    }
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Available Sessions</Typography>
        <Grid container spacing={2}>
          {sessions.length===0 && <Typography>No sessions available.</Typography>}
          {sessions.map(s=>(
            <Grid item xs={12} sm={6} md={4} key={s._id}>
              <Card sx={{ p:2 }}>
                <Typography>Sport: {s.sport}</Typography>
                <Typography>Teams: {s.team1} vs {s.team2}</Typography>
                <Typography>Need: {s.additionalPlayers}</Typography>
                <Typography>Date: {new Date(s.date).toLocaleDateString()}</Typography>
                <Typography>Time: {s.time}</Typography>
                <Typography>Venue: {s.venue}</Typography>
                <Box sx={{ mt:1, display:'flex', gap:1 }}>
                  <Button onClick={()=>joinSession(s._id)}>Join</Button>
                  <Button color="error" onClick={() => { setSel(s); setDialogOpen(true); }}>
                    Cancel
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
          <DialogTitle>Cancel Session</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Reason"
              value={cancelReason}
              onChange={e=>setCancelReason(e.target.value)}
              sx={{ mt:1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setDialogOpen(false)}>Close</Button>
            <Button color="error" onClick={cancelSession}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <Box sx={{ display:'flex' }}>
      <AppBar position="fixed" sx={{ zIndex:t=>t.zIndex.drawer+1 }}>
        <Toolbar><Typography>Player Dashboard</Typography></Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper':{width:drawerWidth} }} open>
        <Toolbar />
        {items.map(i=>(
          <ListItemButton key={i.id} selected={active===i.id} onClick={()=>setActive(i.id)}>
            <ListItemIcon>{i.icon}</ListItemIcon>
            <ListItemText primary={i.label}/>
          </ListItemButton>
        ))}
      </Drawer>
      <Box component="main" sx={{ flexGrow:1, p:3, mt:8, ml:`${drawerWidth}px` }}>
        {renderContent()}
      </Box>
    </Box>
  );
}
