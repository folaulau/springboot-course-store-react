
let authToken = localStorage.getItem("authToken");
let uid = localStorage.getItem("uid");
let profileImgUrl = localStorage.getItem("profileImgUrl");

let userInitialState = {
    uid: uid,
    authToken: authToken,
    loggedIn: (authToken!==undefined && authToken!==null && authToken.length>0),
    profileImgUrl: profileImgUrl
};

export const UserStateReducer = (state = userInitialState, action) => {

    switch (action.type) {
        case 'START_USER_SESSION':

            let session = action.payload;
            let newState = {};
            
            localStorage.clear();

            newState.loggedIn = (session.token!==undefined && session.token!==null && session.token.length>0);

            if(session.userUid!==undefined && session.userUid!==null && session.userUid.length>5){
                localStorage.setItem("uid", session.userUid);
                newState.uid = session.userUid;
            }

            if(session.userUid!==undefined && session.userUid!==null && session.userUid.length>5){
                localStorage.setItem("uid", session.userUid);
                newState.uid = session.userUid;
            }

            if(session.token!==undefined && session.token!==null && session.token.length>5){
                localStorage.setItem("authToken", session.token);
                newState.authToken = session.token;
            }

            if(session.profileImgUrl!==undefined && session.profileImgUrl!==null && session.profileImgUrl.length>5){
                localStorage.setItem("profileImgUrl", session.profileImgUrl);
                newState.profileImgUrl = session.profileImgUrl;
            }

            return Object.assign({}, state, newState);
            
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