import { io } from "./http";
import dayjs, { customParseFormat } from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

let isLocked: boolean = false;
let sendTime: ReturnType<typeof setInterval>;

io.on("connection", (socket: any) => {
    console.log("USER CONNECTED!");
    setTimeout(
        () =>
            socket.disconnect(
                true,
                socket.emit("connectionTimedOut", {
                    response: "ConnectionTimedOut",
                    payload: {
                        isConnected: false,
                        message: "Your session has expired.",
                    },
                })
            ),
        300000
    );

    socket.on("lockService", (data: object) => {
        if (!isLocked) {
            if (data.payload.token) {
                isLocked = true;
                socket.emit("lockService", {
                    response: "LockServiceOK",
                    payload: {
                        isLocked: isLocked,
                        message: "Locking effected.",
                    },
                });

                sendTime = setInterval(function () {
                    const time = dayjs(new Date()).format("HH:mm:ss");

                    socket.emit("bitTimeEvent", {
                        response: "BitTimeEvent",
                        payload: {
                            time: time,
                        },
                    });
                }, 1000);
            }
        } else {
            socket.emit("lockService", {
                response: "LockServiceFAILED",
                payload: {
                    isLocked: isLocked,
                    message: "Locking failed.",
                },
            });
        }
    });

    socket.on("unlockService", (data: object) => {
        if (isLocked) {
            if (data.payload.token) {
                isLocked = false;
                clearInterval(sendTime);

                socket.emit("unlockService", {
                    response: "UnlockServiceOK",
                    payload: {
                        isLocked: isLocked,
                        message: "Unlocking effected.",
                    },
                });
            }
        } else {
            socket.emit("unlockService", {
                response: "UnlockServiceFAILED",
                payload: {
                    isLocked: isLocked,
                    message: "Unlocking failed.",
                },
            });
        }
    });

    socket.on("isLocked", (data: object) => {
        console.log(data);
        socket.emit("isLocked", {
            response: "IsLocked",
            payload: {
                isLocked: isLocked,
            },
        });
    });

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED!");
    });
});
