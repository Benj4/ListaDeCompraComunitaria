import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
// import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import NotificationsIcon from '@material-ui/icons/Notifications';

import { mainListItems } from './LeftMenu';
// import SimpleLineChart from './SimpleLineChart';
// import SimpleTable from './SimpleTable';
import Avatar from './Avatar';
import firebase from './firebase';
import GoogleLogin from './googleLogin';
import ListaCompra from './List/ListaCompra';
import CompradorHeader from './List/CompradorHeader';
import ListaTotal from './List/ListaTotal';

import AddDialog from './AddDialog/AddDialog';

const db = firebase.firestore();

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
    paddingTop: 100
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 16,
  }
});

class Dashboard extends React.Component {
  
  state = {
    open: true,
    user: false,
    listaDelDia : { lista: {} },
    itemList : []
  };

  componentWillMount(){

    //cuando el usuario hace login
    firebase.auth().getRedirectResult().then( (result) => {
      var user = result.user;
      if( user ){
        console.log('Redirect: user', user.providerData[0]);
        this.setState( {user: user.providerData[0]} );
      }else{
        console.log('Redirect: not logged');
      }
      
    }).catch(function(error) {
      console.log('getRedirectResult error', error);

    });

    //cuando la pagina se carga y toma el login de las cookies
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        console.log('User is signed in.', user.providerData[0]);
        this.setState( {user: user.providerData[0]} );
      } else {
        this.setState( {user: null} );
      }
    });

    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0'); 
    var yyyy = now.getFullYear();

    //var dayId = mm + '-' + dd + '-' + yyyy
    var dayId = dd + '-' + mm + '-' + yyyy
    this.setState({ dayId : dayId }, ()=>{
      this.listenList();
      this.listenItems();
    })


  }

  listenItems = () => {
    var that = this;
    var items = [];
    db.collection("items").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          items.push( { label: doc.id } );
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
      });
      that.setState({ itemList : items });
  });
  }

  listenList = () => {
    

    db.collection("listas").doc(this.state.dayId)
    .onSnapshot( (doc) => {
        if( !doc.exists ){
          
          db.collection("listas").doc(this.state.dayId).set({
            createdAt : new Date(),
            updatedAt : new Date(),
            lista : {}
          })
          // .then(function() {
          //     console.log("Document successfully written!");
          // })
          // .catch(function(error) {
          //     console.error("Error writing document: ", error);
          // });

        }else{

          this.setState( { listaDelDia : doc.data() } )

        }
        
    });

  }

  reciveItem = (item) => {
    if( !!this.state.listaDelDia.bloqueada ){
      return;
    }
    if( this.state.user && this.state.user.uid ){
      const listaDelDia = this.state.listaDelDia;
      var listaUsuario = listaDelDia.lista[this.state.user.uid];

      //TODO: incrementar cantidad cuando el item ya exista
      if(listaUsuario){
        listaUsuario.items.push( item );
      }else{
        
        const { uid, displayName, photoURL } = this.state.user;
        listaDelDia.lista[this.state.user.uid] = { userData : { uid, displayName, photoURL }, items: [item]};
      }


      db.collection("listas").doc(this.state.dayId).update({
        updatedAt : new Date(),
        lista : listaDelDia.lista
      })

      //this.setState( { listaDelDia : listaDelDia } );

    }

    //TODO: no agregar cuando ya existe
    db.collection("items").doc(item.item).set({
      name : item.item
    })

  }

  deleteItem = (item) => {
    var uid = this.state.user.uid;
    const listaDelDia = this.state.listaDelDia;
    const newItemList = [...listaDelDia.lista[uid].items];
    const itemToDelete = newItemList.indexOf(item);
    
    newItemList.splice(itemToDelete, 1);

    db.collection("listas").doc(this.state.dayId).update({
      updatedAt : new Date(),
      ["lista."+uid+".items"] : newItemList
    })

  };

  handleChangeComprador = (value) => {

    var user = null;
    if (value) {
      const { uid, displayName, photoURL } = this.state.user
      user = { uid, displayName, photoURL };
    }
    
    db.collection("listas").doc(this.state.dayId).update({
      updatedAt : new Date(),
      //TODO: enviar solo datos del usuario que se utilizan ( photo, nombre )
      comprador : user
    })

  }

  handleChangeBloqueoLista = (value) => {
    
    db.collection("listas").doc(this.state.dayId).update({
      updatedAt : new Date(),
      
      bloqueada : !!value
    })

  }

  generarCobro = () => {

    const listaDelDia = this.state.listaDelDia;
    var userList = {};

    const collecDeudas = db.collection("deudas");

    for (const key in listaDelDia.lista) {
      if (listaDelDia.lista.hasOwnProperty(key)) {
        // let keyday = this.state.dayId.split('-').join(''); //si si, que ineficiente bla bla . . .
        // userList[key] = {};
        // userList[key][keyday] = {
        //   userData : listaDelDia.lista[key].userData,
        //   dauda : listaDelDia.lista[key].items.reduce( (prev, curr) => prev + curr.valor, 0 ),
        //   cancelado : 0
        // }

        collecDeudas.where("dayId", "==", this.state.dayId).where("deudor", "==", listaDelDia.lista[key].userData)
        .get()
        .then( (querySnapshot) => {
            querySnapshot.forEach(function(doc) {
               
                collecDeudas.doc(doc.id).update({
                  updatedAt : new Date(),
                  dauda : listaDelDia.lista[key].items.reduce( (prev, curr) => prev + curr.valor, 0 ),
                })

            });

            if(querySnapshot.size == 0){

              const { uid, displayName, photoURL } = this.state.user;
        
              collecDeudas.doc().set({
                createdAt : new Date(),
                dayId : this.state.dayId,
                deudor : listaDelDia.lista[key].userData,
                cobrador : { uid, displayName, photoURL },
                dauda : listaDelDia.lista[key].items.reduce( (prev, curr) => prev + curr.valor, 0 ),
                cancelado : 0
              });

            }
        })
        

      }
    }


    //habilitar actualizar
    // db.collection("deudas").doc(this.state.user.uid).set({
    //   createdAt : new Date(),
    //   dayId : this.state.dayId,
    //   deudas : userList
    // })
    // .then(function() {
    //   alert('ok');
    // })
    // .catch(function(error) {
    //     console.error("Error writing document: ", error);
    // });

  }

  setItemValor = (item) => {

    const listaDelDia = this.state.listaDelDia;

    for (const key in listaDelDia.lista) {
      if (listaDelDia.lista.hasOwnProperty(key)) {
        let userlist = listaDelDia.lista[key];
        
        for (let i = 0; i < userlist.items.length; i++) {
          if (userlist.items[i].item == item.item) {
            userlist.items[i].valor = item.valor * userlist.items[i].cantidad;
            //break; //descomentar cuando se unifiquen numero de items
          }
          
        }

      }
    }

    //TODO: optimsar?
    db.collection("listas").doc(this.state.dayId).update({
      updatedAt : new Date(),
      ["lista"] : listaDelDia.lista
    })

    //this.setState( {listaDelDia: listaDelDia} )

  }

  setListChecks = (checks) => {
    db.collection("listas").doc(this.state.dayId).update({
      updatedAt : new Date(),
      listChecks : checks
    })
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Lista Desayuno
              {/* Desayuneitor3Mil!!!!11 */}
            </Typography>

            <Avatar user={this.state.user}  />
           
            <IconButton>
              <GoogleLogin user={this.state.user} />
            </IconButton>

          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>

        </Drawer>
        <main className={classes.content}>

          <CompradorHeader listaDelDia={this.state.listaDelDia} handleChangeComprador={ this.handleChangeComprador } loggedUserId={this.state.user ? this.state.user.uid : null} />

          <ListaCompra listaDelDia={this.state.listaDelDia} deleteItem={this.deleteItem} handleChangeBloqueoLista={this.handleChangeBloqueoLista} generarCobro={this.generarCobro} loggedUserId={this.state.user ? this.state.user.uid : null} />

          <ListaTotal listaDelDia={this.state.listaDelDia} setItemValor={this.setItemValor} setListChecks={this.setListChecks} loggedUserId={this.state.user ? this.state.user.uid : null} />

          <AddDialog addItem={ this.reciveItem } itemList={this.state.itemList} disabled={ !!this.state.listaDelDia.bloqueada } />
          
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);