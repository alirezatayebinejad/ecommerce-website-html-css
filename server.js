const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

const EXCEL_FILE = 'orders.xlsx';

// Function to create and format worksheet
async function createWorksheet(workbook) {
    const worksheet = workbook.addWorksheet('Orders');
    
    // Define columns with specific widths and styles
    worksheet.columns = [
        { header: 'Order Date', key: 'date', width: 20 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Street', key: 'street', width: 30 },
        { header: 'City', key: 'city', width: 20 },
        { header: 'State', key: 'state', width: 15 },
        { header: 'ZIP', key: 'zip', width: 10 },
        { header: 'Country', key: 'country', width: 20 },
        { header: 'Card Number', key: 'cardNumber', width: 20 },
        { header: 'Card Name', key: 'cardName', width: 25 },
        { header: 'Items', key: 'items', width: 40 },
        { header: 'Total Amount', key: 'total', width: 15 }
    ];

    // Style the header row
    worksheet.getRow(1).font = {
        bold: true,
        size: 12
    };

    // Add background color to header
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    // Add borders to header
    worksheet.getRow(1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'double' },
        right: { style: 'thin' }
    };

    return worksheet;
}

app.post('/save-order', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        let worksheet;

        // Check if file exists
        if (fs.existsSync(EXCEL_FILE)) {
            await workbook.xlsx.readFile(EXCEL_FILE);
            worksheet = workbook.getWorksheet('Orders');
            
            // If worksheet doesn't exist, create it
            if (!worksheet) {
                worksheet = await createWorksheet(workbook);
            }
        } else {
            // Create new worksheet with formatting
            worksheet = await createWorksheet(workbook);
        }

        // Format the total amount
        const totalAmount = parseFloat(req.body.total).toFixed(2);

        // Add the new order
        const newRow = worksheet.addRow({
            date: new Date().toLocaleString(),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.country,
            cardNumber: `****-****-****-${req.body.cardNumber.slice(-4)}`,
            cardName: req.body.cardName,
            items: JSON.stringify(req.body.items),
            total: totalAmount
        });

        // Style the new row
        newRow.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        // Align total amount to right
        newRow.getCell('total').alignment = { horizontal: 'right' };

        // Save the file
        await workbook.xlsx.writeFile(EXCEL_FILE);
        console.log('Order saved successfully');
        res.json({ success: true, message: 'Order saved successfully' });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ success: false, message: 'Failed to save order' });
    }
});

// Try different ports if 3000 is in use
const ports = [3000, 3001, 3002, 3003];

function startServer(portIndex = 0) {
    if (portIndex >= ports.length) {
        console.error('No available ports found');
        return;
    }

    const PORT = ports[portIndex];
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy, trying next port...`);
            startServer(portIndex + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

startServer(); 