"use strict";
/**
 * This file was auto-generated by Fern from our API Definition.
 */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptVersions = void 0;
const core = __importStar(require("../../../../core"));
const PromptonApi = __importStar(require("../../.."));
const url_search_params_1 = __importDefault(require("@ungap/url-search-params"));
const url_join_1 = __importDefault(require("url-join"));
const serializers = __importStar(require("../../../../serialization"));
const errors = __importStar(require("../../../../errors"));
class PromptVersions {
    constructor(options) {
        this.options = options;
    }
    /**
     * @throws {@link PromptonApi.BadRequestError}
     * @throws {@link PromptonApi.UnauthorizedError}
     * @throws {@link PromptonApi.NotFoundError}
     * @throws {@link PromptonApi.UnprocessableEntityError}
     */
    getPromptVersionsList(request = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { promptId } = request;
            const _queryParams = new url_search_params_1.default();
            if (promptId != null) {
                _queryParams.append("prompt_id", promptId);
            }
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(yield core.Supplier.get(this.options.environment), "promptVersions"),
                method: "GET",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
                queryParameters: _queryParams,
                timeoutMs: 60000,
            });
            if (_response.ok) {
                return yield serializers.promptVersions.getPromptVersionsList.Response.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new PromptonApi.BadRequestError(_response.error.body);
                    case 401:
                        throw new PromptonApi.UnauthorizedError(_response.error.body);
                    case 404:
                        throw new PromptonApi.NotFoundError(_response.error.body);
                    case 422:
                        throw new PromptonApi.UnprocessableEntityError(_response.error.body);
                    default:
                        throw new errors.PromptonApiError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.PromptonApiError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.PromptonApiTimeoutError();
                case "unknown":
                    throw new errors.PromptonApiError({
                        message: _response.error.errorMessage,
                    });
            }
        });
    }
    /**
     * @throws {@link PromptonApi.BadRequestError}
     * @throws {@link PromptonApi.UnauthorizedError}
     * @throws {@link PromptonApi.UnprocessableEntityError}
     */
    addPromptVersion(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(yield core.Supplier.get(this.options.environment), "promptVersions"),
                method: "POST",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
                body: yield serializers.PromptVersionCreate.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
                timeoutMs: 60000,
            });
            if (_response.ok) {
                return _response.body;
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new PromptonApi.BadRequestError(_response.error.body);
                    case 401:
                        throw new PromptonApi.UnauthorizedError(_response.error.body);
                    case 422:
                        throw new PromptonApi.UnprocessableEntityError(_response.error.body);
                    default:
                        throw new errors.PromptonApiError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.PromptonApiError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.PromptonApiTimeoutError();
                case "unknown":
                    throw new errors.PromptonApiError({
                        message: _response.error.errorMessage,
                    });
            }
        });
    }
    /**
     * @throws {@link PromptonApi.BadRequestError}
     * @throws {@link PromptonApi.UnauthorizedError}
     * @throws {@link PromptonApi.NotFoundError}
     * @throws {@link PromptonApi.UnprocessableEntityError}
     */
    getPromptVersionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(yield core.Supplier.get(this.options.environment), `promptVersions/${id}`),
                method: "GET",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
                timeoutMs: 60000,
            });
            if (_response.ok) {
                return yield serializers.PromptVersionRead.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new PromptonApi.BadRequestError(_response.error.body);
                    case 401:
                        throw new PromptonApi.UnauthorizedError(_response.error.body);
                    case 404:
                        throw new PromptonApi.NotFoundError(_response.error.body);
                    case 422:
                        throw new PromptonApi.UnprocessableEntityError(_response.error.body);
                    default:
                        throw new errors.PromptonApiError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.PromptonApiError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.PromptonApiTimeoutError();
                case "unknown":
                    throw new errors.PromptonApiError({
                        message: _response.error.errorMessage,
                    });
            }
        });
    }
    /**
     * @throws {@link PromptonApi.BadRequestError}
     * @throws {@link PromptonApi.UnauthorizedError}
     * @throws {@link PromptonApi.NotFoundError}
     * @throws {@link PromptonApi.UnprocessableEntityError}
     */
    updatePromptVersion(id, request = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(yield core.Supplier.get(this.options.environment), `promptVersions/${id}`),
                method: "PATCH",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
                body: yield serializers.PromptVersionUpdate.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
                timeoutMs: 60000,
            });
            if (_response.ok) {
                return yield serializers.PromptVersionRead.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new PromptonApi.BadRequestError(_response.error.body);
                    case 401:
                        throw new PromptonApi.UnauthorizedError(_response.error.body);
                    case 404:
                        throw new PromptonApi.NotFoundError(_response.error.body);
                    case 422:
                        throw new PromptonApi.UnprocessableEntityError(_response.error.body);
                    default:
                        throw new errors.PromptonApiError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.PromptonApiError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.PromptonApiTimeoutError();
                case "unknown":
                    throw new errors.PromptonApiError({
                        message: _response.error.errorMessage,
                    });
            }
        });
    }
    _getAuthorizationHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            const bearer = yield core.Supplier.get(this.options.token);
            if (bearer != null) {
                return `Bearer ${bearer}`;
            }
            return undefined;
        });
    }
}
exports.PromptVersions = PromptVersions;
