export declare const otpStore: Map<string, {
    otp: string;
    expiresAt: number;
}>;
export declare function generateOtp(): string;
export declare function sendOtp(phone: string, otp: string): void;
