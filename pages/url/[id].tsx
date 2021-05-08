import { Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fireStore } from "../../Firebase";

const index = () => {
    const route = useRouter();

    useEffect(() => {
        const id = route.query.id as string;
        fireStore
            .collection("urlShortener")
            .doc(id)
            .get()
            .then((res) => {
                if (res?.data()?.originalUrl) {
                    location.assign(res?.data()?.originalUrl);
                }
            });
    }, [route]);

    return (
        <div
            style={{
                display: "grid",
                placeItems: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h1" component="h1">
                Redirecting...
            </Typography>
        </div>
    );
};

export default index;
