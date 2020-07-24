import React from "react";
import SimpleMDE from "react-simplemde-editor";
import { Typography, FormHelperText, makeStyles } from '@material-ui/core';
import "easymde/dist/easymde.min.css";
import "./bootstrap4.4.min.css"

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.light
  }
}))

const Protocol = ({ value, change, errors, ...others }) => {
  const classes = useStyles()

  const hasError = field => errors[field] ? true : false

  return <>
    <Typography
      variant="subtitle1"
      align="justify"
      component="p"
      className="mb-3"
    >
      In this section you can specify the protocol for data collection. It should be noted that the more specific the better the data to be processed and as a consequence the models will be much more precise.
    </Typography>
    <Typography
      variant="subtitle1"
      align="justify"
      component="p"
      className="mb-3"
    >
      In this text box, you can write <a target="_blank" href="https://www.markdownguide.org/getting-started/" rel="noreferrer">Markdown</a> code and HTML code with <a target="_blank" href="https://getbootstrap.com" rel="noreferrer">Bootstrap 4.4</a> styles.
    </Typography>
    <SimpleMDE
      onChange={change}
      value={value}
      options={{
        spellChecker: false,
        autosave: true,
        autofocus: false,
        autosave: {
          enabled: false,
          unique_id: "render",
        },
        hideIcons: ["guide", "heading", "fullscreen", "side-by-side"],
        renderingConfig: {
          singleLineBreaks: false,
          codeSyntaxHighlighting: true,
        },
      }}
    />
    {
      hasError('protocol') ? <FormHelperText className={classes.error}>{errors.protocol[0]}</FormHelperText> : null
    }

  </>
}

export default Protocol

