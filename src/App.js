import { Fragment, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ButtonGroup, CssBaseline, Typography } from "@mui/material";
import { TextField, Button, Grid } from "@mui/material";
import moment from "moment";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';

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

    let p = 12;
    if (props.onClickBack) { p -= 1; }
    if (props.onClickNext) { p -= 1; }
    return (
        <Fragment>
            {props.tasks.map((t) =>
                <Grid container spacing={1} sx={{p: 1}} key={t.id.toString()}>
                    <Grid item xs={p}>
                        <Typography sx={{ mt: 1, mb: 1, display: 'block' }}>
                            {t.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12 - p}>
                        <ButtonGroup sx={{ p: 0 }} variant="outlined" aria-label="outlined button group">
                            {props.onClickBack &&
                                    <Button
                                    onClick={(ev) => back(ev, t.id)}>
                                    {props.textBack || "<"}
                                    </Button>}
                                    {props.onClickNext &&
                                            <Button
                                            onClick={(ev) => next(ev, t.id)}>
                                            {props.textNext || ">"}
                                            </Button>}
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
            )}
                            </Fragment>
    );
}

function Todo() {
    const [ tabId, setTabId ] = useState('1');
    const [ description, setDescription ] = useState('');
    const [ inProgressList, setInProgressList ] = useState([ ]);
    const [ nextList, setNextList ] = useState([ ]);
    const [ doneList, setDoneList ] = useState([ ]);

    function createTask() {
        setNextList(nextList.concat({
            id: (new Date()).getTime(),
            description
        }));
        setTabId('2');
        setDescription('');
    }

    function onTabChange(ev, newValue) {
        setTabId(newValue);
    }

    function moveToDone(id, addToTop = false) {
        const item = inProgressList.concat(nextList).find((t) => t.id === id);

        const next = nextList.filter((t) => t.id !== id);
        const inProgress = inProgressList.filter((t) => t.id !== id);
        const done = addToTop ?
            [ item ].concat(doneList) :
            doneList.concat(item);

        setNextList(next);
        setInProgressList(inProgress);
        setDoneList(done);
    }
    function moveToInProgress(id, addToTop = false) {
        const item = doneList.concat(nextList).find((t) => t.id === id);

        const next = nextList.filter((t) => t.id !== id);
        const inProgress = addToTop ?
            [ item ].concat(inProgressList) :
            inProgressList.concat(item);
        const done = doneList.filter((t) => t.id !== id);

        setNextList(next);
        setInProgressList(inProgress);
        setDoneList(done);

        setTabId('1');
    }

    function moveToNext(id, addToTop = false) {
        const item = inProgressList.concat(doneList).find((t) => t.id === id);

        const next = addToTop ? [ item ].concat(nextList) : nextList.concat(item);
        const inProgress = inProgressList.filter((t) => t.id !== id);
        const done = doneList.filter((t) => t.id !== id);

        setNextList(next);
        setInProgressList(inProgress);
        setDoneList(done);
    }

    return (
        <Fragment>
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

                <TabContext value={tabId}>
                    <TabList onChange={onTabChange} sx={{ m: 1 }}>
                        <Tab label="In Progress" value="1" />
                        <Tab label="Next" value="2" />
                        <Tab label="Done" value="3" />
                    </TabList>
                    <TabPanel value="1">
                        <TaskList
                        tasks={inProgressList}
                        onClickBack={(id) => moveToNext(id, true)}
                        textBack="✗"
                        onClickNext={moveToDone}
                        textNext="✓"
                    />
                        </TabPanel>
                        <TabPanel value="2">
                            <TaskList
                            tasks={nextList}
                            onClickNext={moveToInProgress}
                        />
                            </TabPanel>
                            <TabPanel value="3">
                                <TaskList
                                tasks={doneList}
                                onClickBack={(id) => moveToInProgress(id, true)}
                            />
                                </TabPanel>
                            </TabContext>
                        </Fragment>
    );
}

export default function App() {
    const [ currentTheme ] = useState(availableThemes.default);

    return (
        <div className="App">
            <ThemeProvider theme={currentTheme}>
                <CssBaseline />
                <Todo />
            </ThemeProvider>
        </div>
    );
}

