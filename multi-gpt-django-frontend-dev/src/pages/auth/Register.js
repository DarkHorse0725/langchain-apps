import React, { useState } from "react";
import { TextField, Button, Box, Alert, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { Form, NavLink, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/userAuthApi";
import { storeToken } from "../../services/localStorageServices";

const Register = () => {
    //!     Server Error
    const [server_error, setServerError] = useState({});

    const navigate = useNavigate();

    //!     TRK Query
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const accuretData = {
            name: data.get("name"),
            email: data.get("email"),
            password: data.get("password"),
            password2: data.get("password2"),
            tc: data.get("tc"),
        };

        const res = await registerUser(accuretData);

        // console.log(res);

        if (res.error) {
            console.log(res.error.data.error);
            setServerError(res.error.data.error);
        }

        if (res.data) {
            console.log(res.data);
            storeToken(res.data.token);
            navigate("/dashboard");
        }
    };

    return (
        <>
            {/* {server_error.email ? console.log(server_error.email[0]) : ""}
            {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""} */}

            <Box component="form" noValidate sx={{ m: 1 }} id="register-form" onSubmit={handleSubmit}>
                <TextField margin="normal" required fullWidth id="name" name="name" label="Full Name" />
                {server_error.name ? <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.name[0]}</Typography> : ""}

                <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />
                {server_error.email ? <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.email[0]}</Typography> : ""}

                <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" />
                {server_error.password ? (
                    <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.password[0]}</Typography>
                ) : (
                    ""
                )}

                <TextField margin="normal" required fullWidth id="password2" name="password2" label="Confirm Password" type="password" />
                {server_error.password2 ? (
                    <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.password2[0]}</Typography>
                ) : (
                    ""
                )}

                <FormControlLabel control={<Checkbox value={true} color="primary" name="tc" id="tc" />} label="I agree to terms and conditions." />
                {server_error.tc ? <Typography style={{ color: "red", fontSize: 14, paddingLeft: 10 }}>{server_error.tc[0]}</Typography> : ""}

                <Box textAlign="center">
                    <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2, px: 2 }}>
                        Join
                    </Button>
                </Box>

                {server_error.non_field_errors ? <Alert severity="error">{server_error.non_field_errors[0]}</Alert> : ""}
            </Box>
        </>
    );
};

export default Register;
