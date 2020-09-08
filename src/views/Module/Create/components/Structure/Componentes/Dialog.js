import React, { useEffect, useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { Button, Dialog, DialogContent, AppBar, Toolbar, IconButton, Typography, Slide, Grid, TextField, DialogTitle, DialogActions, Fab, Chip, Avatar, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core'
import { Close, Add } from '@material-ui/icons'

import { contrast, randomNumber, default_options } from 'utils'
import { ColorPicker } from 'components/ColorPicker'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    color: theme.palette.white,
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    padding: theme.spacing(3, 3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0),
    }
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  avatar: {
    margin: theme.spacing(1),
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    cursor: 'pointer'
  },
  views: {
    padding: theme.spacing(2),
  },
  wrapper: {
    position: "relative",
    borderRadius: "10px",
    backgroundColor: "#ededed",
    width: "100%",
    padding: "8px",
    margin: 0,
    display: "flex",
    maxWidth: "100%",
    flexWrap: "nowrap",
    alignItems: "center",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, toggle, element, change }) {
  const classes = useStyles();
  const [graphs, setGraphs] = useState([])

  useEffect(() => {
    setGraphs([...element.value])
  }, [element, open])

  const dataRandom = () => {
    const length = parseInt(Math.random() * (90 - 80) + 80)
    const array = []
    for (let index = 0; index < length; index++) {
      array.push(Math.random() * (45000 - 0) + 0)
    }
    return array
  }

  const addGraph = () => {
    let aux = [...graphs]
    aux[aux.length] = default_options
    setGraphs(aux)
  }

  const addSerie = index => () => {
    let aux = [...graphs]
    aux[index].cont_series = aux[index].cont_series + 1
    const new_serie = {
      id: `key_${aux[index].cont_series}`, name: '', type: 'line', color: randomNumber(), data: dataRandom(),
    }
    const len_series = aux[index].options.series.length
    aux[index].options.series[len_series] = new_serie
    aux[index].serie = new_serie
    aux[index].dialog = true
    aux[index].serie.index = len_series
    
    if(aux[index].options.series.length > 1) aux[index].len = 1
    setGraphs(aux)
  }

  const editSerie = (index, serie) => () => {
    let aux = [...graphs]
    aux[index].serie = aux[index].options.series[serie]
    aux[index].dialog = true
    aux[index].serie.index = serie
    setGraphs(aux)
  }

  const cancelEdit = index => () => {
    let aux = [...graphs]
    aux[index].dialog = false
    aux[index].serie.index = null
    setGraphs(aux)
  }

  const deleteSerie = (index, serie) => () => {
    let aux = [...graphs]    
    aux[index].serie.index = null
    aux[index].options.series.splice(serie, 1)

    if(aux[index].options.series.length === 1) aux[index].len = 0
    if(aux[index].options.series.length === 0) aux.splice(index, 1)
    setGraphs(aux)
  }

  const handleAxis = index => e => {
    let aux = [...graphs]
    aux[index].options[e.target.name].title.text = e.target.value
    setGraphs(aux)
  }

  const handleTitle = index => e => {
    let aux = [...graphs]
    aux[index].options[e.target.name].text = e.target.value
    setGraphs(aux)
  }

  const handleSerie = (index, name, value) => {
    let aux = [...graphs]
    aux[index].options.series[aux[index].serie.index][name] = value
    aux[index].serie[name] = value
    setGraphs(aux)
  }

  const handleSerieColor = index => color => {
    handleSerie(index, "color", color)
  }

  const handleSerieText = index => e => {
    handleSerie(index, e.target.name, e.target.value)
  }

  const saveOptions = () => {
    toggle(false)()
    change({...element, value: graphs, len: element.len})
  }

  return <>
    <Dialog fullScreen open={open} onClose={toggle(false)} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Setting
          </Typography>
          <IconButton edge="start" color="inherit" onClick={saveOptions} aria-label="close">
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        {
          graphs.map((graph, key) =>
            <Grid container key={key}>
              <Grid item md={6} lg={6}>
                <Grid container className={classes.views}>
                  <Grid item className="p-2" xs={12}>
                    <Typography variant="h5">Define your chart settings</Typography>
                  </Grid>
                  <Grid item className="p-2" xs={12} sm={12} md={12} lg={12}>
                    <TextField fullWidth size="small" label="Title" variant="outlined" defaultValue={graph.options.title.text} onBlur={handleTitle(key)} name="title" />
                  </Grid>
                  <Grid item className="p-2" xs={12} sm={4} md={12} lg={12}>
                    <TextField fullWidth size="small" label="Subtitle" variant="outlined" defaultValue={graph.options.subtitle.text} onBlur={handleTitle(key)} name="subtitle" />
                  </Grid>
                  <Grid item className="p-2" xs={6} sm={4} md={6} lg={6}>
                    <TextField fullWidth size="small" label="Axis X" variant="outlined" defaultValue={graph.options.xAxis.title.text} onBlur={handleAxis(key)} name="xAxis" />
                  </Grid>
                  <Grid item className="p-2" xs={6} sm={4} md={6} lg={6}>
                    <TextField fullWidth size="small" label="Axis Y" variant="outlined" defaultValue={graph.options.yAxis.title.text} onBlur={handleAxis(key)} name="yAxis" />
                  </Grid>
                  <Grid item className="p-2" xs={12}>
                    <Typography variant="h5" className="pb-2">Series</Typography>
                    {
                      graph.options.series.map((chip, item) =>
                        <Chip
                          variant="outlined"
                          key={item}
                          onClick={editSerie(key, item)}
                          className={classes.avatar}
                          avatar={<Avatar style={{ backgroundColor: chip.color, color: contrast(chip.color) }}>{chip.type[0].toUpperCase()}</Avatar>}
                          label={chip.name}
                          onDelete={deleteSerie(key, item)}
                        />
                      )
                    }
                  </Grid>
                  <Grid item className="p-2" xs={12}>
                    <Fab size="small" className={classes.margin} onClick={addSerie(key)}>
                      <Add />
                    </Fab>
                  </Grid>
                </Grid>
                <Dialog
                  fullWidth
                  maxWidth="md"
                  open={graph.dialog}
                  onClose={cancelEdit(key)}
                  aria-labelledby="max-width-dialog-title"
                >
                  <DialogTitle id="max-width-dialog-title">
                    Define series settings
                  </DialogTitle>
                  <DialogContent>
                    <Grid container>
                      <Grid item className="p-2" xs={12}>
                        <TextField fullWidth size="small" label="Name" variant="outlined" value={graph.serie.name} onChange={handleSerieText(key)} name="name" />
                      </Grid>
                      <Grid item className="p-2" xs={12} sm={6} >
                        <FormControl className={classes.formControl} fullWidth variant="outlined" size="small">
                          <InputLabel id="demo-simple-select-label">Type</InputLabel>
                          <Select
                            name="type"
                            label="Type"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={graph.serie.type}
                            onChange={handleSerieText(key)}
                          >
                            <MenuItem value="line">Line</MenuItem>
                            <MenuItem value="bar">Bar</MenuItem>
                            <MenuItem value="column">Column</MenuItem>
                            <MenuItem value="spline">Spline</MenuItem>
                            <MenuItem value="pie">Pie</MenuItem>
                            <MenuItem value="area">Area</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item className="p-2" xs={12} sm={6} >
                        <ColorPicker color={graph.serie.color} setColor={handleSerieColor(key)} size="small" />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={cancelEdit(key)} color="primary">
                      Close
                      </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={graph.options}
                  updateArgs={[true, true, true]}
                />
              </Grid>
            </Grid>
          )

        }
        <Grid container>
          <Grid item xs={12}>
            <Fab variant="extended" color="primary" className={classes.margin} onClick={addGraph}>
              <Add className="mr-1" />
                graph
              </Fab>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  </>
}