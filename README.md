
## Judul Proyek
Time to Code - Backend

## Deskripsi
Menyediakan API yang mengelola data pengguna, autentikasi, dan penyimpanan progres pembelajaran. Menggunakan arsitektur berbasis RESTful, backend ini mendukung fitur-fitur seperti pengelolaan tantangan, pencapaian pengguna, dan elemen gamifikasi. Backend menyimpan data secara aman di database relasional dan memastikan komunikasi yang efisien antara aplikasi mobile dan server.

## Fitur
- **Mode Cerita                 :** Sebuah visual novel interaktif yang mengajarkan konsep-konsep pemrograman melalui pengalaman berbasis narasi.
- **Mode Tantangan              :** Serangkaian tantangan untuk menguji dan memperkuat konsep yang telah dipelajari di Mode Cerita.
- **Mode Drag and Drop          :** Pengalaman pengkodean langsung di mana pengguna dapat menyeret dan menjatuhkan blok kode untuk menyelesaikan masalah.
- **Penyimpanan Progres Lokal   :** Progres dan pengaturan pengguna disimpan secara lokal di perangkat untuk pengalaman yang lebih lancar.
- **Elemen Gamifikasi           :** Aplikasi ini menggabungkan elemen gamifikasi seperti poin, level, dan pencapaian untuk memotivasi pengguna.

## Teknologi yang Digunakan
- **Laravel    :** framework utama untuk mengelola logika aplikasi dan menyediakan API.
- **PHP        :** Menjalankan server-side processing dan integrasi dengan database.

## Instalasi
1. **Kloning repositori:**
    ```bash
    git clone https://github.com/pens-pbl/2025-timetocode-backend.git
    ```
2. **Menyalin file .env:**
    ```bash
    Buat file .env baru lalu salin .env.example
    ```
3. **Instal dependensi:**
    ```bash
    composer install
    ```
4. **Membuat database SQLite:**
    ```bash
    database/database.sqlite
    ```
5. **Membuat key:**
    ```bash
    php artisan key:generate
    ```
6. **Menjalankan migrasi dan seeder:**
    ```bash
    php artisan migrate \--seed
    ```

## Penggunaan
1. **Jalankan aplikasi:**
    ```bash
    flutter run
    ```
2. Aplikasi akan diluncurkan di perangkat yang terhubung atau emulator.
3. Dari menu utama, Anda dapat memilih antara "Mode Cerita" atau "Mode Tantangan" untuk mulai belajar.

## Variabel Lingkungan
Proyek ini tidak memerlukan variabel lingkungan. Semua konfigurasi sudah disertakan dalam kode sumber.

## Kontribusi
Kontribusi sangat diterima! Jika Anda memiliki ide, saran, atau laporan bug, silahkan buka issue atau kirim pull request.

## Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
