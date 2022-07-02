export class ElasticClientConfigModel {
    node: string;
    username: string;
    password: string;
    caFingerprint: string;
    index: string;
}

export default class ConfigModel {
    version: string;
    host: string;
    port: number;

    elastic: ElasticClientConfigModel;

    showErrorMessage: boolean;

    proxy: boolean;
}