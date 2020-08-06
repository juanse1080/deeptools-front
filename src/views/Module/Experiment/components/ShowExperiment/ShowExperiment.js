import React from 'react'

import { Order, Full } from '../index'

export default function ({ value, to, docker, id, ...others }) {
  const getView = (index) => {
    switch (parseInt(index)) {
      case 0:        
        return <Full value={value} types={docker.elements_type}/>
      case 2:        
        return <Order value={value} types={docker.elements_type}/>
      default:
        break;
    }
  }

  return <div {...others}>
    {getView(docker.view)}
  </div>

}