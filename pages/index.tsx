import {
    Box,
    Button,
    Container,
    TextField,
    Typography
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import firebase, { fireStore } from "../Firebase";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "grid",
            placeItems: "center",
            height: "100vh",
        },
        form: {
            width: "50vw",
            padding: theme.spacing(5),
        },
        link: {
            width: "50vw",
            overflowX: "auto",
            backgroundColor: "#e7e7e7",
            padding: theme.spacing(5),
        },
    })
);

function uniqueId() {
    return "xxxxxxxx".replace(/[x]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const urlValidator = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
    "i"
); // fragment locator

export default function index() {
    const classes = useStyles();
    const [input, setInput] = useState("");
    const [total, setTotal] = useState(0);
    const [copy, setCopy] = useState(false);
    const [error, setError] = useState("");
    const [shortUrl, setShortUrl] = useState("");

    useEffect(() => {
        fireStore.collection("urlShortener").onSnapshot((res) => {
            setTotal(res.docs.length);
        });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        if (input === "") {
            setError("Enter a URL");
        } else {
            if (urlValidator.test(input)) {
                const id = uniqueId();
                const url = process.env.NODE_ENV==='development'?
                `http://${window.location.hostname}:3000/url/${id}`:
                `https://${window.location.hostname}/url/${id}`;
                fireStore
                    .collection("urlShortener")
                    .doc(id)
                    .set({
                        originalUrl: input,
                        sortUrl: url,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(() => {
                        setInput("");
                        setShortUrl(url);
                    })
                    .catch((e) => {
                        setError(e.message);
                    });
            } else {
                setError("Please Enter a valid URL");
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopy(true);
    };

    return (
        <div>
            <Container className={classes.root}>
                <Box>
                    <Typography align="center" variant="h6" paragraph>
                        Total = {total ? total : "---"}
                    </Typography>
                    <form
                        autoComplete="off"
                        className={classes.form}
                        onSubmit={submit}
                    >
                        <TextField
                            autoFocus
                            fullWidth
                            label="Enter URL"
                            placeholder="Enter URL and press Enter!"
                            variant="outlined"
                            value={input}
                            error={Boolean(error)}
                            helperText={error}
                            onChange={(e) => {
                                setInput(e.target.value);
                            }}
                        />
                    </form>
                    {shortUrl && (
                        <Typography align="center" variant="h6" paragraph>
                            <Button
                                color={copy ? "secondary" : "primary"}
                                onClick={copyToClipboard}
                            >
                                {copy ? "Copied" : "Copy to Clipboard"}
                            </Button>
                            <Typography
                                align="center"
                                variant="h6"
                                paragraph
                                className={classes.link}
                                onClick={() => {
                                    navigator.clipboard.writeText(shortUrl);
                                }}
                            >
                                <a href={shortUrl} target="_blank">
                                    <Typography
                                        align="center"
                                        variant="h6"
                                        component="span"
                                        paragraph
                                    >
                                        {shortUrl}
                                    </Typography>
                                </a>
                            </Typography>
                        </Typography>
                    )}
                </Box>
            </Container>
        </div>
    );
}
