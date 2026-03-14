import axios from "axios";
import qs from "qs";

export const sendOTPviaFast2SMS = async (mobile, otp) => {
    try {
        if (!process.env.FAST2SMS_API_KEY) {
            console.warn("⚠️ FAST2SMS_API_KEY not found - using console mode");
            console.log("════════════════════════════════════════");
            console.log("📱 OTP SENT (Development Mode)");
            console.log(`Mobile: ${mobile}`);
            console.log(`OTP: ${otp}`);
            console.log("════════════════════════════════════════");
            return { success: true, console: true, otp };
        }

        const data = {
            "route": "dlt",
            "sender_id": "PHCPRL",
            "message": "180473",
            "variables_values": otp,
            "flash": 0,
            "numbers": mobile,
        }

        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            data,
            {
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        console.log("✅ Fast2SMS Response:", response.data);
        return response.data;

    } catch (error) {
        console.warn("⚠️ Fast2SMS unavailable, using fallback");
        console.error("Error details:", error.response?.data?.message || error.message);
        console.log("════════════════════════════════════════");
        console.log("📱 OTP SENT (Fallback Mode)");
        console.log(`Mobile: ${mobile}`);
        console.log(`OTP: ${otp}`);
        console.log("════════════════════════════════════════");
        return { success: true, fallback: true, otp };
    }
};
