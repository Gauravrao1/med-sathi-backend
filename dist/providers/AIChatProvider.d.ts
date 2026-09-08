import { Medicine } from './DataProvider.js';
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export interface AIChatProvider {
    chat(messages: ChatMessage[], medicineContext: Medicine | null): Promise<string>;
}
export declare class MockAIChatProvider implements AIChatProvider {
    chat(messages: ChatMessage[], medicineContext: Medicine | null): Promise<string>;
    private findKnowledgeKey;
    private searchMedicineInMessage;
}
export declare class GeminiChatProvider implements AIChatProvider {
    private genAI;
    private mockProvider;
    constructor();
    chat(messages: ChatMessage[], medicineContext: Medicine | null): Promise<string>;
}
