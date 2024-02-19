import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Alert, CircularProgress, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../services/userAuthApi";
import { getToken, storeToken } from "../../services/localStorageServices";
import { useDispatch } from "react-redux";
import { setUserToken, unSetUserToken } from "../../features/authSlice";

const LoginForm = () => {
    //!     Server Error
    const [server_error, setServerError] = useState({});

    //!     slice
    const dispatch = useDispatch();

    //!     RTK Query
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const navigate = useNavigate();

    //!     Form Submit Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const accuretData = {
            email: data.get("email"),
            password: data.get("password"),
        };

        const res = await loginUser(accuretData);

        console.log(res);

        if (res.error) {
            console.log(res.error.data);
            setServerError(res.error.data);
        }

        if (res.data) {
            console.log(res.data);

            //*     save in local storage
            storeToken(res.data.token);

            //*     redux save
            let { access_token } = getToken();
            dispatch(setUserToken({ access_token: access_token }));

            //*     redirect
            navigate("/dashboard");
        }
    };

    //!     un set redux access_token
    let { access_token } = getToken();
    useEffect(() => {
        dispatch(setUserToken({ access_token: access_token }));
    }, [access_token, dispatch]);

    return (
        <>
            <Box component="form" noValidate sx={{ m: 1 }} id="login-form" onSubmit={handleSubmit}>
                <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />
                {server_error.email ? <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.email[0]}</Typography> : ""}

                <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" />
                {server_error.password ? (
                    <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.password[0]}</Typography>
                ) : (
                    ""
                )}

                <Box textAlign="center">
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2, px: 2 }}>
                            Login
                        </Button>
                    )}
                </Box>
                <NavLink to="/sendpasswordresetemail">Forgot Password ?</NavLink>

                {server_error.error ? <Alert severity="error">{server_error.error.non_field_errors[0]}</Alert> : ""}
            </Box>
        </>
    );
};

export default LoginForm;
