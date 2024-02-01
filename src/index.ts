import {
    ApplicationMessage,
    ApplicationMessageHeader,
    Connect,
    Disconnect,
    IApplicationMessage,
    MmtpMessage,
    MsgType,
    ProtocolMessage,
    ProtocolMessageType,
    Receive,
    Recipients,
    Send,
    Subscribe,
    Unsubscribe
} from "../mmtp";
import {v4 as uuidv4} from "uuid";
import "./styles.scss";
import "bootstrap";
import {Certificate} from "pkijs";

console.log("Hello World!");

let ownMrn = "";

const connectContainer = document.getElementById("connectContainer") as HTMLDivElement;
const receiveContainer = document.getElementById("receiveContainer") as HTMLDivElement;
const urlInput = document.getElementById("edgeRouterAddr") as HTMLSelectElement;
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;

const connTypeSelect = document.getElementById("connectionTypeSelect") as HTMLSelectElement;
const certInputDiv = document.getElementById("certInputDiv") as HTMLDivElement;
const certFileInput = document.getElementById("certInput") as HTMLInputElement;
const privateKeyFileInput = document.getElementById("privateKeyInput") as HTMLInputElement;

const mrnH3 = document.getElementById("mrnH3") as HTMLTextAreaElement;
mrnH3.textContent = ownMrn;

const msgContainer = document.getElementById("msgContainer") as HTMLDivElement;
const sendContainer = document.getElementById("sendContainer") as HTMLDivElement;
const msgArea = document.getElementById("msgArea") as HTMLTextAreaElement;
const receiverMrnSelect = document.getElementById("receiverMrn") as HTMLSelectElement;
const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
const disconnectBtn = document.getElementById("disconnectBtn") as HTMLButtonElement;
const incomingArea = document.getElementById("incomingArea") as HTMLTextAreaElement;

const subsList = document.getElementById("subscriptions") as HTMLUListElement;
const subjectSelect = document.getElementById("subjectSelect") as HTMLSelectElement;

interface Subscription {
    value: string,
    name: string,
}

let authenticated: boolean;
let connectionType: string;

connTypeSelect.addEventListener("change", () => {
    authenticated = connTypeSelect.value === "authenticated";
    connectionType = connTypeSelect.value;
    certInputDiv.hidden = !authenticated;
});

let certificate: Certificate;
let privateKey: CryptoKey;

let ws: WebSocket;
let reconnectToken: string;
let lastSentMessage: MmtpMessage;

