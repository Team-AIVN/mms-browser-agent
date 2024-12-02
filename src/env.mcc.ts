import { EnvironmentConfig } from "./index";

const EnvMcc : EnvironmentConfig = {
    mcc: [
        { value: "wss://kr-edgerouter.dmc.international:8888", text: "Korea Edge Router" },
        { value: "wss://eu-edgerouter.dmc.international:8888", text: "EU Edge Router" },
    ]
};

export default EnvMcc;