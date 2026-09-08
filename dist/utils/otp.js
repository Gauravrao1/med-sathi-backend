// TODO: Integrate with MSG91 or similar SMS provider for production
// Replace the sendOtp function below with your SMS gateway API call.
// MSG91 Example:
//   import axios from 'axios';
//   export async function sendOtp(phone: string, otp: string) {
//     await axios.post('https://api.msg91.com/api/v5/otp', {
//       template_id: 'YOUR_TEMPLATE_ID',
//       mobile: '91' + phone,
//       otp
//     }, { headers: { authkey: process.env.MSG91_AUTH_KEY } });
//   }
export const otpStore = new Map();
export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export function sendOtp(phone, otp) {
    console.log('');
    console.log('========================================');
    console.log('  OTP for +91-' + phone + ': ' + otp);
    console.log('  (Expires in 5 minutes)');
    console.log('========================================');
    console.log('');
}
