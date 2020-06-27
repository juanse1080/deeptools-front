import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default function ShowHighcharts({ element }) {

  console.log(element)

  return <>
    {
      element.map((graph, key) => {
        console.log(JSON.parse(graph.value))
        return <HighchartsReact
          key={key}
          highcharts={Highcharts}
          options={JSON.parse(graph.value).options}
          updateArgs={[true, true, true]}
        />
      }

      )
    }
  </>
}