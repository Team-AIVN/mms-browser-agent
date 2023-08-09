import {Connect, MmtpMessage, MsgType, ProtocolMessage, ProtocolMessageType} from "../mmtp";
import {v4 as uuidv4} from "uuid";
import "./styles.scss";
import "bootstrap";

console.log("Hello World!");

const mrn = "urn:mrn:mcp:device:idp1:org1:" + uuidv4().slice(0, 8);

let mmtpMsg = MmtpMessage.create({
    msgType: MsgType.PROTOCOL_MESSAGE,
    uuid: uuidv4(),
    protocolMessage: ProtocolMessage.create({
        protocolMsgType: ProtocolMessageType.CONNECT_MESSAGE,
        connectMessage: Connect.create({
            ownMrn: mrn
        })
    })
});

console.log(mmtpMsg);

let msgBlob = MmtpMessage.encode(mmtpMsg).finish();

console.log(msgBlob);

const mrnH2 = document.getElementById("mrnH2");
mrnH2.textContent = mrn;

let ws = new WebSocket("ws://localhost:8888");

ws.addEventListener("open", () => {
    ws.send(msgBlob);
    ws.onmessage = async (msgEvent) => {
        console.log("Message received:", msgEvent.data);
        let data = msgEvent.data as Blob;
        let bytes = await data.arrayBuffer();
        let response = MmtpMessage.decode(new Uint8Array(bytes));
        console.log(response);
    };
});
