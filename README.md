
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
- **Laravel    :** Framework utama untuk mengelola logika aplikasi dan menyediakan API.
- **PHP        :** Menjalankan server-side processing dan integrasi dengan database.

## Instalasi
1. **Kloning repositori:**
    ```bash
    git clone https://github.com/pens-pbl/2025-timetocode-backend.git
    ```
2. **Menyalin file .env:**
   Linux / Mac
    ```bash
    cp .env.example .env
    ```
    Windows (CMD)
    ```bash
    copy .env.example .env
    ```
3. **Instal dependensi:**
    ```bash
    composer install
    ```
4. **Membuat database SQLite:**
   Linux / Mac
    ```bash
    touch database/database.sqlite
    ```
    Windows (CMD)
    ```bash
    type nul > database\database.sqlite
    ```
6. **Membuat key:**
    ```bash
    php artisan key:generate
    ```
7. **Menjalankan migrasi dan seeder:**
    ```bash
    php artisan migrate --seed
    ```

## Penggunaan
1.  ```bash
    php artisan serve
    ```
2.  ```bash
    localhost 127.0.0.1:8000
    ```
    atau
    
     ```bash
    localhost:8000
    ```
## Variabel Lingkungan
Proyek ini tidak memerlukan variabel lingkungan. Semua konfigurasi sudah disertakan dalam kode sumber.

## Kontribusi
Kontribusi sangat diterima! Jika Anda memiliki ide, saran, atau laporan bug, silahkan buka issue atau kirim pull request.

## Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