connectBtn.addEventListener("click", async () => {
    if (!connectionType) {
        alert("Please choose a connection type");
        location.reload();
    }

    if (authenticated) {
        await loadCertAndPrivateKeyFromFiles();
        for (const rdn of certificate.subject.typesAndValues) {
            if (rdn.type === "0.9.2342.19200300.100.1.1") {
                ownMrn = rdn.value.valueBlock.value;
                break;
            }
        }
        console.log(ownMrn);
    }

    let wsUrl = urlInput.value;
    if (wsUrl === "") {
        alert("You need to choose an Edge Router to connect to!");
        location.reload();
    } else if (!wsUrl.startsWith("ws")) {
        wsUrl = "ws://" + wsUrl;
    }
    const edgeRouter = urlInput.options[urlInput.selectedIndex].textContent;

    mrnH3.hidden = false;

    ws = new WebSocket(wsUrl);

    ws.addEventListener("open", () => {
        let initialized = false;

        ws.onmessage = async (msgEvent) => {
            console.log("Message received:", msgEvent.data);
            const data = msgEvent.data as Blob;
            const bytes = await data.arrayBuffer();
            const response = MmtpMessage.decode(new Uint8Array(bytes));
            console.log(response);

            if (response.responseMessage?.responseToUuid !== lastSentMessage.uuid) {
                console.error("The UUID of the last sent message does not match the UUID being responded to");
            }
            if (!initialized) {
                // do something
                connectContainer.hidden = true;
                msgContainer.hidden = false;
                reconnectToken = response.responseMessage.reconnectToken;

                if (authenticated) {
                    sendContainer.hidden = false;
                    const subMsg = MmtpMessage.create({
                        msgType: MsgType.PROTOCOL_MESSAGE,
                        uuid: uuidv4(),
                        protocolMessage: ProtocolMessage.create({
                            protocolMsgType: ProtocolMessageType.SUBSCRIBE_MESSAGE,
                            subscribeMessage: Subscribe.create({
                                directMessages: true
                            })
                        })
                    });
                    msgBlob = MmtpMessage.encode(subMsg).finish();

                    lastSentMessage = subMsg;

                    ws.send(msgBlob);
                }
                initialized = true;

                disconnectBtn.addEventListener("click", () => {
                    const disconnectMsg = MmtpMessage.create({
                        msgType: MsgType.PROTOCOL_MESSAGE,
                        uuid: uuidv4(),
                        protocolMessage: ProtocolMessage.create({
                            protocolMsgType: ProtocolMessageType.DISCONNECT_MESSAGE,
                            disconnectMessage: Disconnect.create()
                        })
                    });

                    msgBlob = MmtpMessage.encode(disconnectMsg).finish();

                    lastSentMessage = disconnectMsg;
                    ws.send(msgBlob);
                });

                if (ownMrn) {
                    await fetch(mrnStoreUrl + "/mrn", {
                        method: "POST",
                        body: JSON.stringify({mrn: ownMrn, edgeRouter: edgeRouter}),
                        mode: "cors",
                        headers: {"Content-Type": "application/json"}
                    });
                }

                disconnectBtn.hidden = false;
                receiveContainer.hidden = false;
            } else {
                if (response.msgType == MsgType.RESPONSE_MESSAGE) {
                    const msgs = response.responseMessage.applicationMessages;
                    msgs.forEach(msg => {
                        showReceivedMessage(msg);
                    })
                }
            }
        };

        const connectMsg = MmtpMessage.create({
            msgType: MsgType.PROTOCOL_MESSAGE,
            uuid: uuidv4(),
            protocolMessage: ProtocolMessage.create({
                protocolMsgType: ProtocolMessageType.CONNECT_MESSAGE,
                connectMessage: Connect.create({})
            })
        });
        if (ownMrn) {
            connectMsg.protocolMessage.connectMessage.ownMrn = ownMrn;
        }
        if (reconnectToken) {
            connectMsg.protocolMessage.connectMessage.reconnectToken = reconnectToken;
        }
        let msgBlob = MmtpMessage.encode(connectMsg).finish();

        lastSentMessage = connectMsg;
        ws.send(msgBlob);
    });

    ws.addEventListener("close", async evt => {
        if (evt.code !== 1000) {
            alert("Connection to Edge Router closed unexpectedly: " + evt.reason);
        }
        if (ownMrn) {
            await fetch(mrnStoreUrl + "/mrn/" + ownMrn, {
                method: "DELETE",
                mode: "cors"
            });
        }
        location.reload();
    });
});

async function loadCertAndPrivateKeyFromFiles() {
    if (!certFileInput.files.length || !privateKeyFileInput.files.length) {
        alert("Please provide a certificate and private key file")
        location.reload()
    }
    const certPem = await certFileInput.files[0].text();
    const certBytes = extractFromPem(certPem, "CERTIFICATE");
    const privKeyPem = await privateKeyFileInput.files[0].text();
    const privKeyBytes = extractFromPem(privKeyPem, "PRIVATE KEY");

    certificate = Certificate.fromBER(certBytes);
    privateKey = await crypto.subtle.importKey("pkcs8", privKeyBytes, {
        name: "ECDSA",
        namedCurve: "P-384"
    }, false, ["sign"]);
}

function extractFromPem(pemInput: string, inputType: string): ArrayBuffer {
    const b64 = pemInput.split(new RegExp(`-----BEGIN ${inputType}-----\r?\n?`))[1].split(`-----END ${inputType}-----`)[0];
    return str2ab(atob(b64));
}

/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

const possibleSubscriptions: Subscription[] = [
    {
        value: "Urn:mrn:mcp:service:dk-dmi:weather_on_route",
        name: "Weather on route",
    },
    {
        value: "Boats",
        name: "Boats",
    },
    {
        value: "MCP",
        name: "MCP",
    },
    {
        value: "Weather",
        name: "Weather",
    }];

let encodedFile: Uint8Array;

const mrnStoreUrl = "http://20.91.195.244:81";

interface Agent {
    mrn: string,
    edgeRouter: string,
}

