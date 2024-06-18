
export const LoginStart = (userCredentials) => ({
    type: "Login_Start",
});
export const LoginSuccess = (user) => ({
    type: "Login_Success",
    payload: user,
});
export const LoginFailure = (error) => ({
    type: "Login_Failure",
    payload: error
});

export const Follow = (userId) => ({
    type: "FOLLOW",
    payload: userId
});

export const Unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId
})