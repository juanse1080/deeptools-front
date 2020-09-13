import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    viewPreview: {
        width: "auto",
        height: "auto",
        maxWidth: "100%",
        maxHeight: "calc( 100vh - 69px )",
    },
    rootDialog: {
        lineHeight: 0,
    },
    rootCard: {
        position: 'relative',    
        '&:hover': {
            border: '1px dashed #0f5888',
        }
    },
    rootCardDrag: {
        border: '1px dashed #0f5888',
    },
    paperScrollBody: {
        overflowY: "hidden",
    },
    media: {
        height: 0,
        paddingTop: '100%',
    },
    imgPreview: {
        height: "auto",
        width: "auto",
        maxHeight: "100%",
        maxWidth: "100%",
        position: "absolute",
        alignSelf: "center",
        zIndex: 1,
        opacity: "0.2"
    },
    box: {
        zIndex: 1,
        position: "relative",
        cursor: 'pointer',
        borderRadius: '8px',
        borderStyle: 'dashed',
        borderWidth: '2px',
        paddingTop: '50%',
        paddingBottom: '50%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        fontSize: '12px',
        '&:hover': {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
        }

    },
    boxDragOver: {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
    },
    iconLoadDragOver: {
        color: theme.palette.primary.main,
    },
    icons: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
    },    
    buttonBase: {
        padding: 0,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export default useStyles