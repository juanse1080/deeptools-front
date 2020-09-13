import {
  Card,
  CardMedia,
  Grid,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { authHeaderJSON, host } from 'helpers';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { error } from 'utils';

const useStyles = makeStyles(theme => ({
  media: {
    paddingTop: '80%',
    height: 0,
    width: '100%'
  }
}));

export default function({ id, change, examples, type, ...others }) {
  const classes = useStyles();

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${host}/module/run/${id}/examples`, authHeaderJSON())
      .then(function(res) {
        setData([...res.data]);
      })
      .catch(function(err) {
        error(err);
        console.error(err.response);
      });
  }, [id, type]);

  const new_items = (e, values) => {
    change(values);
  };

  return (
    <div {...others}>
      <Grid container justify="flex-start" direction="row">
        <Grid item x={12} className="mb-2">
          <Typography variant="subtitle1">
            Select the multimedia elements you want for a short test
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="tags-outlined"
            size="small"
            options={data}
            getOptionLabel={option => option.name}
            value={examples}
            onChange={new_items}
            filterSelectedOptions
            renderInput={params => (
              <TextField {...params} variant="outlined" label="Examples" />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} className="mt-3">
        {examples.map((item, key) => (
          <Grid key={key} item xs={12} sm={6} md={6} lg={4} xl={3}>
            {type === 'image' ? (
              <Card>
                <CardMedia
                  className={classes.media}
                  image={`${host}${item.href}`}
                  title={item.href}
                />
              </Card>
            ) : (
              <ReactPlayer
                url={`${host}${item.href}`}
                className="react-player"
                controls
                playing
                muted
                loop
                width="100%"
                height="100%"
              />
            )}
            {console.log(type)}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
