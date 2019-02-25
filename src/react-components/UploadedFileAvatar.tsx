import * as React from 'react';
import  * as PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';

const styles = createStyles({
    avatar: {
        margin: 10,
    },
    pinkAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: pink[500],
    },
    greenAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: green[500],
    },
});

export interface Props extends WithStyles<typeof styles> {}

function UploadedFileAvatar(props: Props) {
    const {classes} = props;
    return (
        <Avatar className={classes.avatar}>
            <FolderIcon/>
        </Avatar>
    );
}

UploadedFileAvatar.propTypes = {
    classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(UploadedFileAvatar);