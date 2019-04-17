
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = {
  avatar: {
    margin: 5,
  },
  progress: {
    margin: 5,
  },
  // bigAvatar: {
  //   margin: 10,
  //   width: 60,
  //   height: 60,
  // },
};

function ImageAvatars(props) {
  const { classes, user } = props;
  return (
    <IconButton color="inherit">
      <Grid container justify="rigth" alignItems="rigth">
        { user === false ? 
          <CircularProgress className={classes.progress} color="secondary" /> :
          (user ? <Avatar alt="Remy Sharp" src={user.photoURL} className={classes.avatar} /> : null)
        }
      </Grid>
    </IconButton>
    
  );
}

ImageAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageAvatars);
