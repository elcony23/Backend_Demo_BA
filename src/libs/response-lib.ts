export function success(body) {
    console.log('Result: 200');
    console.log(
        `Response: ${typeof body === 'object' ? JSON.stringify(body) : body}`
    );
    return buildResponse(200, body);
}

export function redirect(Location) {
    console.log('Result: 302');
    console.log(`Redirect: ${Location}`);
    return {
        statusCode: 302,
        headers: {
            Location
        }
    };
}

export function failure(body) {
    console.log('Result: 400');
    console.log(
        `Response: ${typeof body === 'object' ? JSON.stringify(body) : body}`
    );
    return buildResponse(400, body);
}

export function notAllowed(body) {
    console.log('Result: 405');
    console.log(
        `Response: ${typeof body === 'object' ? JSON.stringify(body) : body}`
    );
    return buildResponse(405, body);
}

export function customResponse(code, body) {
    console.log('Result:', code);
    console.log(
        `Response: ${typeof body === 'object' ? JSON.stringify(body) : body}`
    );
    return buildResponse(code, body);
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: typeof body === 'object' ? JSON.stringify(body, null, 4) : body
    };
}
