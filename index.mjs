import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import Fastify from 'fastify';
import open, {apps} from 'open';

const __dirname = dirname(fileURLToPath(import.meta.url));

const readAssetFile = async (filename, defaultContent) => {
    const indexHtmlFilename = join(__dirname, filename);
    try {
        return await fs.readFile(indexHtmlFilename);
    } catch (err) {
        console.error(err);
        return defaultContent;
    }
}

const fastify = Fastify({
    logger: true
})

fastify.get('/', async function (request, reply) {
    reply.header('content-type', 'text/html');
    return await readAssetFile('index.html', `<html><body><h1>HTML file not found</h1></body></html>`);
})

fastify.get('/html5-qrcode.min.js', async function (request, reply) {
    reply.header('content-type', 'text/javascript');
    return await readAssetFile('node_modules/html5-qrcode/html5-qrcode.min.js', `console.log('JS file not found');`);
})

const PORT = 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        // For reasons unknown, the laptop camera does not get enumerated in Brave. No such problem in Firefox.
        await open(`http://127.0.0.1:${PORT}#node-open`, { app: { name: apps.firefox } });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start()
