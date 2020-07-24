import palette from '../palette';

export default {
  root: {
    // color: `${palette.primary.main} !important`,
    '&:not([href])': {
      color: `${palette.primary.main}`,
      '&:hover': {
        textDecoration: 'underline',
        color: `${palette.primary.main}`,
      }
    }
  }
};