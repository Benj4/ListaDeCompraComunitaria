import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';


import ListaPersona from './ListaPersona';

const styles = theme => ({
  root: {
    width: '100%',
    // marginTop: 100,
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper:{
    marginBottom : 50
  },
  bottomControls:{
    marginLeft: 10
  },
  button: {
    margin: theme.spacing.unit,
  }
});

class ListaCompra extends React.Component {
  state = {
    checked: [1],
  };

  handleDelete = data => () => {
    if (data.label === 'React') {
      alert('Why would you want to delete React?! :)'); // eslint-disable-line no-alert
      return;
    }

    this.setState(state => {
      const chipData = [...state.chipData];
      const chipToDelete = chipData.indexOf(data);
      chipData.splice(chipToDelete, 1);
      return { chipData };
    });
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.handleChangeBloqueoLista( event.target.checked );
  };

  render() {
    const { classes, listaDelDia } = this.props;
    const usersList = listaDelDia.lista;
    var allWithValues = true;
    for (const key in usersList) {
      if (usersList.hasOwnProperty(key)) {
        
        let arrMiniTotales = [];
        usersList[key].items.forEach(item => {
          if (item.valor) {
            arrMiniTotales.push( item.valor );
          }else{
            allWithValues = false;
          }
        });
        
        if( arrMiniTotales.length ){
          usersList[key].textTotal = arrMiniTotales.join(' + ') + ' = ' + arrMiniTotales.reduce((prev, curr) => prev + curr, 0);
        }

      }
    }



    const generarCobro = allWithValues && !!listaDelDia.bloqueada && ( this.props.loggedUserId && (listaDelDia.comprador && this.props.loggedUserId == listaDelDia.comprador.uid) );

    return (
      <Paper className={classes.paper}>
        <List className={classes.root}>
          { Object.keys(usersList).filter(u => usersList[u].items.length ).map(uid => (
            <ListItem key={uid} button>
              <ListItemAvatar>
                <Avatar
                  alt={usersList[uid].userData.displayName}
                  src={usersList[uid].userData.photoURL}
                />
              </ListItemAvatar>
              <ListItem >

                <ListaPersona items={usersList[uid].items} deleteItem={this.props.deleteItem} showDelete={ (this.props.loggedUserId == uid) && !listaDelDia.bloqueada }  />
                
              </ListItem>
              <ListItem >

                <ListItemText secondary={ usersList[uid].textTotal ? usersList[uid].textTotal : '' } />
              </ListItem>
              <ListItemSecondaryAction>
                {/* <Checkbox
                  onChange={this.handleToggle(uid)}
                  checked={this.state.checked.indexOf(uid) !== -1}
                /> */}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {/* <Paper className={classes.paper}> */}
          <FormControlLabel className={classes.bottomControls}
            control={
              <Switch
                checked={!!listaDelDia.bloqueada}
                onChange={this.handleChange('listaBloqueada')}
                value="listaBloqueada"
              />
            }
            label={'Bloquear lista'}
            disabled={ !this.props.loggedUserId || (listaDelDia.comprador && this.props.loggedUserId != listaDelDia.comprador.uid)}
          />
          { generarCobro ?
            <Button variant="outlined" color="primary" className={classes.button} onClick={this.props.generarCobro}>
              Generar cobro
            </Button>
            :null
          }
          

        {/* </Paper> */}

      </Paper>
    );
  }
}

ListaCompra.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListaCompra);
