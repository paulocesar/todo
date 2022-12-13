import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Typography } from "@mui/material";
import { TextField, Button, Container, Grid } from "@mui/material";
import moment from "moment";

const availableThemes = {
  default: createTheme(),
  dark: createTheme({ palette: { mode: "dark" } })
};

function useTime() {
  const [time, setTime] = useState(moment());

  function tick() {
    setTime(moment());
  }

  useEffect(() => {
    const tickId = setInterval(tick, 1000);
    return () => clearInterval(tickId);
  });

  return [time];
}

function Clock(props) {
  const [time] = useTime();
  const defaultFormat = "MM/DD/YYYY HH:mm:ss";

  return (
    <Typography variant="p">
      {time.format(props.format || defaultFormat)}
    </Typography>
  );
}

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(availableThemes.default);

  return (
    <div className="App">
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
          <Grid container spacing={1} sx={{p: 1}} >
            <Grid item xs={6}>
              <Typography variant="h2">TODO</Typography>
              <Clock />
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{p: 1}} >
            <Grid item xs={9}>
              <TextField
                sx={{ width: 1 }}
                label="Add task"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <Button sx={{ p: 2, width: 1 }} variant="contained">
                Add
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{p: 1}} >
            <Grid item xs={4}>
              <Typography variant="h5">Next</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5">In Progress</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5">Done</Typography>
            </Grid>
          </Grid>
      </ThemeProvider>
    </div>
  );
}

