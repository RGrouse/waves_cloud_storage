import * as React from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Update from '@material-ui/icons/Update';
import LoginButtonWithDialog from './LoginButtonWithDialog';

const styles = createStyles({
    root: {
        margin: 0,
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
});

class MainAppBar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position='static'>
                    <Toolbar>
                        {this.props.balance &&
                            [<Typography key='account_balance' variant='body1' color='inherit'>
                                {'Your balance: ' + this.props.balance}
                            </Typography>,
                            <IconButton key='update_balance' aria-label='Update' color='inherit' onClick={this.props.updateBalanceCallback()} >
                                <Update/>
                            </IconButton>]
                        }
                        <Typography variant='h6' color='inherit' className={classes.grow}>
                            Clex
                        </Typography>
                        <Typography variant='body1' color='inherit'>
                            {this.props.address}
                        </Typography>
                        <LoginButtonWithDialog loginCallback={this.props.loginCallback}/>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(MainAppBar);
