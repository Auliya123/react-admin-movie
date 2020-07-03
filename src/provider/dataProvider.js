import { fetchUtils, GET_LIST, GET_ONE, CREATE, UPDATE} from "react-admin";
import { API } from '../config/API';
import firebase from '../config/firebase';

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://movie-6a34e.firebaseio.com"
});

const API_URL = `${API.movie.baseUrl}`;
const API_KEY = `${API.movie.apiKey}`;
const LANGUAGE = "en-US";
const queryString = require("query-string");
const truncate = require("truncate");
const db = firebase.firestore();

const convertDataProviderRequestToHTTP = (type, resource, params) => {
  let url = "";
  switch (type) {
    case GET_LIST: {
      if (resource === "movies" && !params.query) {
        const now = new Date();
        const query = {
          api_key: API_KEY,
          language: LANGUAGE,
          sort_by: "revenue.desc",
          "vote_count.gte": (params && params.voteFilterNumber) || 50,
          page: (params && params.page) || 1,
          "primary_release_date.gte":
            params && params.releaseDateAfter
              ? params.releaseDateAfter
              : new Date(now.setFullYear(now.getFullYear() - 1))
                .toISOString()
                .split("T")[0]
        };
        url = `${API_URL}/discover/movie?${queryString.stringify(query)}`;
      } else if (resource === "movies" && params.query) {
        const query = {
          api_key: API_KEY,
          language: LANGUAGE,
          page: params.page || 1,
          query: params.query
        };
        url = `${API_URL}/search/movie?${queryString.stringify(query)}`;
      } else if (resource === "genres") {
        const query = {
          api_key: API_KEY
        };
        url = `${API_URL}/genre/movie/list?${queryString.stringify(query)}`;
      }
      else if (resource === "users") {
        url = `${API.firestore.baseUrl}`;
      }
      else if (resource === "favorites") {
        url = `${API.firestore.baseUrl}/${firebase.auth().currentUser.uid}`
      }
      break;
    }

    case GET_ONE: {
      if (resource === "movies") {
        const query = {
          api_key: API_KEY
        };
        url = `${API_URL}/movie/${params.id}?${queryString.stringify(
          query
        )}`;
      }
      else if (resource === "users") {
        url = `${API.firestore.baseUrl}/${params.id}`;
      }
      break;
    }

    case CREATE: {
      if (resource === "users") {
        const email = params.data.email;
        const password = params.data.password;
        return firebase.auth()
          .createUserWithEmailAndPassword(email, password)
          .then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
              id: cred.user.uid,
              name: params.data.name,
              email: params.data.email,
              password: params.data.password,
              role: params.data.role
            });
          }
          )
          .then(() => {
            alert("success")
          })
      }
      break;
    }
    case UPDATE: {
      if (resource === "users") {
        console.log(params.data);

        return db.collection("users")
          .doc(params.data.id)
          .update({
            id: params.data.id,
            name: params.data.name,
            email: params.data.email,
            password: params.data.password,
            role: params.data.role
          })
          .then(() => {
            alert("success")
          });
      }
    }
    default:
      throw new Error(`Unsupported fetch action type ${type}`);
  }
  return { url }
};

const poster_base_url = "http://image.tmdb.org/t/p/w342";
const avatar_base_url = "http://image.tmdb.org/t/p/w92";
const poster_show_base_url = "http://image.tmdb.org/t/p/w500/";
const convertHTTPResponseToDataProvider = (
  response,
  type,
  resource,
  params
) => {
  const { json } = response;
  switch (type) {
    case GET_LIST: {
      if (resource === "movies") {
        return {
          data: json.results.map(x => {
            return {
              ...x,
              ...{
                image_path: x.poster_path
                  ? `${poster_base_url}${x.poster_path}`
                  : ""
              },
              ...{
                avatar_path: x.poster_path
                  ? `${avatar_base_url}${x.poster_path}`
                  : ""
              },
              ...{
                short_overview:
                  x.overview.length > 240
                    ? truncate(x.overview, 240)
                    : x.overview
              }
            };
          }),
          total: json.results.length
        };
      } else if (resource === "genres") {
        return {
          data: json.genres,
          total: json.genres.length
        };
      } else if (resource === "users") {
        return {
          data: json.documents.map(x => {
            return {
              ...x,
              ...{
                id: x.fields.id.stringValue
              },
              ...{
                name: x.fields.name.stringValue
              },
              ...{
                email: x.fields.email.stringValue
              },
              ...{
                password:
                  x.fields.password.stringValue
              },
              ...{
                role:
                  x.fields.role.stringValue
              }
            };
          }),
          total: json.documents.length
        };
      }
      else if (resource === "favorites") {
        return {
          data: json.fields.favoritesMovies.arrayValue.values.map(x => {
            return {
              ...x,
              ...{
                favoritesMovies: x.integerValue
              },
            };
          }),
          total: json.fields.favoritesMovies.arrayValue.values.length
        }
      }
      break;
    }
    case GET_ONE: {
      if (resource === "movies") {
        json["image_path"] = poster_show_base_url + json.poster_path;
        const logos = json.production_companies.reduce((acc, c) => {
          if (c.logo_path) {
            const logoPath = c.logo_path.split(".png")[0] + ".svg";
            acc.push(avatar_base_url + logoPath);
          }
          return acc;
        }, []);
        json["company_logos"] = logos;
        return {
          data: json
        };
      }
      if (resource === "users") {
        const name = json.fields.name.stringValue;
        const role = json.fields.role.stringValue;
        json["name"] = name;
        json["role"] = role;
        return {
          data: json
        }
      }
      break;
    }
    default:
      return { data: json };
  }
};

export default(type, resource, params) => {
  const { fetchJson } = fetchUtils;
  const { url, options } = convertDataProviderRequestToHTTP(
    type,
    resource,
    params
  );
  return fetchJson(url, options).then(response =>
    convertHTTPResponseToDataProvider(response, type, resource, params)
  );
};
