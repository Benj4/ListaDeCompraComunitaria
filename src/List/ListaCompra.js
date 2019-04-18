import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';

import ListaPersona from './ListaPersona';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 100,
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
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

  render() {
    const { classes, usersList } = this.props;

    var users = [];
    for (const key in usersList) {
      if (usersList.hasOwnProperty(key)) {
        users.push( usersList[key] )
      }
    }

    return (
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

              <ListaPersona items={usersList[uid].items} deleteItem={this.props.deleteItem} showDelete={ this.props.loggedUserId == uid} />

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
    );
  }
}

ListaCompra.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListaCompra);
