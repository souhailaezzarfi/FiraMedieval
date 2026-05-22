import { useEffect, useState, useRef } from "react";
import programaService from "../../services/programaService";
import { FaFilePdf } from "react-icons/fa";

export default function Programa() {
  const [urlActual, setUrlActual] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    programaService
      .getPdf()
      .then((res) => setUrlActual(res.data.url))
      .catch(() => setUrlActual(null));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await programaService.uploadPdf(file);
      setUrlActual(res.data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message ?? "Error en pujar el PDF.");
    } finally {
      setUploading(false);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C1A0E]">
          Programa de la Fira
        </h1>
        <p className="text-xg text-[#8B6A4A] mt-1">
          Gestiona el PDF del programa oficial
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E0D5C0] p-8 max-w-2xl">
        {/* PDF actual */}
        <div className="mb-8">
          <p className="text-lg font-semibold text-[#6B4F30] uppercase tracking-wider mb-3">
            PDF actual
          </p>
          {urlActual ? (
            <div className="flex items-center gap-4 p-4 bg-[#FAF6EE] rounded-xl border border-[#E0D5C0]">
              <FaFilePdf size={32} className="text-red-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-md font-medium text-[#432918]">
                  programa.pdf
                </p>
                <p className="text-sm text-[#8B6A4A] truncate">{urlActual}</p>
              </div>

              <a
                href={urlActual}
                target="_blank"
                rel="noreferrer"
                className="text-md font-semibold text-[#C49743] hover:text-[#432918] transition-colors shrink-0"
              >
                Veure
              </a>
            </div>
          ) : (
            <div className="p-4 bg-[#FAF6EE] rounded-xl border border-dashed border-[#E0D5C0] text-center">
              <p className="text-md text-[#8B6A4A]">
                No hi ha cap PDF pujat encara.
              </p>
            </div>
          )}
        </div>

        {/* nou PDF */}
        <div>
          <p className="text-md font-semibold text-[#6B4F30] uppercase tracking-wider mb-3">
            {urlActual ? "Substituir PDF" : "Pujar PDF"}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-md px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-md px-4 py-2 rounded-lg mb-4">
              PDF pujat correctament.
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-lg cursor-pointer transition-colors ${
              uploading
                ? "bg-[#D4A853]/60 text-[#1E0F07] cursor-wait"
                : "bg-[#D4A853] text-[#1E0F07] hover:bg-[#C49743]"
            }`}
          >
            <FaFilePdf size={18} />
            {uploading
              ? "Pujant..."
              : urlActual
                ? "Substituir PDF"
                : "Pujar PDF"}
          </label>
          <p className="text-sm text-[#8B6A4A] mt-2">Màxim 10MB. Només PDF.</p>
        </div>
      </div>
    </div>
  );
}
