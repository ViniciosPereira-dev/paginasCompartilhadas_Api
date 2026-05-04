export function success(res, message, data = null, status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data
    });
}

export function error(res, message, status = 400) {
    return res.status(status).json({
        success: false,
        error: message
    });
}

export function parseDateBR(dateString) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return null;
    }

    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
}

