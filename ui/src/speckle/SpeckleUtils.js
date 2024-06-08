import { userInfoQuery } from "./SpeckleQueries.js"

export const SPECKLE_URL = import.meta.env.VITE_SPECKLE_URL;
export const APP_SPECKLE_ID = import.meta.env.VITE_SPECKLE_ID;
export const APP_SPECKLE_NAME = import.meta.env.VITE_SPECKLE_NAME;
export const CHALLENGE = `${APP_SPECKLE_NAME}.Challenge`;
export const TOKEN = `${APP_SPECKLE_NAME}.AuthToken`;
export const REFRESH_TOKEN = `${APP_SPECKLE_NAME}.RefreshToken`;
export const FS_URL = import.meta.env.VITE_API_URL;

/**
 * Log out the current user. This removes the token/refreshToken pair.
 */
export function speckleLogOut() {
    // Remove both token and refreshToken from localStorage
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(`${APP_SPECKLE_NAME}.Authentication`);
}

export function checkSpeckleAuthStatus(){
    const authState = JSON.parse(localStorage.getItem(`${APP_SPECKLE_NAME}.Authentication`));
    return authState;
}

/**
 * Redirects to the Speckle server authentication page, using a randomly generated challenge. Challenge will be stored to compare with when exchanging the access code.
 */
export function goToSpeckleAuthPage() {
    // Generate random challenge
    var challenge =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    // Save challenge in localStorage
    localStorage.setItem(CHALLENGE, challenge)
    // Send user to auth page
    console.log(`Going to auth page : ${SPECKLE_URL}/authn/verify/${APP_SPECKLE_ID}/${challenge}`);
    window.location.href = `${SPECKLE_URL}/authn/verify/${APP_SPECKLE_ID}/${challenge}`;
}

/**
 * Exchanges the provided access code with a token/refreshToken pair, and saves them to local storage.
 * @param {string} accessCode 
 */
export async function exchangeAccessCode(accessCode) {
    try {
        var res = await fetch(`${FS_URL}/exchange-access-code`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              accessCode: accessCode,
              challenge: localStorage.getItem(CHALLENGE)
            })
          })
          var data = await res.json();
          if (data.token) {
            // If retrieving the token was successful, remove challenge and set the new token and refresh token
            localStorage.removeItem(CHALLENGE);
            localStorage.setItem(TOKEN, data.token);
            localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
          }
          return data;
    }

    catch (err){
        console.warn("Failed to exchange access code.");
        return {};
    }

}

/**
 * Calls the GraphQL endpoint of the Speckle server with a query object.
 * @param {any} query - object for query
 * @param {string} token - auth token
 */
export async function speckleFetch(query, token) {
    try {
    var res = await fetch(
        `${FS_URL}/speckle-query`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            token: token
        })
        })
    return await res.json();
    } catch (err) {
    console.error("API call failed", err);
    }
}

/**
 * Tries to get user data with auth token from local storage
 */
export async function getUserData(){
    console.log("Fetching user data...");
    let token = localStorage.getItem(TOKEN);
    console.log("Token: ",token);

    try {
        // If token found
        if (token){
            let userData = await speckleFetch(userInfoQuery(), token);
            console.log("Speckle User Data: ", userData);
            localStorage.setItem(`${APP_SPECKLE_NAME}.User`, userData.data.activeUser.name);
            localStorage.setItem(`${APP_SPECKLE_NAME}.Details`, JSON.stringify(userData.data.serverInfo));
            localStorage.setItem(`${APP_SPECKLE_NAME}.Authentication`, JSON.stringify(true));
            return userData
        }
    
        // If no token found
        else {
            console.log("Not authenticated. Please log in");
            return {};
            // LoginSpeckle()
        }
    }

    catch (e){
        console.warn(e);
        return Promise.reject("Something went wrong with getting user data.");
    }

}

/**
 * Get any streams and branches that user account has. If login_state is false, direct users to log in to Speckle.
 */
export async function GetSpeckleStream(){
    console.log("Getting Speckle Stream...");
    
    // Check for authentication
    var authState = localStorage.getItem("Authentication");
    if (authState){
        
    }

    else {
        console.log("Not authenticated. Please log in");
    }
}