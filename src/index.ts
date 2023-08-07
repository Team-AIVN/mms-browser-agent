import {Connect, MmtpMessage, MsgType, ProtocolMessage, ProtocolMessageType} from "../mmtp";
import {v4 as uuidv4} from "uuid";

console.log("Hello World!");

let mmtpMsg = MmtpMessage.create({
    msgType: MsgType.PROTOCOL_MESSAGE,
    uuid: uuidv4(),
    protocolMessage: ProtocolMessage.create({
        protocolMsgType: ProtocolMessageType.CONNECT_MESSAGE,
        connectMessage: Connect.create({
            ownMrn: "urn:mrn:mcp:device:idp1:org1:agent"
        })
    })
});

console.log(mmtpMsg);

let msgBlob = MmtpMessage.encode(mmtpMsg).finish();

console.log(msgBlob);

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
