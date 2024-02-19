import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import "../style/message.css";

const ChatHistory = (props) => {
    const [history, setHistory] = useState(null);
    useEffect(() => {
        setHistory(props.history);
    }, [props.history]);

    return (
        <Box>
            <Box className="chat-container">
                <ul className="chat">
                    {history &&
                        history.length > 0 &&
                        history.map((row, index) => {
                            return (
                                <>
                                    <li
                                        className="message flex"
                                        style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 10px" }}
                                    >
                                        {/* <img className="logo" src="/images/bot.jpg" alt="" /> */}
                                        <Box fontSize={38} fontFamily={`emoji`}>
                                            {" "}
                                            Q:
                                        </Box>
                                        <p style={{ marginLeft: "10px", marginRight: "10px" }}>{row[0]}</p>
                                    </li>
                                    <li
                                        className="message"
                                        style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 10px" }}
                                    >
                                        <p style={{ marginLeft: "20px", marginRight: "5px" }}>{row[1]}</p>
                                        <Box fontSize={38} fontFamily={`emoji`}>
                                            {" "}
                                            :A
                                        </Box>
                                    </li>
                                </>
                            );
                        })}
                </ul>
            </Box>
        </Box>
    );
};

export default ChatHistory;
