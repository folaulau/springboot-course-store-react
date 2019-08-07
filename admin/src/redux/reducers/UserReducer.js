
let authToken = localStorage.getItem("authToken");
let uid = localStorage.getItem("uid");

let userInitialState = {
    uid: uid,
    authToken: authToken,
    loggedIn: (authToken!==undefined && authToken!==null && authToken.length>0)
};

export const UserStateReducer = (state = userInitialState, action) => {

    switch (action.type) {
        case 'START_USER_SESSION':

            let session = action.payload;
            
            localStorage.clear();

            localStorage.setItem("uid", session.userUid);
            localStorage.setItem("authToken", session.token);

            let loggedIn = (session.token!==undefined && session.token!==null && session.token.length>0);

            return Object.assign({}, state, {
                uid: session.userUid,
                authToken: session.token,
                loggedIn: loggedIn
            });
            
        case 'LOGOUT_USER_SESSION':

            localStorage.clear();

            return Object.assign({}, state, {
                uid: null,
                authToken: null,
                loggedIn: false
            });

        default:
            return state;
    }
}