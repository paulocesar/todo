import { Fragment, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ButtonGroup, CssBaseline, Typography } from "@mui/material";
import { TextField, Button, Container, Grid } from "@mui/material";
import moment from "moment";
import { DeleteTwoTone } from "@mui/icons-material";
import { MenuList, MenuItem, Box } from "@mui/material";

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

function TaskList(props) {
  function back(ev, id) {
    props.onClickBack(id);
  }
  function next(ev, id) {
    props.onClickNext(id);
  }

  let p = 11;
  if (props.onClickBack) { p -= 1; }
  if (props.onClickNext) { p -= 1; }
  return (
    <Fragment>
      <Typography variant="h5">
        {props.title}
      </Typography>
      <MenuList>
        {props.tasks.map((t) =>
          <Grid container spacing={1} sx={{p: 1}} key={t.id.toString()}>
            <Grid item xs={p}>
              <Typography noWrap sx={{ display: 'block' }}>
                {t.description}
              </Typography>
            </Grid>
            <Grid item xs={12 - p}>
              <ButtonGroup sx={{ p: 0 }} variant="outlined" aria-label="outlined button group">
                {props.onClickBack &&
                  <Button
                    onClick={(ev) => back(ev, t.id)}>
                    {"<"}
                  </Button>}
                {props.onClickNext &&
                  <Button
                    onClick={(ev) => next(ev, t.id)}>
                    {">"}
                    </Button>}
              </ButtonGroup>
            </Grid>
          </Grid>
        )}
      </MenuList>
    </Fragment>
  );
}

export default function App() {
  const [ currentTheme, setCurrentTheme ] = useState(availableThemes.default);
  const [ description, setDescription ] = useState('');
  const [ inProgressList, setInProgressList ] = useState([ ]);
  const [ nextList, setNextList ] = useState([ ]);
  const [ doneList, setDoneList ] = useState([ ]);

  function createTask() {
    setNextList(nextList.concat({
      id: (new Date()).getTime(),
      description
    }));
    setDescription('');
  }

  function moveToDone(id) {
    const item = inProgressList.concat(nextList).find((t) => t.id === id);

    const next = nextList.filter((t) => t.id !== id);
    const inProgress = inProgressList.filter((t) => t.id !== id);
    const done = doneList.concat(item);

    setNextList(next);
    setInProgressList(inProgress);
    setDoneList(done);
  }
  function moveToInProgress(id) {
    const item = doneList.concat(nextList).find((t) => t.id === id);

    const next = nextList.filter((t) => t.id !== id);
    const inProgress = inProgressList.concat(item);
    const done = doneList.filter((t) => t.id !== id);

    setNextList(next);
    setInProgressList(inProgress);
    setDoneList(done);
  }

  function moveToNext(id) {
    const item = inProgressList.concat(doneList).find((t) => t.id === id);

    const next = nextList.concat(item);
    const inProgress = inProgressList.filter((t) => t.id !== id);
    const done = doneList.filter((t) => t.id !== id);

    setNextList(next);
    setInProgressList(inProgress);
    setDoneList(done);
  }

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
            <Grid item xs={12}>
              <TextField
                sx={{ width: 1 }}
                label="Add task"
                InputLabelProps={{ shrink: true }}
                value={description}
                onKeyDown={(e) => e.key === 'Enter' ? createTask() : null}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{p: 1}} >
            <Grid item xs={4}>
              <TaskList
                title="Next"
                tasks={nextList}
                onClickNext={moveToInProgress}
              />
            </Grid>
            <Grid item xs={4}>
              <TaskList
                title="In Progress"
                tasks={inProgressList}
                onClickBack={moveToNext}
                onClickNext={moveToDone}
              />
            </Grid>
            <Grid item xs={4}>
              <TaskList
                title="Done"
                tasks={doneList}
                onClickBack={moveToInProgress}
              />
            </Grid>
          </Grid>
      </ThemeProvider>
    </div>
  );
}

