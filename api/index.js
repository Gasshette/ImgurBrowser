export const CLIENT_ID = '6e7f81d30b961bf';
export const CLIENT_SECRET = '19098be0960a1e037bdd9bbbcbffeb4e65cc2870';
export const AUTHORIZATION_HEADER = `Authorization:${CLIENT_ID} ${CLIENT_SECRET}`;

export const URL_USER_AUTHORIZATION = `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token`;

// export const getTokens = () => {
//   fetch(URL_USER_AUTHORIZATION).then(response => console.log('response = ', response));
// }