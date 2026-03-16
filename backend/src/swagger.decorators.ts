type AnyDecorator = (...args: any[]) => any;

const noop: AnyDecorator = () => () => {};

let ApiProperty: AnyDecorator = noop;
let ApiTags: AnyDecorator = noop;
let ApiBody: AnyDecorator = noop;
let ApiBearerAuth: AnyDecorator = noop;
let ApiOkResponse: AnyDecorator = noop;
let ApiCreatedResponse: AnyDecorator = noop;
let ApiUnauthorizedResponse: AnyDecorator = noop;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const swagger = require('@nestjs/swagger');
  ApiProperty = swagger.ApiProperty;
  ApiTags = swagger.ApiTags;
  ApiBody = swagger.ApiBody;
  ApiBearerAuth = swagger.ApiBearerAuth;
  ApiOkResponse = swagger.ApiOkResponse;
  ApiCreatedResponse = swagger.ApiCreatedResponse;
  ApiUnauthorizedResponse = swagger.ApiUnauthorizedResponse;
} catch {
  // Swagger is optional; fall back to no-op decorators.
}

export {
  ApiProperty,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
};