import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Input } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const CSVEmbedding = ({ loading, setLoading, setOpen, setMessage, setStatus }) => {
    const [upload, setUpload] = useState([]);
    const [flag, setFlag] = useState(true);
    const forceReload = () => {
        setFlag(!flag);
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
        const res = await fetch(process.env.REACT_APP_BASE_URL + "/api/langchain/csv_embedding", {
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
    return (
        <Box>
            <Box mt={`20px`}>
                <h1>CSV</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Input type="file" name="fileToUpload" multiple onChange={handleFileSelect} />
                    <Button type="submit" sx={{ marginLeft: "20px" }} variant="outlined">
                        CSV Embedding
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
        </Box>
    );
};

export default CSVEmbedding;
