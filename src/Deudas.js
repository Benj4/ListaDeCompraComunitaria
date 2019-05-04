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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import firebase from './firebase';
const db = firebase.firestore();

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
  check: {
    color: 'rgb(225, 0, 80)',
    '&$checked': {
      color: '#4caf50',
    },
  },
  checked: {}
});

class Deudas extends React.Component {
  state = {
    deudas : [],
    checked : {}
  };


  componentWillMount(){
    this.getDeudas();
  }

  getDeudas = () => {
    var deudas = [];
    if( this.props.loggedUserId ){
      db.collection("deudas").where("deudor.uid", "==", this.props.loggedUserId)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              deudas.push( { id : doc.id, data: doc.data() } );
          });
          this.setState({deudas: deudas});
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
          this.setState({deudas: deudas});
      });  
    }

  }

  render() {
    const { classes } = this.props;
    const options = {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }
    const lang = navigator.language || 'en-US' //"es-ES";

    return (
      <div>
        <h3>Deudas</h3>
        <Paper className={classes.paper}>
        <List className={classes.root}>
          { this.state.deudas.map(cobro => (
            
            <ListItem key={cobro.id}>
              <Avatar
                  src={cobro.data.cobrador.photoURL}
              />
             
              <ListItemText 
                primary={cobro.data.cobrador.displayName} 
                secondary={"Pagar: $ " + cobro.data.deuda}
              />
             
              <ListItemText 
                  primary={ (new Intl.DateTimeFormat(lang, options).format(cobro.data.createdAt.toDate())) }
                  secondary={ cobro.data.dayId }
              />

              <ListItemSecondaryAction>
             
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={this.state.checked[cobro.id]}
                      disabled={true}
                      defaultChecked={cobro.data.pagado}
                      classes={{
                        root: classes.check,
                        checked: classes.checked
                      }}
                    />
                  }
                  label="Pagado"
                />

              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        </Paper>
      </div>
    );
  }
}

Deudas.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Deudas);
