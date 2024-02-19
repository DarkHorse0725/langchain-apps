import React from "react";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { getToken } from "../services/localStorageServices";

const Navbar = () => {
    const { access_token } = getToken();

    const activePage = ({ isActive }) => {
        return { backgroundColor: isActive ? "#004182" : "" };
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                            Multi
                        </Typography>

                        <Button component={NavLink} to="/" sx={{ color: "white", textTransform: "none", fontSize: "1rem" }} style={activePage}>
                            Home
                        </Button>
                        <Button component={NavLink} to="/admin" sx={{ color: "white", textTransform: "none", fontSize: "1rem" }} style={activePage}>
                            Admin
                        </Button>
                        <Button component={NavLink} to="/slack" sx={{ color: "white", textTransform: "none", fontSize: "1rem" }} style={activePage}>
                            Connect with Slack
                        </Button>

                        {access_token ? (
                            <Button
                                component={NavLink}
                                to="/dashboard"
                                sx={{ color: "white", textTransform: "none", fontSize: "1rem" }}
                                style={activePage}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <Button
                                component={NavLink}
                                to="/login"
                                sx={{ color: "white", textTransform: "none", fontSize: "1rem" }}
                                style={activePage}
                            >
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
};

export default Navbar;
