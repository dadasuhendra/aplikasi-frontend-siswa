import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/siswa";

const formKosong = {
  kode_siswa: "",
  nama_siswa: "",
  alamat_siswa: "",
  tgl_siswa: "",
  jurusan_siswa: "",
};

export default function App() {
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState(formKosong);
  const [modeEdit, setModeEdit] = useState(false);
  const [pesan, setPesan] = useState(null);

  async function ambilData() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setDaftar(await res.json());
    } catch {
      setPesan({ teks: "Tidak bisa terhubung ke backend", error: true });
    }
  }

  useEffect(() => {
    ambilData();
  }, []);

  function ubahInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function simpan(e) {
    e.preventDefault();
    const url = modeEdit ? `${API}/${form.kode_siswa}` : API;
    try {
      const res = await fetch(url, {
        method: modeEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setPesan({ teks: data.pesan, error: !res.ok });
      if (res.ok) {
        batal();
        ambilData();
      }
    } catch {
      setPesan({ teks: "Tidak bisa terhubung ke backend", error: true });
    }
  }

  function mulaiEdit(siswa) {
    setForm(siswa);
    setModeEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function batal() {
    setForm(formKosong);
    setModeEdit(false);
  }

  async function hapus(kode) {
    if (!window.confirm(`Hapus siswa ${kode}?`)) return;
    try {
      const res = await fetch(`${API}/${kode}`, { method: "DELETE" });
      const data = await res.json();
      setPesan({ teks: data.pesan, error: !res.ok });
      if (modeEdit && form.kode_siswa === kode) batal();
      ambilData();
    } catch {
      setPesan({ teks: "Tidak bisa terhubung ke backend", error: true });
    }
  }

  return (
    <main className="halaman">
      <h1>Data Siswa</h1>

      {pesan && <p className={pesan.error ? "info galat" : "info sukses"}>{pesan.teks}</p>}

      <form className="form" onSubmit={simpan}>
        <h2>{modeEdit ? "Ubah data siswa" : "Tambah Data siswa"}</h2>
        <label>
          Kode siswa
          <input name="kode_siswa" value={form.kode_siswa} onChange={ubahInput} disabled={modeEdit} required />
        </label>
        <label>
          Nama siswa
          <input name="nama_siswa" value={form.nama_siswa} onChange={ubahInput} required />
        </label>
        <label>
          Alamat siswa
          <input name="alamat_siswa" value={form.alamat_siswa} onChange={ubahInput} required />
        </label>
        <label>
          Tgl siswa
          <input type="date" name="tgl_siswa" value={form.tgl_siswa} onChange={ubahInput} required />
        </label>
        <label>
          Jurusan siswa
          <input name="jurusan_siswa" value={form.jurusan_siswa} onChange={ubahInput} required />
        </label>
        <div className="aksi">
          <button type="submit" className="utama">{modeEdit ? "Simpan perubahan" : "Tambah Data siswa"}</button>
          {modeEdit && <button type="button" onClick={batal}>Batal</button>}
        </div>
      </form>

      <div className="tabel-bungkus">
        <table>
          <thead>
            <tr>
              <th>Kode</th><th>Nama</th><th>Alamat</th><th>Tgl</th><th>Jurusan</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftar.length === 0 && (
              <tr><td colSpan="6" className="kosong">Belum ada data siswa.</td></tr>
            )}
            {daftar.map((s) => (
              <tr key={s.kode_siswa}>
                <td>{s.kode_siswa}</td>
                <td>{s.nama_siswa}</td>
                <td>{s.alamat_siswa}</td>
                <td>{s.tgl_siswa}</td>
                <td>{s.jurusan_siswa}</td>
                <td className="aksi">
                  <button onClick={() => mulaiEdit(s)}>Ubah</button>
                  <button className="bahaya" onClick={() => hapus(s.kode_siswa)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}