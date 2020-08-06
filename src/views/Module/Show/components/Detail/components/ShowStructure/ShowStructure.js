import React from 'react'
import { Full, First, Order } from './components'

export default function ShowStructure({ elements }) {

  
  const renderStructure = () => {
    if (elements.input && elements.response && elements.output && elements.graph.length > 0) {
      return 0
    } else if (elements.input && elements.response && elements.graph.length > 0) {
      return 1
    } else if (elements.input && elements.response && elements.output) {
      return 2
    } else {
      console.error("Error in the relation of the structures")
    }
  }
  console.log(elements)

  const views = [
    <Full elements={elements} />,
    <First elements={elements} />,
    <Order elements={elements} />,
  ]

  return <>
    {
      views[renderStructure()]
    }
  </>
}