import {
  Card,
  CardMedia,
  Chip,
  Dialog,
  Icon,
  IconButton,
  makeStyles,
  MobileStepper,
  Paper,
  Slide
} from '@material-ui/core';
import { ArrowBack, ArrowForward, Visibility } from '@material-ui/icons';
import clsx from 'clsx';
import { host } from 'helpers';
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactPlayer from 'react-player';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  media: {
    paddingTop: '80%',
    height: 0,
    width: '100%'
  },
  group: {
    position: 'relative',
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:focus div.actions': {
      display: 'flex !important'
    },
    '&:active div.actions': {
      display: 'flex !important'
    }
  },
  stepper: {
    marginTop: theme.spacing(1),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    padding: 0
  },
  dots: {
    alignItems: 'center'
  },
  dot: {
    width: 6,
    height: 6
  },
  activeDot: {
    backgroundColor: 'inherit',
    width: 8,
    height: 8
  },
  viewPreview: {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: 'calc( 100vh - 69px )'
  },
  rootDialog: {
    lineHeight: 0
  },
  paperScrollBody: {
    overflowY: 'hidden',
    '&:hover div.actions': {
      display: 'flex !important'
    },
    '&:focus div.actions': {
      display: 'flex !important'
    },
    '&:active div.actions': {
      display: 'flex !important'
    }
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.grey[500]
  },
  iconButton: {
    fontSize: 15,
    margin: 5,
    width: 'auto'
  }
}));

export default function({ type, values, ...others }) {
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState(false);

  const changeMedia = index => () => {
    setIndex(index);
  };

  const handleCloseView = () => {
    setImage(false);
  };
  const handleShowView = () => {
    setImage(true);
  };

  return (
    <div {...others}>
      {type === 'image' ? (
        <>
          {values.length < 2 ? (
            <Card className={classes.group}>
              <CardMedia
                className={classes.media}
                image={`${host}${values[0]}`}
              />
              <Paper
                variant="outlined"
                style={{
                  display: isMobile ? 'flex' : 'none',
                  position: 'absolute',
                  right: 10,
                  borderRadius: '50%',
                  zIndex: 1,
                  bottom: 10
                }}
                className="actions">
                <IconButton size="small" onClick={handleShowView}>
                  <Visibility fontSize="small" />
                </IconButton>
              </Paper>
              <Dialog
                classes={{
                  root: classes.rootDialog,
                  paperScrollBody: classes.paperScrollBody
                }}
                scroll="body"
                onClose={handleCloseView}
                aria-labelledby="customized-dialog-title"
                open={image}
                TransitionComponent={Transition}>
                <img
                  className={classes.viewPreview}
                  src={`${host}${values[index]}`}
                  alt={values[index]}
                />
              </Dialog>
            </Card>
          ) : (
            <>
              <Card className={classes.group}>
                {index === 0 ? null : (
                  <Paper
                    variant="outlined"
                    style={{
                      display: isMobile ? 'flex' : 'none',
                      position: 'absolute',
                      left: 5,
                      borderRadius: '50%',
                      zIndex: 1,
                      bottom: 'calc(50% - 13px)'
                    }}
                    className="actions">
                    <IconButton size="small" onClick={changeMedia(index - 1)}>
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  </Paper>
                )}
                <CardMedia
                  className={classes.media}
                  image={`${host}${values[index]}`}
                />
                {index === values.length - 1 ? null : (
                  <Paper
                    variant="outlined"
                    style={{
                      display: isMobile ? 'flex' : 'none',
                      position: 'absolute',
                      right: 5,
                      borderRadius: '50%',
                      zIndex: 1,
                      bottom: 'calc(50% - 13px)'
                    }}
                    className="actions">
                    <IconButton size="small" onClick={changeMedia(index + 1)}>
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Paper>
                )}
                <Chip
                  variant="outlined"
                  label={`${index + 1}/${values.length}`}
                  className="actions"
                  style={{
                    display: isMobile ? 'flex' : 'none',
                    position: 'absolute',
                    top: 10,
                    right: 10
                  }}
                />
                <Paper
                  variant="outlined"
                  style={{
                    display: isMobile ? 'flex' : 'none',
                    position: 'absolute',
                    right: 10,
                    borderRadius: '50%',
                    zIndex: 1,
                    bottom: 10
                  }}
                  className="actions">
                  <IconButton size="small" onClick={handleShowView}>
                    <Icon
                      fontSize="small"
                      className={clsx(classes.iconButton, 'fal fa-eye')}
                    />
                  </IconButton>
                </Paper>
              </Card>
              <MobileStepper
                classes={{
                  root: classes.stepper,
                  dot: classes.dot,
                  dots: classes.dots
                }}
                variant="progress"
                steps={values.length + 1}
                position="static"
                activeStep={index + 1}
              />
              <Dialog
                classes={{
                  root: classes.rootDialog,
                  paperScrollBody: classes.paperScrollBody
                }}
                scroll="body"
                onClose={handleCloseView}
                aria-labelledby="customized-dialog-title"
                open={image}
                TransitionComponent={Transition}>
                {index === 0 ? null : (
                  <Paper
                    variant="outlined"
                    style={{
                      display: isMobile ? 'flex' : 'none',
                      position: 'absolute',
                      left: 5,
                      borderRadius: '50%',
                      zIndex: 1,
                      bottom: 'calc(50% - 13px)'
                    }}
                    className="actions">
                    <IconButton size="small" onClick={changeMedia(index - 1)}>
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  </Paper>
                )}
                <img
                  className={classes.viewPreview}
                  src={`${host}${values[index]}`}
                  alt={values[index]}
                />
                {index === values.length - 1 ? null : (
                  <Paper
                    variant="outlined"
                    style={{
                      display: isMobile ? 'flex' : 'none',
                      position: 'absolute',
                      right: 5,
                      borderRadius: '50%',
                      zIndex: 1,
                      bottom: 'calc(50% - 13px)'
                    }}
                    className="actions">
                    <IconButton size="small" onClick={changeMedia(index + 1)}>
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Paper>
                )}
                {/* <Chip variant="outlined" label={`${index + 1}/${values.length}`} className="actions" style={{ display: isMobile ? 'flex' : 'none', position: 'absolute', top: 10, right: 10 }} /> */}
              </Dialog>
            </>
          )}
        </>
      ) : values.length < 2 ? (
        <ReactPlayer
          url={`${host}${values[0]}`}
          className="react-player"
          controls
          playing
          muted
          loop
          width="100%"
          height="100%"
        />
      ) : (
        <div className={classes.group}>
          {index === 0 ? null : (
            <Paper
              variant="outlined"
              style={{
                display: isMobile ? 'flex' : 'none',
                position: 'absolute',
                left: 5,
                borderRadius: '50%',
                zIndex: 1,
                bottom: 'calc(50% - 13px)'
              }}
              className="actions">
              <IconButton size="small" onClick={changeMedia(index - 1)}>
                <ArrowBack fontSize="small" />
              </IconButton>
            </Paper>
          )}
          <ReactPlayer
            url={`${host}${values[index]}`}
            className="react-player"
            controls
            loop
            width="100%"
            height="100%"
          />
          {index === values.length - 1 ? null : (
            <Paper
              variant="outlined"
              style={{
                display: isMobile ? 'flex' : 'none',
                position: 'absolute',
                right: 5,
                borderRadius: '50%',
                zIndex: 1,
                bottom: 'calc(50% - 13px)'
              }}
              className="actions">
              <IconButton size="small" onClick={changeMedia(index + 1)}>
                <ArrowForward fontSize="small" />
              </IconButton>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}
