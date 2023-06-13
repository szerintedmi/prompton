/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as PromptonApi from "..";
export interface ChatGptChatCompletitionConfig {
    /** <span style="white-space: nowrap">`non-empty`</span> */
    model?: string;
    temperature?: number;
    topP?: number;
    stop?: PromptonApi.ChatGptChatCompletitionConfigStop;
    maxTokens?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    logitBias?: Record<string, number>;
}
