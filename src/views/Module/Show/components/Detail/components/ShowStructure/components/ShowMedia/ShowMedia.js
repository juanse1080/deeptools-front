import React from 'react'

import { Card, makeStyles, CardMedia, MobileStepper } from '@material-ui/core'

import img from 'assets/img/default.jpg'
import video from 'assets/img/video.jpg'

const useStyles = makeStyles(theme => ({
  card: {
    willChange: 'transform, opacity',
    width: '100%',
  },
  media: {
    paddingTop: '80%',
    height: 0,
    width: '100%'
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
}))

export default function ShowMedia({ element }) {
  const classes = useStyles()

  console.log(element)
  return <>
    <Card className={classes.card} >
      <CardMedia
        className={classes.media}
        image={element.value === "image" ? img : video}
        title="Contemplative Reptile"
      />
    </Card>
    {
      element.len > 0 ? <MobileStepper
        classes={{ root: classes.stepper, dot: classes.dot, dots: classes.dots }}
        variant="dots"
        steps={6}
        position="static"
        activeStep={0}
      /> : null
    }
  </>
}