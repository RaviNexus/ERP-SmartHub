"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUnauthorizedResponse = exports.ApiCreatedResponse = exports.ApiOkResponse = exports.ApiBearerAuth = exports.ApiBody = exports.ApiTags = exports.ApiProperty = void 0;
const noop = () => () => { };
let ApiProperty = noop;
exports.ApiProperty = ApiProperty;
let ApiTags = noop;
exports.ApiTags = ApiTags;
let ApiBody = noop;
exports.ApiBody = ApiBody;
let ApiBearerAuth = noop;
exports.ApiBearerAuth = ApiBearerAuth;
let ApiOkResponse = noop;
exports.ApiOkResponse = ApiOkResponse;
let ApiCreatedResponse = noop;
exports.ApiCreatedResponse = ApiCreatedResponse;
let ApiUnauthorizedResponse = noop;
exports.ApiUnauthorizedResponse = ApiUnauthorizedResponse;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swagger = require('@nestjs/swagger');
    exports.ApiProperty = ApiProperty = swagger.ApiProperty;
    exports.ApiTags = ApiTags = swagger.ApiTags;
    exports.ApiBody = ApiBody = swagger.ApiBody;
    exports.ApiBearerAuth = ApiBearerAuth = swagger.ApiBearerAuth;
    exports.ApiOkResponse = ApiOkResponse = swagger.ApiOkResponse;
    exports.ApiCreatedResponse = ApiCreatedResponse = swagger.ApiCreatedResponse;
    exports.ApiUnauthorizedResponse = ApiUnauthorizedResponse = swagger.ApiUnauthorizedResponse;
}
catch {
    // Swagger is optional; fall back to no-op decorators.
}
