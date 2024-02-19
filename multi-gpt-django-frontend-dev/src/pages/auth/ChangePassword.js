import React, { useState } from "react";
import { Grid, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useChangeUserPasswordMutation } from "../../services/userAuthApi";
import { getToken } from "../../services/localStorageServices";

const ChangePassword = () => {
    //!     Server Error
    const [server_error, setServerError] = useState({});
    const [server_message, setServerMessage] = useState({});

    //!     RTK Query
    const [changeUserPassword] = useChangeUserPasswordMutation();

    //!     Access Token
    const { access_token } = getToken();

    //!     Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const actualData = {
            password: data.get("password"),
            password2: data.get("password2"),
        };

        const res = await changeUserPassword({ actualData, access_token });

        if (res.error) {
            setServerMessage({});

            setServerError(res.error.data.error);
        }

        if (res.data) {
            console.log(res.data);

            setServerError({});
            setServerMessage(res.data);

            console.log(server_message);

            document.getElementById("password-change-form").reset();
        }
    };

    //!     Get User Data From Redux Store
    const myData = useSelector((state) => state.user);

    return (
        <>
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <Box component="form" noValidate sx={{ m: 1, ml: 5 }} id="password-change-form" onSubmit={handleSubmit}>
                        <TextField margin="normal" required fullWidth id="password" name="password" label="New Password" type="password" />
                        {server_error.password ? (
                            <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.password[0]}</Typography>
                        ) : (
                            ""
                        )}

                        <TextField margin="normal" required fullWidth id="password2" name="password2" label="Confirm New Password" type="password" />
                        {server_error.password2 ? (
                            <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.password2[0]}</Typography>
                        ) : (
                            ""
                        )}

                        <Box textAlign="center">
                            <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2, px: 2 }}>
                                Change
                            </Button>
                        </Box>

                        {server_error.non_field_errors ? <Alert severity="error">{server_error.non_field_errors[0]}</Alert> : ""}

                        {server_message.message ? <Alert severity="success">{server_message.message}</Alert> : ""}
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default ChangePassword;
