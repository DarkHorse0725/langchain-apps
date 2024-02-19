import { Box, Button } from "@mui/material";
import axios from "axios";

const Slack = () => {
    const handleConnect = async () => {
        const URL = process.env.REACT_APP_BASE_URL + "/api/langchain/slack_bot";
        const res = await axios.post(URL);
        console.log("res = ", res);
    };

    return (
        <Box m={`50px`}>
            <Button variant="contained" onClick={handleConnect}>Connect with Slack</Button>
        </Box>
    );
};

export default Slack;
