import * as React from 'react';
import  * as PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import UploadedFilesList from './UploadedFilesList';
import {DropzoneArea} from 'material-ui-dropzone';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            display: 'flex',
            alignItems: 'flex-start',
            height: 'calc(100% - 64px)',
        },
        button: {
            margin: theme.spacing.unit,
        },
        paper: {
            margin: '16px 0 16px 16px',
            width: 'calc(50% - 32px)',
            padding: theme.spacing.unit * 2,
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    });

class MainGridLayout extends React.Component<any> {
    state = {
        uploadHistory: [],
        files: []
    };

    constructor(props: any) {
        super(props);
    }

    updateHistory() {
        const newState = Object.assign({}, this.state);
        newState.uploadHistory = this.props.km.getUploadHistory();
        this.setState(newState);
    }

    handleUploadClick = () => {
        let promises = [];
        if (this.props.km && this.props.bm) {
            for (let file of this.state.files) {
                promises.push(this.props.bm.uploadFile(file.path, '').then((uploadedFile: any) => {
                    this.props.km.addUploadedFileToKeystore(uploadedFile);
                });
            }
        }

        return Promise.all(promises).then(() => {
            this.updateHistory();

            setTimeout(() => {
                //this.props.updateBalanceCallback();
                }, 10000);
        });
    };
    handleFileSelect(files: any) {
        const newState = Object.assign({}, this.state);
        newState.files = files;
        this.setState(newState);
    }
    handleDownloadFile(uid: string) {
        if (this.props.km && this.props.bm) {
            let file = this.props.km.getUploadedFileInfo(uid);
            if (file) {
                this.props.bm.downloadFile(file, '');
            }
        }
    }
    componentDidUpdate(prevProps: any) {
        if ((this.props.km && this.props.bm) && (this.props.km !== prevProps.km)
            && (this.props.bm !== prevProps.bm)) {
            this.updateHistory();
        }
    }

    render() {
        const {classes} = this.props;

        let fileToUpload = this.props.km && this.props.bm ? (
            <Paper className={classes.paper}>
                <DropzoneArea
                    showAlerts={false}
                    onChange={this.handleFileSelect.bind(this)}
                />
                <Button variant='contained' component='span' className={classes.button} onClick={this.handleUploadClick}>
                    Upload
                </Button>
            </Paper>
        ) : null;
        return (
            <div className={classes.root}>
                { fileToUpload }
                <UploadedFilesList uploadHistory={this.state.uploadHistory} downloadCallback={this.handleDownloadFile.bind(this)}/>
            </div>

        );
    }
}

export default withStyles(styles)(MainGridLayout);
