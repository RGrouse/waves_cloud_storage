import * as React from 'react';
import  * as PropTypes from 'prop-types';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import MainGridLayout from './MainGridLayout';
import MainAppBar, {IAccountInfo} from './MainAppBar';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {CssBaseline} from '@material-ui/core';
import {purple, blueGrey} from '@material-ui/core/colors';
import {BlockChainMaster} from '../services/blockchain_interaction';
import {KeystoreMaster} from '../services/keystore_interaction';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            textAlign: 'center',
            height: 'inherit',
        },
    });
const theme = createMuiTheme({
    palette: {
        primary: {
            light: blueGrey[300],
            main: blueGrey[500],
            dark: blueGrey[700],
        },
        secondary: {
            light: purple[300],
            main: purple[500],
            dark: purple[700],
        },
    },
    typography: {
        useNextVariants: true,
    },
});

function withRoot(Component: any) {
    function WithRoot(props: any) {
        // MuiThemeProvider makes the theme available down the React tree
        // thanks to React context.
        return (
            <MuiThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...props} />
            </MuiThemeProvider>
        );
    }

    return WithRoot;
}

interface MainState {
    address: string;
    balance: number | null;
    bm: BlockChainMaster | null;
    km: KeystoreMaster | null;  //km?:
}

class App extends React.Component<any, any> {
    state: MainState = {
        address: '',
        balance: null,
        bm: null,
        km: null,
    };
    login(wavesSeed: string) {
        let bm: BlockChainMaster = new BlockChainMaster(wavesSeed);
        let km: KeystoreMaster = new KeystoreMaster();
        bm.getAddress().then(
            (addr: string) => {
                bm.getWavesBalance(addr).then((balance: number) => {
                    const newState = Object.assign({}, this.state);
                    newState.address = addr;
                    newState.balance = balance;
                    newState.bm = bm;
                    newState.km = km;
                    this.setState(newState);
                });
            });
    }
    updateBalance() {
        if (!this.state.bm) { return; }
        this.state.bm.getAddress().then(
            (addr: string) => {
                this.state.bm.getWavesBalance(addr).then((balance: number) => {
                    const newState = Object.assign({}, this.state);
                    newState.balance = balance;
                    this.setState(newState);
                });
            });
    }
    constructor(props: any) {
        super(props);
    }

    render(): React.ReactNode {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <MainAppBar
                    loginCallback={this.login.bind(this)}
                    address={this.state.address}
                    balance={this.state.balance}
                    updateBalanceCallback={this.updateBalance.bind(this)}/>
                <MainGridLayout
                    km={this.state.km}
                    bm={this.state.bm}
                    updateBalanceCallback={this.updateBalance.bind(this)} />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(App));
