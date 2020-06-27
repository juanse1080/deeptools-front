import React, { Component } from 'react'

import SwipeableViews from 'react-swipeable-views'

import { Paper, Grid, FormControl, FormLabel, FormGroup, Checkbox, FormControlLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

import { Full, First, Order } from './Componentes'
import { element } from 'prop-types';

const useStyles = theme => ({
  formControl: {
    display: 'block',
    paddingBottom: theme.spacing(2)
  },
})

class Structure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 2
    }

    this.handleStructure = this.handleStructure.bind(this)
    this.handleElements = this.handleElements.bind(this)
    this.setIndex = this.setIndex.bind(this)
  }

  handleStructure = () => {
    if (this.props.elements.input.state && this.props.elements.response.state && this.props.elements.output.state && this.props.elements.graph.state) {
      return 0
    } else if (this.props.elements.input.state && this.props.elements.response.state && this.props.elements.graph.state) {
      return 1
    } else if (this.props.elements.input.state && this.props.elements.response.state && this.props.elements.output.state) {
      return 2
    } else if (this.props.elements.input.state && this.props.elements.response.state) {
      return this.state.index
    } else {
      console.error("Error in the relation of the structures")
    }
  }

  handleElements = e => {
    this.props.check(e.target.name, e.target.checked)
    this.setIndex(this.handleStructure())
  }

  componentDidMount = () => {
    this.setIndex(this.handleStructure())
  }

  setIndex = value => {
    this.setState({ index: value })
  }

  render() {
    const { classes, elements, change, check, ...others } = this.props
    return (
      <>
        <FormControl component="fieldset" className={classes.formControl}>

          <FormGroup>
            <FormLabel component="legend">Select the necessary elements for your algorithm</FormLabel>
            <Grid container>
              <Grid item xs={12} sm={6} lg={3}>
                <FormControlLabel disabled control={
                  <Checkbox color="primary" checked={elements.input.state} onChange={this.handleElements} name="input" />
                } label="Multimedia input" />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormControlLabel disabled control={
                  <Checkbox color="primary" checked={elements.response.state} onChange={this.handleElements} name="response" />
                } label="Descriptive response of the result" />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormControlLabel disabled={!elements.graph.state} control={
                  <Checkbox color="primary" checked={elements.output.state} onChange={this.handleElements} name="output" />
                } label="Multimedia output" />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormControlLabel disabled={!elements.output.state} control={
                  <Checkbox color="primary" checked={elements.graph.state} onChange={this.handleElements} name="graph" />
                } label="Graphic display of the result" />
              </Grid>
            </Grid>
          </FormGroup>
          {/* <FormHelperText></FormHelperText> */}
        </FormControl>
        <SwipeableViews index={this.state.index}>
          <Full elements={elements} change={change} />
          <First elements={elements} change={change} />
          <Order elements={elements} change={change} />
        </SwipeableViews>
      </>
    )
  }
}

export default withStyles(useStyles, { withTheme: true })(Structure)