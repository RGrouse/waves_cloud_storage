import * as React from 'react';
import  * as PropTypes from 'prop-types';
import { createStyles, withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloudDownload from '@material-ui/icons/CloudDownload';
import ShareIcon from '@material-ui/icons/Share';
import UploadedFileAvatar from './UploadedFileAvatar';
import {Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Utils from '../services/utils';

const styles = createStyles({
    paper: {
        padding: 8,
    },
    actions: {
        display: 'flex',
    },
});

class UploadedFileCard extends React.Component<any>  {
    constructor(props: any) {
        super(props);
    }
    handleUploadClick() {
        let uid: string = this.props.file.uid;
        this.props.downloadCallback(uid);
    }
    public render() {
        const {classes} = this.props;

        return (
            <Paper className={classes.paper}>
                <Grid container wrap='nowrap' spacing={8} alignItems={'center'}>
                    <Grid item>
                        <UploadedFileAvatar/>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <Typography noWrap align={'left'}>{this.props.file ? this.props.file.fileName : 'Title'}</Typography>
                        <Typography noWrap align={'left'}>{this.props.file ? Utils.formatDate(this.props.file.time) : 'Timestamp'}</Typography>
                    </Grid>
                    <CardActions disableActionSpacing>
                        <IconButton aria-label='Download' onClick={this.handleUploadClick.bind(this)}>
                            <CloudDownload/>
                        </IconButton>
                        <IconButton aria-label='Share'>
                            <ShareIcon/>
                        </IconButton>
                    </CardActions>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(UploadedFileCard);
