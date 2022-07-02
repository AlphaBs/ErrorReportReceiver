import { Client } from "@elastic/elasticsearch";

export interface IAppContext {
    elasticClient: Client
};