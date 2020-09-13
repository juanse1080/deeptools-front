import { Card, Tooltip } from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import useStyles from './FileUploadImageStyles';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FileUpload({ onChange, id, preview, loaded, className, disableLabel, disableIcons }) {

    const [image, setImage] = useState(
        {
            preview: preview || "",
            loaded: loaded || false,
            undo: false, //Activacion del toogle cuando el formato no es el admitido
            view: false, //Dialog para visualizar la imagen ya cargada
            dragOver: false,
        });

    const classes = useStyles();
    const accept = "image/*"; //Para que los celulares tengan posibilidad de usar la camara
    const idInput = id || "input-upload-img"

    const handleUndo = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setImage({ ...image, undo: false })
    }

    const handleCloseView = () => { setImage({ ...image, view: false }) }

    const handleChange = (e) => {
        const file = (e.target.files && e.target.files[0]) || (e.dataTransfer && e.dataTransfer.files[0]);
        const pattern = /image-*/;
        const reader = new FileReader();
        if (file && !file.type.match(pattern)) {
            setImage({ ...image, undo: true, dragOver: false })
            return;
        }
        if (file) {
            reader.onload = (e) => {
                setImage({
                    ...image,
                    preview: reader.result,
                    loaded: true,
                    dragOver: false,
                });
                if (onChange) {
                    onChange(idInput, file);
                }
            }
            reader.readAsDataURL(file);
        }
    }

    const onDragEnter = (e) => { setImage({ ...image, dragOver: true }); e.preventDefault(); }
    const onDragLeave = (e) => { setImage({ ...image, dragOver: false }); e.preventDefault(); }
    const onDragOver = (e) => { setImage({ ...image, dragOver: true }); e.preventDefault(); }
    const onDrop = (e) => { e.preventDefault(); handleChange(e); }

    return (
        <div className={className}>
            {image.loaded ?
                <>
                    <Tooltip title="Upload photo" placement="top">
                        <Card className={(image.dragOver ? classes.rootCardDrag : classes.rootCard) + " rounded-pill"} variant="outlined">
                            <CardMedia
                                className={classes.media}
                                image={image.preview}
                                title="prueba"
                                onDragEnter={onDragEnter}
                                onDragLeave={onDragLeave}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                            />
                            <label
                                className={classes.icons}
                                htmlFor={idInput}
                                onDragEnter={onDragEnter}
                                onDragLeave={onDragLeave}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                            />
                        </Card>
                    </Tooltip>
                </> :
                <label
                    htmlFor={idInput}
                    className={classes.root}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                >
                    <div className={clsx(classes.box, (image.dragOver) ? classes.boxDragOver : "")}>
                        <PermMediaIcon style={{ zIndex: 2 }} />
                        {
                            disableLabel ? null : (
                                <label style={{ zIndex: 2 }}>
                                    {(image.dragOver) ?
                                        "Suelte la imagen aquí"
                                        :
                                        "Seleccione una foto"
                                    }
                                </label>
                            )
                        }
                    </div>
                </label>
            }

            <input type="file" id={idInput} accept={accept} style={{ display: 'none' }} onChange={handleChange} />

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                key="undo"
                open={image.undo}
                autoHideDuration={5000}
                onClose={handleUndo}
            >
                <Alert onClose={handleUndo} severity="warning">
                    El formato no corresponde con el permitido
            </Alert>
            </Snackbar>

            <Dialog
                classes={{ root: classes.rootDialog, paperScrollBody: classes.paperScrollBody }}
                scroll="body"
                onClose={handleCloseView}
                aria-labelledby="customized-dialog-title"
                open={image.view}
                TransitionComponent={Transition}
            >
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseView}>
                    <CloseIcon />
                </IconButton>
                <img className={classes.viewPreview} src={image.preview} alt="Imagen preview" />
            </Dialog>
        </div>
    )
}

FileUpload.propTypes = {
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    preview: PropTypes.string,
    loaded: PropTypes.bool,
}

export default FileUpload;
