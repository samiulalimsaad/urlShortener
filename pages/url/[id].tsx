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
                    if(res?.data()?.originalUrl.split(":")[0]==='https'){
                   open(res?.data()?.originalUrl).focus();
                   close()
                }
                else{
                    open("https://" + res?.data()?.originalUrl).focus();
                    close()
                   }
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
