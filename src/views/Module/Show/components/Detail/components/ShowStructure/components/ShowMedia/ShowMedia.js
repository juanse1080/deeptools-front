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
        variant="dots"
        steps={6}
        position="static"
        activeStep={0}
      /> : null
    }
  </>
}