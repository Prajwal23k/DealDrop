import axios from "axios";

export const getLocationFromIp = async (ip) => {
    const defaultLocation = {
        country: "Unknown",
        region: "Unknown",
        city: "Unknown",
        isp: "Unknown",
    };

    // Skip API call for localhost IPs
    if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.includes("::ffff:127.0.0.1")) {
        return defaultLocation;
    }

    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`, {
            timeout: 5000 // 5 second timeout
        });
        if (response.data.status === "success") {
            return {
                country: response.data.country,
                region: response.data.regionName,
                city: response.data.city,
                isp: response.data.isp,
            };
        } else {
            return defaultLocation;
        }
    } catch (error) {
        console.log("Geo API error:", error.message);
        return defaultLocation;
    }
};

export const getClientIp = (req) => {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
};