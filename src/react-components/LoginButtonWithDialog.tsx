import * as React from 'react';
import  * as PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default class LoginButtonWithDialog extends React.Component<any, any> {
    private wavesSeed: string;

    state = {
        open: false,
    };

    constructor(props: any) {
        super(props);
        this.wavesSeed = '';
    }

    handleClickOpen = () => {
        this.setState({open: true});
    }

    handleClose = () => {
        this.setState({open: false});
    }

    handleOnChange = (event: any) => {
        this.wavesSeed = event.target.value;
    }

    handleLogin = () => {
        this.handleClose();
        this.props.loginCallback(this.wavesSeed);
        this.wavesSeed = '';
    }

    render() {
        return (
            <div>
                <Button color='inherit' onClick={this.handleClickOpen}>
                    Login
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby='form-dialog-title'>
                    <DialogTitle id='form-dialog-title'>Login</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Чтобы загрузить файлы в блокчейн нужно войти в свой аккаунт. Все Data транзакции оплачиваются токенами Waves
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin='dense'
                            id='seed'
                            onChange={this.handleOnChange}
                            label='Waves seed'
                            type='text'
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>
                            Отмена
                        </Button>
                        <Button onClick={this.handleLogin} color='primary'>
                            Войти
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
