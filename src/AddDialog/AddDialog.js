import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';

import SuggestItem from './SuggestItem';

class ResponsiveDialog extends React.Component {
  state = {
    open: false,
    itemValue : "",
    cantidad : 1 
  };

  handleChange = name => event => {   
    this.setState({ [name]: parseInt(event.target.value) || '' });
  };

  handleValue = ( value ) => {
    //elimino espacios y puntos
    this.setState({ itemValue : value.trim().replace(/\./g, "") });
  };

  handleClickOpen = () => {
    if( !this.state.open ){
      this.setState({ open: true, itemValue : "" });
    }
  };

  handleClose = () => {
    
    this.setState({ open: false, itemValue : "" });
  };

  handleAdd = () => {
    if( this.state.itemValue.length && parseInt(this.state.cantidad) > 0){
      this.props.addItem( { cantidad : parseInt(this.state.cantidad), item : this.state.itemValue }  );
    }
    this.setState({ open: false, itemValue : "" });
  };

  render() {
    const { fullScreen } = this.props;
    const fabStyle = {
      position: 'absolute',
      bottom: 10,
      right: 10,
    }

    return (
      <Fab style={fabStyle} color={'primary'} onClick={this.handleClickOpen} disabled={this.props.disabled}>

        <AddIcon />

        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"( ˘▽˘)っ♨"}</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
            </DialogContentText> */}
            <TextField
              id="cantidad"
              label="Number"
              value={this.state.cantidad}
              onChange={this.handleChange('cantidad')}
              type="text"
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <SuggestItem onChange={ this.handleValue } itemList={this.props.itemList} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.handleAdd} color="primary" autoFocus>
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
      </Fab>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ResponsiveDialog);
