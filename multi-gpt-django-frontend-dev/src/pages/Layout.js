import { Box, CssBaseline } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../src/components/Navbar";

const Layout = () => {
    return (
        <Box overflow={`hidden`} height={`100vh`}>
            <CssBaseline />
            <Navbar />
            <Outlet />
        </Box>
    );
};

export default Layout;
