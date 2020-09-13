import {
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select
} from '@material-ui/core';
import img from 'assets/img/default.jpg';
import video from 'assets/img/video.jpg';
import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    paddingBottom: '80%'
  },
  card: {
    willChange: 'transform, opacity',
    position: 'absolute',
    width: '100%'
  },
  media: {
    paddingTop: '80%',
    height: 0,
    width: '100%'
  },
  icon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1)
  },
  help: {
    marginLeft: theme.spacing(1),
    position: 'absolute',
    bottom: theme.spacing(1)
  }
}));

const scale = s => `scale(${s})`;

export default function({ change, element }) {
  const classes = useStyles();

  const [dialog, setDialog] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: element.value === 'video' ? 1 : 0,
    transform: `perspective(600px) rotateX(${
      element.value === 'video' ? 180 : 0
    }deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  const [props, set] = useSpring(() => ({
    scale: 1,
    config: { mass: 5, tension: 350, friction: 40 }
  }));

  const AnimatedIconButton = animated(IconButton);
  const AnimatedCard = animated(Card);

  const handleElement = e => {
    change({ ...element, [e.target.name]: e.target.value });
  };

  const handleDialog = (value = dialog) => () => {
    setDialog(value);
  };

  return (
    <>
      <div
        className={classes.root}
        onMouseEnter={() => set({ scale: 1.3 })}
        onMouseLeave={() => set({ scale: 1 })}>
        <AnimatedCard
          className={classes.card}
          style={{ opacity: opacity.interpolate(o => 1 - o), transform }}>
          <CardMedia
            className={classes.media}
            image={img}
            title="Contemplative Reptile"
          />
        </AnimatedCard>
        <AnimatedCard
          className={classes.card}
          style={{
            opacity,
            transform: transform.interpolate(t => `${t} rotateX(180deg)`)
          }}>
          <CardMedia
            className={classes.media}
            image={video}
            title="Contemplative Reptile"
          />
        </AnimatedCard>
        <FormHelperText className={classes.help}>
          Quantity:{' '}
          {element.len > 0 ? `Many ${element.value}s` : `One ${element.value}`}
        </FormHelperText>
        <AnimatedIconButton
          className={classes.icon}
          aria-label="settings"
          size="small"
          style={{ transform: props.scale.interpolate(scale) }}
          onClick={handleDialog(true)}>
          <Icon fontSize="small" className="fal fa-cog" />
        </AnimatedIconButton>
      </div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={dialog}
        onClose={handleDialog(false)}
        aria-labelledby="max-width-dialog-title">
        <DialogTitle id="max-width-dialog-title">
          Define series settings
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item className="p-2" xs={12} sm={6}>
              <FormControl
                className={classes.formControl}
                fullWidth
                variant="outlined"
                size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  name="value"
                  value={element.value}
                  onChange={handleElement}
                  label="Type">
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item className="p-2" xs={12} sm={6}>
              <FormControl
                className={classes.formControl}
                fullWidth
                variant="outlined"
                size="small">
                <InputLabel>Quantity of elements</InputLabel>
                <Select
                  label="Quantity of elements"
                  name="len"
                  value={element.len}
                  onChange={handleElement}>
                  <MenuItem value={0}>One {element.value}</MenuItem>
                  <MenuItem value={1}>Many {element.value}s</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
