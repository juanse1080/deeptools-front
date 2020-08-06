import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default function ShowHighcharts({ element }) {
  return <>
    {
      element.map((graph, key) => {
        return <HighchartsReact
          key={key}
          highcharts={Highcharts}
          options={JSON.parse(graph.value)}
          updateArgs={[true, true, true]}
        />
      }

      )
    }
  </>
}