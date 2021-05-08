import { Box, Container, TextField, Typography } from "@material-ui/core";
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
            width: 500,
            paddingBottom: theme.spacing(5),
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

const urlValidator = /^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/;

export default function index() {
    const classes = useStyles();
    const [input, setInput] = useState("");
    const [total, setTotal] = useState(0);
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
            if (!urlValidator.test(input)) {
                setError("Plaease Enter a valid URL");
                return;
            }
            const id = uniqueId();
            const url = `https://${window.location.hostname}/url/${id}`;
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
        }
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
                            Sort URL ={" "}
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
                    )}
                </Box>
            </Container>
        </div>
    );
}
