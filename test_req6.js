// Using native fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3000/api/Sensors/records';

async function testEndpoint(name, url) {
    console.log(`\n--- Testing: ${name} ---`);
    console.log(`URL: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        if (Array.isArray(data)) {
            console.log(`Count: ${data.length}`);
            if (data.length > 0) {
                console.log('First Item Sample:', JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
            }
        } else {
            console.log('Response:', data);
        }
    } catch (error) {
        console.error(`Error testing ${name}:`, error.message);
    }
}

async function runTests() {
    // 1. Test Active Records
    await testEndpoint('Active Records', `${BASE_URL}/active-records`);

    // 2. Test Filter (Temperature 0-100)
    await testEndpoint('Filter (temperature_C 0-100)', `${BASE_URL}/filter?key=temperature_C&min=0&max=100`);

    // 3. Test Complex Structure (5+ fields)
    await testEndpoint('Complex Structure (5+ fields)', `${BASE_URL}/complex-structure`);

    // 4. Test Recent (After 2026-02-01)
    await testEndpoint('Recent Records (After 2026-02-01)', `${BASE_URL}/recent`);
}

runTests();
