import {EnvironmentConfig} from "./index";

declare const ENVIRONMENT: string;

let ENV: Promise<EnvironmentConfig>;

if (ENVIRONMENT === "mcc") {
    ENV = import("./env.mcc").then((module) => module.default);
} else {
    throw new Error("Invalid environment configuration");
}

export default ENV;
