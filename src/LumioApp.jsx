import { useState, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }
  .root { background: #F4F7FF; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }

  /* NAV */
  .nav { background: #0B1F4B; padding: 0 24px; height: 58px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .nav-brand { display: flex; align-items: center; gap: 12px; }
  .nav-name { font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.3px; line-height: 1; }
  .pbar { height: 3px; background: rgba(255,255,255,0.12); }
  .pfill { height: 3px; background: linear-gradient(90deg, #3B82F6, #60A5FA); transition: width 0.5s ease; }

  /* HERO */
  .hero { background: linear-gradient(135deg, #0B1F4B 0%, #1E3A7B 55%, #1A3070 100%); padding: 56px 24px 80px; text-align: center; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%); pointer-events: none; }
  .hero::after { content: ''; position: absolute; bottom: -80px; left: -60px; width: 350px; height: 350px; background: radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 65%); pointer-events: none; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(59,130,246,0.18); border: 1px solid rgba(59,130,246,0.35); color: #93C5FD; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; letter-spacing: 0.3px; }
  .hero-title { font-size: 36px; font-weight: 800; color: white; line-height: 1.15; margin-bottom: 12px; letter-spacing: -0.5px; }
  .hero-title span { color: #60A5FA; }
  .hero-sub { font-size: 16px; color: rgba(255,255,255,0.62); font-weight: 400; margin-bottom: 32px; max-width: 420px; margin-left: auto; margin-right: auto; line-height: 1.6; }
  .hero-proof { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 24px; }
  .hero-proof-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.5); }
  .hero-proof-dot { width: 5px; height: 5px; background: #3B82F6; border-radius: 50%; }

  /* FEAT CARDS */
  .feats { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; padding: 0 20px; margin-top: -38px; position: relative; z-index: 2; }
  .feat { background: white; border-radius: 16px; padding: 20px 16px; text-align: center; width: 175px; box-shadow: 0 4px 24px rgba(11,31,75,0.1); flex-shrink: 0; border: 1px solid rgba(59,130,246,0.08); }
  .feat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px; }

  /* SECTION */
  .section { padding: 36px 20px; max-width: 720px; margin: 0 auto; }
  .step-indicator { font-size: 11px; color: #6B7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .page-title { font-size: 24px; font-weight: 800; color: #0B1F4B; margin-bottom: 4px; letter-spacing: -0.3px; }
  .page-sub { font-size: 14px; color: #6B7280; margin-bottom: 24px; line-height: 1.55; }

  /* BUTTONS */
  .btn-primary { background: #1D4ED8; color: white; border: none; padding: 14px 32px; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 16px rgba(29,78,216,0.35); display: inline-flex; align-items: center; gap: 8px; }
  .btn-primary:hover { background: #1E40AF; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(29,78,216,0.4); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-outline { background: white; color: #1D4ED8; border: 2px solid #DBEAFE; padding: 10px 20px; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { border-color: #1D4ED8; background: #EFF6FF; }
  .btn-ghost { background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.25); padding: 11px 24px; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-ghost:hover { background: rgba(255,255,255,0.2); }

  /* QUESTION CARDS */
  .q-card { background: white; border-radius: 16px; padding: 22px; margin-bottom: 16px; box-shadow: 0 2px 16px rgba(11,31,75,0.07); border: 1px solid #E8EEFF; animation: fadeUp 0.35s ease forwards; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .q-why { display: inline-flex; align-items: center; gap: 5px; background: #EFF6FF; color: #1D4ED8; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 10px; }
  .q-label { font-size: 15px; font-weight: 700; color: #0B1F4B; margin-bottom: 14px; line-height: 1.4; }
  .q-opts { display: flex; flex-wrap: wrap; gap: 8px; }
  .q-opt { padding: 10px 16px; border-radius: 10px; border: 2px solid #E8EEFF; background: white; font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; transition: all 0.18s; text-align: left; line-height: 1.4; }
  .q-opt:hover { border-color: #93C5FD; background: #F0F7FF; color: #1D4ED8; }
  .q-opt.sel { background: #0B1F4B; color: white; border-color: #0B1F4B; font-weight: 600; }
  .q-opt.sel-blue { background: #1D4ED8; color: white; border-color: #1D4ED8; font-weight: 600; }
  .q-input { width: 100%; padding: 12px 16px; border: 2px solid #E8EEFF; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; outline: none; color: #0B1F4B; transition: border-color 0.2s; background: #FAFBFF; }
  .q-input:focus { border-color: #3B82F6; background: white; }
  .q-note { font-size: 11px; color: #9CA3AF; margin-top: 7px; display: flex; align-items: center; gap: 4px; }

  /* ALERT INLINE */
  .inline-alert { background: #FFF7ED; border: 1px solid #FDE68A; border-radius: 10px; padding: 12px 14px; margin-top: 10px; font-size: 12px; color: #92400E; line-height: 1.5; display: flex; gap: 8px; }
  .inline-alert-red { background: #FEF2F2; border-color: #FECACA; color: #991B1B; }
  .inline-alert-blue { background: #EFF6FF; border-color: #BFDBFE; color: #1E40AF; }

  /* PROGRESS DOTS */
  .dots { display: flex; gap: 5px; align-items: center; }
  .dot-step { width: 7px; height: 7px; border-radius: 50%; transition: all 0.3s; }

  /* UPLOAD ZONE */
  .upload-zone { border: 2px dashed #C7D2FE; border-radius: 16px; padding: 44px 24px; text-align: center; background: white; transition: all 0.25s; }
  .upload-zone:hover { border-color: #3B82F6; background: #F0F7FF; }

  /* RESULT CARDS */
  .rcard { background: white; border-radius: 18px; padding: 26px; box-shadow: 0 4px 24px rgba(11,31,75,0.08); margin-bottom: 16px; border: 1px solid #E8EEFF; animation: fadeUp 0.45s ease forwards; }
  .score-ring { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; }
  .score-n { font-size: 28px; font-weight: 800; line-height: 1; }
  .score-l { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .resume-box { background: #F4F7FF; border-radius: 10px; padding: 14px 16px; font-size: 14px; color: #374151; line-height: 1.65; margin-bottom: 20px; border-left: 3px solid #3B82F6; }
  .slabel { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 8px; margin-top: 18px; display: flex; align-items: center; gap: 6px; }
  .tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .tag { padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; }
  .tg { background: #ECFDF5; color: #065F46; }
  .tr { background: #FEF2F2; color: #991B1B; }
  .to { background: #FFF7ED; color: #92400E; }
  .tb { background: #EFF6FF; color: #1E40AF; }

  /* GAP ANALYSIS */
  .gap-header { background: linear-gradient(135deg, #0B1F4B, #1E3A7B); color: white; border-radius: 14px; padding: 20px 22px; margin-bottom: 20px; }
  .gap-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
  .gstat { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .gs-ok { background: rgba(16,185,129,0.2); color: #6EE7B7; }
  .gs-warn { background: rgba(245,158,11,0.2); color: #FCD34D; }
  .gs-ko { background: rgba(239,68,68,0.2); color: #FCA5A5; }
  .gap-item { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid #F0F4FF; }
  .gap-item:last-child { border-bottom: none; }
  .gap-badge { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
  .gb-ok { background: #ECFDF5; color: #065F46; }
  .gb-warn { background: #FFF7ED; color: #92400E; }
  .gb-ko { background: #FEF2F2; color: #991B1B; }
  .gap-title { font-size: 14px; font-weight: 700; color: #0B1F4B; margin-bottom: 3px; }
  .gap-detail { font-size: 13px; color: #6B7280; line-height: 1.55; }
  .expert-tip { background: #EFF6FF; border-left: 3px solid #3B82F6; border-radius: 0 8px 8px 0; padding: 8px 12px; margin-top: 6px; font-size: 11px; color: #1D4ED8; line-height: 1.5; font-style: italic; }

  /* LEAD CTA */
  .lead-cta { background: linear-gradient(135deg, #0B1F4B, #1E3A7B); border-radius: 18px; padding: 28px; text-align: center; margin-bottom: 16px; color: white; position: relative; overflow: hidden; }
  .lead-cta::before { content:''; position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 70%); }
  .lead-cta h3 { font-size: 22px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.3px; }
  .lead-cta p { font-size: 14px; opacity: 0.75; margin-bottom: 20px; line-height: 1.5; }

  /* SPECIAL CASE */
  .special-card { background: linear-gradient(135deg, #FEF2F2, #FFF5F5); border: 2px solid #FECACA; border-radius: 18px; padding: 28px; text-align: center; margin-bottom: 16px; }

  /* DONATION */
  .don-box { background: white; border: 1px solid #E8EEFF; border-radius: 14px; padding: 18px 20px; text-align: center; margin-bottom: 32px; }
  .don-btns { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
  .don-btn { background: white; border: 2px solid #E8EEFF; color: #0B1F4B; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
  .don-btn:hover { border-color: #3B82F6; color: #1D4ED8; }
  .don-btn.sel { background: #1D4ED8; color: white; border-color: #1D4ED8; }

  /* FORM */
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 5px; display: block; text-transform: uppercase; letter-spacing: 0.4px; }
  .form-input { width: 100%; padding: 12px 14px; border: 2px solid #E8EEFF; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; outline: none; color: #0B1F4B; transition: border-color 0.2s; background: #FAFBFF; }
  .form-input:focus { border-color: #3B82F6; background: white; }
  .form-textarea { width: 100%; padding: 12px 14px; border: 2px solid #E8EEFF; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; outline: none; color: #0B1F4B; transition: border-color 0.2s; background: #FAFBFF; resize: vertical; min-height: 90px; line-height: 1.5; }
  .form-textarea:focus { border-color: #3B82F6; background: white; }
  .ok-box { background: #ECFDF5; border: 2px solid #A7F3D0; border-radius: 16px; padding: 28px; text-align: center; }

  /* TABS */
  .tabs { display: flex; gap: 6px; margin-bottom: 20px; background: white; padding: 5px; border-radius: 12px; border: 1px solid #E8EEFF; }
  .tab { flex: 1; padding: 9px 12px; border-radius: 9px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; }
  .tab.active { background: #0B1F4B; color: white; box-shadow: 0 2px 8px rgba(11,31,75,0.25); }

  /* PROFILE RECAP */
  .profile-recap { background: white; border-radius: 12px; padding: 16px 18px; margin-bottom: 18px; border: 1px solid #E8EEFF; }
  .profile-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .ptag { background: #F4F7FF; color: #374151; padding: 4px 10px; border-radius: 7px; font-size: 12px; font-weight: 500; border: 1px solid #E8EEFF; }
  .ptag-primary { background: #0B1F4B; color: white; border-color: #0B1F4B; font-weight: 700; }

  /* HOW IT WORKS */
  .step-row { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; max-width: 500px; margin-left: auto; margin-right: auto; }
  .step-num { width: 36px; height: 36px; background: #0B1F4B; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 14px; flex-shrink: 0; }
  .step-body-title { font-weight: 700; color: #0B1F4B; font-size: 14px; margin-bottom: 2px; }
  .step-body-sub { font-size: 13px; color: #6B7280; line-height: 1.4; }
`;

// ─── EXPERT QUESTIONS DATA ────────────────────────────────────────────────────
const Q_LEVEL1 = [
  {
    id: "vehicule_age",
    why: "Pour recommander le bon niveau de couverture",
    label: "Quel est l'âge de votre véhicule ?",
    type: "choice",
    opts: ["Neuf ou < 1 an", "1 à 4 ans", "4 à 10 ans", "Plus de 10 ans"]
  },
  {
    id: "vehicule_valeur",
    why: "Pour évaluer le niveau d'indemnisation nécessaire",
    label: "Quelle est la valeur actuelle de votre véhicule ?",
    type: "choice",
    opts: ["Moins de 2 000€", "2 000€ à 5 000€", "5 000€ à 50 000€", "Plus de 50 000€"]
  },
  {
    id: "financement",
    why: "Le type de financement change tout en cas d'accident grave",
    label: "Comment avez-vous financé votre véhicule ?",
    type: "choice",
    opts: ["Achat comptant", "Crédit auto", "LOA / Leasing", "LLD (location longue durée)"]
  },
  {
    id: "conducteurs",
    why: "Pour vérifier que tous les conducteurs sont bien couverts",
    label: "Qui conduit ce véhicule ?",
    type: "choice",
    opts: ["Moi uniquement", "Moi + conjoint / proche", "J'ai un conducteur secondaire", "Mon enfant conduit aussi ce véhicule"]
  },
  {
    id: "usage",
    why: "Un usage mal déclaré peut entraîner un refus de remboursement",
    label: "Comment utilisez-vous votre véhicule au quotidien ?",
    type: "choice",
    opts: ["Usage privé uniquement", "Privé + trajets domicile-travail", "Privé + usage professionnel occasionnel", "Usage professionnel / tournées régulières"]
  },
  {
    id: "kilometrage",
    why: "Un dépassement non signalé peut créer des problèmes en cas de sinistre",
    label: "Combien de kilomètres parcourez-vous par an ?",
    type: "choice",
    opts: ["Moins de 5 000 km", "5 000 à 10 000 km", "10 000 à 20 000 km", "Plus de 20 000 km"]
  },
];

const Q_LEVEL2_RULES = [
  {
    id: "conducteur_principal",
    condition: (p) => p.conducteurs === "Mon enfant conduit aussi ce véhicule",
    why: "Point critique — une erreur ici peut invalider toute votre couverture",
    label: "Qui parcourt le plus de kilomètres au volant de ce véhicule sur l'année ?",
    type: "choice",
    opts: ["Moi (le souscripteur)", "Mon enfant / l'autre conducteur"],
    alert: { type: "red", text: "⚠️ Si votre enfant est le conducteur principal réel mais déclaré secondaire, l'assureur peut refuser toute indemnisation en cas de sinistre. C'est l'une des erreurs les plus fréquentes et les plus coûteuses." }
  },
  {
    id: "indemnisation_renforcee",
    condition: (p) => ["LOA / Leasing", "LLD (location longue durée)"].includes(p.financement),
    why: "Indispensable pour les véhicules financés — sans ça vous pouvez perdre des milliers d'euros",
    label: "Votre contrat inclut-il une indemnisation renforcée (valeur à neuf ou valeur majorée) ?",
    type: "choice",
    opts: ["Oui, elle est incluse", "Non, pas dans mon contrat", "Je ne sais pas"],
    alert: { type: "orange", text: "💡 En cas de destruction totale d'un véhicule en LOA/LLD, l'assureur rembourse la valeur vénale mais le loueur réclame le solde restant dû. Sans indemnisation renforcée, c'est vous qui payez la différence — souvent plusieurs milliers d'euros." }
  },
  {
    id: "valeur_achat",
    condition: (p) => ["Neuf ou < 1 an", "1 à 4 ans"].includes(p.vehicule_age) && p.financement === "Achat comptant",
    why: "Pour les véhicules récents, être remboursé à la valeur réelle fait une grande différence",
    label: "Souhaitez-vous être remboursé à la valeur d'achat en cas de destruction totale ?",
    type: "choice",
    opts: ["Oui, c'est important pour moi", "Non, la valeur expertisée me convient"],
    alert: { type: "blue", text: "💡 Sans cette option, votre assureur remboursera la valeur du marché au jour du sinistre, souvent inférieure de 20 à 40% à la valeur d'achat dès la 2e année." }
  },
  {
    id: "stationnement",
    condition: (p) => true,
    why: "L'adresse et le type de stationnement sont vérifiés en cas de sinistre",
    label: "Comment est stationné votre véhicule habituellement ?",
    type: "choice",
    opts: ["Garage privatif fermé", "Parking privé clos", "Parking privé clos et couvert", "Parking collectif couvert", "Parking collectif non couvert", "Voie publique / rue"]
  },
  {
    id: "pret_tiers",
    condition: (p) => ["Moi + conjoint / proche", "J'ai un conducteur secondaire"].includes(p.conducteurs),
    why: "En cas de sinistre avec un conducteur non déclaré, des surprises peuvent apparaître",
    label: "Prêtez-vous votre véhicule à d'autres personnes de temps en temps ?",
    type: "choice",
    opts: ["Non jamais", "Oui, à des proches occasionnellement"],
    alert: { type: "orange", text: "💡 Quand un tiers non déclaré conduit votre véhicule, une franchise supplémentaire peut s'appliquer. Vérifiez si votre contrat propose un rachat de cette franchise." }
  },
];

const Q_LEVEL3 = {
  id: "besoins_libres",
  why: "Pour personnaliser encore plus votre analyse",
  label: "Y a-t-il quelque chose d'important pour vous que nous n'avons pas abordé ?",
  placeholder: "Ex : j'ai eu une mauvaise expérience avec mon assurance, je fais beaucoup de longs trajets, je transporte souvent des objets de valeur, j'ai besoin d'être dépanné rapidement...",
  type: "textarea"
};

const SPECIAL_CASES = [
  { id: "malusse", label: "Conducteur malussé (bonus-malus > 1)", icon: "📉" },
  { id: "resilie", label: "Résilié par mon assureur précédent", icon: "🚫" },
  { id: "collection", label: "Véhicule de collection", icon: "🏆" },
  { id: "vtc_taxi", label: "VTC / Taxi / Transport de personnes", icon: "🚕" },
  { id: "utilitaire", label: "Véhicule utilitaire professionnel", icon: "🚚" },
];

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
function buildDemoAnalysis(profile) {
  const isLOA = ["LOA / Leasing", "LLD (location longue durée)"].includes(profile.financement);
  const isRecent = ["Neuf ou < 1 an", "1 à 4 ans"].includes(profile.vehicule_age);
  const hasChild = profile.conducteurs === "Mon enfant conduit aussi ce véhicule";
  const isChildMain = profile.conducteur_principal === "Mon enfant / l'autre conducteur";
  const isStreet = profile.stationnement === "Voie publique / rue";
  const hasFreeText = profile.besoins_libres && profile.besoins_libres.length > 5;

  const score = isLOA && profile.indemnisation_renforcee !== "Oui, elle est incluse" ? 2
    : isChildMain ? 2
    : isRecent ? 3 : 4;

  const gaps = [];

  if (isChildMain) gaps.push({
    ok: false,
    title: "⚠️ Risque de fausse déclaration conducteur",
    detail: "Votre enfant est le conducteur principal réel mais est probablement déclaré secondaire. En cas de sinistre, l'assureur peut refuser totalement la prise en charge et résilier le contrat.",
    tip: "Il faut impérativement régulariser la situation. Le surcoût est réel mais bien inférieur au risque d'être sans couverture."
  });

  if (isLOA && profile.indemnisation_renforcee !== "Oui, elle est incluse") gaps.push({
    ok: false,
    title: "Indemnisation renforcée absente — risque financier majeur",
    detail: "En LOA/LLD, si votre véhicule est détruit, l'assureur rembourse la valeur vénale mais le loueur réclame le solde restant dû. Sans garantie renforcée, la différence est à votre charge.",
    tip: "Cette option est quasi-indispensable en LOA/LLD. Son coût est faible comparé au risque réel."
  });

  if (isRecent && !isLOA) gaps.push({
    ok: "warn",
    title: "Valeur d'indemnisation à vérifier pour véhicule récent",
    detail: "Sans option valeur à neuf, votre remboursement en cas de destruction totale sera la valeur du marché le jour du sinistre — souvent 20 à 40% de moins que votre prix d'achat.",
    tip: "Pour un véhicule de moins de 4 ans, l'option valeur à neuf ou indemnisation majorée est fortement recommandée."
  });

  gaps.push({
    ok: true,
    title: "Niveau de couverture adapté à l'âge du véhicule",
    detail: `Pour un véhicule ${profile.vehicule_age?.toLowerCase()}, le niveau de garantie de votre contrat actuel est cohérent avec la valeur du bien.`,
    tip: null
  });

  if (isStreet) gaps.push({
    ok: "warn",
    title: "Stationnement voie publique — tarif et couverture à vérifier",
    detail: "Le stationnement en rue génère un risque plus élevé (vol, vandalisme). Vérifiez que votre contrat est bien tarifé pour ce type de stationnement — une différence non déclarée peut poser problème.",
    tip: "Si vous avez déménagé ou changé de type de stationnement, signalez-le immédiatement à votre assureur."
  });

  if (profile.usage === "Usage professionnel / tournées régulières") gaps.push({
    ok: false,
    title: "Usage professionnel — vérification critique",
    detail: "Un usage professionnel mal déclaré est l'une des causes les plus fréquentes de refus de sinistre. Votre contrat doit explicitement mentionner cet usage.",
    tip: null
  });

  gaps.push({
    ok: profile.assistance_0km !== false ? "warn" : true,
    title: "Assistance — vérifier la franchise kilométrique",
    detail: "De nombreux contrats prévoient une franchise kilométrique (ex : pas d'assistance dans un rayon de 30 à 50 km du domicile). Si vous tombez en panne près de chez vous, vous n'êtes pas couvert.",
    tip: "L'assistance 0 km est indispensable pour être tranquille en toutes circonstances. Vérifiez ce point dans votre contrat."
  });

  gaps.push({
    ok: "warn",
    title: "Véhicule de prêt — garantie ou simple service garage ?",
    detail: "Beaucoup de contrats mentionnent un 'véhicule de remplacement' mais uniquement si vous passez par un garage partenaire, et seulement s'il en a un disponible. Ce n'est pas une vraie garantie.",
    tip: "La vraie garantie véhicule de prêt vous assure un véhicule de location quoi qu'il arrive — panne, accident, vol, incendie."
  });

  if (hasFreeText) gaps.push({
    ok: "warn",
    title: "Point spécifique mentionné — à vérifier avec un expert",
    detail: `Vous avez mentionné : "${profile.besoins_libres}". Ce point mérite une vérification approfondie avec un conseiller pour s'assurer que votre contrat y répond.`,
    tip: null
  });

  return {
    type: "Assurance Auto",
    compagnie: "Votre contrat actuel",
    score,
    resume: score <= 2
      ? "Votre contrat présente des lacunes sérieuses au regard de votre situation réelle. Plusieurs points critiques nécessitent une action rapide pour éviter de mauvaises surprises en cas de sinistre."
      : score === 3
      ? "Votre contrat offre une couverture correcte mais plusieurs points méritent d'être vérifiés ou optimisés selon votre profil."
      : "Votre contrat est globalement bien adapté à votre situation. Quelques points d'attention à surveiller.",
    garanties: [
      "Responsabilité civile obligatoire",
      profile.vehicule_age !== "Plus de 10 ans" ? "Dommages tous accidents" : null,
      "Vol & incendie",
      "Bris de glace",
    ].filter(Boolean),
    exclusions: [
      isChildMain ? "Couverture compromise si fausse déclaration conducteur" : null,
      profile.usage === "Usage professionnel / tournées régulières" ? "Usage pro non confirmé dans le contrat" : null,
      "Franchise kilométrique assistance probable",
    ].filter(Boolean),
    alertes: [
      isLOA && profile.indemnisation_renforcee !== "Oui, elle est incluse" ? "Reliquat LOA/LLD non couvert en cas de destruction totale" : null,
      isStreet ? "Stationnement rue — vérifier la déclaration" : null,
      "Véhicule de prêt : garantie réelle à confirmer",
      "Protection juridique : vérifier si c'est une vraie PJ ou simple assistance",
    ].filter(Boolean),
    points_forts: [
      "Couverture accidents corporels présente",
      "Couverture de base conforme",
    ],
    points_faibles: [
      isLOA ? "Indemnisation insuffisante pour véhicule financé" : null,
      "Assistance — franchise km à vérifier",
      isRecent ? "Valeur d'indemnisation potentiellement insuffisante" : null,
    ].filter(Boolean),
    conseil: score <= 2
      ? "Votre situation nécessite une révision urgente. Contactez un conseiller expert pour régulariser ces points avant qu'un sinistre ne survienne."
      : "Votre contrat est une bonne base mais peut être optimisé. Un conseiller peut vous proposer mieux au même prix ou moins cher.",
    gaps,
  };
}

// ─── COMPOSANTS ───────────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const c = score >= 4
    ? { bg: "#ECFDF5", color: "#065F46", label: "Bon" }
    : score >= 3
    ? { bg: "#FFF7ED", color: "#92400E", label: "Moyen" }
    : { bg: "#FEF2F2", color: "#991B1B", label: "Insuffisant" };
  return (
    <div className="score-ring" style={{ background: c.bg }}>
      <span className="score-n" style={{ color: c.color }}>{score}/5</span>
      <span className="score-l" style={{ color: c.color }}>{c.label}</span>
    </div>
  );
}

function ResultCard({ a, embedded }) {
  const wrap = embedded
    ? { marginBottom: 0 }
    : { background: "white", borderRadius: 18, padding: 26, boxShadow: "0 4px 24px rgba(11,31,75,0.08)", marginBottom: 16, border: "1px solid #E8EEFF", animation: "fadeUp 0.45s ease forwards" };
  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0B1F4B", letterSpacing: "-0.3px" }}>{a.type}</div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{a.compagnie}</div>
        </div>
        <ScoreBadge score={a.score} />
      </div>
      <div className="resume-box">{a.resume}</div>
      {a.garanties?.length > 0 && (<><div className="slabel" style={{ color: "#065F46" }}>✅ Garanties présentes</div><div className="tags">{a.garanties.map((g, i) => <span key={i} className="tag tg">✓ {g}</span>)}</div></>)}
      {a.exclusions?.length > 0 && (<><div className="slabel" style={{ color: "#991B1B" }}>❌ Points critiques détectés</div><div className="tags">{a.exclusions.map((e, i) => <span key={i} className="tag tr">✕ {e}</span>)}</div></>)}
      {a.alertes?.length > 0 && (<><div className="slabel" style={{ color: "#92400E" }}>⚠️ Points d'attention</div><div className="tags">{a.alertes.map((al, i) => <span key={i} className="tag to">⚠ {al}</span>)}</div></>)}
      {a.points_forts?.length > 0 && (<><div className="slabel" style={{ color: "#1E40AF" }}>💪 Points forts</div><div className="tags">{a.points_forts.map((p, i) => <span key={i} className="tag tb">+ {p}</span>)}</div></>)}
      {a.points_faibles?.length > 0 && (<><div className="slabel" style={{ color: "#6B7280" }}>📉 Points faibles</div><div className="tags">{a.points_faibles.map((p, i) => <span key={i} className="tag" style={{ background: "#F4F7FF", color: "#374151" }}>− {p}</span>)}</div></>)}
      {a.conseil && (
        <div style={{ background: "linear-gradient(135deg,#0B1F4B,#1E3A7B)", color: "white", borderRadius: 12, padding: "14px 16px", fontSize: 13, lineHeight: 1.6, marginTop: 18, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span><span>{a.conseil}</span>
        </div>
      )}
    </div>
  );
}

function GapCard({ gaps, profile, embedded }) {
  const ok = gaps.filter(g => g.ok === true).length;
  const warn = gaps.filter(g => g.ok === "warn").length;
  const ko = gaps.filter(g => g.ok === false).length;
  return (
    <div style={embedded ? {} : { background: "white", borderRadius: 18, padding: 26, boxShadow: "0 4px 24px rgba(11,31,75,0.08)", marginBottom: 16 }}>
      <div className="gap-header">
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🎯 Analyse personnalisée de votre situation</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 12 }}>
          Basée sur votre profil : {[profile.vehicule_age, profile.financement, profile.usage].filter(Boolean).join(" · ")}
        </div>
        <div className="gap-stats">
          <span className="gstat gs-ok">✓ {ok} conforme{ok > 1 ? "s" : ""}</span>
          <span className="gstat gs-warn">⚠ {warn} à vérifier</span>
          <span className="gstat gs-ko">✕ {ko} lacune{ko > 1 ? "s" : ""}</span>
        </div>
      </div>
      <div style={{ padding: embedded ? "0" : "4px 22px 16px" }}>
        {gaps.map((g, i) => (
          <div key={i} className="gap-item">
            <div className={`gap-badge ${g.ok === true ? "gb-ok" : g.ok === "warn" ? "gb-warn" : "gb-ko"}`}>
              {g.ok === true ? "✓" : g.ok === "warn" ? "⚠" : "✕"}
            </div>
            <div style={{ flex: 1 }}>
              <div className="gap-title">{g.title}</div>
              <div className="gap-detail">{g.detail}</div>
              {g.tip && <div className="expert-tip">👤 Conseil expert : {g.tip}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function Lumio() {
  const [step, setStep] = useState("home");
  const [profile, setProfile] = useState({});
  const [q1Step, setQ1Step] = useState(0);
  const [specialCase, setSpecialCase] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const [leadSent, setLeadSent] = useState(false);
  const [donation, setDonation] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Compute level-2 questions based on current profile
  const activeL2 = Q_LEVEL2_RULES.filter(r => r.condition(profile));

  const progress = step === "home" ? 0
    : step === "special_check" ? 8
    : step === "q1" ? 12 + (q1Step / Q_LEVEL1.length) * 35
    : step === "q2" ? 50
    : step === "q3" ? 68
    : step === "upload" ? 80
    : 100;

  const setAnswer = (id, val) => setProfile(p => ({ ...p, [id]: val }));

  const currentQ1 = Q_LEVEL1[q1Step];
  const canNextQ1 = !!profile[currentQ1?.id];

  // ── VRAIE ANALYSE PDF ─────────────────────────────────────────────────────
  const analyzeRealPDF = async (file) => {
    setUploading(true);
    setUploadError("");
    try {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const profileSummary = Object.entries(profile)
        .filter(([k, v]) => v)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join(" | ");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 4000,
          messages: [{
            role: "user",
            content: [
              {
                type: "document",
                source: { type: "base64", media_type: "application/pdf", data: base64 }
              },
              {
                type: "text",
                text: `Tu es un expert en assurance automobile française avec 20 ans d'expérience terrain, ancien agent général AXA. Analyse ce contrat d'assurance auto en tenant compte du profil client : ${profileSummary}.

═══ GRILLE DE NOTATION OFFICIELLE ═══
Score 5/5 : Contrat excellent, toutes garanties adaptées au profil, franchises correctes, options clés présentes
Score 4/5 : Bon contrat, 1-2 points mineurs à améliorer
Score 3/5 : Contrat correct, lacunes sur garanties secondaires ou franchises un peu élevées
Score 2/5 : Contrat insuffisant, lacunes sur garanties importantes pour ce profil
Score 1/5 : Couverture dangereusement insuffisante, risques majeurs non couverts

═══ RÈGLES MÉTIER OBLIGATOIRES ═══

CONDUCTEUR PRINCIPAL :
- Le conducteur principal est TOUJOURS celui qui réalise le plus de kilomètres par an avec ce véhicule
- Si un jeune conducteur ou un tiers utilise le véhicule plus que le souscripteur = il doit être déclaré conducteur principal
- Fausse déclaration conducteur principal = risque de nullité du contrat et refus total de sinistre

FRANCHISE CONDUCTEUR NON DÉSIGNÉ :
- La franchise supplémentaire (ex: 1 500€) s'applique UNIQUEMENT si un conducteur NON déclaré au contrat a un sinistre
- Les conducteurs désignés nominativement au contrat (conjoint, enfant déclaré) bénéficient de la MÊME franchise que le souscripteur
- Ne jamais dire que la franchise du conjoint déclaré se cumule avec la franchise de base — c'est FAUX
- Mentionner qu'il existe des options de rachat de franchise pour les conducteurs non désignés

FRANCHISES — GRILLE DE RÉFÉRENCE OFFICIELLE LUMIO :
Utilise cette grille pour évaluer si une franchise est basse, normale ou élevée.

Citadine/Compacte 0-3 ans : Dommages 300-600€ | Vol/Incendie 300-600€ | BDG répa 0-100€ / rempl 100-250€
Citadine/Compacte 3-8 ans : Dommages 400-700€ | Vol/Incendie 300-700€ | BDG répa 0-100€ / rempl 100-250€
Citadine/Compacte >8 ans : Dommages 500-800€ | Vol/Incendie 400-800€ | BDG répa 0-100€ / rempl 100-250€
Berline/Break 0-3 ans : Dommages 400-800€ | Vol/Incendie 400-800€ | BDG répa 0-100€ / rempl 100-300€
Berline/Break 3-8 ans : Dommages 500-900€ | Vol/Incendie 500-900€ | BDG répa 0-100€ / rempl 100-300€
Berline/Break >8 ans : Dommages 600-1000€ | Vol/Incendie 600-1000€ | BDG répa 0-100€ / rempl 100-300€
SUV/Monospace 0-3 ans : Dommages 500-1000€ | Vol/Incendie 500-1000€ | BDG répa 0-100€ / rempl 150-400€
SUV/Monospace 3-8 ans : Dommages 600-1100€ | Vol/Incendie 600-1100€ | BDG répa 0-100€ / rempl 150-400€
SUV/Monospace >8 ans : Dommages 700-1200€ | Vol/Incendie 700-1200€ | BDG répa 0-100€ / rempl 150-400€
Haut de gamme/Sport 0-3 ans : Dommages 800-2000€ ou 5-10% (min 800-1500€) | Vol/Incendie 1000-3000€ | BDG répa 100-250€ / rempl 300-800€
Haut de gamme/Sport 3-8 ans : Dommages 1000-2500€ | Vol/Incendie 1200-3500€ | BDG répa 100-250€ / rempl 300-800€
Haut de gamme/Sport >8 ans : Dommages 1200-3000€ | Vol/Incendie 1500-4000€ | BDG répa 100-250€ / rempl 300-800€
Électrique grand public 0-3 ans : Dommages 500-1200€ | Vol/Incendie 500-1200€ | BDG répa 0-100€ / rempl 200-500€
Électrique grand public 3-8 ans : Dommages 600-1300€ | Vol/Incendie 600-1300€ | BDG répa 0-100€ / rempl 200-500€
Électrique grand public >8 ans : Dommages 700-1400€ | Vol/Incendie 700-1400€ | BDG répa 0-100€ / rempl 200-500€
Utilitaire pro 0-3 ans : Dommages 600-1200€ | Vol/Incendie 800-1500€
Utilitaire pro 3-8 ans : Dommages 700-1300€ | Vol/Incendie 900-1700€
Utilitaire pro >8 ans : Dommages 800-1500€ | Vol/Incendie 1000-2000€
CatNat/Événements climatiques : franchise légale 380€ (toutes catégories)

RÈGLES D'ÉVALUATION DES FRANCHISES :
- Franchise EN BAS de la fourchette = EXCELLENT, classer en point fort
- Franchise DANS la fourchette = normale, point neutre
- Franchise EN HAUT de la fourchette = acceptable, signaler comme point d'attention
- Franchise AU-DESSUS de la fourchette = élevée, point faible
- Bris de glace 0€ (réparation impact) = point fort — standard marché
- Ne JAMAIS conseiller franchise 0€ sur dommages — irréaliste
- Des options de rachat de franchise existent — les mentionner si franchise élevée
- Pour véhicule haut de gamme/sport ou électrique premium : les franchises sont naturellement plus élevées — ne pas pénaliser si dans la fourchette

INDEMNISATION :
- Valeur à neuf 2 ans puis expert+20% = standard du marché = BON niveau
- Pour Tesla ou véhicule à faible dépréciation : expert+20% est AVANTAGEUX car la valeur reste haute
- Certains contrats proposent jusqu'à expert+30% mais 20% reste très correct

ASSISTANCE :
- Assistance 0km (sans franchise kilométrique) = TOUJOURS classer en point fort majeur
- Franchise kilométrique = point faible important à signaler

VÉHICULE DE REMPLACEMENT :
- Absence de garantie véhicule de remplacement = point faible
- Beaucoup de contrats prévoient un prêt de véhicule par le garage partenaire conseillé par l'assureur suite à sinistre, MAIS sous condition de disponibilité — ce n'est pas une garantie ferme
- La vraie garantie véhicule de remplacement = mise à disposition systématique quelles que soient les circonstances

PROTECTION JURIDIQUE :
- Si absence de PJ : préciser que cela couvre non seulement les litiges mais aussi l'aide aux démarches, courriers, négociations amiables, contestation d'expertise, litige avec tiers
- PJ intégrée au contrat auto = couvre uniquement les litiges liés au véhicule
- Recommander EN PRIORITÉ une PJ générale séparée = couvre auto + habitation + achats + vie privée
- NE PAS citer de tarif ou de prix sauf si certitude absolue basée sur les comparateurs français de référence : lelynx.fr, lesfurets.com ou meilleurtaux.com — en cas de doute NE PAS mentionner de prix
- Ces mêmes sites font référence pour les statistiques, probabilités, plafonds moyens du marché français

FRAIS ANNEXES :
- Vérifier si des frais hors cotisation sont prélevés (hors taxes légales obligatoires et contribution attentat)
- Si frais annexes présents = point très négatif

BONUS-MALUS :
- Vérifier le coefficient bonus-malus
- Coefficient maximum légal = 0.50 après 13 ans sans sinistre responsable
- Impact fort sur le tarif final

USAGE PROFESSIONNEL :
- Trajets privé-pro = déplacements ponctuels dans cadre pro (réunions, formations)
- Tournées professionnelles = déplacements client-à-client réguliers (infirmière libérale, commercial terrain) = à déclarer impérativement
- Si usage pro non couvert = point CRITIQUE

GARANTIE ACCESSOIRES :
- Absence = point FAIBLE seulement, sauf si client a des équipements ajoutés

RÈGLES ABSOLUES :
- Ne JAMAIS inventer ou supposer des informations non présentes dans le contrat
- Ne JAMAIS citer de plafonds de garantie sauf s'ils sont explicitement mentionnés dans le document
- Ne JAMAIS citer de tarifs ou prix si tu n'as pas de données fiables et vérifiées
- Baser UNIQUEMENT l'analyse sur ce qui est écrit dans le contrat fourni

═══ FORMAT DE RÉPONSE ═══
Retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks) :
{
  "type": "type exact du contrat",
  "compagnie": "nom exact de l'assureur",
  "score": 3,
  "resume": "2-3 phrases claires pour un non-expert, personnalisées selon le profil client",
  "garanties": ["garanties réellement présentes et importantes"],
  "exclusions": ["exclusions vraiment critiques pour CE profil uniquement"],
  "alertes": ["points d'attention contextualisés selon le profil"],
  "points_forts": ["vrais points forts du contrat"],
  "points_faibles": ["vrais points faibles du contrat"],
  "conseil": "conseil expert personnalisé et actionnable en 1-2 phrases",
  "gaps": [
    {"ok": true, "title": "point conforme", "detail": "explication positive", "tip": null},
    {"ok": false, "title": "lacune critique", "detail": "risque concret pour CE client", "tip": "conseil expert précis et réaliste"},
    {"ok": "warn", "title": "point à surveiller", "detail": "explication contextuelle", "tip": "conseil pratique"}
  ]
}`
              }
            ]
          }]
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Erreur API");
      }

      const data = await res.json();
      const text = data.content[0].text.trim().replace(/```json|```/g, "").trim();
      const result = JSON.parse(text);
      setAnalysis({ ...result, fileName: file.name });
      setActiveTab(0);
      setStep("results");
    } catch (e) {
      setUploadError("Erreur lors de l'analyse : " + e.message + ". Vérifiez que votre clé API est valide.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setUploadError("");
    } else if (file) {
      setUploadError("Format non supporté. Veuillez déposer un fichier PDF.");
    }
  };

  const Nav = ({ back, onBack }) => (
    <div>
      <div className="nav">
        <div className="nav-brand">
          {/* Logo : L doré + Lumio */}
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #C8922A, #F0C040)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(200,146,42,0.4)",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, color: "white", letterSpacing: "-1px", lineHeight: 1 }}>L</span>
          </div>
          <div>
            <div className="nav-name">
              <span style={{ color: "#F0C040" }}>L</span>umio
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: -2 }}>La lumière sur vos assurances.</div>
          </div>
        </div>
        {back && <button className="btn-outline" style={{ padding: "7px 16px", fontSize: 12 }} onClick={onBack}>← Retour</button>}
      </div>
      <div className="pbar"><div className="pfill" style={{ width: `${progress}%` }}></div></div>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (step === "home") return (
    <div className="root"><style>{css}</style>
      <div className="hero">

        {/* Logo hero centré */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 58, height: 58, borderRadius: 16,
            background: "linear-gradient(135deg, #C8922A, #F0C040)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 8px rgba(200,146,42,0.15), 0 0 0 16px rgba(200,146,42,0.07)",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 34, color: "white", letterSpacing: "-2px", lineHeight: 1 }}>L</span>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 36, fontWeight: 800, color: "white", letterSpacing: "-0.5px", lineHeight: 1 }}>
              <span style={{ color: "#F0C040" }}>L</span>umio
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", letterSpacing: "1.5px", marginTop: 4, textTransform: "uppercase" }}>La lumière sur vos assurances.</div>
          </div>
        </div>

        <div className="hero-badge">🚗 Analyse contrat auto gratuite</div>
        <div className="hero-title"><span>L'œil expert</span><br />sur vos assurances</div>
        <div className="hero-sub">Lumio analyse votre contrat et détecte les lacunes selon votre situation réelle — gratuitement, sans parti pris.</div>
        <button className="btn-ghost" onClick={() => setStep("special_check")}>
          Analyser mon contrat gratuitement →
        </button>
        <div className="hero-proof">
          {["Aucun compte requis", "100% gratuit", "Analyse personnalisée", "Conseil expert inclus"].map((t, i) => (
            <div key={i} className="hero-proof-item"><div className="hero-proof-dot"></div>{t}</div>
          ))}
        </div>
      </div>

      <div className="feats">
        {[
          { icon: "🎯", color: "#EFF6FF", iconBg: "#DBEAFE", t: "Profil sur-mesure", d: "Questions adaptées à votre situation" },
          { icon: "🔍", color: "#F0FDF4", iconBg: "#D1FAE5", t: "Lacunes détectées", d: "Ce que votre contrat ne couvre pas" },
          { icon: "⚡", color: "#FFF7ED", iconBg: "#FDE68A", t: "Alertes critiques", d: "Les risques concrets pour vous" },
          { icon: "💡", color: "#F5F3FF", iconBg: "#DDD6FE", t: "Conseil expert", d: "Un conseiller vous rappelle" },
        ].map((f, i) => (
          <div key={i} className="feat" style={{ background: f.color }}>
            <div className="feat-icon" style={{ background: f.iconBg }}>{f.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F4B", marginBottom: 3 }}>{f.t}</div>
            <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>{f.d}</div>
          </div>
        ))}
      </div>

      <div className="section" style={{ marginTop: 52 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="page-title">Comment ça marche ?</div>
          <div className="page-sub">3 étapes simples, une analyse vraiment personnalisée</div>
        </div>
        {[
          { n: "1", icon: "🎯", t: "Votre profil en 2 minutes", d: "Des questions simples et visuelles, adaptées à votre situation. On vous explique pourquoi chaque question compte." },
          { n: "2", icon: "📄", t: "Votre contrat actuel", d: "Déposez votre PDF ou testez avec notre démo. L'IA croise votre contrat avec votre profil réel." },
          { n: "3", icon: "📊", t: "Bilan personnalisé + alertes", d: "Score clair, lacunes identifiées, conseils d'expert. Vous savez exactement où vous en êtes." },
        ].map((s, i) => (
          <div key={i} className="step-row">
            <div className="step-num">{s.n}</div>
            <div><div className="step-body-title">{s.icon} {s.t}</div><div className="step-body-sub">{s.d}</div></div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button className="btn-primary" onClick={() => setStep("special_check")}>Commencer mon analyse →</button>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "12px 24px 32px", fontSize: 11, color: "#9CA3AF" }}>
        Lumio est un outil d'information. Pour toute décision d'assurance, consultez un professionnel agréé.
      </div>
    </div>
  );

  // ── SPECIAL CASE CHECK ────────────────────────────────────────────────────
  if (step === "special_check") return (
    <div className="root"><style>{css}</style>
      <Nav back onBack={() => setStep("home")} />
      <div className="section">
        <div className="step-indicator">Étape préliminaire</div>
        <div className="page-title">Avant de commencer…</div>
        <div className="page-sub">Certaines situations nécessitent une expertise spécialisée. Êtes-vous dans l'un de ces cas ?</div>

        {SPECIAL_CASES.map((sc) => (
          <div key={sc.id} onClick={() => setSpecialCase(specialCase === sc.id ? null : sc.id)}
            style={{ background: specialCase === sc.id ? "#FEF2F2" : "white", border: `2px solid ${specialCase === sc.id ? "#FECACA" : "#E8EEFF"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s" }}>
            <span style={{ fontSize: 22 }}>{sc.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0B1F4B" }}>{sc.label}</span>
            {specialCase === sc.id && <span style={{ marginLeft: "auto", color: "#991B1B", fontWeight: 700, fontSize: 18 }}>✓</span>}
          </div>
        ))}

        {specialCase && (
          <div className="inline-alert inline-alert-red" style={{ marginTop: 8, marginBottom: 16 }}>
            <span>🚨</span>
            <div>
              <strong>Cas particulier détecté.</strong> Votre situation nécessite une expertise spécialisée. Notre outil peut vous donner une première analyse, mais un conseiller expert doit impérativement revoir votre dossier. Nous vous mettrons en contact directement.
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => { setQ1Step(0); setStep("q1"); }}>
            {specialCase ? "Continuer malgré tout →" : "Aucun de ces cas — Continuer →"}
          </button>
          {specialCase && (
            <button className="btn-outline" onClick={() => setStep("lead")}>
              Parler directement à un expert
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── QUESTIONS NIVEAU 1 ────────────────────────────────────────────────────
  if (step === "q1") {
    const q = Q_LEVEL1[q1Step];
    return (
      <div className="root"><style>{css}</style>
        <Nav back onBack={() => q1Step === 0 ? setStep("special_check") : setQ1Step(q1Step - 1)} />
        <div className="section">
          <div className="step-indicator">Étape 1 · Question {q1Step + 1} / {Q_LEVEL1.length}</div>
          <div className="page-title">Votre profil conducteur</div>
          <div className="page-sub">Chaque réponse nous aide à détecter les points critiques de votre contrat.</div>

          <div className="q-card">
            <div className="q-why">💡 {q.why}</div>
            <div className="q-label">{q.label}</div>
            <div className="q-opts">
              {q.opts.map(o => (
                <button key={o} className={`q-opt ${profile[q.id] === o ? "sel" : ""}`} onClick={() => setAnswer(q.id, o)}>{o}</button>
              ))}
            </div>
          </div>

          {/* Réponses déjà données */}
          {q1Step > 0 && (
            <div className="profile-tags" style={{ marginBottom: 16 }}>
              {Q_LEVEL1.slice(0, q1Step).map(pq => profile[pq.id] && (
                <span key={pq.id} className="ptag" style={{ cursor: "pointer" }} onClick={() => setQ1Step(Q_LEVEL1.findIndex(x => x.id === pq.id))}>
                  {profile[pq.id]}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <div className="dots">
              {Q_LEVEL1.map((_, i) => (
                <div key={i} className="dot-step" style={{ background: i < q1Step ? "#3B82F6" : i === q1Step ? "#0B1F4B" : "#E0E7FF", width: i === q1Step ? "20px" : "7px", borderRadius: i === q1Step ? "4px" : "50%" }}></div>
              ))}
            </div>
            <button className="btn-primary" disabled={!canNextQ1}
              onClick={() => q1Step < Q_LEVEL1.length - 1 ? setQ1Step(q1Step + 1) : setStep("q2")}>
              {q1Step < Q_LEVEL1.length - 1 ? "Suivant →" : "Continuer →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTIONS NIVEAU 2 ────────────────────────────────────────────────────
  if (step === "q2") {
    return (
      <div className="root"><style>{css}</style>
        <Nav back onBack={() => setStep("q1")} />
        <div className="section">
          <div className="step-indicator">Étape 2 · Questions spécifiques à votre profil</div>
          <div className="page-title">Quelques points importants</div>
          <div className="page-sub">Basées sur vos réponses, ces questions ciblent les risques concrets pour votre situation.</div>

          {activeL2.length === 0 && (
            <div className="inline-alert inline-alert-blue" style={{ marginBottom: 20 }}>
              <span>✅</span>
              <div>Votre profil de base est simple — aucune question supplémentaire critique détectée. Vous pouvez continuer directement.</div>
            </div>
          )}

          {activeL2.map((q, idx) => (
            <div key={q.id} className="q-card">
              <div className="q-why">⚡ {q.why}</div>
              <div className="q-label">{q.label}</div>
              <div className="q-opts">
                {q.opts.map(o => (
                  <button key={o} className={`q-opt ${profile[q.id] === o ? "sel" : ""}`} onClick={() => setAnswer(q.id, o)}>{o}</button>
                ))}
              </div>
              {q.alert && profile[q.id] && (
                <div className={`inline-alert ${q.alert.type === "red" ? "inline-alert-red" : q.alert.type === "blue" ? "inline-alert-blue" : ""}`} style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12 }}>{q.alert.text}</div>
                </div>
              )}
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn-primary" onClick={() => setStep("q3")}>Continuer →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTIONS NIVEAU 3 (bulles + champ libre) ────────────────────────────
  if (step === "q3") {
    const BULLES = [
      { id: "b1", icon: "🔑", text: "Je prête régulièrement mon véhicule à des proches" },
      { id: "b2", icon: "💼", text: "J'utilise mon véhicule pour mon activité professionnelle" },
      { id: "b3", icon: "👶", text: "Un jeune conducteur conduit ce véhicule" },
      { id: "b4", icon: "🔧", text: "J'ai des équipements ajoutés (jantes, sono, GPS, attelage...)" },
      { id: "b5", icon: "🚗", text: "Un véhicule de remplacement est indispensable pour moi" },
      { id: "b6", icon: "⚖️", text: "Je n'ai pas de protection juridique du tout" },
      { id: "b7", icon: "🌍", text: "Je souhaite être couvert hors Europe" },
      { id: "b8", icon: "📍", text: "Je roule peu — moins de 5 000 km par an" },
      { id: "b9", icon: "🔍", text: "Je veux savoir si je suis bien couvert" },
      { id: "b10", icon: "💰", text: "Je cherche à réduire ma cotisation" },
    ];

    const texte = profile.besoins_libres || "";
    const bullesActives = BULLES.filter(b => texte.includes(b.text));
    const qualite = Math.min(100, (texte.length / 3) + (bullesActives.length * 15));
    const qualiteLabel = qualite === 0 ? "Analyse standard" : qualite < 30 ? "Analyse enrichie" : qualite < 60 ? "Analyse personnalisée" : "Analyse expert ⭐";
    const qualiteColor = qualite === 0 ? "#9CA3AF" : qualite < 30 ? "#3B82F6" : qualite < 60 ? "#C8922A" : "#065F46";

    const toggleBulle = (bulle) => {
      const current = profile.besoins_libres || "";
      if (current.includes(bulle.text)) {
        setAnswer("besoins_libres", current.replace(bulle.text + "\n", "").replace(bulle.text, "").trim());
      } else {
        setAnswer("besoins_libres", current ? current + "\n" + bulle.text : bulle.text);
      }
    };

    return (
      <div className="root"><style>{css}</style>
        <Nav back onBack={() => setStep("q2")} />
        <div className="section">
          <div className="step-indicator">Étape 3 · Vos besoins</div>
          <div className="page-title">Votre analyse sera 2× plus précise</div>
          <div className="page-sub">Cliquez sur ce qui vous concerne — plus vous nous en dites, plus l'analyse sera juste.</div>

          {/* Bulles cliquables */}
          <div style={{ background: "white", borderRadius: 16, padding: "20px", border: "1px solid #E8EEFF", boxShadow: "0 2px 12px rgba(11,31,75,0.06)", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
              Cliquez sur ce qui vous concerne
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {BULLES.map(b => {
                const active = texte.includes(b.text);
                return (
                  <button key={b.id} onClick={() => toggleBulle(b)} style={{
                    padding: "9px 14px", borderRadius: 50,
                    border: `2px solid ${active ? "#0B1F4B" : "#E8EEFF"}`,
                    background: active ? "#0B1F4B" : "white",
                    color: active ? "white" : "#374151",
                    fontSize: 13, fontWeight: active ? 700 : 500,
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}>
                    <span>{b.icon}</span> {b.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Champ libre */}
          <div style={{ background: "white", borderRadius: 16, padding: "20px", border: "1px solid #E8EEFF", boxShadow: "0 2px 12px rgba(11,31,75,0.06)", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              Ajoutez ce qu'on n'a pas prévu
            </div>
            <textarea
              className="form-textarea"
              placeholder="Ex : je transporte souvent du matériel médical, mon véhicule est modifié, j'ai eu un sinistre l'an dernier, je stationne dans un quartier exposé aux vols..."
              value={texte}
              onChange={e => setAnswer("besoins_libres", e.target.value)}
              style={{ minHeight: 90 }}
            />
          </div>

          {/* Barre de qualité */}
          <div style={{ background: "white", borderRadius: 14, padding: "14px 18px", border: "1px solid #E8EEFF", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Qualité de l'analyse</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: qualiteColor }}>{qualiteLabel}</span>
            </div>
            <div style={{ height: 8, background: "#F0F4FF", borderRadius: 10 }}>
              <div style={{ height: 8, width: `${Math.max(4, qualite)}%`, borderRadius: 10, background: qualite === 0 ? "#E8EEFF" : qualite < 30 ? "#3B82F6" : qualite < 60 ? "#C8922A" : "#10B981", transition: "all 0.4s ease" }}></div>
            </div>
            {qualite === 0 && (
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
                ⚡ Sélectionnez des bulles ou décrivez votre situation pour une analyse vraiment personnalisée
              </div>
            )}
          </div>

          {/* Récap profil */}
          <div className="profile-recap">
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>✅ Votre profil enregistré</div>
            <div className="profile-tags">
              <span className="ptag ptag-primary">🚗 Assurance Auto</span>
              {Object.entries(profile).filter(([k, v]) => k !== "besoins_libres" && v).map(([k, v]) => (
                <span key={k} className="ptag">{v}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={() => setStep("upload")}>
              Déposer mon contrat →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── UPLOAD ────────────────────────────────────────────────────────────────
  if (step === "upload") {
    return (
      <div className="root"><style>{css}</style>
        <Nav back onBack={() => setStep("q3")} />
        <div className="section">
          <div className="step-indicator">Dernière étape · Votre contrat</div>
          <div className="page-title">Déposez votre contrat PDF</div>
          <div className="page-sub">L'IA croisera votre contrat avec votre profil pour une analyse vraiment personnalisée.</div>

          <div className="profile-recap" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Profil enregistré</div>
            <div className="profile-tags">
              {Object.entries(profile).filter(([k, v]) => k !== "besoins_libres" && v).map(([k, v]) => (
                <span key={k} className="ptag">{v}</span>
              ))}
            </div>
          </div>

          {uploadError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#991B1B" }}>
              ⚠️ {uploadError}
            </div>
          )}

          {/* ZONE UPLOAD RÉELLE */}
          <label htmlFor="pdf-upload" style={{ display: "block", cursor: "pointer" }}>
            <div className="upload-zone" style={{ borderColor: uploadedFile ? "#3B82F6" : undefined, background: uploadedFile ? "#EFF6FF" : undefined }}>
              {uploading ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0B1F4B", marginBottom: 6 }}>Analyse en cours…</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>L'IA lit votre contrat, patientez 30 secondes</div>
                  <div style={{ marginTop: 14, width: "60%", height: 4, background: "#E8EEFF", borderRadius: 10, margin: "14px auto 0" }}>
                    <div style={{ height: 4, width: "70%", background: "linear-gradient(90deg,#3B82F6,#60A5FA)", borderRadius: 10, animation: "fadeUp 1s ease infinite" }}></div>
                  </div>
                </>
              ) : uploadedFile ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0B1F4B", marginBottom: 4 }}>📄 {uploadedFile.name}</div>
                  <div style={{ fontSize: 13, color: "#3B82F6", marginBottom: 6 }}>Fichier sélectionné — cliquez pour changer</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📄</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0B1F4B", marginBottom: 6 }}>Cliquez ici pour choisir votre PDF</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 10 }}>ou glissez-déposez votre contrat</div>
                  <div style={{ display: "inline-block", background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "white", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
                    📂 Parcourir mes fichiers
                  </div>
                  <div style={{ fontSize: 11, color: "#C4BAA8", marginTop: 10 }}>PDF uniquement · Contrat auto, habitation, santé…</div>
                </>
              )}
            </div>
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            ref={fileInputRef}
            style={{ position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" }}
            onChange={handleFileChange}
            disabled={uploading}
          />

          {uploadedFile && !uploading && (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <button
                className="btn-primary"
                style={{ fontSize: 16, padding: "14px 36px", boxShadow: "0 4px 16px rgba(29,78,216,0.4)" }}
                onClick={() => analyzeRealPDF(uploadedFile)}>
                🔍 Analyser mon contrat →
              </button>
            </div>
          )}

          {/* DEMO */}
          <div style={{ marginTop: 20, background: "linear-gradient(135deg,#0B1F4B,#1E3A7B)", borderRadius: 16, padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>🎬 Pas de PDF sous la main ?</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>
              Testez avec une simulation basée sur votre profil
            </div>
            <button
              onClick={() => { setAnalysis(buildDemoAnalysis(profile)); setActiveTab(0); setStep("results"); }}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Voir la démo →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (step === "results" && analysis) {
    return (
      <div className="root"><style>{css}</style>
        <Nav back onBack={() => setStep("upload")} />
        <div className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="page-title">Votre bilan Lumio</div>
              <div className="page-sub" style={{ marginBottom: 0 }}>Analyse personnalisée · Assurance Auto</div>
            </div>
            <button className="btn-outline" onClick={() => { setStep("special_check"); setProfile({}); setAnalysis(null); }}>
              Nouvelle analyse
            </button>
          </div>

          <style>{`
            @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
          `}</style>

          {/* ── BILAN CONTRAT ── */}
          <div style={{ background: "white", borderRadius: 16, padding: "26px", border: "2px solid #E8EEFF", boxShadow: "0 4px 24px rgba(11,31,75,0.08)", marginBottom: 16, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#3B82F6", marginBottom: 4 }}>📊 Bilan contrat</div>
                <div style={{ fontSize: 21, fontWeight: 800, color: "#0B1F4B", letterSpacing: "-0.3px" }}>{analysis.type}</div>
                <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{analysis.compagnie}</div>
              </div>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
                background: analysis.score >= 4 ? "#ECFDF5" : analysis.score >= 3 ? "#FFF7ED" : "#FEF2F2",
                boxShadow: "0 4px 16px rgba(11,31,75,0.1)",
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: analysis.score >= 4 ? "#065F46" : analysis.score >= 3 ? "#92400E" : "#991B1B" }}>{analysis.score}/5</span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2, color: analysis.score >= 4 ? "#065F46" : analysis.score >= 3 ? "#92400E" : "#991B1B" }}>
                  {analysis.score >= 4 ? "Bon" : analysis.score >= 3 ? "Moyen" : "Insuffisant"}
                </span>
              </div>
            </div>
            <div style={{ background: "#F4F7FF", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#374151", lineHeight: 1.65, marginBottom: 20, borderLeft: "4px solid #3B82F6" }}>
              {analysis.resume}
            </div>
            {[
              { items: analysis.garanties, color: "#065F46", bg: "#ECFDF5", label: "✅ Garanties présentes", prefix: "✓" },
              { items: analysis.exclusions, color: "#991B1B", bg: "#FEF2F2", label: "❌ Points critiques", prefix: "✕" },
              { items: analysis.alertes, color: "#92400E", bg: "#FFF7ED", label: "⚠️ Points d'attention", prefix: "⚠" },
              { items: analysis.points_forts, color: "#1E40AF", bg: "#EFF6FF", label: "💪 Points forts", prefix: "+" },
              { items: analysis.points_faibles, color: "#374151", bg: "#F4F7FF", label: "📉 Points faibles", prefix: "−" },
            ].filter(s => s.items?.length > 0).map((s, idx) => (
              <div key={idx}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7, color: s.color, marginBottom: 8, marginTop: 18 }}>{s.label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.items.map((item, j) => <span key={j} style={{ padding: "6px 13px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.prefix} {item}</span>)}
                </div>
              </div>
            ))}
            {analysis.conseil && (
              <div style={{ background: "linear-gradient(135deg,#0B1F4B,#1E3A7B)", color: "white", borderRadius: 12, padding: "16px 18px", fontSize: 13, lineHeight: 1.65, marginTop: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span><span>{analysis.conseil}</span>
              </div>
            )}
          </div>

          {/* ── SÉPARATEUR → ANALYSE PERSONNALISÉE ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 16px", position: "relative" }}>
            <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, #E8EEFF, #C7D2FE)" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 20, padding: "6px 14px", flexShrink: 0, position: "relative" }}>
              {/* Point rouge clignotant */}
              <div style={{ position: "relative", display: "inline-flex" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#EF4444", animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite", opacity: 0.55 }}></div>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444", position: "relative" }}></div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#991B1B" }}>
                {analysis.gaps.filter(g => g.ok === false).length} lacune{analysis.gaps.filter(g => g.ok === false).length > 1 ? "s" : ""} détectée{analysis.gaps.filter(g => g.ok === false).length > 1 ? "s" : ""} sur votre profil
              </span>
            </div>
            <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, #C7D2FE, #E8EEFF)" }}></div>
          </div>

          {/* ── ANALYSE PERSONNALISÉE ── */}
          <div style={{ background: "white", borderRadius: 16, border: "2px solid #E8EEFF", boxShadow: "0 4px 24px rgba(11,31,75,0.08)", marginBottom: 16, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,#0B1F4B,#1E3A7B)", color: "white", padding: "20px 26px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>🎯 Analyse personnalisée</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Ce que votre contrat ne couvre pas pour vous</div>
              <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 14 }}>
                {Object.entries(profile).filter(([k,v]) => k !== "besoins_libres" && v).map(([,v]) => v).slice(0,3).join(" · ")}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: `✓ ${analysis.gaps.filter(g => g.ok === true).length} conforme(s)`, bg: "rgba(16,185,129,0.2)", color: "#6EE7B7" },
                  { label: `⚠ ${analysis.gaps.filter(g => g.ok === "warn").length} à vérifier`, bg: "rgba(245,158,11,0.2)", color: "#FCD34D" },
                  { label: `✕ ${analysis.gaps.filter(g => g.ok === false).length} lacune(s)`, bg: "rgba(239,68,68,0.2)", color: "#FCA5A5" },
                ].map((s, i) => <span key={i} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>)}
              </div>
            </div>
            <div style={{ padding: "4px 26px 16px" }}>
              {analysis.gaps.map((g, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "15px 0", borderBottom: i < analysis.gaps.length - 1 ? "1px solid #F0F4FF" : "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, background: g.ok === true ? "#ECFDF5" : g.ok === "warn" ? "#FFF7ED" : "#FEF2F2", color: g.ok === true ? "#065F46" : g.ok === "warn" ? "#92400E" : "#991B1B" }}>
                    {g.ok === true ? "✓" : g.ok === "warn" ? "⚠" : "✕"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0B1F4B", marginBottom: 4 }}>{g.title}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{g.detail}</div>
                    {g.tip && <div style={{ background: "#EFF6FF", borderLeft: "3px solid #3B82F6", borderRadius: "0 8px 8px 0", padding: "8px 12px", marginTop: 8, fontSize: 11, color: "#1D4ED8", lineHeight: 1.5, fontStyle: "italic" }}>👤 Conseil expert : {g.tip}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DON — placé au pic d'émotion, juste après l'analyse ── */}
          {!donation || donation === "done" ? (
            <div style={{
              background: "linear-gradient(135deg, #92400E 0%, #C8922A 50%, #F0C040 100%)",
              borderRadius: 20, padding: "28px 24px", marginBottom: 16, position: "relative", overflow: "hidden",
            }}>
              {/* Fond décoratif */}
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }}></div>
              <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }}></div>

              {/* En-tête sans soleil */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 4 }}>Lumio vous a aidé ? ❤️</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Un café nous aide à garder l'outil gratuit ☕</div>
              </div>

              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", lineHeight: 1.6, marginBottom: 18 }}>
                Lumio est 100% gratuit et sans publicité. Si cette analyse vous a été utile — ou vous a évité une mauvaise surprise — un petit geste nous motive à continuer.
              </div>

              {/* Barre de progression fictive — effet social */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>🎯 Objectif du mois</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>68% atteint</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 10 }}>
                  <div style={{ height: 6, width: "68%", background: "white", borderRadius: 10, boxShadow: "0 0 8px rgba(255,255,255,0.5)" }}></div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 5 }}>47 personnes ont soutenu Lumio ce mois-ci</div>
              </div>

              {/* Montants — 5€ présélectionné */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  { amount: "2€", label: "☕ Un café" },
                  { amount: "5€", label: "🍕 Une part" },
                  { amount: "10€", label: "🎬 Un ciné" },
                  { amount: "20€", label: "🙏 Super fan" },
                ].map(({ amount, label }) => (
                  <button key={amount} onClick={() => setDonation(amount)} style={{
                    flex: 1, minWidth: "fit-content",
                    padding: "10px 8px",
                    borderRadius: 12,
                    border: `2px solid ${donation === amount ? "white" : "rgba(255,255,255,0.65)"}`,
                    background: donation === amount ? "white" : "rgba(255,255,255,0.22)",
                    color: donation === amount ? "#C8922A" : "white",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontWeight: donation === amount ? 800 : 700,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "center",
                    transform: donation === amount ? "scale(1.05)" : "none",
                    backdropFilter: "blur(4px)",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{amount}</div>
                    <div style={{ fontSize: 10, opacity: donation === amount ? 1 : 0.9, marginTop: 1 }}>{label}</div>
                  </button>
                ))}
              </div>

              {donation && (
                <button style={{
                  width: "100%", padding: "14px", borderRadius: 12,
                  background: "white", color: "#C8922A",
                  border: "none", fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 15, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "all 0.2s",
                }} onClick={() => setDonation("done")}>
                  ♥ Soutenir Lumio avec {donation}
                </button>
              )}

              {!donation && (
                <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                  Choisissez un montant ci-dessus
                </div>
              )}
            </div>
          ) : (
            /* Après le don */
            <div style={{ background: "#ECFDF5", border: "2px solid #A7F3D0", borderRadius: 16, padding: "20px 24px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🙏</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#065F46", marginBottom: 4 }}>Merci pour votre soutien !</div>
              <div style={{ fontSize: 13, color: "#047857" }}>Vous contribuez à garder Lumio gratuit pour tous.</div>
            </div>
          )}

          {!leadSent ? (
            <div className="lead-cta">
              <h3>
                {analysis.score <= 2 ? "🚨 Votre contrat nécessite une action" : "🎯 On peut optimiser votre couverture"}
              </h3>
              <p>
                {analysis.score <= 2
                  ? "Des lacunes importantes ont été détectées. Un conseiller expert examine votre dossier et vous propose une solution adaptée — gratuitement, sans engagement."
                  : "Un conseiller expert peut vous proposer une meilleure couverture au même prix ou moins cher. Gratuit, sans engagement."}
              </p>
              <button className="btn-ghost" onClick={() => setStep("lead")}>
                Être rappelé gratuitement →
              </button>
            </div>
          ) : (
            <div className="ok-box" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#065F46", marginBottom: 4 }}>Demande envoyée !</div>
              <div style={{ fontSize: 13, color: "#047857" }}>Un conseiller expert vous contactera dans les 24h.</div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ── LEAD FORM ─────────────────────────────────────────────────────────────
  if (step === "lead") {
    return (
      <div className="root"><style>{css}</style>
        <Nav back onBack={() => setStep(analysis ? "results" : "special_check")} />
        <div className="section" style={{ maxWidth: 500 }}>
          <div className="page-title">Parlez à un expert</div>
          <div className="page-sub">Gratuit · Sans engagement · Réponse sous 24h</div>

          {!leadSent ? (
            <div className="rcard">
              <div style={{ background: "#F4F7FF", borderRadius: 10, padding: "12px 15px", marginBottom: 16, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                💬 Le conseiller reçoit votre profil complet et les lacunes identifiées. Votre premier échange sera directement opérationnel — pas de répétitions, un vrai conseil adapté à vous.
              </div>

              {/* Résumé profil transmis */}
              <div className="profile-tags" style={{ marginBottom: 18 }}>
                <span className="ptag ptag-primary">🚗 Auto</span>
                {Object.entries(profile).filter(([k, v]) => k !== "besoins_libres" && v).slice(0, 4).map(([k, v]) => (
                  <span key={k} className="ptag">{v}</span>
                ))}
                {specialCase && <span className="ptag" style={{ background: "#FEF2F2", color: "#991B1B", borderColor: "#FECACA" }}>Cas particulier</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Prénom & Nom *</label>
                <input className="form-input" placeholder="Jean Dupont" value={leadData.name} onChange={e => setLeadData({ ...leadData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="jean@email.com" value={leadData.email} onChange={e => setLeadData({ ...leadData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone *</label>
                <input className="form-input" type="tel" placeholder="06 12 34 56 78" value={leadData.phone} onChange={e => setLeadData({ ...leadData, phone: e.target.value })} />
              </div>

              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
                disabled={!leadData.name || !leadData.email || !leadData.phone}
                onClick={() => { setLeadSent(true); setStep("results"); }}>
                Envoyer ma demande →
              </button>
              <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 8 }}>
                🔒 Données confidentielles — jamais revendues.
              </div>
            </div>
          ) : (
            <div className="ok-box">
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#065F46", marginBottom: 4 }}>Demande envoyée !</div>
              <div style={{ fontSize: 13, color: "#047857", marginBottom: 18 }}>Un expert vous contactera au {leadData.phone} dans les 24h ouvrées.</div>
              <button className="btn-outline" onClick={() => setStep("results")}>← Retour à mon analyse</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
