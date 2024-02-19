import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Input } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import CSVEmbedding from "../components/CSVEmbedding";
import TXTEmbedding from "../components/TXTEmbedding";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import ChatHistory from "../components/ChatHistory";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
    const [url, setURL] = useState("");
    const [userPrompts, setUserPrompts] = useState("");
    const [upload, setUpload] = useState([]);
    const [sourceWidth, setSourceWidth] = useState(-200);
    const [history, setHistory] = useState([]);
    const [modal, setModal] = React.useState("gpt-3.5-turbo");

    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = useState("success");
    const [message, setMessage] = useState("Successfully embedded!");

    const [fileList, setFileList] = useState([]);
    const [fileFlg, setFileFlg] = useState([]);
    const handleClick = () => {
        setOpen(true);
    };

    const handleChange = (event) => {
        setModal(event.target.value);
    };

    const [flag, setFlag] = useState(true);
    const forceReload = () => {
        setFlag(!flag);
    };

    const [loading, setLoading] = useState(false);

    const handleChangeURL = (e) => {
        setURL(e.target.value);
    };

    const handleEmbedding = async () => {
        setLoading(true);
        const rlt = await axios.post(process.env.REACT_APP_BASE_URL + "/api/langchain/url_embedding", { site_url: url });
        setLoading(false);
        if (rlt.status == 201) {
            setStatus("success");
            setMessage("Embedded successfully");
        } else {
            setStatus("warning");
            setMessage("Connection error");
        }
        setOpen(true);
    };

    const handleUserPrompt = (e) => {
        if (e.keyCode == 13) {
            console.log("value", e.target.value);
            handleProcess();
        } else {
            setUserPrompts(e.target.value);
        }
    };

    const handleProcess = async () => {
        const fileListTemp = [];
        for (let i = 0; i < fileList.length; i++) {
            if (fileFlg[i] === false) continue;
            fileListTemp.push(fileList[i]);
        }
        setLoading(true);
        const rlt = await axios.post(process.env.REACT_APP_BASE_URL + "/api/langchain/chat", {
            site_url: url,
            userPrompts: userPrompts,
            modal: modal,
            history: history,
            fileList: fileListTemp
        });
        if (rlt.data["status"] == "success") {
            setHistory(rlt.data["history"]);
        }
        setLoading(false);
        console.log(rlt);
    };

    const handleFileSelect = (evt) => {
        const temp = [evt.target.files[0]];
        setUpload([...upload, ...temp]);
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.set("newFile[]", upload);
        upload.forEach((file) => {
            data.append("files", file);
        });
        const res = await fetch(process.env.REACT_APP_BASE_URL + "/api/langchain/pdf_embedding", {
            method: "POST",
            body: data,
        });

        setLoading(false);
        if (res.status == 201) {
            setStatus("success");
            setMessage("Embedded successfully");
        } else {
            setStatus("warning");
            setMessage("Connection error");
        }
        setOpen(true);
    };

    const removeFile = (index) => {
        console.log(index);
        const temp = upload;
        temp.splice(index, 1);
        setUpload(temp);
        forceReload();
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const initFileList = async () => {
        const URL = process.env.REACT_APP_BASE_URL + "/api/langchain/get_init_file_list";
        const res = await axios.post(URL);
        let tempFlg = Array(res.data.length).fill(0);
        setFileFlg(tempFlg);
        setFileList(res.data);
    };

    useEffect(() => {
        initFileList();
    }, []);

    const handleFileList = (index) => {
        let tempFlg = fileFlg;
        tempFlg[index] = !tempFlg[index];
        setFileFlg(tempFlg);
    };

    return (
        <Box position={`relative`}>
            <Grid container justifyContent="center">
                <Box display={`flex`} gap={`60px`} position={`relative`}>
                    <Box minWidth={`30vw`}>
                        <Box>
                            <h1>URL</h1>
                            <Box display={`flex`}>
                                <TextField fullWidth label="URL" id="url_embedding" onChange={handleChangeURL} />
                                <Button sx={{ marginLeft: "20px" }} variant="outlined" onClick={handleEmbedding}>
                                    URL Embedding
                                </Button>
                            </Box>
                        </Box>
                        <Box mt={`20px`}>
                            <h1>PDF</h1>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Input type="file" name="fileToUpload" multiple onChange={handleFileSelect} />
                                <Button type="submit" sx={{ marginLeft: "20px" }} variant="outlined">
                                    PDF Embedding
                                </Button>
                                <Box>
                                    {upload.map((row, index) => (
                                        <Box
                                            display={`flex`}
                                            justifyContent={`space-between`}
                                            key={index}
                                            p={`5px 10px`}
                                            mt={`10px`}
                                            alignItems={`center`}
                                            sx={{ background: "#e5e3e3", borderRadius: "10px" }}
                                        >
                                            <Box>{row.name}</Box>
                                            <Box display={`flex`} alignItems={`center`} sx={{ cursor: "pointer" }} onClick={() => removeFile(index)}>
                                                <CloseIcon />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </form>
                        </Box>
                        <Box>
                            <CSVEmbedding loading={loading} setLoading={setLoading} setOpen={setOpen} setMessage={setMessage} setStatus={setStatus} />
                        </Box>
                        <Box>
                            <TXTEmbedding loading={loading} setLoading={setLoading} setOpen={setOpen} setMessage={setMessage} setStatus={setStatus} />
                        </Box>
                    </Box>
                    <Box minWidth={`50vw`} maxWidth={`50vw`}>
                        <Box>
                            <h1>Chat </h1>
                            <Box display={`flex`} justifyContent={`start`} alignItems={`center`} gap={`20px`}>
                                <Box fontSize={18}>Modals: </Box>
                                <Select labelId="gpt-modal" id="gpt-modal" value={modal} onChange={handleChange} autoWidth>
                                    <MenuItem value={`gpt-3.5-turbo`}>gpt-3.5-turbo</MenuItem>
                                    <MenuItem value={`text-davinci-002`}>text-davinci-002</MenuItem>
                                    <MenuItem value={`code-davinci-002`}>code-davinci-002</MenuItem>
                                    <MenuItem value={`text-davinci-003`}>text-davinci-003</MenuItem>
                                </Select>
                            </Box>
                            <Box display={`flex`} mt={`20px`}>
                                <TextField fullWidth label="QA" id="user_prompts" onKeyDown={handleUserPrompt} onChange={handleUserPrompt} />
                                <Button sx={{ marginLeft: "20px" }} variant="outlined" onClick={handleProcess}>
                                    Submit
                                </Button>
                            </Box>
                            <Box mt={`20px`}>
                                <ChatHistory history={history} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {loading && (
                    <Box
                        position={`absolute`}
                        top={0}
                        left={0}
                        width={`100vw`}
                        height={`100vh`}
                        display={`flex`}
                        justifyContent={`center`}
                        alignItems={`center`}
                        sx={{ background: "white", opacity: 0.3 }}
                    >
                        <CircularProgress color="secondary" />
                    </Box>
                )}
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
                        {message}
                    </Alert>
                </Snackbar>
            </Grid>
            <Box position={`absolute`} top={`50px`} right={`100px`} zIndex={1}>
                <Button variant="outlined" onClick={() => setSourceWidth(0)}>
                    Source
                </Button>
            </Box>
            <Box
                position={`absolute`}
                top={`0px`}
                right={`${sourceWidth}px`}
                height={`calc(100vh - 65px)`}
                width={`200px`}
                zIndex={2}
                p={`10px`}
                boxShadow={`0px 0px 3px 3px #554c4cb3`}
                sx={{ transition: "right 1s", backgroundColor: "#e1e1e1" }}
            >
                {fileList.length > 0 &&
                    fileList.map((row, index) => {
                        return (
                            <Box key={index} display={`flex`} alignItems={`center`}>
                                <Checkbox onClick={() => handleFileList(index)} />
                                <Box>{row}</Box>
                            </Box>
                        );
                    })}
                <Button variant="outlined" onClick={() => setSourceWidth(-200)}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
