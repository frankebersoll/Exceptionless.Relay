import * as fs from 'fs';
import * as server from './server';

console.log("test");

setTimeout(() => { console.log("asdf") }, 3000);

server.run();