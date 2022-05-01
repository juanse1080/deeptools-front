import { Grid } from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import Media from '../Media';
import ShowResponse from '../ShowResponse';

export default function({ value, types, ...others }) {  
  return (
    <div {...others}>
      <Grid
        className="mt-3"
        container
        spacing={2}
      >
        <Grid
          item
          lg={12}
          md={12}
          sm={12}
          xs={12}
        >
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              lg={5}
              md={6}
              sm={12}
              xs={12}
            >
              <Media
                type={types.input.value}
                values={value.input}
              />
            </Grid>
            <Grid
              item
              lg={7}
              md={6}
              sm={12}
              xs={12}
            >
              {value.graph.map((graph, key) => (
                <HighchartsReact
                  highcharts={Highcharts}
                  key={key}
                  options={JSON.parse(graph)}
                  updateArgs={[true, true, true]}
                />
              ))}
            </Grid>            
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
            >
              <ShowResponse value={value.response[0]} />
            </Grid>
          </Grid>
        </Grid>        
      </Grid>
    </div>
  );
}
