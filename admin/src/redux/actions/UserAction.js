
export const startUserSession = session => {
    return {
        type: 'START_USER_SESSION',
        payload: session
    };
};

export const logoutUserSession = session => {
    return {
        type: 'LOGOUT_USER_SESSION',
        payload: session
    };
};