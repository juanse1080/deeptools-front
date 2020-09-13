import { Chip, Link, Typography } from '@material-ui/core';
import React from 'react';
import { title } from 'utils';

export default function Detail({ module, viewOwner }) {
  return (
    <>
      <Typography>{module.description}</Typography>
      <Typography className="mt-3 mb-2 text-secondary">
        <span className="mr-1">Developer:</span>
        <Link onClick={viewOwner(module.user.id)}>
          {title(`${module.user.first_name} ${module.user.last_name}`)}
        </Link>
      </Typography>

      <Typography></Typography>
      {module.extensions ? (
        <>
          <Typography className="mt-3 mb-2 text-secondary">
            Extensions:
          </Typography>
          {module.extensions.split(' ').map(extension => (
            <Chip
              variant="outlined"
              key={extension}
              label={extension}
              className="m-1"
            />
          ))}
        </>
      ) : (
        <>
          <Typography className="mt-3 mb-2 text-secondary">
            Extensions:
          </Typography>
          <Chip
            variant="outlined"
            label={`${title(module.elements.input.value)} extensions`}
            className="m-1"
          />
        </>
      )}
    </>
  );
}
