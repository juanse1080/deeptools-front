import React, { useEffect, useState } from 'react'

import axios from 'axios'
import showdown from 'showdown'
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

import { makeStyles, Backdrop, CircularProgress, Button, Link, Typography, useTheme, useMediaQuery, IconButton, Grid, Breadcrumbs } from '@material-ui/core'
import { ArrowBack, ArrowForward, PlayArrow, Save } from '@material-ui/icons'

import { useDispatch, useSelector } from "react-redux";
import { actions } from '_redux';

import { host, authHeaderJSON, history, ws, authHeaderForm } from 'helpers'
import { error, title as ucWords } from 'utils'

import { InputFile } from './components'
import { Example } from './components'

import "./bootstrap4.4.min.css"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      // backgroundColor: theme.palette.white
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
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  }
}))

const transform = (node, index) => {
  if (node.type === 'tag' && node.name === 'span') {
    return null;
  }

  if (node.type === 'tag' && node.name === 'ul') {
    node.name = 'ol';
    node.attribs.class = "ml-4"
    return convertNodeToElement(node, index, transform);
  }

  if (node.type === 'tag' && node.name === 'ol') {
    node.attribs.class = "ml-4"
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
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const dispatch = useDispatch()
  const access = useSelector(state => state.user.id)

  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [module, setModule] = useState(null)
  const [media, setMedia] = useState([])
  const [example, setExample] = useState([])
  const [refs, setRefs] = useState([])
  const [cancel, setCancel] = useState([])

  const to = href => () => {
    dispatch(actions.startLoading())
    history.push(href)
    dispatch(actions.finishLoading())
  }

  const addMedia = items => {
    const len = media.length
    const cancels = []
    items.forEach((element, index) => {
      const source = axios.CancelToken.source()
      const form = new FormData()
      form.append('file', element)

      appendMedia({ name: element.name, hover: false, progress: 0, uploaded: false, ref: index })

      const config = {
        ...authHeaderForm(),
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          handleMedia(len + index, 'progress', percentCompleted)
        }
      }

      cancels.push(source)

      axios.post(`${host}/module/upload/${match.params.id}`, form, config).then(
        function (res) {
          console.log(res.data)
          handleMedia(len + index, 'uploaded', true)
          setMedia(media => {
            let aux = [...media]
            aux[len + index] = { ...aux[len + index], ...res.data }
            return aux
          })
        }
      ).catch(
        function (err) {
          // handleMedia(len + index, 'uploaded', false)
        }
      )

    })
    setCancel([...cancel, ...cancels])
  }

  const appendMedia = value => {
    setMedia(media => {
      let aux = [...media]
      aux[aux.length] = value
      return aux
    })
  }

  const handleMedia = (index, name, value) => {
    setMedia(media => {
      let aux = [...media]
      aux[index] = { ...aux[index], [name]: value }
      return aux
    })
  }

  const deleteMedia = index => () => {
    handleMedia(index, 'deleting', true)
    console.log(media, index)
    axios.delete(`${host}/module/upload/remove/${media[index].id}`, authHeaderJSON()).then(
      function (res) {
        handleMedia(index, 'deleting', false)
        let aux = [...media]
        aux.splice(index, 1)
        setMedia(aux)
      }
    ).catch(
      function (err) {
        handleMedia(index, 'deleting', false)
      }
    )
  }

  const uploadExamples = () => {
    axios.post(`${host}/module/upload/${match.params.id}/examples`, { examples: example.map(item => item.id) }, authHeaderJSON()).then(
      function (res) {
        console.log(res.data)
        setStep(1)
      }
    ).catch(
      function (err) {
        error(err)
        console.error(err.response)
      }
    )
  }

  const cancelUpload = index => () => {
    const index_cancel = media[index].ref
    cancel[index_cancel].cancel('')

    let aux = [...media]
    aux.splice(index, 1)
    setMedia(aux)

    let aux_c = [...cancel]
    aux_c.splice(index_cancel, 1)
    setCancel(aux_c)
  }

  const enterMedia = index => () => {
    let aux = [...media.map(item => ({ ...item, 'hover': false }))]
    aux[index] = { ...aux[index], 'hover': true }
    setMedia(aux)
  }

  const leaveMedia = () => {
    setMedia(media.map(item => ({ ...item, 'hover': false })))
  }

  const connect = (id) => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${access}/${id}`)

    waitForSocketConnection(webSocket, () => {
      sendMessage(webSocket, { command: 'execute' })
    })

    return webSocket
  }

  const waitForSocketConnection = (webSocket, callback) => {
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (webSocket.readyState === 1) {
          callback()
          return
        } else {
          console.log("show: wait for connection...")
          waitForSocketConnection(webSocket, callback)
        }
      }, 100) // wait 100 milisecond for the connection...
  }

  const check = (list) => list.reduce((reducer, item) => reducer && item.ws.readyState === 1 ? true : false, true)

  const tryCheck = (ch, callback) => {
    setTimeout(
      function () {
        if (check(ch)) {
          callback()
          return
        } else {
          console.log("show: wait for connection...")
          tryCheck(ch, callback)
        }
      }, 100)
  }

  const sendMessage = (webSocket, data) => {
    try {
      webSocket.send(JSON.stringify({ ...data }))
    }
    catch (err) {
      console.log(err.message)
    }
  }

  const execute = () => {
    dispatch(actions.startLoading())
    let channels = []
    media.forEach(item => {
      if (!channels.includes(item.experiment))
        channels.push(item.experiment)
    })
    const ch = channels.map(item => ({ id: item, 'ws': connect(item) }))
    console.log(ch)
    setRefs(ch)
    tryCheck(ch, () => {
      ch.forEach(item => item.ws.close())
      dispatch(actions.finishLoading())
      if (ch.length === 1) {
        history.push(`/module/experiment/${ch[0].id}`)
      } else {
        history.push(`/subscriptions/${match.params.id}`)
      }
    })
  }

  useEffect(() => {
    axios.post(`${host}/module/run/${match.params.id}`, {}, authHeaderJSON()).then(
      function (res) {
        if (!['active', 'builded'].includes(res.data.state)) history.goBack()
        const obj = new showdown.Converter({ tables: true })

        let type
        [...res.data.elements_type].some(item => {
          if (item.kind === 'input') {
            type = item.value
            return true
          }
        })
        console.log({ ...res.data, html: obj.makeHtml(res.data.protocol), type })
        setModule({ ...res.data, html: obj.makeHtml(res.data.protocol), type })
        setMedia(res.data.elements.map(item => ({ ...item, hover: false, progress: 100, uploaded: true })))
        setLoading(false)
      }
    ).catch(
      function (err) {
        error(err)
        console.error(err.response)
      }
    )

    return () => {
      if (refs.length > 0) {
        refs.forEach(ref => ref.ws.close())
      }
    }
  }, [match.params.id])

  const content = () => {
    if (step === 0) {
      return <div className="p-3" style={{ overflow: 'scroll' }}>
        {ReactHtmlParser(module.html, options)}
      </div>
    } else if (step === 1) {
      return <InputFile init={module.state === 'builded' ? true : false} enterMedia={enterMedia} cancelUpload={cancelUpload} leaveMedia={leaveMedia} media={media} addMedia={addMedia} deleteMedia={deleteMedia} pattern={module.extensions ? new RegExp(`^${module.type}/*(${module.extensions.split(' ').join('|')})$`) : new RegExp(`^${module.type}/.*$`)} />
    } else {
      return <Example change={setExample} examples={example} id={match.params.id} type={module.type} />
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
            {/* <Grid container justify="center" direction="row" className="mb-3">
              <Grid item xs={12}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                  <Link color="inherit" onClick={to(`/subscriptions`)}>Algorithms</Link>
                  <Link color="inherit" onClick={to(`/module/${module.image_name}`)}>{ucWords(module.name)}</Link>
                  <Typography color="textSecondary">Run</Typography>
                </Breadcrumbs>
              </Grid>
            </Grid> */}
            {content()}
            {
              sm ? <div className={classes.actions}>
                <div className={classes.buttons}>
                  <Button disabled={step === 0} onClick={handleStep(step - 1)} className={classes.backButton}>Back</Button>
                  <Button disabled={step === 1 && media.length === 0} variant="contained" color="primary" onClick={step === 0 ? handleStep(step + 1) : step == 1 ? execute : uploadExamples}>{step === 0 ? 'Next' : step == 1 ? 'execute' : 'save'}</Button>
                </div>
                {
                  step === 1 ? module.state === 'builded' ? null : <Link component="button" onClick={handleStep(2)}>
                    <Typography variant="h5" color="primary">Do you want to do a little test?</Typography>
                  </Link> : null
                }
              </div> : <div className={classes.actions}>
                  <div className={classes.buttons}>
                    <IconButton disabled={step === 0} onClick={handleStep(step - 1)} className={classes.backButton}>
                      <ArrowBack />
                    </IconButton>
                    <IconButton disabled={step === 1 && media.length === 0} variant="contained" color="primary" onClick={step === 0 ? handleStep(step + 1) : step === 1 ? execute : uploadExamples}>{step === 0 ? <ArrowForward /> : step === 1 ? <PlayArrow /> : <Save />}</IconButton>
                  </div>
                  {
                    step === 1 ? module.state === 'builded' ? null : <Link component="button" onClick={handleStep(2)}>
                      <Typography variant="h5" color="primary">Do you want to do a little test?</Typography>
                    </Link> : null
                  }
                </div>
            }
          </>
      }
    </div>
  </>
}