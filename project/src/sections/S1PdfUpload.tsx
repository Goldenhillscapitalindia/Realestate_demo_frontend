// src/components/S1PdfUpload.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import S1DealSummary from "../Components/deal/S1DealSummary";

type Stage = "idle" | "ready" | "uploading" | "success" | "error";
const MAX_SIZE_BYTES = 50 * 1024 * 1024;
const WRAP = "mx-auto w-[90vw] max-w-[1600px]"

const S1PdfUpload: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const s1InputRef = useRef<HTMLInputElement>(null);
  const rcInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const [s1File, setS1File] = useState<File | null>(null);
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<any>(null);
  const [showUploader, setShowUploader] = useState(true);

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const validate = (f: File) => {
    if (f.type !== "application/pdf") return "Only PDF files are allowed.";
    if (f.size > MAX_SIZE_BYTES) return `Max size ${formatBytes(MAX_SIZE_BYTES)}.`;
    return null;
  };

  const pickS1 = () => s1InputRef.current?.click();
  const pickRC = () => rcInputRef.current?.click();

  const onS1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const err = validate(f); if (err) return setMsg(err);
    setS1File(f); setMsg(""); setStage(rcFile ? "ready" : "idle");
  };

  const onRCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const err = validate(f); if (err) return setMsg(err);
    setRcFile(f); setMsg(""); setStage(s1File ? "ready" : "idle");
  };

  const resetAll = () => {
    setS1File(null); setRcFile(null); setStage("idle");
    setMsg(""); setProgress(0); setData(null); setShowUploader(true);
  };

  const onDrop = (type: "s1" | "rc") => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0]; if (!f) return;
    const err = validate(f); if (err) return setMsg(err);
    type === "s1" ? setS1File(f) : setRcFile(f);
    setMsg(""); setStage(s1File && rcFile ? "ready" : "idle");
  };

  const statuses = [
    "Uploading PDFs…",
    "Extracting text in LlamaCloud…",
    "Parsing sections & tables…",
    "Compiling your IPO summary…"
  ];
  const statusIdx = Math.min(3, Math.floor(progress / 25));

  const handleUpload = async () => {
    if (!s1File || !rcFile) {
      setMsg("Please add both PDFs: S-1 and Report Card."); return;
    }
    setStage("uploading"); setMsg(""); setProgress(0);
    const fd = new FormData();
    fd.append("file", s1File); // S-1 -> "file"
    fd.append("report_card_file", rcFile); // Report Card -> "report_card_file"

    try {
      const res = await axios.post(
        `${API_URL}/api/document_data_extraction/`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            const p = Math.round((evt.loaded * 100) / evt.total);
            setProgress(p < 98 ? p : 98); // keep UI suspense before server finishes
          },
        }
      );
      setData(res.data);
      setProgress(100);
      setStage("success");
      setMsg("Extraction complete.");
      setShowUploader(false);
    } catch (err: any) {
      console.error(err);
      setStage("error");
      setMsg(err?.response?.data?.detail || "Upload failed. Please try again.");
    }
  };

  useEffect(() => {
    if (stage === "success" && outputRef.current) {
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }, [stage]);

  const FileCard = ({
    title, file, onPick, onDropHandler, onRemove,
    subtitle,
  }: {
    title: string; file: File | null; onPick: () => void;
    onDropHandler: (e: React.DragEvent<HTMLDivElement>) => void;
    onRemove: () => void; subtitle: string;
  }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onPick() : null)}
      onDrop={onDropHandler}
      onDragOver={(e) => e.preventDefault()}
      className={[
        "rounded-2xl border-2 border-dashed p-5 transition bg-white",
        file ? "border-emerald-300 bg-emerald-50/40" : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          <div className="text-xs text-slate-500">{subtitle}</div>
          {file ? (
            <div className="mt-2 text-sm text-emerald-700 truncate">
              {file.name} • {formatBytes(file.size)}
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-600">
              Drag & drop PDF here or <span className="underline">click to browse</span>
            </div>
          )}
        </div>
        {file ? (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Remove
          </button>
        ) : (
          <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 16v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
              <path d="M12 12v9" />
              <path d="m16 16-4-4-4 4" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return (
    
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className={`${WRAP} px-4 py-3 flex items-center gap-2`}>
          <button
            onClick={() => navigate("/", { state: { scrollTo: "demos" } })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <span aria-hidden>←</span> Back
          </button>
          <div className="ml-2 text-sm text-slate-500">IPO Docs • Dual PDF Upload</div>
        </div>
      </div>

      <main className={`${WRAP} px-4 py-10`}>
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Upload S-1 & Report Card</h1>
          <p className="mt-2 text-slate-600">We’ll extract with LlamaCloud and render a clean summary.</p>
        </header>

        {showUploader && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* How it works (simplified) */}
            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-800">How it works</h2>
                <ol className="mt-3 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-slate-300 text-xs flex items-center justify-center">1</span>
                    Add both PDFs below (S-1 and Report Card).
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-slate-300 text-xs flex items-center justify-center">2</span>
                    Click Submit — we upload, extract, and parse.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-slate-300 text-xs flex items-center justify-center">3</span>
                    You’ll be taken to the summary automatically.
                  </li>
                </ol>
                <div className="mt-5 text-xs text-slate-500">
                  PDF only • Max {formatBytes(MAX_SIZE_BYTES)} each
                </div>
              </div>
            </aside>

            {/* Uploader */}
            <section className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
                <FileCard
                  title="S-1 / F-1 / 424B (Primary Filing)"
                  subtitle="Key: uploaded as 'file'"
                  file={s1File}
                  onPick={pickS1}
                  onRemove={() => { setS1File(null); setStage(rcFile ? "idle" : "idle"); }}
                  onDropHandler={onDrop("s1")}
                />
                <input ref={s1InputRef} type="file" accept="application/pdf" className="hidden" onChange={onS1Change} />

                <FileCard
                  title="Report Card (Supporting PDF)"
                  subtitle="Key: uploaded as 'report_card_file'"
                  file={rcFile}
                  onPick={pickRC}
                  onRemove={() => { setRcFile(null); setStage(s1File ? "idle" : "idle"); }}
                  onDropHandler={onDrop("rc")}
                />
                <input ref={rcInputRef} type="file" accept="application/pdf" className="hidden" onChange={onRCChange} />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {!!msg && (
                      <span className={stage === "error" ? "text-red-600 font-medium" : "text-slate-600"}>
                        {msg}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={resetAll}
                      disabled={stage === "uploading"}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!s1File || !rcFile || stage === "uploading"}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {stage === "uploading" ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                          </svg>
                          Submitting…
                        </>
                      ) : ("Submit")}
                    </button>
                  </div>
                </div>

                {/* Lively progress */}
                {stage === "uploading" && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium text-slate-700">{statuses[statusIdx]}</div>
                      <div className="text-slate-500">{progress}%</div>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-white overflow-hidden">
                      <div className="h-2 bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <li className={progress >= 5 ? "text-emerald-700" : ""}>✓ Upload started</li>
                      <li className={progress >= 35 ? "text-emerald-700" : ""}>✓ Text extraction</li>
                      <li className={progress >= 65 ? "text-emerald-700" : ""}>✓ Section parsing</li>
                      <li className={progress >= 95 ? "text-emerald-700" : ""}>✓ Summary ready</li>
                    </ul>
                  </div>
                )}

                {/* Error box */}
                {stage === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Something went wrong. {msg} &nbsp;
                    <button onClick={resetAll} className="underline">Try again</button>
                  </div>
                )}
              </div>
            </section>
          </section>
        )}
        {/* <S1DealSummary data={{
        "ticker_name": "MPLT",
        "exchange": "Nasdaq Global Market",
        "company_name": "MapLight Therapeutics, Inc.",
        "pricing_date": "2025-09-19",
        "deal_size": 511000000.0,
        "industry": "Biopharmaceuticals / Central Nervous System (CNS) Disorders",
        "shares_offered": 0,
        "nosh": 440,
        "established_year": 2018,
        "bookrunners": "Morgan Stanley, Jefferies, Leerink Partners",
        "filed_date": "2025-09-19",
        "business_overview": "- MapLight Therapeutics is a clinical-stage biopharmaceutical company focused on developing new treatments for central nervous system (CNS) disorders, targeting conditions with significant unmet patient needs such as schizophrenia, Alzheimer’s disease psychosis (ADP), and autism spectrum disorder (ASD).\n- The company leverages a proprietary drug discovery platform to identify neural circuits causally linked to CNS diseases and develop therapeutics that modulate these circuits for greater efficacy and fewer side effects.\n- Its lead product, ML-007C-MA, combines M1/M4 muscarinic agonist ML-007 with a peripheral anticholinergic and is in Phase 2 development for schizophrenia and for ADP, aiming to deliver effective treatment without dopaminergic side effects.\n- A second candidate, ML-004, targets social communication deficits and irritability in ASD, addressing a market with currently no approved therapies for core symptoms.\n- MapLight’s pipeline includes two additional preclinical candidates: ML-021 (for Parkinson’s disease motor deficits) and ML-009 (for hyperactivity/impulsivity disorders), both developed using its neural circuit insights.\n- The company maintains global rights to all current programs and aims to maximize value through clinical advancement, potential new indications, and selective collaborations.\n- With an experienced management team and scientific founders who are leaders in neuroscience and platform technology, MapLight has raised over $500 million to support its pipeline and development strategy.",
        "key_highlights": "1. Revenue: No commercial revenue as of filing; company is clinical-stage.\n2. YoY Revenue Growth: Not available; company generates no product revenue.\n3. EBIT: Not applicable; company is incurring operating losses.\n4. Adjusted EBIT Margin: Not available; company reports operating losses.\n5. Amount Raised: Over $511M raised pre-IPO from venture capital, healthcare investors, and foundation grants.\n6. TAM: Schizophrenia affects over 20M people globally (3M in the US); ADP affects 40% of 7M Alzheimer’s patients in the US; significant potential addressable markets in CNS disorders.\n",
        "strengths": "- Unique drug discovery platform that identifies and targets disease-causing neural circuits, potentially leading to more effective and safer CNS drugs.\n- Lead candidate (ML-007C-MA) addresses both symptom breadth and side effect profile in schizophrenia and Alzheimer’s psychosis, targeting an unmet need.\n- Strong clinical and preclinical pipeline diversified across mechanisms and indications, reducing risk.\n- Experienced management and scientific founders with significant drug development expertise and scientific innovation.\n- Retention of worldwide rights to all programs, maximizing future strategic flexibility and value.\n- Demonstrated good safety and tolerability for lead candidate in early clinical trials.\n- Robust financial backing from leading healthcare investors and VC firms supporting future R&D and operations.",
        "concerns": "- No history of commercialized products and still at the clinical stage, leading to uncertainty about eventual market success.\n- Substantial ongoing operating losses and need for additional financing; current financial projections indicate further investments required before profitability.\n- Heavy reliance on regulatory approvals, which are unpredictable and can significantly delay or halt progress.\n- Development risk remains high; clinical trials are expensive, long, and often unsuccessful.\n- Dependence on third-party partners for research and clinical trials may introduce additional risk and operational delays.\n- Faces competition from larger, established pharmaceutical companies that may develop more effective or faster-to-market solutions.\n- Risks in retaining key personnel and protecting intellectual property, both essential to company’s long-term competitiveness.",
        "principal_stockholders_preipo": "Catalyst4, Inc.: % of shares, voting common stock\nEntities affiliated with NFLS Beta Limited: % of shares, voting common stock\nNovo Holdings A/S: % of shares, voting common stock\nForbion Growth Opportunities Fund III Coöperatief U.A: % of shares, voting common stock",
        "key_management_personnel": "Christopher A. Kroeger, M.D. (2018): Chief Executive Officer\nVishwas Setia (2024): Chief Financial Officer\nErin Pennock Foff, M.D., Ph.D. (Date N/A): Chief Medical Officer\nJonathan Gillis (Date N/A): Chief Administrative and Accounting Officer\nAnatol Kreitzer, Ph.D. (Date N/A): Chief Discovery Officer",
        "use_of_proceeds": "- Advance the clinical development of current product candidates, primarily ML-007C-MA in schizophrenia and ADP.\n- Fund research and development activities for additional pipeline programs, including ML-004 and preclinical assets.\n- Support working capital needs and general corporate operations.\n- Enable further development and strategic growth of the company's proprietary platform and technologies.\n- Maintain financial flexibility for potential collaborations and business expansion as opportunities arise.\n- Address regulatory and compliance costs as the company moves towards commercialization.\n- Cover costs associated with the public offering and associated transition to public company reporting.",
        "regulatory_environment_category": "The company operates in a highly regulated biotech/pharma sector, particularly in CNS therapeutics, facing direct FDA oversight and stringent approval processes. Continuous compliance challenges arise from global regulatory demands, post-approval management, data privacy, and healthcare laws, introducing significant operational friction and persistent risks related to cost-containment and price controls.",
        "customer_mix_category": "The company's customer base targets clinicians such as psychiatrists and neurologists specializing in schizophrenia, ADP, and ASD, mainly focusing on US inpatient and elderly patients. The market spans institutional and retail sectors, with dominant US payers including Medicaid, Medicare, CMS, Cigna, etc.",
        "supplier_mix_category": "Company retains global rights for all programs with no direct supplier dependencies disclosed. However, it outsources all manufacturing to contract manufacturing organizations (CMOs), relying on external partners for clinical materials, which elevates execution risk due to lack of owned production facilities.",
        "market_analysis_category": "Significant unmet needs in CNS disorders like schizophrenia (>20M global, >3M US) and AD psychosis (~7M US AD pts, ~40% w/ psychosis). Schizophrenia market strong, antipsychotic sales proj. to grow from $14B (2024) to >$20B (2030), with recent branded meds >$5B annual sales despite generics. Emerging classes include muscarinic agonists. AD psychosis lacks approved therapies; current antipsychotics are poorly tolerated and only partially effective. Developing neuropsychiatric disease therapies faces competition from pharma majors and generics, with relatively limited clinical, regulatory, and marketing resources vs incumbents.",
        "tam_sam_penetration_category": "The TAM for antipsychotics, targeting conditions like schizophrenia (>20M global, ~3M US pts) and ADP (~2.8M US pts), is projected to exceed $20B by 2030. Current market penetration is low due to efficacy and tolerability gaps in existing treatments, indicating significant expansion potential and opportunity for new mechanistic therapies to capture unmet needs and gain market share.",
        "growth_catalysts_category": "Anticipated Phase 2 topline data releases include ZEPHYR for schizophrenia and IRIS for ASD in 2H 2026, and VISTA for ADP in 2H 2027. Pipeline expansion targets new CNS indications such as cognitive impairment in AD, Parkinson's, and hyperactivity disorders. IND-enabling studies for ML-021 and ML-009 are planned for 2026 alongside ongoing IP and candidate additions.",
        "secular_trends_category": "CNS disorder prevalence is rising, fueling demand for novel, efficacious neuropsychiatric treatments and driving long-term growth. High SOC drug discontinuation and gaps in effective therapies (e.g., ASD) provide tailwinds, while entrenched generics pose headwinds.",
        "revenue_growth_profile_category": "There are no commercial revenues currently; future revenue growth depends on clinical success in major CNS indications and holds potential for rapid growth after approval due to target populations and payer support.",
        "margin_profile_category": "High-margin profile typical of specialty pharma/biotech and CNS drugs; margins expected to expand with successful late-stage trials, product differentiation, and improved cost scale through volume.",
        "leverage_profile_category": "The company has raised substantial equity capital totaling $511M, consistent with a biotech model. There is no available information regarding debt or any balance sheet leverage, suggesting a likely equity-focused and minimally leveraged capital structure.",
        "management_team_category": "The management team is robust, featuring industry veterans alongside distinguished scientific founders like Karl Deisseroth and Robert Malenka, renowned for their expertise in neuroscience and drug development. Their strong academic and innovation credentials enhance the company's leadership credibility.",
        "sponsor_track_record_category": "The sponsor has a strong track record, having raised around $511M from top-tier VC and healthcare investors. Their scientific leadership is highly regarded for successfully translating circuit neuroscience discoveries into clinical applications.",
        "esg_focus_category": "The company's thesis is fundamentally centered on addressing unmet needs and improving quality of life for CNS patients, indicating a core focus on social impact within healthcare. Although there is material attention to employee retention, lab safety, and privacy, broader ESG integration, especially environmental factors, appears peripheral and not central to the overall investment thesis.",
        "ma_opportunities_category": "Although no explicit past M&A activity or specific buyer interest is reported, the strong CNS pipeline and IP position the company well for future strategic acquisitions amid ongoing industry consolidation."
    }} /> */}

        {/* Output */}
        {(stage === "success" && data?.data) && (
          <div ref={outputRef} className="mt-10">
            <S1DealSummary data={data.data} />
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowUploader((v) => !v)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {showUploader ? "Hide uploader" : "Show uploader"}
              </button>
              <button
                onClick={resetAll}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Start new upload
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default S1PdfUpload;
