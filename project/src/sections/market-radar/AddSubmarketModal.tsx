import React, { useEffect, useState } from "react";

type AddSubmarketModalProps = {
  open: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: FormData) => Promise<void>;
};

const AddSubmarketModal: React.FC<AddSubmarketModalProps> = ({
  open,
  loading,
  error,
  onClose,
  onSubmit,
}) => {
  const [region, setRegion] = useState("");
  const [submarketName, setSubmarketName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [constructionType, setConstructionType] = useState("");
  const [submarketPdf, setSubmarketPdf] = useState<File | null>(null);
  const [capitalPdf, setCapitalPdf] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    setRegion("");
    setSubmarketName("");
    setLatitude("");
    setLongitude("");
    setConstructionType("");
    setSubmarketPdf(null);
    setCapitalPdf(null);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("region", region);
    formData.append("sub_market_name", submarketName);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("construction_type", constructionType);
    if (submarketPdf) {
      formData.append("submarket_pdf", submarketPdf);
    }
    if (capitalPdf) {
      formData.append("capital_pdf", capitalPdf);
    }
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 py-8">
      <div
        className="w-full max-w-xl rounded-2xl border border-white/10 p-6 text-slate-100 shadow-[0_30px_60px_rgba(2,6,23,0.65)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Submarket</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:border-white/30 hover:text-white"
            disabled={loading}
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-slate-300">
              Region
              <input
                type="text"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] px-3 py-2 text-sm text-slate-100 focus:border-white/30 focus:outline-none"
                required
              />
            </label>
            <label className="text-xs text-slate-300">
              Submarket Name
              <input
                type="text"
                value={submarketName}
                onChange={(event) => setSubmarketName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] px-3 py-2 text-sm text-slate-100 focus:border-white/30 focus:outline-none"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-slate-300">
              Latitude
              <input
                type="text"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] px-3 py-2 text-sm text-slate-100 focus:border-white/30 focus:outline-none"
                required
              />
            </label>
            <label className="text-xs text-slate-300">
              Longitude
              <input
                type="text"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] px-3 py-2 text-sm text-slate-100 focus:border-white/30 focus:outline-none"
                required
              />
            </label>
          </div>

          <label className="text-xs text-slate-300">
            Construction Type
            <select
              value={constructionType}
              onChange={(event) => setConstructionType(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] px-3 py-2 text-sm text-slate-100 focus:border-white/30 focus:outline-none"
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="multifamily">multifamily</option>
              <option value="industrial">industrial</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-slate-300">
              Submarket PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setSubmarketPdf(event.target.files?.[0] ?? null)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-slate-300 file:mr-2 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-1 file:text-xs file:text-cyan-100"
              />
            </label>
            <label className="text-xs text-slate-300">
              Capital PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setCapitalPdf(event.target.files?.[0] ?? null)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B1220] px-3 py-2 text-xs text-slate-300 file:mr-2 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-1 file:text-xs file:text-cyan-100"
              />
            </label>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 hover:border-white/30 hover:text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full border border-cyan-400/50 bg-cyan-400/10 px-5 py-2 text-xs font-semibold text-cyan-100 hover:border-cyan-300/70"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubmarketModal;
