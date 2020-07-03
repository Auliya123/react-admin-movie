import React, { Component } from 'react';
import StackGrid from "react-stack-grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import {
  GET_LIST,
} from "react-admin";
import Chip from "@material-ui/core/Chip";
import SmileyIcon from "@material-ui/icons/SentimentSatisfied";
import MovieIcon from "@material-ui/icons/Movie";
import dataProvider from "./provider/dataProvider";
import { API } from './config/API';

const cardStyle = {
  width: 400,
  minHeight: 700,
  margin: "0.2em",
  paddingBottom: "0.5em",
  display: "inline-block",
  verticalAlign: "top"
};


export class movieFavorite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      genres: [],
      movies: []
    };
  }

  getMovies = () => {
    this.setState({ isLoading: true });
    dataProvider(GET_LIST, "favorites")
      .then(async data => {
        await Promise.all(data.data.map(data =>
          fetch(`${API.movie.baseUrl}/movie/${data.integerValue}?api_key=${API.movie.apiKey}`)
            .then(response => response.json())
        ))
          .then(data => { this.setState({ movies: data, isLoading: false }); console.log(data) })
      })
  }

  componentDidMount = () => {
    this.getMovies();
  }

  render() {
    const cardMediaStyle = {
      margin: "auto",
      display: "block",
      width: "100%",
      height: 500,
      zIndex: 2
    };

    return (
      <div>
        <StackGrid
          style={{ marginTop: 20 }}
          appearDelay={150}
          duration={700}
          columnWidth={400}
          gutterWidth={10}
          gutterHeight={5}
        >
          {this.state.movies.map(movie => (
            <Card key={movie.id} style={cardStyle}>
              <img src={`http://image.tmdb.org/t/p/w342${movie.poster_path}`} style={cardMediaStyle} />
              <MovieIcon
                align="center"
                style={{ float: "left", margin: "30px 0 0 12px" }}
              />
              <CardHeader title={movie.title} subheader={movie.release_date} />
              <CardContent>
                <SmileyIcon style={{ float: "left" }} />
                <Typography
                  variant="subheading"
                  align="left"
                  style={{ marginLeft: "30px" }}
                  paragraph
                  color="textSecondary"
                >
                  {movie.vote_average}
                </Typography>
                {movie.genres.map(genre => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                  />
                ))}
                <div
                  style={{ marginTop: "20px" }}
                > {movie.overview}</div>
              </CardContent>
            </Card>
          )
          )}
        </StackGrid>
      </div>
    )
  }
}

export default movieFavorite;



