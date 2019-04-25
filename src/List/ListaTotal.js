import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import memoizeOne from 'memoize-one';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: theme.palette.background.paper,
  },
  paper : {
    padding : 10,
    marginTop : 10
  },
  legend:{
    fontSize: 'small',
    color: 'darkslategray'
  }
});

class ListaTotal extends React.Component {
  state = {
    checked: [],
    valoresCalculados: {}
  };

  //cuarda la operacion y no la ejecuta nuevamente si los parametros no cambian
  getListaTotal = memoizeOne(
    (lista) => {
      var listaTotal = [];
      for (const key in lista) {
        if (lista.hasOwnProperty(key)) {
          for (let i = 0; i < lista[key].items.length; i++) {
            const item = lista[key].items[i];
            const itemAdded = listaTotal.find( it => it.item == item.item );
            
            if( itemAdded ){
              itemAdded.cantidad += item.cantidad;
              itemAdded.total += item.valor ? item.valor : 0;
             
            }else{
              let cloneItem = Object.assign({}, item); //clona el objeto para no influir en los otros componentes
              cloneItem.total = cloneItem.valor ? cloneItem.valor : 0;
              listaTotal.push( cloneItem ); 
              
            }

          }
        }
      }
      return listaTotal;
    }
  );
    
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

  handleChange = item => event => {
    
    const { valoresCalculados } = this.state;
    try {
      valoresCalculados[item.item] = Math.round( parseInt(event.target.value) / item.cantidad );
    } catch (error) {}

    this.setState( { valoresCalculados : valoresCalculados } );

  }

  handleBlur = item => event => {
    
    this.props.setItemValor( { item : item.item, valor : this.state.valoresCalculados[item.item]} );

  }

  render() {
    const { classes, listaDelDia } = this.props;

    const listaTotal = this.getListaTotal(listaDelDia.lista);

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Lista Total
        </Typography>
        <Paper className={classes.paper}>
        <Table className={classes.table} aria-labelledby="tableTitle">

            <TableBody>
              {listaTotal.map(item => {
                  const isSelected = false;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={item.item}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox" onClick={this.handleToggle(item.item)} >
                        <Checkbox checked={this.state.checked.indexOf(item.item) !== -1} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {item.cantidad}
                      </TableCell>
                      <TableCell align="right">{item.item}</TableCell>
                      
                      <TableCell align="right">
                        <TextField
                          label="Valor"
                          // value={}
                          onChange={this.handleChange(item)}
                          onBlur={this.handleBlur(item)}
                          type="number"
                          defaultValue={ (item.total || '') }
                          //value={ (item.total || '') }
                          // className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          disabled={ !this.props.loggedUserId || (listaDelDia.comprador && this.props.loggedUserId != listaDelDia.comprador.uid)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
             
            </TableBody>
            
        </Table>
        <span className={classes.legend}> <i>* Si los valores ingresados cambian al actualizar la pagina, es porque se hace un redondeo para mantener los numeros enteros</i></span>
        </Paper>
        {/* 
        <Paper className={classes.paper}>
          <List className={classes.root}>
            {listaTotal.map(item => (
              <ListItem key={item.item} role={undefined} dense button onClick={this.handleToggle(item.item)}>
                <Checkbox
                  checked={this.state.checked.indexOf(item.item) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={`${item.cantidad} ${item.item}`} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">

                  <TextField
                    label="Valor"
                    // value={}
                    onChange={this.handleChange()}
                    type="number"
                    // className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />

                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
        */}
        
      </div>
    );
  }
}

ListaTotal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListaTotal);
