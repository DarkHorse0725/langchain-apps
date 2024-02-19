import React, { useState } from "react";
import { Grid, TextField, Button, Box, Alert, Typography, CircularProgress } from "@mui/material";
import { useSendResetPasswordMailMutation } from "../../services/userAuthApi";

const SendPasswordResetEmail = () => {
    //!     Server Error
    const [server_error, setServerError] = useState({});
    const [server_message, setServerMessage] = useState({});

    //!     RTK Query
    const [sendResetPasswordMail, { isLoading }] = useSendResetPasswordMailMutation();

    //!     Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const actualData = {
            email: data.get("email"),
        };

        const res = await sendResetPasswordMail(actualData);

        if (res.error) {
            console.log(res.error.data.error);
            setServerMessage({});
            setServerError(res.error.data.error);
        }

        if (isLoading) {
            <CircularProgress />;
        }

        if (res.data) {
            console.log(res.data);

            setServerError({});

            setServerMessage(res.data);

            document.getElementById("password-reset-send-form").reset();
        }
    };

    return (
        <>
            <Grid container justifyContent="center">
                <Grid item sm={6} xs={12}>
                    <Box component="form" noValidate sx={{ m: 1 }} id="password-reset-send-form" onSubmit={handleSubmit}>
                        <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />
                        {server_error.email ? (
                            <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.email[0]}</Typography>
                        ) : (
                            ""
                        )}

                        <Box textAlign="center">
                            <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2, px: 2 }}>
                                Send
                            </Button>
                        </Box>

                        {server_error.non_field_errors ? <Alert severity="error">{server_error.non_field_errors[0]}</Alert> : ""}

                        {server_message.message ? <Alert severity="success">{server_message.message}</Alert> : ""}

                        {isLoading && <CircularProgress />}
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default SendPasswordResetEmail;
