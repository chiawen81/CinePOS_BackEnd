interface ErrorInfo extends Error {
    status?: number;
    statusCode?: number;
    isOperational?: boolean;
}