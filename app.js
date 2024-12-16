// app.js
const ctx = document.getElementById('interestRateChart').getContext('2d');

// Data awal grafik (akan diupdate dari API)
const labels = [];
const interestRates = [];

// Membuat grafik menggunakan Chart.js
const interestRateChart = new Chart(ctx, {
    type: 'line', // Jenis grafik
    data: {
        labels: labels,
        datasets: [{
            label: 'Suku Bunga (%)',
            data: interestRates,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false // Tidak mengisi area bawah grafik
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Pergerakan Suku Bunga Real-Time'
            }
        }
    }
});

// Fungsi untuk memperbarui proyeksi suku bunga
function updateForecast() {
    const forecastValue = (Math.random() * (5 - 3) + 3).toFixed(2); // Nilai antara 3% dan 5%
    document.getElementById('forecast-value').innerText = `${forecastValue}%`;
}

// Mengambil data suku bunga secara real-time dari API
function fetchInterestRateData() {
    const apiURL = 'https://api.exchangerate-api.com/v4/latest/USD'; // Gantilah dengan API suku bunga yang sesuai
    
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates.BRL; // Misalkan data suku bunga dalam format ini

            const now = new Date();
            const label = `${now.getHours()}:${now.getMinutes()}`;
            labels.push(label);
            interestRates.push(rate);

            interestRateChart.update();

            updateForecast();
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Hitung cicilan bulanan berdasarkan input pengguna
function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const loanTerm = parseFloat(document.getElementById('loanTerm').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // Bunga per bulan
    
    if (isNaN(loanAmount) || isNaN(loanTerm) || isNaN(interestRate) || loanAmount <= 0 || loanTerm <= 0 || interestRate <= 0) {
        alert("Masukkan data yang valid!");
        return;
    }
    
    // Rumus cicilan tetap (annuity formula)
    const monthlyPayment = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTerm * 12));
    
    const totalPayment = monthlyPayment * loanTerm * 12;
    
    // Tampilkan hasil analisis
    document.getElementById('monthlyPayment').innerText = `Cicilan Bulanan: Rp ${monthlyPayment.toFixed(2)}`;
    document.getElementById('totalPayment').innerText = `Total Pembayaran: Rp ${totalPayment.toFixed(2)}`;
}

// Event listener untuk tombol hitung cicilan
document.getElementById('calculateButton').addEventListener('click', calculateLoan);

// Update data setiap 10 detik (untuk contoh real-time)
setInterval(fetchInterestRateData, 10000);
fetchInterestRateData();