const mrnRadio = document.getElementById('mrn') as HTMLInputElement;
const subjectRadio = document.getElementById('subject') as HTMLInputElement;

// MRN 라디오 버튼에 이벤트 리스너 추가
mrnRadio.addEventListener('change', (event) => {
    if (mrnRadio.checked) {
        subjectSelect.hidden = true;
        receiverMrnSelect.hidden = false;
        fetch(mrnStoreUrl + "/mrns", {
            mode: "cors",
            method: "GET"
        })
            .then(resp => resp.json())
            .then((resp: Agent[]) => resp.forEach(agent => {
                if (agent.mrn !== ownMrn) {
                    const mrnOption = document.createElement("option");
                    mrnOption.value = agent.mrn;
                    mrnOption.textContent = agent.mrn;
                    receiverMrnSelect.appendChild(mrnOption);
                }
            }));
    }
});

// Subject 라디오 버튼에 이벤트 리스너 추가
subjectRadio.addEventListener('change', (event) => {
    if (subjectRadio.checked) {
        receiverMrnSelect.hidden = true;
        receiverMrnSelect.innerHTML = "<option value=\"\">---Please select an MRN---</option>";
        subjectSelect.hidden = false;
    }
});

possibleSubscriptions.forEach(ps => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const span = document.createElement("span");
    span.textContent = ps.name;
    span.classList.add("pe-2");
    li.appendChild(span);

    const subButton = document.createElement("button");
    subButton.classList.add("btn", "btn-primary");
    subButton.textContent = "Subscribe";
    li.appendChild(subButton);

    const unsubButton = document.createElement("button");
    unsubButton.classList.add("btn", "btn-danger");
    unsubButton.textContent = "Unsubscribe";
    unsubButton.hidden = true;
    li.appendChild(unsubButton);

    subButton.addEventListener("click", () => {
        const subMsg = MmtpMessage.create({
            uuid: uuidv4(),
            msgType: MsgType.PROTOCOL_MESSAGE,
            protocolMessage: ProtocolMessage.create({
                protocolMsgType: ProtocolMessageType.SUBSCRIBE_MESSAGE,
                subscribeMessage: Subscribe.create({
                    subject: ps.value
                })
            })
        });
        const subMsgBytes = MmtpMessage.encode(subMsg).finish();
        lastSentMessage = subMsg;
        ws.send(subMsgBytes);

        subButton.hidden = true;
        unsubButton.hidden = false;
    });

    unsubButton.addEventListener("click", () => {
        const unsubMsg = MmtpMessage.create({
            uuid: uuidv4(),
            msgType: MsgType.PROTOCOL_MESSAGE,
            protocolMessage: ProtocolMessage.create({
                protocolMsgType: ProtocolMessageType.UNSUBSCRIBE_MESSAGE,
                unsubscribeMessage: Unsubscribe.create({
                    subject: ps.value
                })
            })
        });
        const unsubMsgBytes = MmtpMessage.encode(unsubMsg).finish();
        lastSentMessage = unsubMsg;
        ws.send(unsubMsgBytes);

        unsubButton.hidden = true;
        subButton.hidden = false;
    });

    subsList.appendChild(li);

    const subjectOption = document.createElement("option");
    subjectOption.value = ps.value;
    subjectOption.textContent = ps.name;
    subjectSelect.appendChild(subjectOption);
});

const fileBytesArray = new TextEncoder().encode("FILE"); // The bytes of the word "FILE"

function showReceivedMessage(msg: IApplicationMessage) {
    const payload = msg.body;
    const decoder = new TextDecoder();
    if (arraysEqual(payload.subarray(0, 4), fileBytesArray)) {
        for (let i = 4; i < payload.length; i++) {
            if (arraysEqual(payload.subarray(i, i + 4), fileBytesArray)) {
                const fileNameBytes = payload.subarray(4, i);
                const fileName = decoder.decode(fileNameBytes);
                const content = payload.subarray(i + 4);

                incomingArea.append(`${msg.header.sender} sent: `);
                const downloadLink = document.createElement("a");
                downloadLink.href = "#";
                downloadLink.textContent = fileName;
                downloadLink.onclick = (e) => {
                    let hidden_a = document.createElement('a');
                    hidden_a.setAttribute('href', 'data:application/octet-stream;base64,' + bytesToBase64(content));
                    hidden_a.setAttribute('download', fileName);
                    document.body.appendChild(hidden_a);
                    hidden_a.click();

                    e.preventDefault();
                };
                incomingArea.append(downloadLink);
                incomingArea.appendChild(document.createElement('br'));
                break;
            }
        }
    } else {
        const text = decoder.decode(payload);
        incomingArea.append(`${msg.header.sender} sent: ${text}`);
        incomingArea.appendChild(document.createElement('br'));
    }
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}

