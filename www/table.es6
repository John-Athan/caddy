function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

function parseCookie(cookieString) {
    const result = {};
    if (!cookieString) return result;

    const urlParts = cookieString.split('-at-');
    urlParts.shift(); // Remove the first element (UserID)

    urlParts.forEach(part => {
        const [timestamp, url] = part.split('-url-');
        if (timestamp && url) {
            result[timestamp.trim()] = url.trim();
        }
    });

    return result;
}

function createTable(quicData, httpData) {
    let output = `<table><tr><th>Timestamp</th><th>Visited URL</th><th>QUIC Token Tracking</th><th>HTTP Cookie Tracking</th></tr>`;
    const allTimestamps = new Set([...Object.keys(quicData), ...Object.keys(httpData)]);

    allTimestamps.forEach(timestamp => {
        const quicUrl = quicData[timestamp] || '';
        const httpUrl = httpData[timestamp] || '';
        const quicCheck = quicUrl ? '✓' : '';
        const httpCheck = httpUrl ? '✓' : '';
        const url = quicUrl || httpUrl;

        output += `<tr>
                        <td>${new Date(parseInt(timestamp) * 1000).toLocaleString()}</td>
                        <td><a href="${url}">${url}</a></td>
                        <td>${quicCheck}</td>
                        <td>${httpCheck}</td>
                       </tr>`;
    });

    output += '</table>';
    return output;
}

document.addEventListener('DOMContentLoaded', function () {
    const quicCookie = getCookie('quicTokenTracking');
    const httpCookie = getCookie('httpCookieTracking');

    const quicData = parseCookie(quicCookie);
    const httpData = parseCookie(httpCookie);

    document.getElementById('trackingInfo').innerHTML = createTable(quicData, httpData);
});