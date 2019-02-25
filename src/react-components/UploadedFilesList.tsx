import * as React from 'react';
import  * as PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import UploadedFileCard from './UploadedFileCard';
import Paper from './MainGridLayout';
import {IUploadedFile} from '../services/blockchain_interaction';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: 16,
            width: 'calc(50% - 32px)',
            height: '100%',
            overflow: 'auto',
        },
    });

class UploadedFilesList extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={16} direction={'column-reverse'}>
                    {
                        this.props.uploadHistory.map((item: IUploadedFile, index: number) => (
                            <Grid item key={index}>
                                <UploadedFileCard downloadCallback={this.props.downloadCallback} file={item}/>
                            </Grid>))
                    }
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(UploadedFilesList);
