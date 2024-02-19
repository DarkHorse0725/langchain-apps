import React, { useState } from "react";
import { Grid, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../services/userAuthApi";

const ResetPassword = () => {
    //!     Server Error
    const [server_error, setServerError] = useState({});
    const [server_message, setServerMessage] = useState({});

    //!     RTK Query
    const [resetPassword] = useResetPasswordMutation();

    //!     Router
    const navigate = useNavigate();
    const { id, token } = useParams();

    //!     Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const actualData = {
            password: data.get("password"),
            password2: data.get("password2"),
        };

        const res = await resetPassword({ actualData, id, token });

        if (res.error) {
            setServerMessage({});

            setServerError(res.error.data.error);
        }

        if (res.data) {
            setServerError({});
            setServerMessage(res.data);

            document.getElementById("password-reset-form").reset();

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    };

    return (
        <>
            <Grid container justifyContent="center">
                <Grid item sm={6} xs={12}>
                    <Box component="form" noValidate sx={{ m: 1 }} id="password-reset-form" onSubmit={handleSubmit}>
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
                                Reset
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default ResetPassword;
