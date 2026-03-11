const testFetch = async () => {
    try {
        const response = await fetch('http://45.117.179.192:8000/api/log/last-log/C004');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
};

testFetch();
