import { serverHttp, PORT } from "./http";
import "./websocket";


serverHttp.listen(PORT, () => {
    console.log(`=== SERVER STARTED AT ${PORT} ===`);
});
