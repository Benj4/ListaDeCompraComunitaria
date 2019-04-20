import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  paper : {
    padding : 10,
    marginBottom : 10
  }
});

class ListaPersona extends React.Component {
  state = {
    comproYo: false
  };

    
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.handleChangeComprador( event.target.checked );
  };

  render() {
    const { classes, listaDelDia } = this.props;

    console.log( 'listaDelDia.comprador', listaDelDia.comprador );

    var label = "Hoy compro yo";
    if( listaDelDia.comprador != null && this.props.loggedUserId != listaDelDia.comprador.uid ){
      label = "Hoy compra " + listaDelDia.comprador.displayName ;
    }

    return (
      <Paper className={classes.paper}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.comproYo}
                onChange={this.handleChange('comproYo')}
                value="comproYo"
              />
            }
            label={label}
            disabled={listaDelDia.comprador && this.props.loggedUserId != listaDelDia.comprador.uid}
          />

      </Paper>
    );
  }
}

ListaPersona.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListaPersona);
