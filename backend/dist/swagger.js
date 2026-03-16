"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const setupSwagger = async (app, config) => {
    if (!config.swaggerEnabled)
        return;
    try {
        // Lazy-load so builds can succeed even if the package is not installed yet.
        const swagger = await Promise.resolve().then(() => __importStar(require('@nestjs/swagger')));
        const builder = new swagger.DocumentBuilder()
            .setTitle('SmartHub ERP API')
            .setDescription('ERP backend API documentation')
            .setVersion('0.0.1')
            .addBearerAuth();
        const document = swagger.SwaggerModule.createDocument(app, builder.build());
        swagger.SwaggerModule.setup(config.swaggerPath, app, document);
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Swagger disabled (package not installed).');
    }
};
exports.setupSwagger = setupSwagger;
