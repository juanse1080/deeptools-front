import React, { useEffect, useState } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import showdown from 'showdown'
import { Paper, makeStyles } from '@material-ui/core'
import "./bootstrap4.4.min.css"

const transform = (node, index) => {

  // return null to block certain elements
  // don't allow <span> elements
  if (node.type === 'tag' && node.name === 'span') {
    return null;
  }

  // Transform <ul> into <ol>
  // A node can be modified and passed to the convertNodeToElement function which will continue to render it and it's children
  if (node.type === 'tag' && node.name === 'ul') {
    node.name = 'ol';
    return convertNodeToElement(node, index, transform);
  }

  // return an <i> element for every <b>
  // a key must be included for all elements
  if (node.type === 'tag' && node.name === 'b') {
    return <i key={index}>I am now in italics, not bold</i>;
  }

  // all links must open in a new window
  if (node.type === 'tag' && node.name === 'a') {
    node.attribs.target = '_blank';
    return convertNodeToElement(node, index, transform);
  }

}

const options = {
  decodeEntities: true,
  transform
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      boxShadow: 'none',
      backgroundColor: 'inherit'
    },
  },
}))

export default function ({ value }) {
  const classes = useStyles()
  const [html, setHtml] = useState(null)

  useEffect(() => {
    const obj = new showdown.Converter()
    setHtml(obj.makeHtml(value))
    console.log(html)
  }, [value])

  return <>
    <Paper className={classes.paper} elevation={3}>
      {
        ReactHtmlParser(html, options)
      }
    </Paper>
  </>
}