import * as React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function TaskList() {
    return (
        <Container maxWidth="lg">
            <Item>
                <FormControl sx={{ width: 1 }}>
                    <TextField id="task"
                        label="Describe a task"
                        margin="normal"
                        variant="outlined" />
                    <Button variant="contained">Add Task</Button>
                </FormControl>
            </Item>
            <Item>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <p>This is a new task</p>
                        </Grid>
                        <Grid xs={12}>
                            <p>This is a new task</p>
                        </Grid>
                    </Grid>
                </Box>
            </Item>
        </Container>
    );
}

function App() {
  return <TaskList />;
}

export default App;
