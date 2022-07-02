export class HttpError extends Error {
    public constructor(msg: string, status: string, code: number) {
        super(msg)

        if (status)
            this.status = status;

        if (code)
            this.statusCode = code;
        else
            this.statusCode = 500;
    }

    statusCode: number;
    status: string
}