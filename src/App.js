import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';
import { authProvider } from './provider/authProvider';
import { userList, userCreate, userEdit } from './users';
import movieFavorite from './movieFavorite';
import dataProvider from './provider/dataProvider';
import refreshedMoviesReducer from './refreshedMoviesReducer';
import movieList from './movieList';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FavoriteIcon from '@material-ui/icons/Favorite';
import UserIcon from '@material-ui/icons/Group';

// username=admin@gmail.com
// password = 12345678

class App extends Component {
  render() {
    return (
      <Admin
        customReducers={{ refreshedMoviesReducer }}
        authProvider={authProvider}
        dataProvider={dataProvider}
      >
        <Resource name="movies" list={movieList} icon={DashboardIcon} />
        <Resource name="users" list={userList} create={userCreate} edit={userEdit} icon={UserIcon} />
        <Resource name="favorites" list={movieFavorite} icon={FavoriteIcon} />
      </Admin>
    );
  }
}

export default App;
