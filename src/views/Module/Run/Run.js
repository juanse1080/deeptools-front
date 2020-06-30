import React, { useEffect, useState } from 'react'

import axios from 'axios'
import showdown from 'showdown'
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

import { makeStyles, Backdrop, CircularProgress, Button } from '@material-ui/core'

import { host, authHeaderJSON, history, ws } from 'helpers'
import { error } from 'utils'

import { InputFile } from './components'

import "./bootstrap4.4.min.css"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.white
    }
  },
  fullHeight: {
    paddingTop: "100%",
    transform: 'scale(1, 1) !important'
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.appBar + 1,
    color: '#fff',
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
}))

const transform = (node, index) => {
  if (node.type === 'tag' && node.name === 'span') {
    return null;
  }

  if (node.type === 'tag' && node.name === 'ul') {
    node.name = 'ol';
    return convertNodeToElement(node, index, transform);
  }

  if (node.type === 'tag' && node.name === 'b') {
    return <i key={index}>I am now in italics, not bold</i>;
  }

  if (node.type === 'tag' && node.name === 'a') {
    node.attribs.target = '_blank';
    return convertNodeToElement(node, index, transform);
  }
}

const options = {
  decodeEntities: true,
  transform
};

export default function Run({ match, ...others }) {
  const classes = useStyles()

  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [module, setModule] = useState(null)
  const [media, setMedia] = useState([])

  const addMedia = (many, items) => {
    if (many) {
      setMedia([...media, ...items.map(item => ({ file: item, hover: false, progress: 0 }))])
    } else {
      setMedia([...items.map(item => ({ file: item, hover: false, progress: 0 }))])
    }
  }

  const deleteMedia = index => () => {
    let aux = [...media]
    aux.splice(index, 1)
    setMedia(aux)
  }

  const enterMedia = index => () => {
    let aux = [...media.map(item => ({ ...item, 'hover': false }))]
    aux[index] = { ...aux[index], 'hover': true }
    setMedia(aux)
  }

  const leaveMedia = () => {
    setMedia(media.map(item => ({ ...item, 'hover': false })))
  }

  useEffect(() => {
    axios.post(`${host}/module/run/${match.params.id}`, {}, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        if (res.data.docker.state !== 'active') history.goBack()
        const obj = new showdown.Converter()
        const many = [...res.data.docker.elements_type].filter(item => item.kind === 'input')[0].len === '1' ? true : false
        console.log(many)
        setModule({ ...res.data.docker, html: obj.makeHtml(res.data.docker.protocol), many: many })
        setLoading(false)
      }
    ).catch(
      function (err) {
        error(err)
        console.error(err.response)
      }
    )
  }, [match.params.id])

  const content = () => {
    if (step === 0) {
      console.log("ENTRO")
      return <>
        {ReactHtmlParser(module.html, options)}
      </>
    } else {
      return <InputFile many={module.many} enterMedia={enterMedia} leaveMedia={leaveMedia} media={media} addMedia={addMedia} deleteMedia={deleteMedia} />
    }
  }

  const handleStep = (newStep) => () => {
    setStep(newStep)
  }

  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </> : <>
            {content()}
            <div className={classes.buttons}>
              <Button disabled={step === 0} onClick={handleStep(step - 1)} className={classes.backButton}>Back</Button>
              <Button disabled={step === 1} variant="contained" color="primary" onClick={handleStep(step + 1)}>Next</Button>
            </div>
          </>
      }
    </div>
  </>
}