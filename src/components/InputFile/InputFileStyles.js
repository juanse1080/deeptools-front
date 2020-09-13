import { makeStyles } from '@material-ui/core/styles'
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  nameFile: {
    // textDecoration: "underline",
    color: "gray",
    display: "inline",
    margin: "0 10px 0 10px",
    // width: "100%",
    fontWeight: 400,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    position: "relative",
    borderRadius: "4px",
    // backgroundColor: "#ededed",
    border: '1px solid #0000003b',
    width: "100%",
    height: '37.66px',
    // padding: "5px",
    margin: 0,
    display: "flex",
    maxWidth: "100%",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  wrapperDrag: {
    border: "#009be5 1px dotted",
    backgroundColor: "#d0e5ff",
  },
  button: {
    minWidth: "104.5px",
    marginLeft: 2
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonDanger: {
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[600],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default useStyles