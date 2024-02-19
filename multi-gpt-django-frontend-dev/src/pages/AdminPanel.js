import { Box, Button, Input, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "@mui/icons-material";

const AdminPanel = () => {
    const [prompts, setPrompts] = useState("");
    const [openAIKey, setOpenAIKey] = useState("");
    const [loading, setLoading] = useState(false);

    const init = async () => {
        const url = process.env.REACT_APP_BASE_URL + "/api/langchain/get_attr";
        const res = await axios.post(url);
    };

    useEffect(() => {
        init();
    }, []);

    const saveAttr = async () => {
        const url = process.env.REACT_APP_BASE_URL + "/api/langchain/save_attr";
        setLoading(true);
        const res = await axios.post(url, {
            openAIKey: openAIKey,
            prompts: prompts,
        });
        setLoading(false);
    };

    return (
        <Box display={`flex`}>
            <Box width={`500px`} height={`700px`} m={`50px auto`} p={`20px 15px`} sx={{ border: "1px solid black", borderRadius: "25px" }}>
                <Box mt={`70px`} mb={`50px`} fontSize={`28px`} textAlign={`center`}>
                    Save OpenAIKey & Promps
                </Box>
                <Box display={`flex`} alignItems={`center`} mt={`20px`} gap={`20px`}>
                    <Box fontSize={`18px`} fontWeight={500}>
                        OpenAIKey:
                    </Box>
                    <TextField fullWidth multiline={true} rows={3} value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} />
                </Box>
                <Box display={`flex`} alignItems={`center`} mt={`50px`} gap={`20px`}>
                    <Box width={`130px`} fontSize={`18px`} fontWeight={500}>
                        Prompts:
                    </Box>
                    <TextField fullWidth multiline={true} rows={5} value={prompts} onChange={(e) => setPrompts(e.target.value)} />
                </Box>
                <Box display={`flex`} alignItems={`center`} justifyContent={`right`} mt={`50px`} gap={`20px`}>
                    <Button sx={{ width: "150px" }} variant="outlined" onClick={saveAttr}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminPanel;
