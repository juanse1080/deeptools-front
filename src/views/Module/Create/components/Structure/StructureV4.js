import React, { useState, useEffect } from 'react'
import { Paper, Grid, FormControl, FormLabel, FormGroup, Checkbox, FormControlLabel, Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import { Full, First, Order } from './Componentes'

const useStyles = makeStyles(theme => ({
  formControl: {
    display: 'block',
    paddingBottom: theme.spacing(2)
  },
}))

function View(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const Structure = ({ elements, change, check, ...others }) => {
  const classes = useStyles()
  const [index, setIndex] = useState(2)

  const handleStructure = () => {
    if (elements.input.state && elements.response.state && elements.output.state && elements.graph.state) {
      return 0
    } else if (elements.input.state && elements.response.state && elements.graph.state) {
      return 1
    } else if (elements.input.state && elements.response.state && elements.output.state) {
      return 2
    } else if (elements.input.state && elements.response.state) {
      return index
    } else {
      console.error("Error in the relation of the structures")
    }
  }

  const handleElements = e => {
    check(e.target.name, e.target.checked);
  }

  // Actualiza la visualización cuando la propiedad cambia
  useEffect(() => {
    setIndex(() => handleStructure())
  }, [elements])

  return (
    <>
      <FormControl component="fieldset" className={classes.formControl}>

        <FormGroup>
          <FormLabel component="legend">Select the necessary elements for your algorithm</FormLabel>
          <Grid container>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControlLabel disabled control={
                <Checkbox color="primary" checked={elements.input.state} onChange={handleElements} name="input" />
              } label="Multimedia input" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControlLabel disabled control={
                <Checkbox color="primary" checked={elements.response.state} onChange={handleElements} name="response" />
              } label="Descriptive response of the result" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControlLabel disabled={!elements.graph.state} control={
                <Checkbox color="primary" checked={elements.output.state} onChange={handleElements} name="output" />
              } label="Multimedia output" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControlLabel disabled={!elements.output.state} control={
                <Checkbox color="primary" checked={elements.graph.state} onChange={handleElements} name="graph" />
              } label="Graphic display of the result" />
            </Grid>
          </Grid>
        </FormGroup>
        {/* <FormHelperText></FormHelperText> */}
      </FormControl>
      <View value={index} index={0}>
        <Full elements={elements} change={change} />
      </View>
      <View value={index} index={1}>
        <First elements={elements} change={change} />
      </View>
      <View value={index} index={2}>
        <Order elements={elements} change={change} />
      </View>

    </>
  )
}

export default Structure