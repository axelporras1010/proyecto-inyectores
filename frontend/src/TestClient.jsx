import axios from "axios";
import { useEffect } from "react";

export default function TestClient() {
    useEffect(() => {
        axios.get("http://127.0.0.1:8001/api/clients")
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    }, []);

    return <h1>Probando API...</h1>;
}
