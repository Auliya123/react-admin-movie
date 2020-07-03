export const API = {
    firestore: {
        baseUrl: "https://firestore.googleapis.com/v1/projects/movie-6a34e/databases/(default)/documents/users",
    },
    movie: {
        baseUrl: "https://api.themoviedb.org/3",
        apiKey: process.env.REACT_APP_API_KEY_MOVIE
    }
}