function bytesToBase64(bytes: Uint8Array): string {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
}

sendBtn.addEventListener("click", async () => {
    if (!mrnRadio.checked && !subjectRadio.checked) {
        alert("You need to choose message type!");
    }

    let bytes: Uint8Array;
    if (encodedFile) {
        bytes = encodedFile;
    } else {
        const text = msgArea.value;
        const encoder = new TextEncoder();
        bytes = encoder.encode(text);
    }

    const signature = new Uint8Array(await crypto.subtle.sign({name: "ECDSA", hash: "SHA-384"}, privateKey, bytes));
    const b64Signature = btoa(String.fromCodePoint(...signature));

    const sendMsg = MmtpMessage.create({
        msgType: MsgType.PROTOCOL_MESSAGE,
        uuid: uuidv4(),
        protocolMessage: ProtocolMessage.create({
            protocolMsgType: ProtocolMessageType.SEND_MESSAGE,
            sendMessage: Send.create({
                applicationMessage: ApplicationMessage.create({
                    header: ApplicationMessageHeader.create({
                        bodySizeNumBytes: bytes.byteLength,
                        sender: ownMrn,
                    }),
                    body: bytes,
                    signature: b64Signature
                })
            })
        })
    });

    if (mrnRadio.checked) {
        const receiver = receiverMrnSelect.options[receiverMrnSelect.selectedIndex].value;
        sendMsg.protocolMessage.sendMessage.applicationMessage.header.recipients = Recipients.create({
            recipients: [receiver]
        });
    } else if (subjectRadio.checked) {
        sendMsg.protocolMessage.sendMessage.applicationMessage.header.subject = subjectSelect.options[subjectSelect.selectedIndex].value;
    }

    const toBeSent = MmtpMessage.encode(sendMsg).finish();
    console.log("MMTP message size: ", toBeSent.length);
    lastSentMessage = sendMsg;
    ws.send(toBeSent);

    msgArea.value = "";
    encodedFile = undefined;
    loadedState.style.display = 'none';
    unloadedState.style.display = 'block';
});

const receiveBtn = document.getElementById("receiveBtn") as HTMLButtonElement;
receiveBtn.addEventListener("click", () => {
    const receive = MmtpMessage.create({
        msgType: MsgType.PROTOCOL_MESSAGE,
        uuid: uuidv4(),
        protocolMessage: ProtocolMessage.create({
            protocolMsgType: ProtocolMessageType.RECEIVE_MESSAGE,
            receiveMessage: Receive.create({})
        })
    });
    const bytes = MmtpMessage.encode(receive).finish();
    lastSentMessage = receive;
    ws.send(bytes);
});

function encodeFile(fileName: string, data: Uint8Array): Uint8Array {
    const fileNameArray = new TextEncoder().encode("FILE" + fileName + "FILE");
    const mergedArray = new Uint8Array(fileNameArray.length + data.length);
    mergedArray.set(fileNameArray);
    mergedArray.set(data, fileNameArray.length);
    return mergedArray;
}

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener("change", handleFiles, false);

function handleFiles() {
    const fileList = this.files; /* now you can work with the file list */

    const file: File = this.files[0];
    if (file) {
        file.arrayBuffer().then(buff => {
            let data = new Uint8Array(buff); // x is your uInt8Array
            // perform all required operations with x here.
            encodedFile = encodeFile(file.name, data);
            this.files = undefined;
            loadedState.style.display = 'block';
            unloadedState.style.display = 'none';
        });
        console.log("call finished");
    }
}

const loadedState = document.getElementById('file-state-loaded');
const unloadedState = document.getElementById('file-state-unloaded');

loadedState.style.display = 'none';
unloadedState.style.display = 'block';
