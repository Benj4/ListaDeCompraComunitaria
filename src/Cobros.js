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

class Cobros extends React.Component {
  state = {
    cobros : [],
    checked : {}
  };


  componentWillMount(){
    this.getCobros();
  }

  getCobros = () => {
    var cobros = [];
    if( this.props.loggedUserId ){
      db.collection("deudas").where("cobrador.uid", "==", this.props.loggedUserId)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              cobros.push( { id : doc.id, data: doc.data() } );
          });
          this.setState({cobros: cobros});
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
          this.setState({cobros: cobros});
      });  
    }

  }

  handleToggle = cobroId => event => {
    const { cobros } = this.state;
    // checked[cobroId] = !event.target.checked;
    // this.setState({ checked });

    // console.log(event.target.checked);
    let cobro = cobros.find( c => c.id == cobroId );
    cobro.data.pagado = !cobro.data.pagado;

    db.collection("deudas").doc(cobroId).update({
      updatedAt : new Date(),
      'pagado' : cobro.data.pagado,
    })
    this.setState( { cobros } );

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
        <h3>Cobros</h3>
        <Paper className={classes.paper}>
        <List className={classes.root}>
          { this.state.cobros.map(cobro => (
            
            <ListItem key={cobro.id}>
              <Avatar
                  src={cobro.data.deudor.photoURL}
              />
             
              <ListItemText 
                primary={cobro.data.deudor.displayName} 
                secondary={"Cobrar: $ " + cobro.data.deuda}
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
                      defaultChecked={cobro.data.pagado}
                      onChange={this.handleToggle(cobro.id)}
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

Cobros.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cobros);
