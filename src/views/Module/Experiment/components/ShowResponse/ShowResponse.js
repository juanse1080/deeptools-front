import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import showdown from 'showdown';
import './bootstrap4.4.min.css';

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
    node.attribs.class = 'ml-4';
    return convertNodeToElement(node, index, transform);
  }

  if (node.type === 'tag' && node.name === 'ol') {
    node.attribs.class = 'ml-4';
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
};

const options = {
  decodeEntities: true,
  transform
};

const useStyles = makeStyles(theme => ({
  paper: {
    overflow: 'scroll',
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      boxShadow: 'none',
      backgroundColor: 'inherit'
    }
  }
}));

export default function({ value }) {
  const classes = useStyles();
  const [html, setHtml] = useState(null);

  useEffect(() => {
    const obj = new showdown.Converter({ tables: true, tablesHeaderId: true });
    setHtml(obj.makeHtml(value));
  }, [value]);

  return <div className={classes.paper}>{ReactHtmlParser(html, options)}</div>;
}
