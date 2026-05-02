import returnReasonController from '../Src/Modules/ReturnReasons/returnReason.container.js';

const mockReq = { query: {} };
const mockRes = {
    status: (code) => ({
        json: (data) => console.log(`Response ${code}:`, data)
    })
};

try {
    console.log('Testing findAll controller directly...');
    await returnReasonController.findAll(mockReq, mockRes);
} catch (err) {
    console.error('Controller Error:', err);
}

process.exit(0);
