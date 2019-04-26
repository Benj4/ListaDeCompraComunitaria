import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class ListaPersona extends React.Component {
  state = {
    
  };


  handleDelete = data => () => {

    this.props.deleteItem(data);

    //CODIGO BONITO
    /*
    this.setState(state => {
      const chipData = [...state.chipData];
      const chipToDelete = chipData.indexOf(data);
      chipData.splice(chipToDelete, 1);
      return { chipData };
    });
    */
  };

  render() {
    const { classes } = this.props;

    return (
      // <Paper className={classes.root}>
      <div>
        {this.props.items.map((data,i) => {
          let icon = null;

           return (
            <Chip
              key={i}
              icon={icon}
              label={data.item}
              avatar={<Avatar>{data.cantidad}</Avatar>}
              onDelete={this.props.showDelete ? this.handleDelete(data) : null}
              className={classes.chip}
              variant="outlined"
            />
          );
        })}
      </div>
    );
  }
}

ListaPersona.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListaPersona);
