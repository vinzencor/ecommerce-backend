import axios from 'axios';

const TWO_FACTOR_API_KEY = process.env['2factor_API_KEY'];


export const sendSMS = async (phone, otp) => {
    try {
        let formattedPhone = phone.trim();
        if (formattedPhone.length === 10) {
            formattedPhone = `91${formattedPhone}`;
        }
        
        if (!TWO_FACTOR_API_KEY) {
            throw new Error("2factor_API_KEY is missing from environment variables.");
        }

        const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${formattedPhone}/${otp}`;
        console.log(`[SMS] Sending OTP ${otp} to ${formattedPhone}...`);

        const response = await axios.get(url);
        
        console.log("[SMS] 2Factor Response Status Code:", response.status);
        console.log("[SMS] 2Factor Response Data:", response.data);

        if (response.data.Status !== 'Success') {
            throw new Error(`2Factor Error: ${response.data.Details}`);
        }
        
        return response.data;
    } catch (error) {
        const errorDetail = error.response?.data?.Details || error.message;
        console.error("[SMS] SEND ERROR DETAILS:", errorDetail);
        if (error.response?.data) {
            console.error("[SMS] ERROR RESPONSE BODY:", error.response.data);
        }
        throw new Error(`Failed to send SMS OTP: ${errorDetail}`);
    }
};
