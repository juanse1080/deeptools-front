import React from 'react'

import { Order, Full, First } from '../index'

export default function ({ value, to, docker, id, ...others }) {
  console.log(docker.view)
  const getView = (index) => {
    switch (parseInt(index)) {
      case 0:
        return <Full
          types={docker.elements_type}
          value={value}
               />
      case 1:
        return <First
          types={docker.elements_type}
          value={value}
               />
      case 2:
        return <Order
          types={docker.elements_type}
          value={value}
               />
      default:
        break;
    }
  }

  return <div {...others}>
    {getView(docker.view)}
  </div>

}