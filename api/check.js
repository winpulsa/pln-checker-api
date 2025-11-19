// api/check.js
const axios = require('axios');

export default async function handler(req, res) {
    // 1. Konfigurasi CORS (Penting agar bisa diakses dari file HTML kamu)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight request (khusus untuk OPTIONS method)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // 2. Ambil ID Pelanggan dari URL Query
    // Contoh: .../api/check?no=1234567890
    const idPelanggan = req.query.no;
    
    // 3. Ambil API Key dari script kamu sebelumnya
    const API_KEY = "caea83d20b89b90"; 
    
    if (!idPelanggan) {
        // Jika ID kosong, kembalikan error
        return res.status(400).json({ 
            error_msg: "ID Pelanggan (no) wajib diisi di parameter URL." 
        });
    }

    try {
        // 4. Kirim request ke API sumber (api-rekening.my.id)
        const apiUrlSumber = `https://api-rekening.my.id/trueid/bill/pln/?no=${idPelanggan}&key=${API_KEY}`;
        
        const response = await axios.get(apiUrlSumber);
        const data = response.data;
        
        // 5. Kembalikan data yang diterima ke pengguna API kamu
        // Format yang dikembalikan sama persis dengan API sumber: { name, segment_power, error_msg }
        return res.status(200).json(data);

    } catch (error) {
        // Handle jika terjadi error di sisi API sumber atau koneksi
        console.error("Error fetching PLN data:", error.message);
        return res.status(500).json({ 
            error_msg: "Server API sedang bermasalah atau ID tidak valid." 
        });
    }
}
