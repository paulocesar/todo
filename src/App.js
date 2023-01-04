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
                        <ButtonGroup sx={{ p: 0 }}
                            variant="outlined"
                            aria-label="outlined button group">
                            {props.onClickBack && <Button
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
    const [ tasks, setTasks ] = useState([ ]);

    const onTabChange = (ev, newValue) => setTabId(newValue);
    const byStatus = (s, t) => t.filter((t) => t.status === s);

    function setAndSortTasks(newTasks) {
        setTasks(byStatus('inProgress', newTasks)
            .concat(byStatus('next', newTasks))
            .concat(byStatus('done', newTasks)));
    }

    function createTask() {
        const newTasks = tasks.concat({
            id: (new Date()).getTime(),
            status: 'next',
            description
        });

        setAndSortTasks(newTasks);
        setTabId('2');
        setDescription('');

    }

    function moveTo(id, status, addToTop = true) {
        const rest = tasks.filter((t) => t.id !== id)
        const item = tasks.find((t) => t.id === id);
        const newTasks = addToTop ? [ item ].concat(rest) :
            rest.concat(item);

        item.status = status;

        setAndSortTasks(newTasks);
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
                        onKeyDown={(e) =>
                                e.key === 'Enter' ? createTask() : null}
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
                        tasks={byStatus('inProgress', tasks)}
                        onClickBack={(id) => moveTo(id, 'next')}
                        textBack="✗"
                        onClickNext={(id) => moveTo(id, 'done')}
                        textNext="✓" />
                </TabPanel>
                <TabPanel value="2">
                    <TaskList
                        tasks={byStatus('next', tasks)}
                        onClickNext={(id) => moveTo(id, 'inProgress', false)} />
                </TabPanel>
                <TabPanel value="3">
                    <TaskList
                        tasks={byStatus('done', tasks)}
                        onClickBack={(id) => moveTo(id, 'inProgress')} />
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

