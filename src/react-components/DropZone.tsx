import * as React from 'react';
import {DropzoneArea} from 'material-ui-dropzone';

export default class DropZone extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            files: []
        };
    }
    handleChange(files: any) {
        this.setState({
            files: files
        });
    }
    render() {
        return (
            <DropzoneArea
                showAlerts={false}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}
