import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSpring, animated } from 'react-spring'

import { IconButton, Tooltip, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Settings } from '@material-ui/icons';

import Dialog from './Dialog'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    top: '0',
    right: '0',
  }
}))

const scale = (s) => `scale(${s})`

export default function ({ element, change }) {
  const classes = useStyles()
  const [props, set] = useSpring(() => ({ scale: 1, config: { mass: 5, tension: 350, friction: 40 } }))
  const AnimatedIconButton = animated(IconButton)

  const [dialog, setDialog] = useState(false)

  const toggleDialog = (value = dialog => !dialog) => () => setDialog(value)

  return <>
    <div className={classes.root} onMouseEnter={() => set({ scale: 1.3 })} onMouseLeave={() => set({ scale: 1 })}>
      {
        element.value.map((graph, key) =>
          <HighchartsReact
            key={key}
            highcharts={Highcharts}
            options={graph.options}
            updateArgs={[true, true, true]}
          />
        )
      }
      <AnimatedIconButton
        className={classes.icon}
        aria-label="settings"
        size="medium"
        style={{ transform: props.scale.interpolate(scale) }}
        onClick={toggleDialog(true)}
      >
        <Icon fontSize="small" className="fal fa-cog" />
      </AnimatedIconButton>
    </div>
    <Dialog toggle={toggleDialog} open={dialog} element={element} change={change} />
  </>
}