import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import useStyles from './InputFileStyles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function FileUpload({
  onChange,
  id,
  link,
  titleTooltip,
  accept,
  pattern,
  error,
  className
}) {
  const haveValue = link && link !== '';
  const [image, setImage] = useState({
    haveValue: haveValue,
    nameFile:
      (haveValue && 'Click para ver el archivo.') || 'Select an image...',
    undo: false, //Activacion del toogle cuando el formato no es el admitido
    errorText: 'Error al cargar el archivo',
    undoError: false,
    dragOver: false
  });

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [danger, setDanger] = React.useState(false);

  const button = 'Select';
  const classes = useStyles();
  const acceptInput = accept || '';
  const patternInput = pattern || '';
  const idInput = id || 'input-upload-img';
  const fileNode = React.useRef();
  const errorText = error || 'El formato no corresponde con el permitido';

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.button]: true,
    [classes.buttonDanger]: danger
  });

  const handleUndo = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setImage({ ...image, undo: false });
  };

  const handleUndoError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setImage({ ...image, undoError: false });
  };

  const handleButtonClick = () => {
    fileNode.current.click();
  };

  const handleOnloading = () => {
    setDanger(false);
    setSuccess(false);
    setLoading(true);
  };

  const handleSuccess = () => {
    setSuccess(true);
    setDanger(false);
    setLoading(false);
  };

  const handleNormal = () => {
    setSuccess(false);
    setLoading(false);
    setDanger(false);
  };

  const handleError = error => {
    setSuccess(false);
    setLoading(false);
    setDanger(true);
    setImage({
      ...image,
      nameFile: 'Intentelo nuevamente...',
      undoError: true,
      errorText: (error !== '' && error) || 'Error al cargar el archivo',
      dragOver: false
    });
  };

  const handleChange = e => {
    const file =
      (e.target.files && e.target.files[0]) ||
      (e.dataTransfer && e.dataTransfer.files[0]);
    const reader = new FileReader();
    if (file && !file.type.match(patternInput)) {
      setImage({ ...image, undo: true, dragOver: false });
      return;
    }
    if (file) {
      reader.onload = e => {
        setImage(image => ({
          ...image,
          nameFile: file.name,
          dragOver: false
        }));
        if (onChange) {
          onChange(
            idInput,
            file,
            handleOnloading,
            handleSuccess,
            handleNormal,
            handleError
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = e => {
    setImage({ ...image, dragOver: true });
    e.preventDefault();
  };
  const onDragLeave = e => {
    setImage({ ...image, dragOver: false });
    e.preventDefault();
  };
  const onDragOver = e => {
    setImage({ ...image, dragOver: true });
    e.preventDefault();
  };
  const onDrop = e => {
    e.preventDefault();
    handleChange(e);
  };

  return (
    <div className={className}>
      <div
        className={clsx({
          [classes.wrapper]: true,
          [classes.wrapperDrag]: image.dragOver
        })}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}>
        <Tooltip title={titleTooltip} placement="top">
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={buttonClassname}
            disabled={loading}
            onClick={handleButtonClick}>
            {button}
          </Button>
        </Tooltip>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        <p className={classes.nameFile}>
          {image.dragOver ? 'Drop the file here' : image.nameFile}
        </p>
      </div>

      <input
        type="file"
        id={idInput}
        accept={acceptInput}
        style={{ display: 'none' }}
        onChange={handleChange}
        ref={fileNode}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        key="undo"
        open={image.undo}
        autoHideDuration={5000}
        onClose={handleUndo}>
        <Alert onClose={handleUndo} severity="warning">
          {errorText}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        key="undoError"
        open={image.undoError}
        autoHideDuration={5000}
        onClose={handleUndoError}>
        <Alert onClose={handleUndoError} severity="error">
          {image.errorText}
        </Alert>
      </Snackbar>
    </div>
  );
}

FileUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  titleTooltip: PropTypes.string.isRequired,
  accept: PropTypes.string,
  pattern: PropTypes.instanceOf(RegExp),
  error: PropTypes.string,
  className: PropTypes.string
};

export default FileUpload;
