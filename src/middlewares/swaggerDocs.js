import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import yaml from 'yaml';

const openapiFile = fs.readFileSync('./docs/openapi.yaml', 'utf8');
const swaggerDocument = yaml.parse(openapiFile);

export const swaggerDocs = [swaggerUI.serve, swaggerUI.setup(swaggerDocument)];
