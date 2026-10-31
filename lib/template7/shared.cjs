// GENERATED from landing-builder. Run scripts/build-classic-template7.mjs --write there.
// Contains only public rendering/tracking logic; no environment values are embedded.
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// components/public-landing/template7ClassicEntry.ts
var template7ClassicEntry_exports = {};
__export(template7ClassicEntry_exports, {
  renderClassicTemplate7InlineHtml: () => renderClassicTemplate7InlineHtml,
  template7RuntimeAssetResponse: () => template7RuntimeAssetResponse
});
module.exports = __toCommonJS(template7ClassicEntry_exports);

// components/public-landing/template7ResourceWarmup.ts
function buildTemplate7ResourceWarmup(gatewayOrigin, chatOrigin = process.env.INTERNAL_CHAT_ORIGIN || "", selectedGateway = false) {
  const origins = {};
  for (const [key, value] of [["gateway", gatewayOrigin], ["chat", chatOrigin]]) {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash) origins[key] = url.origin;
    } catch {
    }
  }
  if (!origins.gateway && !origins.chat && !selectedGateway) return "";
  const settings = JSON.stringify(origins).replaceAll("<", "\\u003c");
  return `<script data-template7-resources>(function(){
    var cfg=${settings};
    var chatWarmed=false;
    var scripts={};
    function warm(selectedOrigin){
      if(window.__TEMPLATE7_REENTRY_PENDING__)return;
      try {
        var origin=selectedOrigin||cfg.gateway;
        if(origin){
          var parsed=new URL(origin);if(parsed.protocol!=="https:")return;origin=parsed.origin;
          window.__T7_GATEWAY_WARM__=window.__T7_GATEWAY_WARM__||{};
          if(!window.__T7_GATEWAY_WARM__[origin])window.__T7_GATEWAY_WARM__[origin]=fetch(origin+"/api/preparations/warm",{mode:"no-cors",credentials:"omit",cache:"no-store"}).catch(function(){});
          if(!scripts[origin]){scripts[origin]=true;var link=document.createElement("link");link.rel="prefetch";link.as="script";link.href=origin+"/gateway-client.js?v=entry-transition-2";document.head.appendChild(link)}
        }
        if(cfg.chat&&!chatWarmed){
          chatWarmed=true;var frame=document.createElement("iframe");frame.title="Preparando chat";frame.setAttribute("aria-hidden","true");frame.tabIndex=-1;frame.referrerPolicy="no-referrer";
          frame.style.cssText="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0";document.body.appendChild(frame);frame.src=cfg.chat+"/embed/warm";
        }
      }catch(e){}
    }
    window.__T7_WARM_RESOURCES__=warm;
    function intent(event){
      var target=event.target;
      if(target&&target.closest&&target.closest('[data-template7-form]'))warm(window.__T7_SELECTED_GATEWAY__);
    }
    // Heavy chat code starts only when the visitor interacts with the form.
    // Discovery/paint, PageView and typing never wait for this work.
    document.addEventListener("focusin",intent,{passive:true});
    document.addEventListener("input",intent,{passive:true});
    document.addEventListener("pointerdown",intent,{passive:true});
  })();</script>`;
}

// components/public-landing/PhonePrewarmScript.tsx
var import_jsx_runtime = require("react/jsx-runtime");

// components/public-landing/trackingScriptHelpers.ts
var PHONE_NORMALIZER_BODY = String.raw`
  var digits = String(raw || "").replace(/\D+/g, "");
  var countryCallingCode = String(rawCountryCallingCode || "").replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.indexOf("00") === 0) digits = digits.slice(2);
  if (countryCallingCode && digits.indexOf(countryCallingCode) === 0) return digits;

  var national = digits.replace(/^0+/, "");
  if (countryCallingCode === "54") {
    national = national.replace(/^15/, "");
    return national.length === 10 ? "54" + national : digits;
  }
  if (countryCallingCode === "595") {
    return national.length === 9 ? "595" + national : digits;
  }
  return digits;
`;
function buildPhoneNormalizerScript(functionName = "normalizePhone") {
  if (!/^[A-Za-z_$][\w$]*$/.test(functionName)) {
    throw new Error("Invalid phone normalizer function name");
  }
  return `function ${functionName}(raw, rawCountryCallingCode) {${PHONE_NORMALIZER_BODY}}`;
}

// lib/multi-skin-catalog.ts
var MULTI_SKIN_CATALOG = {
  ganamos_plus: { name: "Ganamos+", origin: "https://ganamosbet.plus" },
  jugamos: { name: "Jugamos", origin: "https://jugamos1.lat" },
  casino_zeus: { name: "Casino Zeus", origin: "https://casinozeus1.plus" },
  bet30: { name: "Bet30", origin: "https://bet30e.lat" },
  gana_en_casa: { name: "Gana En Casa", origin: "https://ganaencasabet.lat" },
  celu_apuestas: { name: "CeluApuestas", origin: "https://celuapuestas1.lat" },
  casino_zeta: { name: "CasinoZeta", origin: "https://casinozeta1.lat" },
  oro_puro: { name: "OroPuro", origin: "https://oropuro.bet" },
  fortu_bet: { name: "FortuBet", origin: "https://fortubet.cc" },
  gran_poseidon: { name: "Gran Poseidon", origin: "https://granposeidon.plus" },
  kona_bet: { name: "Konabet", origin: "https://konabet.plus" },
  mega_faraon: { name: "MegaFaraon", origin: "https://megafaraon.plus" },
  camel_bet: { name: "CamelBet", origin: "https://camelbet.icu" },
  rhino_play: { name: "RhinoPlay", origin: "https://rhinoplay.xyz" }
};
var MULTI_SKIN_CODES = Object.keys(MULTI_SKIN_CATALOG);
function isMultiSkinCode(value) {
  return typeof value === "string" && Object.hasOwn(MULTI_SKIN_CATALOG, value);
}

// lib/reyDeAses/request-recovery.ts
async function fetchWithEntryRecovery(url, init, onRetry) {
  const deadline = Date.now() + 45e3;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (init.signal?.aborted) throw init.signal.reason || new Error("entry_cancelled");
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("entry_recovery_pending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(42e3, remaining));
    const cancel = () => controller.abort(init.signal?.reason);
    init.signal?.addEventListener("abort", cancel, { once: true });
    if (init.signal?.aborted) cancel();
    const feedback = onRetry ? setTimeout(onRetry, Math.min(8e3, remaining)) : void 0;
    let response;
    let failure;
    let retryAfter = 0;
    try {
      response = await fetch(url, Object.assign({}, init, { signal: controller.signal }));
      if (!response.ok && ![408, 429, 500, 502, 503, 504].includes(response.status)) return response;
      const received = response;
      response = void 0;
      const text = await received.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch (error) {
        if (received.ok) throw error;
      }
      response = new Response(text, { status: received.status, statusText: received.statusText, headers: received.headers });
      if (response.ok) return response;
      if (body && (body.retryable === false || ["integration_pending", "api2_not_configured", "landing_unavailable", "advisor_not_assigned"].includes(body.error))) return response;
      const header = response.headers.get("Retry-After");
      if (header) retryAfter = /^\d+$/.test(header) ? Number(header) * 1e3 : Math.max(0, Date.parse(header) - Date.now());
      if (retryAfter > 6e4) return response;
    } catch (error) {
      failure = error;
    } finally {
      clearTimeout(timer);
      if (feedback !== void 0) clearTimeout(feedback);
      init.signal?.removeEventListener("abort", cancel);
    }
    if (init.signal?.aborted) throw init.signal.reason || failure || new Error("entry_cancelled");
    if (attempt === 3) {
      if (response) return response;
      throw failure;
    }
    if (onRetry) onRetry();
    const delay = Math.max(Number.isFinite(retryAfter) ? retryAfter : 0, [500, 1500, 3500][attempt]);
    if (Date.now() + delay >= deadline) {
      if (response) return response;
      throw failure || new Error("entry_recovery_pending");
    }
    await new Promise((resolve, reject) => {
      const abort = () => {
        clearTimeout(pause);
        init.signal?.removeEventListener("abort", abort);
        reject(init.signal?.reason || new Error("entry_cancelled"));
      };
      const pause = setTimeout(() => {
        init.signal?.removeEventListener("abort", abort);
        resolve();
      }, delay);
      init.signal?.addEventListener("abort", abort, { once: true });
      if (init.signal?.aborted) abort();
    });
  }
  throw new Error("entry_recovery_exhausted");
}
var ENTRY_REQUEST_RECOVERY_SCRIPT = `var fetchWithEntryRecovery = ${fetchWithEntryRecovery.toString()};`;

// components/public-landing/PublicLandingRuntimeScript.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var SOCIAL_PROOF_ITEMS = [
  { quote: "Muy buena atencion, me respondieron al toque \u{1F64C}", name: "Nico R." },
  { quote: "Me guiaron con paciencia y buena onda \u2705", name: "Juan P." },
  { quote: "Todo super claro, sin vueltas y rapido \u{1F4AC}", name: "Mica F." },
  { quote: "Atencion de diez, se nota que estan atentos \u{1F91D}", name: "Seba L." },
  { quote: "Respondieron enseguida y me ayudaron con todo \u26A1", name: "Romi D." },
  { quote: "Muy buena predisposicion desde el primer mensaje \u{1F64F}", name: "Lau T." },
  { quote: "Me explicaron todo facil y con mucha claridad \u2728", name: "Dario C." },
  { quote: "Da confianza cuando te responden tan rapido \u{1F4F2}", name: "Cami V." },
  { quote: "Excelente trato, muy humanos para atender \u{1F60A}", name: "Pablo M." },
  { quote: "Me senti bien acompa\xF1ado en todo momento \u{1F64C}", name: "Gise A." },
  { quote: "Rapidos, claros y muy atentos \u2705", name: "Fede L." },
  { quote: "La atencion fue simple y re amable \u{1F4AC}", name: "Sofi B." },
  { quote: "Siempre contestan con buena onda \u{1F91D}", name: "Tomi A." },
  { quote: "Me resolvieron la consulta en minutos \u26A1", name: "Vale M." },
  { quote: "Muy prolijos para explicar cada paso \u2728", name: "Leo C." },
  { quote: "Atencion cercana, nada robotica \u{1F60A}", name: "Flor G." },
  { quote: "Te responden rapido y van al punto \u{1F4F2}", name: "Maxi N." },
  { quote: "Buena energia y mucha predisposicion \u{1F64F}", name: "Agus R." },
  { quote: "Todo facil desde el primer WhatsApp \u2705", name: "Dani P." },
  { quote: "Me gusto la claridad con la que atienden \u{1F4AC}", name: "Juli S." },
  { quote: "Super atentos, se nota el compromiso \u{1F64C}", name: "Mati V." },
  { quote: "Muy buena respuesta, cero vueltas \u26A1", name: "Carla D." },
  { quote: "Atencion amable y bien organizada \u{1F91D}", name: "Lucas E." },
  { quote: "Me ayudaron rapido y con paciencia \u{1F60A}", name: "Meli Q." },
  { quote: "Siempre atentos a cada mensaje \u{1F4F2}", name: "Nacho T." },
  { quote: "Muy claro todo, excelente predisposicion \u2728", name: "Ana K." },
  { quote: "Se nota que hay equipo atras respondiendo \u{1F64C}", name: "Bruno F." },
  { quote: "Buena atencion y seguimiento constante \u2705", name: "Rocio L." },
  { quote: "Responden rapido y con trato cordial \u{1F4AC}", name: "Marcos H." },
  { quote: "Todo ordenado, claro y muy humano \u{1F91D}", name: "Pau M." }
];
var META_PARAM_BUILDER_PUBLIC_PATH = "/vendor/meta-capi-param-builder/1.3.1/clientParamBuilder.bundle.js";
function buildRuntimeConfig({ slug, config }) {
  const runtimeConfig = {
    slug,
    landingId: config.id,
    landingName: config.name,
    pixelId: String(config.tracking?.pixelId || "").trim(),
    storageNamespace: `landing-builder:${String(config.tracking?.pixelId || "").replace(/\D+/g, "") || "no-pixel"}:${slug}`,
    postUrl: config.tracking?.postUrl || "",
    landingTag: config.tracking?.landingTag || "LP",
    sendContactPixel: config.tracking?.sendContactPixel !== false,
    ctaDestination: config.layout?.template === 7 ? "atrio" : "whatsapp",
    targetProvider: config.tracking?.target_provider === "multi_skin" ? "multi_skin" : config.tracking?.target_provider === "ases_del_norte" ? "ases_del_norte" : config.tracking?.target_provider === "ganamos_net" ? "ganamos_net" : "rey_de_ases",
    skinCode: config.tracking?.skin_code || "",
    atrioRedirectUrl: config.tracking?.atrioRedirectUrl || "",
    atrioClientId: config.tracking?.atrioClientId || "",
    atrioId: config.tracking?.atrioId || "",
    atrioSlug: config.tracking?.atrioSlug || "",
    phoneCountryCode: config.tracking?.phoneCountryCode || "54",
    workspaceCurrency: String(config.workspaceCurrency || config.tracking?.workspaceCurrency || config.tracking?.currency || "ARS").trim().toUpperCase(),
    ctaText: config.content?.ctaText || "\xA1Contactar ya!",
    template: config.layout?.template || 1,
    template7Whatsapp: config.template7Capture?.whatsapp === true,
    phoneSelectionMode: config.phoneSelection?.mode || "",
    backgroundMode: config.background?.mode || "",
    metaIpCollectorUrl: process.env.NEXT_PUBLIC_META_IP_COLLECTOR_URL || "",
    metaParamBuilderSrc: META_PARAM_BUILDER_PUBLIC_PATH,
    whatsappPrefillText: config.interactions?.enabled && config.interactions.whatsappPrefillText ? config.interactions.whatsappPrefillText : "",
    leadCapture: {
      enabled: config.leadCapture?.enabled === true,
      title: config.leadCapture?.title || "Desbloque\xE1 atenci\xF3n personalizada",
      description: config.leadCapture?.description || "Complet\xE1 tus datos o segu\xED directo a WhatsApp.",
      fields: {
        firstName: config.leadCapture?.fields?.firstName === true,
        lastName: config.leadCapture?.fields?.lastName === true,
        phone: config.leadCapture?.fields?.phone === true,
        email: config.leadCapture?.fields?.email === true
      }
    },
    emailCapture: { enabled: config.emailCapture?.enabled === true },
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    socialProofItems: SOCIAL_PROOF_ITEMS
  };
  return runtimeConfig;
}

// components/public-landing/publicLandingCss.ts
var PUBLIC_LANDING_CSS = String.raw`
html, body {
  margin: 0;
  min-height: 100%;
  background: #000;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

*, *::before, *::after {
  box-sizing: border-box;
}

p, h1 {
  margin: 0;
}

img {
  max-width: 100%;
}

button, a {
  -webkit-tap-highlight-color: transparent;
}

.public-privacy-footer {
  position: fixed;
  z-index: 20;
  left: 50%;
  bottom: max(8px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
}

.public-privacy-link {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 5px 9px;
  color: rgba(255, 255, 255, 0.78);
  background: rgba(0, 0, 0, 0.66);
  font: 500 11px/1.2 Arial, Helvetica, sans-serif;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.public-privacy-link:hover,
.public-privacy-link:focus-visible {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.45);
}

.public-privacy-link:focus-visible,
.public-privacy-dialog__close:focus-visible,
.public-privacy-dialog a:focus-visible {
  outline: 2px solid #25d366;
  outline-offset: 2px;
}

.public-privacy-dialog {
  width: min(92vw, 620px);
  max-height: min(82vh, 720px);
  margin: auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid #343a46;
  border-radius: 16px;
  color: #e8ebf0;
  background: #12151b;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}

.public-privacy-dialog::backdrop {
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(3px);
}

.public-privacy-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #2a2f39;
}

.public-privacy-dialog__header h2 {
  margin: 0;
  color: #fff;
  font: 700 18px/1.25 Arial, Helvetica, sans-serif;
}

.public-privacy-dialog__close {
  appearance: none;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: 1px solid #3a414d;
  border-radius: 8px;
  color: #d8dde5;
  background: #1b2028;
  font: 400 24px/1 Arial, Helvetica, sans-serif;
  cursor: pointer;
}

.public-privacy-dialog__content {
  max-height: calc(min(82vh, 720px) - 69px);
  padding: 18px 20px 22px;
  overflow-y: auto;
  color: #c9cfd8;
  font: 400 13px/1.55 Arial, Helvetica, sans-serif;
}

.public-privacy-dialog__content p {
  margin: 0 0 13px;
}

.public-privacy-dialog__content strong {
  color: #fff;
}

.public-privacy-dialog__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  padding-top: 3px;
}

.public-privacy-dialog__links a {
  color: #67e8a5;
  text-decoration: underline;
  text-underline-offset: 3px;
}

body.public-lead-capture-open {
  overflow: hidden;
}

.public-lead-capture {
  position: fixed;
  z-index: 80;
  inset: 0;
  display: grid;
  place-items: center;
  padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(7px);
}

.public-lead-capture[hidden] {
  display: none;
}

.public-lead-capture__card {
  position: relative;
  width: min(100%, 430px);
  max-height: min(86vh, 620px);
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 22px;
  padding: 24px;
  color: #f8fafc;
  background:
    radial-gradient(circle at 18% 0%, rgba(37, 211, 102, 0.18), transparent 36%),
    linear-gradient(180deg, rgba(19, 25, 34, 0.98), rgba(9, 12, 18, 0.98));
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.64);
}

.public-lead-capture__close {
  appearance: none;
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.06);
  font: 400 22px/1 Arial, Helvetica, sans-serif;
  cursor: pointer;
}

.public-lead-capture__card h2 {
  margin: 0;
  padding-right: 34px;
  color: #fff;
  font: 800 22px/1.12 Arial, Helvetica, sans-serif;
  letter-spacing: -0.03em;
}

.public-lead-capture__description {
  margin: 10px 0 0;
  color: rgba(226, 232, 240, 0.78);
  font: 500 13px/1.45 Arial, Helvetica, sans-serif;
}

.public-lead-capture__grid {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.public-lead-capture__field {
  display: grid;
  gap: 6px;
  color: rgba(226, 232, 240, 0.86);
  font: 700 11px/1.2 Arial, Helvetica, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.public-lead-capture__input {
  width: 100%;
  min-height: 46px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 14px;
  padding: 0 14px;
  color: #fff;
  background: rgba(2, 6, 12, 0.72);
  outline: none;
  font: 600 15px/1 Arial, Helvetica, sans-serif;
}

.public-lead-capture__input::placeholder {
  color: rgba(148, 163, 184, 0.62);
}

.public-lead-capture__input:focus {
  border-color: rgba(37, 211, 102, 0.72);
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.16);
}

.public-lead-capture__actions {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.public-lead-capture__submit,
.public-lead-capture__skip {
  appearance: none;
  min-height: 46px;
  border-radius: 999px;
  padding: 0 16px;
  font: 800 14px/1 Arial, Helvetica, sans-serif;
  cursor: pointer;
}

.public-lead-capture__submit {
  border: 0;
  color: #04130a;
  background: #25d366;
  box-shadow: 0 14px 30px rgba(37, 211, 102, 0.24);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  animation: publicLeadCapturePulse 2.7s ease-in-out infinite;
}

.public-lead-capture__skip {
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(226, 232, 240, 0.86);
  background: rgba(255, 255, 255, 0.04);
  text-transform: uppercase;
  letter-spacing: 0.035em;
}

.public-lead-capture__submit:focus-visible,
.public-lead-capture__skip:focus-visible,
.public-lead-capture__close:focus-visible {
  outline: 2px solid #25d366;
  outline-offset: 2px;
}

@media (max-width: 430px), (max-height: 720px) {
  .public-lead-capture {
    align-items: center;
    padding: 10px 10px max(10px, env(safe-area-inset-bottom));
  }

  .public-lead-capture__card {
    width: 100%;
    max-height: min(92svh, 580px);
    border-radius: 18px;
    padding: 16px;
  }

  .public-lead-capture__close {
    top: 9px;
    right: 9px;
    width: 28px;
    height: 28px;
    font-size: 19px;
  }

  .public-lead-capture__card h2 {
    padding-right: 30px;
    font-size: 18px;
    line-height: 1.08;
  }

  .public-lead-capture__description {
    margin-top: 7px;
    font-size: 12px;
    line-height: 1.32;
  }

  .public-lead-capture__grid {
    gap: 7px;
    margin-top: 12px;
  }

  .public-lead-capture__field {
    gap: 4px;
    font-size: 10px;
    letter-spacing: 0.06em;
  }

  .public-lead-capture__input {
    min-height: 40px;
    border-radius: 12px;
    padding-inline: 12px;
    font-size: 14px;
  }

  .public-lead-capture__actions {
    gap: 8px;
    margin-top: 12px;
  }

  .public-lead-capture__submit,
  .public-lead-capture__skip {
    min-height: 40px;
    font-size: 13px;
  }
}

@keyframes publicLeadCapturePulse {
  0%, 100% {
    box-shadow: 0 14px 30px rgba(37, 211, 102, 0.24);
    transform: translateZ(0) scale(1);
  }
  50% {
    box-shadow: 0 16px 36px rgba(37, 211, 102, 0.38);
    transform: translateZ(0) scale(1.015);
  }
}

.public-landing,
.public-landing * {
  box-sizing: border-box;
}

.public-landing {
  color: #fff;
  background: #000;
}

.public-landing button,
.public-landing a,
.public-landing input,
.public-landing textarea,
.public-landing select {
  font: inherit;
}

.public-landing.landing-shell {
  min-height: 100vh;
}

.public-landing .container.background-image {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
}

.public-landing .background-layer {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #000;
}

.public-landing .background-layer__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.public-landing .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
}

.public-landing .content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 720px);
  padding: 32px 20px max(76px, calc(32px + env(safe-area-inset-bottom)));
}

.public-landing .content .title,
.public-landing .content .subtitle,
.public-landing .content .description {
  width: 100%;
  max-width: min(85vw, 620px);
}

.public-landing .logo {
  width: 200px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 12px;
}

.public-landing .title {
  margin: 10px 0 15px;
  line-height: 1.2;
}

.public-landing .subtitle {
  margin-top: 40px;
  line-height: 1.45;
}

.public-landing .description {
  margin: 35px 0 50px;
  letter-spacing: 0.05em;
}

.public-landing .whatsapp-button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 180px;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 25px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.public-landing .container.background-image.template1-bottom-layout {
  --cta-thumb-frame-height: 74svh;
  align-items: flex-start;
}

.public-landing .template1-bottom-layout .content {
  min-height: var(--cta-thumb-frame-height);
  justify-content: center;
  padding-bottom: 16px;
}

.public-landing .template1-bottom-cta-slot {
  position: absolute;
  z-index: 2;
  top: var(--cta-thumb-frame-height);
  left: 50%;
  width: min(100vw, 430px);
  padding: 0 16px;
  display: flex;
  justify-content: center;
  transform: translateX(-50%);
}

.public-landing .template1-bottom-cta-slot .whatsapp-button {
  margin-top: 10px;
}

.public-landing .whatsapp-button::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 44%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.34), transparent);
  transform: translateX(-150%) skewX(-25deg);
  animation: publicLandingShineX 5.8s infinite;
  pointer-events: none;
}

.public-landing .whatsapp-button:hover {
  transform: scale(1.02);
}

.public-landing .whatsapp-button:active {
  transform: scale(0.97);
  opacity: 0.92;
}

.public-landing .whatsapp-button:disabled {
  cursor: not-allowed;
  opacity: 0.75;
  animation: none;
}

.public-landing .whatsapp-button:disabled::before {
  animation: none;
  opacity: 0;
}

.public-landing .whatsapp-icon {
  width: 29px;
  height: 29px;
  display: block;
}

@keyframes publicLandingShineX {
  from {
    transform: translateX(-150%) skewX(-25deg);
  }
  to {
    transform: translateX(300%) skewX(-25deg);
  }
}

@keyframes publicLandingHeartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.public-landing.lp {
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  overscroll-behavior-y: none;
  touch-action: pan-x;
  background: #000;
}

.public-landing.lp .phone-view {
  height: 100vh;
  height: 100svh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  overscroll-behavior-y: none;
  background: #000;
}

.public-landing.lp .artboard {
  --cta-thumb-frame-height: 74svh;
  width: min(100vw, 430px);
  height: 100vh;
  height: 100svh;
  padding: 0 16px calc(46px + env(safe-area-inset-bottom));
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  overscroll-behavior-y: none;
}

.public-landing.lp .frame {
  position: relative;
  width: 100%;
  height: var(--cta-thumb-frame-height);
  min-height: 0;
  max-height: none;
  margin-top: 0;
  background: #000;
  border-radius: 0 0 34px 34px;
  overflow: hidden;
}

.public-landing.lp .frame__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 28px;
}

.public-landing.lp .frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.04) 0%,
    rgba(0, 0, 0, 0.08) 36%,
    rgba(0, 0, 0, 0.24) 56%,
    rgba(0, 0, 0, 0.72) 84%,
    rgba(0, 0, 0, 0.96) 100%
  );
  pointer-events: none;
  border-radius: 28px;
}

.public-landing.lp .frame__logo {
  position: absolute;
  z-index: 2;
  top: 8.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 54%;
  max-width: 220px;
  min-width: 170px;
  filter:
    drop-shadow(0 8px 20px rgba(0, 0, 0, 0.55))
    drop-shadow(0 0 12px rgba(255, 208, 79, 0.15));
}

.public-landing.lp .frame__copy {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  width: 85%;
  max-width: 365px;
  bottom: 26px;
  padding: 0;
  margin: 0 auto;
  text-align: center;
}

.public-landing.lp .eyebrow {
  color: #dfb117;
  font-size: 21px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
}

.public-landing.lp .frame__copy .title {
  margin-top: 10px;
  color: #fff;
  font-size: 23px;
  line-height: 1.05;
  font-weight: 900;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.95);
}

.public-landing.lp .cta {
  position: relative;
  width: 80%;
  min-height: 45px;
  margin-top: 10px;
  border-radius: 16px;
  background: #08c95f;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 14px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 10px 24px rgba(0, 0, 0, 0.26);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  overflow: visible;
  isolation: isolate;
  will-change: transform;
}

.public-landing.lp .cta::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.34);
  opacity: 0;
  transform: scale(1);
  pointer-events: none;
  z-index: 0;
  animation: publicLandingCtaPulseRing 2.8s ease-out infinite;
  will-change: transform, opacity;
}

.public-landing.lp .cta > * {
  position: relative;
  z-index: 1;
}

.public-landing.lp .cta:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 14px 28px rgba(0, 0, 0, 0.28);
}

.public-landing.lp .cta:active {
  transform: scale(0.97);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.2);
}

.public-landing.lp .cta:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.public-landing.lp .cta:disabled::after {
  animation: none;
  opacity: 0;
}

@keyframes publicLandingCtaPulseRing {
  0% {
    opacity: 0.34;
    transform: scale(1);
  }
  70% {
    opacity: 0;
    transform: scale(1.07);
  }
  100% {
    opacity: 0;
    transform: scale(1.07);
  }
}

@keyframes publicLandingCtaHeartbeat {
  0%,
  64%,
  100% {
    transform: scale(1);
  }
  72% {
    transform: scale(1.02);
  }
  80% {
    transform: scale(1);
  }
  88% {
    transform: scale(1.013);
  }
}

.public-landing.lp .cta__fill {
  flex: 1 1 auto;
  min-width: 0;
  color: #fff;
  font-size: inherit;
  font-weight: inherit;
  line-height: 1.1;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.public-landing.lp .cta__icon {
  width: 29px;
  height: 29px;
  object-fit: contain;
  flex: 0 0 auto;
}

.public-landing.lp .social-proof {
  width: 80%;
  margin-top: 16px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
}

.public-landing.lp .social-proof__quote {
  color: #fff;
  font-size: 12px;
  line-height: 1.22;
  font-weight: 600;
  text-align: left;
  animation: publicLandingSocialProofFadeIn 420ms ease;
  will-change: transform, opacity;
}

.public-landing.lp .social-proof__meta {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  text-align: left;
}

.public-landing.lp .social-proof__stars {
  color: #ffd24b;
  letter-spacing: 1px;
}

.public-landing.lp .social-proof__progress {
  width: 100%;
  height: 3px;
  margin-top: 8px;
  border-radius: 999px;
  background: #25d366;
  transform: scaleX(0);
  transform-origin: left center;
  animation: publicLandingSocialProofProgress 5s linear forwards;
  will-change: transform;
}

@keyframes publicLandingSocialProofFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes publicLandingSocialProofProgress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.public-landing.template4,
.public-landing.template5 {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 0;
  color: #f8fafc;
  background:
    radial-gradient(circle at 50% -10%, rgba(37, 211, 102, 0.18), transparent 34%),
    linear-gradient(180deg, #070a0d 0%, #050608 100%);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.template4__phone,
.template5__phone {
  position: relative;
  width: min(100vw, 430px);
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 12%, rgba(229, 189, 66, 0.08), transparent 28%),
    linear-gradient(180deg, #120d09 0%, #080403 100%);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.58);
}

.template4__phone::before,
.template5__phone::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.17;
  background-image:
    radial-gradient(circle at 20px 20px, transparent 0 6px, rgba(148, 163, 184, 0.45) 7px, transparent 8px),
    radial-gradient(circle at 76px 58px, transparent 0 8px, rgba(148, 163, 184, 0.3) 9px, transparent 10px),
    linear-gradient(45deg, transparent 0 44%, rgba(148, 163, 184, 0.26) 45% 55%, transparent 56%),
    linear-gradient(135deg, transparent 0 44%, rgba(148, 163, 184, 0.22) 45% 55%, transparent 56%);
  background-size: 96px 96px, 120px 120px, 86px 86px, 132px 132px;
  background-position: 0 0, 18px 24px, 8px 18px, -16px 10px;
  pointer-events: none;
}

.template4__intro,
.template5__curtain {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  background: #071013;
  animation: publicLandingCurtain 2.2s ease forwards;
  pointer-events: none;
}

.template4__intro span,
.template5__curtain span {
  color: #7cf86e;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.template4__intro strong,
.template5__curtain strong {
  color: #fff;
  font-size: 28px;
  line-height: 1;
}

.template4__header,
.template5__topbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: calc(12px + env(safe-area-inset-top)) 16px 12px;
  background: rgba(8, 16, 20, 0.92);
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.template4__avatar,
.template5__avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #c2f970;
  background: linear-gradient(145deg, #102126, #1e3338);
  border: 1px solid rgba(124, 248, 110, 0.2);
  font-size: 13px;
  font-weight: 900;
}

.template4__name {
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.1;
}

.template4__status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  color: rgba(226, 232, 240, 0.72);
  font-size: 12px;
  font-weight: 600;
}

.template4__status span,
.template5__live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7cf86e;
  box-shadow: 0 0 0 4px rgba(124, 248, 110, 0.12);
}

.template4__time {
  margin-left: auto;
  color: rgba(226, 232, 240, 0.56);
  font-size: 11px;
  font-weight: 700;
}

.template4__thread {
  position: relative;
  z-index: 1;
  height: calc(100% - 222px);
  padding: 18px 14px 12px;
  overflow: hidden;
}

.template4__date {
  width: max-content;
  margin: 0 auto 16px;
  border-radius: 999px;
  padding: 6px 12px;
  color: rgba(226, 232, 240, 0.76);
  background: rgba(15, 23, 42, 0.62);
  font-size: 11px;
  font-weight: 800;
}

.template4__bubble {
  position: relative;
  width: fit-content;
  max-width: 83%;
  margin-bottom: 10px;
  border-radius: 16px;
  padding: 11px 12px 20px;
  color: #fff;
  font-size: 14px;
  line-height: 1.35;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.template4__bubble span {
  position: absolute;
  right: 11px;
  bottom: 5px;
  color: rgba(226, 232, 240, 0.56);
  font-size: 10px;
  font-weight: 700;
}

.template4__bubble--in {
  background: #202c31;
  border-top-left-radius: 5px;
}

.template4__bubble--out {
  margin-left: auto;
  background: #075e54;
  border-top-right-radius: 5px;
}

.template4__bubble ul {
  margin: 9px 0 0;
  padding-left: 18px;
}

.template4__bubble li + li {
  margin-top: 3px;
}

.template4__footer,
.template5__footer {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 16px max(16px, env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(7, 16, 19, 0), rgba(7, 16, 19, 0.96) 24%, #071013 100%);
}

.template4__footer p {
  margin-bottom: 9px;
  color: rgba(226, 232, 240, 0.7);
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.template4__cta,
.template5__cta {
  appearance: none;
  width: 100%;
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 999px;
  color: #04130a;
  background: #7cf86e;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 16px 34px rgba(124, 248, 110, 0.22);
}

.template4__cta b {
  font-size: 24px;
  line-height: 0.8;
}

.template5__cta {
  min-height: 58px;
  gap: 12px;
  border: 1px solid rgba(8, 112, 55, 0.46);
  font-size: 17px;
  font-weight: 950;
  letter-spacing: -0.02em;
  box-shadow:
    0 0 0 9px rgba(37, 211, 102, 0.13),
    0 14px 28px rgba(37, 211, 102, 0.2);
}

.template4__cta:disabled,
.template5__cta:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.template4__footer small,
.template5__footer small {
  display: block;
  margin-top: 9px;
  color: rgba(226, 232, 240, 0.55);
  font-size: 11px;
  line-height: 1.3;
  text-align: center;
}

.template5__topline {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: calc(16px + env(safe-area-inset-top)) 18px 0;
}

.template5__live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  color: #fff;
  background: #f51d38;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.08em;
}

.template5__live-badge time {
  color: #fff;
  font: 900 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.04em;
}

.template5__viewers {
  color: rgba(226, 232, 240, 0.82);
  font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: nowrap;
}

.template5__hero {
  position: relative;
  z-index: 1;
  padding: 18px 18px 14px;
}

.template5__hero h1 {
  color: #fff;
  font-size: clamp(36px, 11.5vw, 48px);
  line-height: 0.88;
  font-weight: 950;
  letter-spacing: -0.055em;
  text-transform: uppercase;
}

.template5__hero h1 span,
.template5__hero h1 b {
  display: block;
}

.template5__hero h1 b {
  color: #e5bd42;
}

.template5__hero p {
  max-width: 390px;
  margin-top: 11px;
  color: rgba(244, 244, 245, 0.78);
  font-size: 15.5px;
  font-weight: 850;
  line-height: 1.45;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.42);
}

.template5__advisor,
.template5__feed {
  position: relative;
  z-index: 1;
  margin: 0 18px;
  border: 1px solid rgba(229, 189, 66, 0.18);
  border-radius: 18px;
  background: rgba(22, 15, 9, 0.82);
  backdrop-filter: blur(8px);
}

.template5__advisor {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 15px;
}

.template5__avatar {
  width: 50px;
  height: 50px;
  color: rgba(226, 232, 240, 0.72);
  background:
    linear-gradient(145deg, rgba(15, 37, 39, 0.98), rgba(26, 49, 51, 0.98)),
    repeating-linear-gradient(135deg, transparent 0 7px, rgba(255, 255, 255, 0.05) 7px 9px);
  border-color: rgba(229, 189, 66, 0.18);
  font: 800 9px/1.05 ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: center;
}

.template5__avatar-wrap {
  position: relative;
  flex: 0 0 auto;
  width: 50px;
  height: 50px;
}

.template5__avatar-img,
.template5__avatar-placeholder {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(229, 189, 66, 0.18);
  border-radius: 999px;
  background: #050505;
  color: rgba(226, 232, 240, 0.72);
  font: 800 9px/1.05 ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: center;
}

.template5__avatar-img {
  object-fit: cover;
}

.template5__advisor-dot {
  position: absolute;
  right: -1px;
  bottom: 2px;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(22, 15, 9, 0.98);
  border-radius: 999px;
  background: #25d366;
  box-shadow: 0 0 0 4px rgba(37, 211, 102, 0.12);
}

.template5__advisor > div:nth-child(2) {
  min-width: 0;
  flex: 1 1 auto;
}

.template5__advisor > i {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #25d366;
  box-shadow: 0 0 0 6px rgba(37, 211, 102, 0.12);
}

.template5__advisor strong,
.template5__advisor span {
  display: block;
}

.template5__advisor strong {
  color: #fff;
  font-size: 15.5px;
  font-weight: 950;
}

.template5__advisor span {
  margin-top: 2px;
  color: #25d366;
  font-size: 12px;
  font-weight: 850;
}

.template5__progress {
  position: relative;
  z-index: 1;
  height: 7px;
  margin: 12px 18px 14px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
}

.template5__progress span {
  display: block;
  width: 68%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f3ce58, #ff2b44);
  box-shadow: 0 0 22px rgba(243, 206, 88, 0.26);
}

.template5__feed {
  overflow: hidden;
  padding: 0;
}

.template5__feed div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px 13px;
  border-bottom: 1px solid rgba(229, 189, 66, 0.13);
}

.template5__feed strong {
  color: #fff;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.18em;
}

.template5__feed p {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 14px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(229, 189, 66, 0.11);
  color: #f8fafc;
  font-size: 14px;
  line-height: 1.2;
}

.template5__feed p:last-child {
  border-bottom: 0;
}

.template5__feed p span,
.template5__feed p b,
.template5__feed p small {
  display: block;
}

.template5__feed p b {
  color: #f8fafc;
  font-size: 14.8px;
  font-weight: 950;
}

.template5__feed p small {
  margin-top: 2px;
  color: rgba(226, 232, 240, 0.62);
  font-size: 10px;
  font-weight: 700;
}

.template5__feed p > strong {
  color: #25d366;
  font: 950 15px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: nowrap;
}

.template5__feed-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 7px;
  border-radius: 999px;
  background: #25d366;
}

.template5__cta-icon {
  width: 25px;
  height: 25px;
}

@keyframes template5AmbientDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-18px, 14px, 0) scale(1.03);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes template5Pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 29, 56, 0.32);
  }
  50% {
    transform: scale(1.035);
    box-shadow: 0 0 0 9px rgba(245, 29, 56, 0);
  }
}

@keyframes template5DotBlink {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.38;
    transform: scale(0.86);
  }
}

@keyframes template5EnterUp {
  from {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes template5ProgressLoop {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0.03);
  }
}

@keyframes template5FeedPulse {
  0% {
    background: rgba(37, 211, 102, 0.12);
  }
  100% {
    background: transparent;
  }
}

.public-landing.template5 {
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% -18%, rgba(229, 189, 66, 0.18), transparent 32%),
    radial-gradient(circle at 92% 16%, rgba(245, 29, 56, 0.12), transparent 28%),
    #070403;
}

.public-landing.template5 ~ .public-privacy-footer {
  bottom: max(1px, calc(env(safe-area-inset-bottom) - 4px));
  z-index: 25;
}

.public-landing.template5 .template5__phone {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(circle at 82% 14%, rgba(245, 29, 56, 0.13), transparent 30%),
    radial-gradient(circle at 12% 8%, rgba(229, 189, 66, 0.13), transparent 34%),
    linear-gradient(180deg, #120806 0%, #070302 100%);
}

.public-landing.template5 .template5__phone::before {
  opacity: 0.08;
  background-image:
    linear-gradient(90deg, rgba(229, 189, 66, 0.14) 1px, transparent 1px),
    linear-gradient(rgba(229, 189, 66, 0.1) 1px, transparent 1px);
  background-size: 36px 36px;
  animation: template5AmbientDrift 16s ease-in-out infinite;
}

.public-landing.template5 .template5__phone::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: "";
  opacity: var(--template5-background-opacity, 0);
  background:
    linear-gradient(rgba(7, 3, 2, 0.58), rgba(7, 3, 2, 0.76)),
    var(--template5-background-image, none);
  background-position: center;
  background-size: cover;
}

.template5__ambient {
  position: absolute;
  inset: -28px;
  opacity: 0.23;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 20px 20px, transparent 0 11px, rgba(229, 189, 66, 0.8) 12px, transparent 14px),
    radial-gradient(circle at 118px 76px, transparent 0 14px, rgba(37, 211, 102, 0.44) 15px, transparent 17px),
    linear-gradient(45deg, transparent 0 43%, rgba(229, 189, 66, 0.58) 44% 56%, transparent 57%),
    linear-gradient(135deg, transparent 0 43%, rgba(245, 29, 56, 0.42) 44% 56%, transparent 57%);
  background-position: 0 0, 32px 18px, 9px 14px, -24px 10px;
  background-size: 118px 118px, 156px 156px, 92px 92px, 138px 138px;
  filter: drop-shadow(0 0 12px rgba(229, 189, 66, 0.14));
  animation: template5AmbientDrift 18s ease-in-out infinite;
}

.template5__scroll {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding-bottom: 104px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.template5__scroll::-webkit-scrollbar {
  display: none;
}

.public-landing.template5 .template5__curtain {
  background:
    radial-gradient(circle at 50% 34%, rgba(229, 189, 66, 0.18), transparent 24%),
    #080403;
  animation: publicLandingCurtain 1.85s ease forwards;
}

.public-landing.template5 .template5__topline,
.public-landing.template5 .template5__hero,
.public-landing.template5 .template5__advisor,
.public-landing.template5 .template5__progress,
.public-landing.template5 .template5__feed,
.public-landing.template5 .template5__activity {
  opacity: 0;
  animation: template5EnterUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.public-landing.template5 .template5__topline {
  padding-top: calc(12px + env(safe-area-inset-top));
  animation-delay: 0.2s;
}

.public-landing.template5 .template5__hero {
  padding-top: 14px;
  animation-delay: 0.42s;
}

.public-landing.template5 .template5__advisor {
  animation-delay: 0.66s;
}

.public-landing.template5 .template5__progress {
  animation-delay: 0.82s;
}

.public-landing.template5 .template5__feed {
  animation-delay: 1s;
}

.public-landing.template5 .template5__activity {
  animation-delay: 1.14s;
}

.public-landing.template5 .template5__live-dot {
  background: #ffffff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.82);
  animation: template5DotBlink 1.35s ease-in-out infinite;
}

.public-landing.template5 .template5__advisor-dot,
.public-landing.template5 .template5__feed-dot {
  background: #25d366;
  box-shadow: 0 0 12px rgba(37, 211, 102, 0.8);
  animation: template5DotBlink 1.35s ease-in-out infinite;
}

.public-landing.template5 .template5__hero h1 {
  text-shadow:
    0 2px 0 rgba(0, 0, 0, 0.95),
    0 16px 30px rgba(0, 0, 0, 0.42);
}

.public-landing.template5 .template5__advisor,
.public-landing.template5 .template5__feed,
.template5__activity article {
  background: rgba(0, 0, 0, 0.88);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 18px 40px rgba(0, 0, 0, 0.28);
}

.public-landing.template5 .template5__progress {
  height: 7px;
  background: rgba(245, 29, 56, 0.22);
}

.public-landing.template5 .template5__progress span {
  width: 100%;
  transform-origin: left center;
  animation: template5ProgressLoop 5.2s linear infinite;
}

.template5__feed-row--pulse {
  animation: template5FeedPulse 0.9s ease-out;
}

.template5__activity {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 10px 18px 0;
}

.template5__activity article {
  border: 1px solid rgba(229, 189, 66, 0.14);
  border-radius: 16px;
  padding: 10px 11px;
}

.template5__activity span,
.template5__activity strong {
  display: block;
}

.template5__activity span {
  color: rgba(226, 232, 240, 0.66);
  font-size: 9.5px;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.template5__activity strong {
  margin-top: 4px;
  color: #e5bd42;
  font-size: 13px;
  font-weight: 950;
}

.public-landing.template5 .template5__footer {
  bottom: max(58px, calc(env(safe-area-inset-bottom) + 46px));
  padding-top: 22px;
  padding-bottom: 12px;
  background: transparent;
}

.public-landing.template5 .template5__cta {
  color: #ffffff;
  background: linear-gradient(180deg, #2af071 0%, #10c858 100%);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.24);
  transform: translateZ(0);
  animation: template5Pulse 2.3s ease-in-out infinite;
}

@media (max-height: 700px) {
  .public-landing.template5 .template5__topline {
    padding-top: calc(8px + env(safe-area-inset-top));
  }

  .public-landing.template5 .template5__hero {
    padding-top: 10px;
  }

  .template5__hero {
    padding-bottom: 10px;
  }

  .template5__hero h1 {
    font-size: clamp(32px, 9.6vw, 40px);
  }

  .template5__hero p {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.34;
  }

  .template5__advisor {
    padding: 10px 12px;
  }

  .template5__avatar,
  .template5__avatar-wrap,
  .template5__avatar-img,
  .template5__avatar-placeholder {
    width: 44px;
    height: 44px;
  }

  .template5__advisor strong {
    font-size: 14px;
  }

  .template5__advisor span {
    font-size: 11px;
  }

  .template5__progress {
    margin-top: 9px;
    margin-bottom: 11px;
  }

  .template5__feed div {
    padding: 8px 12px;
  }

  .template5__feed p {
    padding: 7px 0;
  }

  .template5__feed p b,
  .template5__feed p > strong {
    font-size: 13px;
  }

  .template5__activity {
    margin-top: 8px;
  }

  .template5__activity article {
    padding: 8px 10px;
  }

  .public-landing.template5 .template5__footer {
    bottom: max(46px, calc(env(safe-area-inset-bottom) + 34px));
    padding-top: 18px;
    padding-bottom: 10px;
  }

  .public-landing.template5 .template5__cta {
    min-height: 54px;
    font-size: 16px;
  }
}

.public-landing.template4 {
  background: #0f191b;
  font-family: Manrope, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.public-landing.template4 ~ .public-privacy-footer {
  bottom: max(1px, calc(env(safe-area-inset-bottom) - 4px));
}

.public-landing.template4 .template4__phone {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  margin-bottom: 0;
  background:
    radial-gradient(circle at 18% 4%, rgba(229, 189, 66, 0.13), transparent 30%),
    linear-gradient(180deg, #143032 0%, #0b1b1d 100%);
}

.public-landing.template4 .template4__phone::before {
  display: block;
  opacity: var(--template4-chat-background-opacity, 0.22);
  background-image:
    var(--template4-chat-background-overlay, none),
    var(--template4-chat-background-image, url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke='%236ee7b7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' opacity='.72'%3E%3Ccircle cx='24' cy='24' r='16'/%3E%3Ccircle cx='24' cy='24' r='8'/%3E%3Cpath d='M24 8v7M24 33v7M8 24h7M33 24h7M14 14l5 5M34 14l-5 5M14 34l5-5M34 34l-5-5'/%3E%3Crect x='60' y='10' width='34' height='46' rx='5' transform='rotate(-10 77 33)'/%3E%3Cpath d='M77 22c-6 8-13 16 0 23 13-7 6-15 0-23zM72 45h10'/%3E%3Crect x='122' y='14' width='38' height='31' rx='5'/%3E%3Cpath d='M131 24h20M131 35h20M129 30h.5M153 30h.5'/%3E%3Cpath d='M28 76c8-11 20-1 10 10 10-11 22-1 10 10-8 8-20 4-20-4 0 8-12 12-20 4-12-11 0-21 10-10-10-11 2-21 10-10zM28 96v12'/%3E%3Cpath d='M82 72l16 16-16 16-16-16zM82 80v16M74 88h16'/%3E%3Crect x='124' y='70' width='34' height='34' rx='7'/%3E%3Ccircle cx='134' cy='80' r='1.5'/%3E%3Ccircle cx='148' cy='80' r='1.5'/%3E%3Ccircle cx='141' cy='87' r='1.5'/%3E%3Ccircle cx='134' cy='94' r='1.5'/%3E%3Ccircle cx='148' cy='94' r='1.5'/%3E%3Cpath d='M25 124c-8 10-16 18 0 28 16-10 8-18 0-28zM18 152h14'/%3E%3Crect x='62' y='122' width='48' height='30' rx='6'/%3E%3Cpath d='M73 132l6 10 6-10M92 132l6 10 6-10'/%3E%3Cpath d='M130 130c0-9 8-16 17-16s17 7 17 16-8 16-17 16-17-7-17-16zM139 128l8-8 8 8M139 136l8 8 8-8'/%3E%3C/g%3E%3Cg fill='%23e5bd42' opacity='.58'%3E%3Ccircle cx='48' cy='54' r='2'/%3E%3Ccircle cx='112' cy='58' r='2'/%3E%3Ccircle cx='164' cy='60' r='2'/%3E%3Ccircle cx='52' cy='112' r='2'/%3E%3Ccircle cx='112' cy='112' r='2'/%3E%3Ccircle cx='166' cy='162' r='2'/%3E%3Cpath d='M48 150l3 6 6 3-6 3-3 6-3-6-6-3 6-3zM114 20l2 4 4 2-4 2-2 4-2-4-4-2 4-2z'/%3E%3C/g%3E%3C/svg%3E"));
  background-size: var(--template4-chat-background-size, 180px 180px);
  background-position: var(--template4-chat-background-position, -18px 2px);
}

.public-landing.template4 .template4__intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: #11191b;
  animation: publicLandingTemplate4Intro 2.15s ease forwards;
}

.public-landing.template4 .template4__spinner {
  position: relative;
  width: 100px;
  height: 100px;
  display: grid;
  place-items: center;
}

.public-landing.template4 .template4__spinner::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 2px solid rgba(37, 211, 102, 0.18);
  border-top-color: #25d366;
  border-radius: 999px;
  animation: publicLandingTemplate4Ring 1.1s linear infinite;
}

.public-landing.template4 .template4__photo {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  color: rgba(203, 213, 225, 0.74);
  background: #050608;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font: 700 8px/1.25 "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: center;
  text-transform: lowercase;
  object-fit: cover;
}

.public-landing.template4 .template4__photo--large {
  width: 74px;
  height: 74px;
  font-size: 9px;
}

.public-landing.template4 .template4__intro-copy {
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-width: 330px;
  padding: 0 28px;
  text-align: center;
}

.public-landing.template4 .template4__intro-copy span {
  color: #25d366;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.public-landing.template4 .template4__intro-copy strong {
  color: #f8fafc;
  font-size: 24px;
  line-height: 1.08;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.public-landing.template4 .template4__intro-copy p {
  color: rgba(203, 213, 225, 0.76);
  font-size: 13.5px;
  line-height: 1.35;
}

.public-landing.template4 .template4__header {
  flex: 0 0 auto;
  min-height: 66px;
  padding: calc(10px + env(safe-area-inset-top)) 16px 10px;
  background: #102326;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.public-landing.template4 .template4__avatar-wrap {
  position: relative;
  flex: 0 0 auto;
}

.public-landing.template4 .template4__online-dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 12px;
  height: 12px;
  border: 2px solid #102326;
  border-radius: 999px;
  background: #25d366;
  animation: publicLandingTemplate4Blink 1.45s ease-in-out infinite;
}

.public-landing.template4 .template4__who {
  min-width: 0;
  flex: 1 1 auto;
}

.public-landing.template4 .template4__who b {
  display: block;
  overflow: hidden;
  color: #f8fafc;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.public-landing.template4 .template4__who span {
  display: block;
  margin-top: 3px;
  color: #25d366;
  font-size: 12.5px;
  line-height: 1.2;
  font-weight: 700;
}

.public-landing.template4 .template4__time {
  color: rgba(203, 213, 225, 0.68);
  font: 700 11px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: right;
}

.public-landing.template4 .template4__time i {
  color: #e5bd42;
  font-style: normal;
}

.public-landing.template4 .template4__thread {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  height: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: clamp(26px, 8vh, 78px) 16px 6px;
}

.public-landing.template4 .template4__stack {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 0;
  margin-bottom: auto;
}

.public-landing.template4 .template4__live-pill {
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 13px;
  border: 1px solid rgba(37, 211, 102, 0.3);
  border-radius: 999px;
  color: #eef7f1;
  background: rgba(37, 211, 102, 0.11);
  font-size: 12.5px;
  line-height: 1.1;
  font-weight: 700;
}

.public-landing.template4 .template4__live-pill i,
.public-landing.template4 .template4__cta-sub i {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #25d366;
  animation: publicLandingTemplate4Blink 1.45s ease-in-out infinite;
}

.public-landing.template4 .template4__live-pill b {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.public-landing.template4 .template4__bubble {
  max-width: 82%;
  margin: 0;
  border-radius: 14px 14px 14px 4px;
  padding: 8px 13px 18px;
  background: #223237;
  color: #ffffff;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.34);
  animation: publicLandingTemplate4Rise 0.38s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.public-landing.template4 .template4__bubble--delay-1 {
  animation-delay: 2.2s;
}

.public-landing.template4 .template4__bubble--delay-2 {
  animation-delay: 3.7s;
}

.public-landing.template4 .template4__bubble--delay-3 {
  animation-delay: 5.2s;
}

.public-landing.template4 .template4__bubble p {
  margin: 0;
  color: #ffffff;
  font-size: 15.5px;
  font-weight: 650;
  line-height: 1.38;
}

.public-landing.template4 .template4__bubble ul {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.public-landing.template4 .template4__bubble li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #f8fafc;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.34;
}

.public-landing.template4 .template4__bubble li::before {
  content: "";
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  margin-top: 5px;
  border-radius: 2px;
  background: #e5bd42;
  transform: rotate(45deg);
}

.public-landing.template4 .template4__bubble span {
  position: absolute;
  right: 11px;
  bottom: 4px;
  color: rgba(226, 232, 240, 0.82);
  font: 700 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
}

.public-landing.template4 .template4__footer {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  padding: 9px 14px max(68px, calc(env(safe-area-inset-bottom) + 58px));
  background: #102326;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
}

.public-landing.template4 .template4__cta {
  justify-content: center;
  gap: 10px;
  min-height: 54px;
  padding: 8px 18px;
  color: #ffffff;
  background: #25d366;
  border: 1px solid rgba(8, 112, 55, 0.64);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 0 0 0 rgba(37, 211, 102, 0.5),
    0 10px 22px rgba(0, 0, 0, 0.18);
  animation: publicLandingTemplate4Pulse 2.4s ease-out infinite;
}

.public-landing.template4 .template4__cta span {
  color: inherit;
  font-size: 17px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.public-landing.template4 .template4__cta-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  color: inherit;
}

.public-landing.template4 .template4__cta-sub {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 8px;
  color: rgba(203, 213, 225, 0.76);
  font-size: 12.5px;
  line-height: 1.2;
}

.public-landing.template4 .template4__footer small {
  margin-top: 8px;
  color: rgba(203, 213, 225, 0.48);
  font: 600 9.5px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
}

@keyframes publicLandingTemplate4Intro {
  0%,
  74% {
    opacity: 1;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes publicLandingTemplate4Ring {
  to {
    transform: rotate(360deg);
  }
}

@keyframes publicLandingTemplate4Blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.25;
  }
}

@keyframes publicLandingTemplate4Rise {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes publicLandingTemplate4Pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
  }
}

@keyframes publicLandingCurtain {
  0%,
  72% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-12px);
    visibility: hidden;
  }
}

@keyframes publicLandingTyping {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.public-landing.lp .features {
  width: 85%;
  max-width: 365px;
  margin-top: 8px;
  text-align: center;
  color: #f4f4f4;
  font-size: 12px;
  line-height: 1.05;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

.public-landing.lp .features p + p {
  margin-top: 1px;
}

.public-landing.template3 {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 12px;
  color: #10213a;
  text-align: center;
  background: #f2f4f5;
}

.public-landing.template3 .template3__card {
  width: min(100%, 384px);
  min-height: 396px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 31px 32px 26px;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 8px 18px rgba(16, 33, 58, 0.13);
}

.public-landing.template3 .template3__whatsapp {
  width: 82px;
  height: 82px;
  flex: none;
  color: #00cf70;
  filter: drop-shadow(0 3px 2px rgba(0, 207, 112, 0.18));
}

.public-landing.template3 .template3__title {
  margin: 20px 0 6px;
  color: #10213a;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.public-landing.template3 .template3__copy {
  margin: 0;
  color: #586577;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
}

.public-landing.template3 .template3__spinner {
  width: 48px;
  height: 48px;
  margin-top: 23px;
  border: 4px solid #eef0f0;
  border-top-color: #00cf70;
  border-right-color: #00cf70;
  border-radius: 50%;
  animation: publicLandingTemplate3Spin 850ms linear infinite;
}

.public-landing.template3 .template3__fallback {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 31px;
  padding-top: 16px;
  border-top: 1px solid #dde1e4;
  color: #8a94a3;
  font-size: 12px;
  line-height: 1.35;
}

.public-landing.template3 .template3__retry {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  color: #00ba66;
  background: transparent;
  font: inherit;
  font-weight: 700;
  line-height: inherit;
  cursor: pointer;
}

.public-landing.template3 .template3__retry:hover {
  color: #009f57;
  text-decoration: underline;
}

.public-landing.template3 .template3__retry:focus-visible {
  outline: 2px solid #00ba66;
  outline-offset: 3px;
  border-radius: 2px;
}

.public-landing.template3 .template3__retry:disabled {
  cursor: wait;
  opacity: 0.65;
}

@keyframes publicLandingTemplate3Spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .public-landing .whatsapp-button,
  .public-landing .whatsapp-button::before,
  .public-landing.lp .cta,
  .public-landing.lp .cta::after,
  .public-landing.lp .social-proof__quote,
  .public-landing.lp .social-proof__progress,
  .template4__intro,
  .template5__curtain,
  .public-landing.template3 .template3__spinner {
    animation: none !important;
  }

  .template4__intro,
  .template5__curtain {
    opacity: 0;
    visibility: hidden;
  }

  .public-landing .whatsapp-button,
  .public-landing.lp .cta {
    transition: none;
  }

  .public-landing.lp .cta:hover {
    transform: none;
  }
}

@media (max-width: 640px) {
  .public-landing .logo {
    width: 170px;
    height: 130px;
  }

  .public-landing .subtitle {
    margin-top: 30px;
  }

  .public-landing .description {
    margin-bottom: 32px;
  }
}

@media (max-height: 720px) {
  .public-landing.template4 .template4__header {
    min-height: 60px;
    padding: calc(8px + env(safe-area-inset-top)) 14px 8px;
  }

  .public-landing.template4 .template4__thread {
    padding-top: clamp(16px, 4vh, 34px);
  }

  .public-landing.template4 .template4__bubble {
    padding: 6px 11px 16px;
  }

  .public-landing.template4 .template4__bubble p {
    font-size: 13px;
  }

  .public-landing.template4 .template4__bubble li {
    font-size: 12px;
  }

  .public-landing.template4 .template4__cta {
    min-height: 50px;
  }

  .public-landing.template4 .template4__footer {
    padding-top: 7px;
    padding-bottom: max(58px, calc(env(safe-area-inset-bottom) + 52px));
  }
}

@media (max-width: 390px) {
  .public-landing .container.background-image.template1-bottom-layout,
  .public-landing.lp .artboard {
    --cta-thumb-frame-height: 72svh;
  }

  .public-landing .template1-bottom-cta-slot {
    padding: 0 12px;
  }

  .public-landing.lp .artboard {
    padding: 0 12px calc(42px + env(safe-area-inset-bottom));
  }

  .public-landing.lp .frame {
    min-height: 0;
  }

  .public-landing.lp .frame__bg,
  .public-landing.lp .frame::after {
    border-radius: 23px;
  }

  .public-landing.lp .frame__logo {
    width: 56%;
    top: 8%;
  }

  .public-landing.lp .frame__copy {
    bottom: 22px;
  }

  .public-landing.lp .eyebrow {
    font-size: 18px;
  }

  .public-landing.lp .frame__copy .title {
    font-size: 20px;
  }

  .public-landing.lp .cta {
    width: 80%;
    min-height: 38px;
    border-radius: 14px;
    padding: 6px 11px;
    gap: 8px;
  }

  .public-landing.lp .cta__icon {
    width: 24px;
    height: 24px;
  }

  .public-landing.lp .social-proof {
    width: 80%;
    margin-top: 14px;
    padding: 7px 9px;
    border-radius: 11px;
  }

  .public-landing.lp .social-proof__quote {
    font-size: 12px;
  }

  .public-landing.lp .social-proof__meta {
    font-size: 11px;
  }

  .public-landing.lp .features {
    font-size: 11px;
  }
}

@media (max-height: 720px) {
  .public-landing.lp .artboard {
    --cta-thumb-frame-height: 69svh;
  }

  .public-landing.lp .social-proof {
    margin-top: 10px;
    padding: 6px 9px;
  }

  .public-landing.lp .social-proof__quote {
    font-size: 11px;
    line-height: 1.16;
  }

  .public-landing.lp .social-proof__progress {
    margin-top: 6px;
  }

  .public-landing.lp .features {
    margin-top: 6px;
    line-height: 1.02;
  }
}

.public-landing .inline-email-capture {
  width: min(85vw, 340px);
  max-width: 100%;
  margin: 6px auto 0;
  text-align: center;
  flex: 0 0 auto;
}
.public-landing .inline-email-capture__field {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 4px;
  border: 1px solid rgba(241, 205, 108, 0.72);
  border-radius: 10px;
  background: rgba(23, 24, 18, 0.96);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09);
}
.public-landing .inline-email-capture__field:focus-within {
  border-color: #25D366;
  box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.18);
}
.public-landing .inline-email-capture__icon {
  width: 13px;
  height: 13px;
  flex: 0 0 13px;
  fill: none;
  stroke: #F1CD6C;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.public-landing .inline-email-capture input {
  width: 20.5em;
  max-width: calc(100% - 17px);
  min-width: 0;
  flex: 0 1 auto;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font: 500 16px/1.2 system-ui, sans-serif;
  text-align: center;
  outline: none;
}
.public-landing .inline-email-capture input::placeholder {
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(10px, 2.8vw, 13px);
  font-style: normal;
}
.public-landing .inline-email-capture small {
  display: block;
  min-height: 14px;
  color: #ffb4b4;
  font-size: 10px;
  line-height: 14px;
}
.public-landing .has-inline-email .whatsapp-button,
.public-landing .has-inline-email .cta { margin-top: 2px; }
.public-landing .container.background-image.has-inline-email .inline-email-capture,
.public-landing .container.background-image.has-inline-email .whatsapp-button {
  width: min(80vw, 320px);
}
.public-landing .template1-bottom-cta-slot { flex-direction: column; align-items: center; }
.public-landing .container.background-image.has-inline-email { min-height: 100svh; height: 100svh; }
.public-landing .container.background-image.has-inline-email .content { padding-top: 8px; padding-bottom: 8px; }
.public-landing .container.background-image.has-inline-email .logo { width: min(35vw, 150px); height: min(16svh, 110px); margin-bottom: 4px; }
.public-landing .container.background-image.has-inline-email .title { margin: 4px 0 6px; }
.public-landing .container.background-image.has-inline-email .subtitle { margin-top: 10px; }
.public-landing .container.background-image.has-inline-email .description { margin: 10px 0 8px; }
.public-landing .container.background-image.has-inline-email.template1-bottom-layout { --cta-thumb-frame-height: 63svh; }
.public-landing.lp .artboard.has-inline-email .frame { flex-shrink: 0; }
.public-landing.lp .artboard.has-inline-email .inline-email-capture { width: 80%; }
.public-landing.lp .artboard.has-inline-email .social-proof { margin-top: 8px; padding-top: 4px; padding-bottom: 4px; }
.public-landing.lp .artboard.has-inline-email .social-proof__progress { margin-top: 4px; }
@media (max-height: 720px) {
  .public-landing .container.background-image.has-inline-email.template1-bottom-layout { --cta-thumb-frame-height: 55svh; }
  .public-landing .container.background-image.has-inline-email .subtitle { margin-top: 5px; }
  .public-landing .container.background-image.has-inline-email .description { margin: 5px 0; }
}
@media (max-height: 780px), (min-width: 391px) and (max-height: 900px) {
  .public-landing.lp .artboard.has-inline-email { position: relative; }
  .public-landing.lp .artboard.has-inline-email .social-proof {
    position: absolute;
    top: 31svh;
    left: 50%;
    margin: 0;
    transform: translateX(-50%);
  }
}

@media (max-width: 420px) {
  .public-landing.template3 .template3__card {
    min-height: 0;
    padding-inline: 24px;
  }
}

@media (min-width: 431px) {
  .public-landing .container.background-image.template1-bottom-layout,
  .public-landing.lp .artboard {
    --cta-thumb-frame-height: 74vh;
  }

  .public-landing.lp .artboard {
    width: 430px;
  }

  .public-landing .template1-bottom-cta-slot {
    width: 430px;
  }
}

@media (min-width: 768px) {
  .public-landing .container.background-image.template1-bottom-layout,
  .public-landing.lp .artboard {
    --cta-thumb-frame-height: min(74vh, 840px);
  }

  .public-landing.lp .artboard {
    padding-bottom: calc(56px + env(safe-area-inset-bottom));
  }

  .public-landing.lp .frame {
    max-height: 840px;
  }

  .public-landing.lp .frame__copy .title {
    font-size: 25px;
  }
}

.public-landing.template6 {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100svh;
  background: radial-gradient(circle at 50% -10%, rgba(37, 211, 102, .15), transparent 38%), #080d11;
}

.template6__background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.template6__background img { width: 100%; height: 100%; object-fit: cover; }

.template6__background::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5, 9, 13, .68), rgba(5, 9, 13, .76));
}

.template6__shell {
  position: relative;
  z-index: 1;
  width: min(100%, 430px);
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 auto;
  padding: max(22px, env(safe-area-inset-top)) 14px calc(62px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  background: rgba(5, 9, 13, .48);
}

.template6.has-background .template6__shell { background: rgba(5, 9, 13, .16); }

.template6__header {
  padding: 5px 8px 20px;
  text-align: center;
}

.template6__header h1 {
  color: var(--template6-title, #fff);
  font-size: clamp(20px, 6vw, 28px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -.025em;
}

.template6__header span,
.template6__footer span { display: block; }

.template6__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: center;
  gap: 12px;
}

.template6__card {
  min-width: 0;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 16px;
  background: rgba(255, 255, 255, .045);
  box-shadow: 0 10px 26px rgba(0, 0, 0, .18);
}

.template6__image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: linear-gradient(140deg, #24302e, #11191a 68%, #09100e);
  color: rgba(255, 255, 255, .42);
  font-size: 12px;
}

.template6__image img { width: 100%; height: 100%; object-fit: cover; }

.template6__caption {
  min-height: 38px;
  margin: 7px 2px 4px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--template6-caption, #fff);
  text-align: center;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.4;
}

.template6__cta {
  width: 100%;
  min-height: 40px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 0;
  border-radius: 9px;
  background: var(--template6-cta-background, #ffd700);
  color: var(--template6-cta-text, #000);
  box-shadow: 0 3px 12px color-mix(in srgb, var(--template6-cta-glow, #ffd700) 30%, transparent);
  font-size: var(--template6-cta-size, 14px);
  font-weight: var(--template6-cta-weight, 700);
  line-height: 1.15;
  cursor: pointer;
}

.template6__cta span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.template6__cta-icon { width: 19px; height: 19px; flex: none; }
.template6__cta:disabled { cursor: wait; opacity: .72; }
.template6__cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

.template6__footer {
  margin-top: auto;
  padding: 20px 10px 8px;
  color: var(--template6-footer, #ffd700);
  text-align: center;
  font-size: 12px;
  line-height: 1.35;
}

@media (max-width: 359px) {
  .template6__shell { padding-inline: 9px; }
  .template6__grid { gap: 8px; }
  .template6__card { padding: 5px; }
  .template6__caption { font-size: 11px; }
  .template6__cta { font-size: min(var(--template6-cta-size, 14px), 12px); }
}
.public-landing.template7 {
  --template7-top-space: clamp(12px, 3svh, 42px);
  --template7-bottom-space: max(48px, calc(env(safe-area-inset-bottom) + 38px));
  position: relative;
  display: grid;
  height: 100svh;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  padding: var(--template7-top-space) 18px var(--template7-bottom-space);
  background: #080807;
  font-family: Arial, Helvetica, sans-serif;
}
.template7__background-image,
.template7__veil { position: absolute; inset: 0; width: 100%; height: 100%; }
.template7__background-image { object-fit: cover; z-index: -2; }
.template7__veil { z-index: -1; background: linear-gradient(180deg, rgba(0,0,0,.28), rgba(0,0,0,.42)), radial-gradient(circle at 50% 30%, rgba(255,215,0,.12), transparent 70%); }
.template7__card {
  width: min(100%, 490px);
  max-height: calc(100svh - var(--template7-top-space) - var(--template7-bottom-space));
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: clamp(18px, 3svh, 44px) clamp(18px, 5vw, 42px);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 28px;
  background: rgba(10,10,10,.64);
  box-shadow: 0 26px 80px rgba(0,0,0,.55), inset 0 1px rgba(255,255,255,.08);
  backdrop-filter: blur(8px);
  text-align: center;
}
.template7__logo { display: block; width: auto; max-width: min(50%, 170px); max-height: clamp(58px, 13svh, 138px); margin: 0 auto clamp(9px, 2svh, 24px); object-fit: contain; }
.template7__title { margin: 0; font-size: min(var(--template7-title-size, 26px), clamp(20px, 4svh, 32px)); line-height: 1.14; overflow-wrap: anywhere; text-wrap: balance; }
.template7__subtitle { margin: clamp(8px, 1.8svh, 16px) 0 0; font-size: min(var(--template7-subtitle-size, 16px), clamp(14px, 2.7svh, 22px)); line-height: 1.35; overflow-wrap: anywhere; }
.template7__form { display: grid; gap: clamp(8px, 1.8svh, 14px); margin-top: clamp(12px, 3svh, 32px); text-align: left; }
.template7__label { color: #f3f3f3; font-size: 14px; font-weight: 600; }
.template7__label span { color: #bdbdbd; font-weight: 400; }
.template7__input { box-sizing: border-box; width: 100%; min-height: clamp(44px, 7.8svh, 58px); padding: 0 18px; border: 1px solid rgba(255,255,255,.26); border-radius: 14px; outline: none; background: rgba(0,0,0,.5); color: #fff; font: inherit; font-size: 18px; }
.template7__input::placeholder { color: #a9a9a9; }
.template7__input:focus { border-color: #ffd700; box-shadow: 0 0 0 3px rgba(255,215,0,.18); }
.template7__cta { width: 100%; min-height: clamp(46px, 8svh, 60px); padding: 10px 18px; border: 0; border-radius: 14px; box-shadow: 0 10px 28px rgba(0,0,0,.3); cursor: pointer; font-size: min(var(--template7-cta-size, 18px), clamp(14px, 2.7svh, 20px)); line-height: 1.2; overflow-wrap: anywhere; transition: transform .15s ease, opacity .15s ease; }
.template7__cta:not(:disabled):hover { transform: translateY(-2px); }
.template7__cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.template7__cta:disabled { cursor: not-allowed; opacity: .52; box-shadow: none; }
.template7__error { margin: 0; color: #ffd2d2; font-size: 13px; line-height: 1.4; text-align: center; }
.template7__error[hidden] { display: none; }
.template7__phone-warning { margin: -3px 0 0; color: #ffe49a; font-size: 12px; line-height: 1.35; }
.template7__phone-warning[hidden] { display: none; }
.template7__handoff-panel { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; background: rgba(0,0,0,.8); }
.template7__handoff-card { width: min(100%, 420px); display: grid; gap: 14px; padding: 28px; border: 1px solid rgba(255,215,0,.35); border-radius: 22px; background: #17121f; color: #fff; text-align: center; box-shadow: 0 20px 70px rgba(0,0,0,.6); }
.template7__handoff-card h2 { margin: 0; font-size: 24px; }
.template7__handoff-card p { margin: 0; line-height: 1.5; }
.template7__handoff-card a, .template7__handoff-card button { display: block; min-height: 48px; padding: 12px; border: 0; border-radius: 12px; font: 700 15px/1.3 system-ui,sans-serif; text-decoration: none; cursor: pointer; }
.template7__handoff-card a { color: #111; background: #ffd700; }
.template7__handoff-card button { color: #fff; background: #363042; }
.template7__handoff-card small { color: #c2bbc9; line-height: 1.4; }
@media (max-width: 480px) { .public-landing.template7 { padding-inline: 16px; } .template7__card { border-radius: 22px; } }
@media (max-height: 480px) { .public-landing.template7 { height: auto; min-height: 100svh; overflow: visible; } .template7__card { max-height: none; } }
.public-landing.template7:focus-within { height: auto; min-height: 100svh; overflow: visible; }
.public-landing.template7:focus-within .template7__card { max-height: none; }
`;
var TEMPLATE7_CRITICAL_CSS = PUBLIC_LANDING_CSS.slice(0, PUBLIC_LANDING_CSS.indexOf("body.public-lead-capture-open")) + PUBLIC_LANDING_CSS.slice(PUBLIC_LANDING_CSS.indexOf(".public-landing.template7 {"));
var TEMPLATE8_CRITICAL_CSS = TEMPLATE7_CRITICAL_CSS + PUBLIC_LANDING_CSS.slice(PUBLIC_LANDING_CSS.indexOf(".public-landing.template6 {"), PUBLIC_LANDING_CSS.indexOf(".public-landing.template7 {")) + `
[data-template8-grid][hidden],[data-template8-entry][hidden]{display:none!important}
.template8 .template6__card:last-child:nth-child(odd){grid-column:1 / -1;width:calc((100% - var(--template8-gap,12px))/2);justify-self:center}
.template8 .template6__shell{height:100svh;min-height:100svh;padding-top:12px;padding-bottom:60px}
.template8 .template6__header{padding:6px 8px 10px}.template8 .template6__footer{padding:10px 6px 0}
.template8 .template6__image{height:clamp(36px,calc((100svh - 200px - var(--template8-extra-copy,0px))/var(--template8-rows,2) - 84px),180px);aspect-ratio:auto}
.template8 .template6__caption{min-height:30px;font-size:11px;line-height:1.3;margin:5px 2px}
.template8 .template6__cta{min-height:36px}.template8 .template6__grid{align-content:start}
@media(max-width:359px){.template8{--template8-gap:8px}}
.template8__back{position:fixed;top:12px;left:12px;z-index:5;border:1px solid #ffffff40;border-radius:10px;background:#111;color:white;padding:10px 14px;font:inherit;cursor:pointer}
.template8__status:empty{display:none}.template8__status{color:#ffd2d2;text-align:center;font:14px system-ui}
`;

// lib/gateway-entry-transition.ts
var brands = {
  rey_de_ases: { name: "Rey de Ases", logo: "/rey-de-ases-logo-transparent.optimized.avif", background: "#141414", glow: "#dba92755" },
  ases_del_norte: { name: "Ases del Norte", logo: "/ases-del-norte-transition-logo.optimized.avif", background: "#071b2c", glow: "#06131dbb" },
  ganamos_net: { name: "Ganamos NET", logo: "/ganamos-net-transition-logo.webp", background: "#11001f", glow: "#8d2db855" },
  multi_skin: { name: "Ganamos+", logo: "/ganamos-plus-logo-transparent.optimized.avif", background: "#121212", glow: "#9d20d966" }
};
function escape(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function renderGatewayEntryTransition(provider, options = {}) {
  const base = brands[provider];
  if (!base) return "";
  const brand = { ...base, ...options.brand };
  const accent = options.brand?.accent || "#f6c84b", accentText = options.brand?.accentText || "#171105";
  let origin = "";
  if (options.gatewayOrigin) {
    try {
      const url = new URL(options.gatewayOrigin);
      if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return "";
      origin = url.origin;
    } catch {
      return "";
    }
  }
  const logo = origin + brand.logo, stage = options.stage || "connecting";
  const image = `<img data-entry-logo data-src="${escape(logo.replace(/\.avif$/, ".webp"))}" alt="${escape(brand.name)}" width="320" height="320">`;
  return `<style id="gateway-entry-transition-style">
html:has(#gateway-entry-transition:not([hidden])),body:has(#gateway-entry-transition:not([hidden])){background-color:var(--gateway-entry-canvas,${brand.background})!important;color-scheme:dark}
#gateway-entry-transition[data-stage="creating"],#gateway-entry-transition[data-stage="preparing"]{background:var(--entry-background,${brand.background})!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
#gateway-entry-transition{position:fixed!important;inset:0!important;z-index:2147483500!important;display:grid!important;place-items:center!important;margin:0!important;padding:max(24px,env(safe-area-inset-top)) 16px max(24px,env(safe-area-inset-bottom))!important;background:${brand.background}f5!important;background:color-mix(in srgb,var(--entry-background,${brand.background}) 96%,transparent)!important;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);color:#fff!important;font:16px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;text-align:center!important;overflow:auto!important;overscroll-behavior:contain}
#gateway-entry-transition{outline:none}#gateway-entry-transition[hidden]{display:none!important}#gateway-entry-transition *{box-sizing:border-box}#gateway-entry-transition .entry-content{width:min(100%,430px);margin:auto}#gateway-entry-transition picture{display:block}#gateway-entry-transition [data-entry-logo]{display:block;width:min(78vw,320px);height:auto;max-height:34svh;object-fit:contain;margin:0 auto;filter:drop-shadow(0 8px 24px var(--entry-glow,${brand.glow}))}#gateway-entry-transition h2{font:700 clamp(17px,4.8vw,24px)/1.2 system-ui;margin:20px 0 9px;color:var(--entry-accent,#f6c84b);text-wrap:balance}#gateway-entry-transition p{font:400 clamp(12px,3.1vw,15px)/1.45 system-ui;max-width:36ch;margin:0 auto;color:#ddd;text-wrap:balance}#gateway-entry-transition .entry-spinner{display:block;width:42px;height:42px;border:4px solid var(--entry-track,#f6c84b33);border-top-color:var(--entry-accent,#f6c84b);border-radius:50%;margin:26px auto 0;animation:gateway-entry-spin .8s linear infinite}#gateway-entry-transition .entry-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:24px}#gateway-entry-transition .entry-actions[hidden],#gateway-entry-transition .entry-spinner[hidden]{display:none!important}#gateway-entry-transition button{appearance:none;cursor:pointer;padding:11px 16px;border:1px solid var(--entry-accent,#f6c84b);border-radius:12px;background:var(--entry-accent,#f6c84b);color:var(--entry-accent-text,#171105);font:700 13px system-ui}#gateway-entry-transition button[data-entry-continue]{background:transparent;color:var(--entry-accent,#f6c84b)}#gateway-entry-transition button:focus-visible{outline:2px solid #fff;outline-offset:3px}@keyframes gateway-entry-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){#gateway-entry-transition .entry-spinner{animation-duration:1.8s}}
</style><div id="gateway-entry-transition" role="status" aria-live="polite" tabindex="-1" data-stage="${stage}" data-palette="${brand.background}" style="--entry-background:${brand.background};--entry-accent:${accent};--entry-track:${accent}33;--entry-accent-text:${accentText};--entry-glow:${brand.glow}"${options.active ? "" : " hidden"}><div class="entry-content">${brand.logo.endsWith(".avif") ? `<picture><source data-entry-source data-srcset="${escape(logo)}" type="image/avif">${image}</picture>` : image}<h2 data-entry-title>${stage === "creating" ? "Creando tu cuenta" : "Conectando con tu asesor"}</h2><p data-entry-description>${stage === "creating" ? "Estamos preparando tu acceso." : "Tu sesi\xF3n en la plataforma est\xE1 lista."}</p><span class="entry-spinner" aria-hidden="true"></span><div class="entry-actions" hidden><button data-entry-retry type="button">Reintentar conexi\xF3n</button><button data-entry-continue type="button">Continuar al chat</button></div></div></div>`;
}
var GATEWAY_ENTRY_TRANSITION_RUNTIME = String.raw`
function createGatewayEntryTransition(root) {
  if (!root) return null;
  var frame=null,origin="",wallet=false,timer=0,retryTimer=0,automaticRetries=0,previous=null,themeSnapshot=null,addedTheme=null,canvasSnapshot=null;
  function applyPalette(){if(themeSnapshot!==null)return;if(document.documentElement&&document.documentElement.style){canvasSnapshot=document.documentElement.style.getPropertyValue("--gateway-entry-canvas");document.documentElement.style.setProperty("--gateway-entry-canvas",root.dataset.palette)}themeSnapshot=Array.from(document.querySelectorAll('meta[name="theme-color"]')).map(function(meta){var previous=meta.getAttribute("content");meta.setAttribute("content",root.dataset.palette);return [meta,previous]});if(!themeSnapshot.length){addedTheme=document.createElement("meta");addedTheme.name="theme-color";addedTheme.content=root.dataset.palette;document.head.appendChild(addedTheme)}}
  function restorePalette(){if(themeSnapshot===null)return;if(canvasSnapshot!==null&&document.documentElement&&document.documentElement.style){if(canvasSnapshot)document.documentElement.style.setProperty("--gateway-entry-canvas",canvasSnapshot);else document.documentElement.style.removeProperty("--gateway-entry-canvas");canvasSnapshot=null}themeSnapshot.forEach(function(item){if(item[1]===null)item[0].removeAttribute("content");else item[0].setAttribute("content",item[1])});if(addedTheme)addedTheme.remove();themeSnapshot=null;addedTheme=null}
  var title=root.querySelector("[data-entry-title]"),description=root.querySelector("[data-entry-description]");
  var spinner=root.querySelector(".entry-spinner"),actions=root.querySelector(".entry-actions");
  function milestone(name,details){try{if(window.__gatewayEntryFunnel)window.__gatewayEntryFunnel.emit(name,details)}catch(e){}}
  function finish(){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(root.hidden)return;root.hidden=true;restorePalette();if(previous&&previous.isConnected)previous.focus({preventScroll:true})}
  function fail(message){if(root.hidden)return;clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;milestone("entry_error",{error_code:"chat_unavailable"});root.dataset.stage="error";title.textContent="No pudimos completar la conexión";description.textContent=message;spinner.hidden=true;actions.hidden=false}
  function reconnect(message){if(root.hidden||retryTimer)return;if(!frame||automaticRetries>=1){fail(message);return}clearTimeout(timer);automaticRetries++;var currentFrame=frame,currentSource=frame.src;description.textContent="Estamos recuperando la conexión con tu asesor.";retryTimer=setTimeout(function(){retryTimer=0;if(root.hidden||frame!==currentFrame||frame.src!==currentSource)return;start("connecting",true);frame.src=currentSource},750)}
  function start(stage,recovering){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(!recovering)automaticRetries=0;previous=document.activeElement;root.dataset.stage=stage;root.hidden=false;applyPalette();spinner.hidden=false;actions.hidden=true;title.textContent=stage==="preparing"?"Preparando tu acceso":stage==="creating"?"Creando tu cuenta":"Conectando con tu asesor";description.textContent=stage==="connecting"?"Tu sesión en la plataforma está lista.":"Estamos preparando tu acceso.";root.querySelectorAll("[data-entry-source]").forEach(function(el){el.srcset=el.dataset.srcset});root.querySelectorAll("[data-entry-logo]").forEach(function(el){el.src=el.dataset.src});root.focus({preventScroll:true});if(stage==="connecting")timer=setTimeout(function(){reconnect("La conexión está tardando más de lo esperado. Podés reintentar sin crear otra cuenta.")},20000)}
  root.querySelector("[data-entry-retry]").addEventListener("click",function(){if(frame){start("connecting");frame.src=frame.src}else finish()});
  root.querySelector("[data-entry-continue]").addEventListener("click",function(){finish();if(frame)frame.focus()});
  root.addEventListener("keydown",function(event){if(event.key!=="Tab")return;var buttons=actions.hidden?[]:Array.from(actions.querySelectorAll("button"));if(!buttons.length){event.preventDefault();root.focus();return}if(event.shiftKey&&(document.activeElement===buttons[0]||document.activeElement===root)){event.preventDefault();buttons[buttons.length-1].focus()}else if(!event.shiftKey&&(document.activeElement===buttons[buttons.length-1]||document.activeElement===root)){event.preventDefault();buttons[0].focus()}});
  window.addEventListener("focusin",function(event){if(!root.hidden&&!root.contains(event.target))root.focus({preventScroll:true})});
  window.addEventListener("message",function(event){var data=event.data;if(!frame||event.source!==frame.contentWindow||event.origin!==origin||!data||data.source!=="atrio-widget"||data.type!=="atrio.widget.entry-ready")return;if(!wallet||(data.walletReady===true&&data.walletRequestCompleted===true)||data.walletAvailable===false){milestone("chat_ready");finish();return}if(data.walletRequestCompleted===true&&data.walletAvailable===true&&data.walletReady===false)reconnect("El chat está disponible, pero no pudimos obtener los datos para cargar. Podés reintentar o continuar al chat.")});
  return {start:start,finish:finish,fail:fail,bind:function(value,allowedOrigin,needsWallet){frame=value;origin=allowedOrigin;wallet=needsWallet;milestone("gateway_loaded")}};
}
`;

// lib/reyDeAses/gatewayOrigins.ts
function gatewayOriginFor(provider, skinCode, env = process.env) {
  if (provider === "multi_skin") {
    return skinCode === "ganamos_plus" && env.GANAMOS_PLUS_GATEWAY_ORIGIN ? env.GANAMOS_PLUS_GATEWAY_ORIGIN : env.MULTI_SKIN_GATEWAY_ORIGIN;
  }
  if (provider === "ases_del_norte") return env.ASES_DEL_NORTE_GATEWAY_ORIGIN;
  if (provider === "ganamos_net") return env.GANAMOS_NET_GATEWAY_ORIGIN;
  return env.REY_GATEWAY_ORIGIN;
}

// lib/skin-branding.ts
var brands2 = {
  "ganamos_plus": {
    "logo": "/ganamos-plus-logo-transparent.optimized.avif",
    "icon": "/ganamos-plus-app-192.png",
    "background": "#121212",
    "primary": "#8b00ff",
    "secondary": "#a855f7",
    "accent": "#f5c518",
    "accentText": "#171105",
    "surface": "#191a1e",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#9d20d966"
  },
  "jugamos": {
    "logo": "/skins/jugamos/logo.avif",
    "icon": "/skins/jugamos/icon-192.png",
    "background": "#101010",
    "primary": "#885fff",
    "secondary": "#f5c518",
    "accent": "#885fff",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#885fff55"
  },
  "casino_zeus": {
    "logo": "/skins/casino_zeus/logo.avif",
    "icon": "/skins/casino_zeus/icon-192.png",
    "background": "#101010",
    "primary": "#da4167",
    "secondary": "#e26c89",
    "accent": "#da4167",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#da416755"
  },
  "bet30": {
    "logo": "/skins/bet30/logo.avif",
    "icon": "/skins/bet30/icon-192.png",
    "background": "#101010",
    "primary": "#da4167",
    "secondary": "#e26c89",
    "accent": "#da4167",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#da416755"
  },
  "gana_en_casa": {
    "logo": "/skins/gana_en_casa/logo.avif",
    "icon": "/skins/gana_en_casa/icon-192.png",
    "background": "#101010",
    "primary": "#f2ce00",
    "secondary": "#bf8200",
    "accent": "#f2ce00",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#f2ce0055"
  },
  "celu_apuestas": {
    "logo": "/skins/celu_apuestas/logo.avif",
    "icon": "/skins/celu_apuestas/icon-192.png",
    "background": "#101010",
    "primary": "#da4167",
    "secondary": "#e26c89",
    "accent": "#da4167",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#da416755"
  },
  "casino_zeta": {
    "logo": "/skins/casino_zeta/logo.avif",
    "icon": "/skins/casino_zeta/icon-192.png",
    "background": "#101010",
    "primary": "#da4167",
    "secondary": "#e26c89",
    "accent": "#da4167",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#da416755"
  },
  "oro_puro": {
    "logo": "/skins/oro_puro/logo.avif",
    "icon": "/skins/oro_puro/icon-192.png",
    "background": "#0a0d11",
    "primary": "#ffd459",
    "secondary": "#fbba72",
    "accent": "#ffd459",
    "accentText": "#101010",
    "surface": "#191a1e",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#ffd45955"
  },
  "fortu_bet": {
    "logo": "/skins/fortu_bet/logo.avif",
    "icon": "/skins/fortu_bet/icon-192.png",
    "background": "#101010",
    "primary": "#673eb7",
    "secondary": "#13a0ff",
    "accent": "#13a0ff",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#673eb755"
  },
  "gran_poseidon": {
    "logo": "/skins/gran_poseidon/logo.avif",
    "icon": "/skins/gran_poseidon/icon-192.png",
    "background": "#000032",
    "primary": "#00aef6",
    "secondary": "#006fce",
    "accent": "#00aef6",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#00aef655"
  },
  "kona_bet": {
    "logo": "/skins/kona_bet/logo.avif",
    "icon": "/skins/kona_bet/icon-192.png",
    "background": "#101010",
    "primary": "#da4167",
    "secondary": "#e26c89",
    "accent": "#da4167",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#da416755"
  },
  "mega_faraon": {
    "logo": "/skins/mega_faraon/logo.avif",
    "icon": "/skins/mega_faraon/icon-192.png",
    "background": "#101010",
    "primary": "#f2ce00",
    "secondary": "#ff8a00",
    "accent": "#f2ce00",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#f2ce0055"
  },
  "camel_bet": {
    "logo": "/skins/camel_bet/logo.avif",
    "icon": "/skins/camel_bet/icon-192.png",
    "background": "#101010",
    "primary": "#ffb000",
    "secondary": "#ff9f00",
    "accent": "#ffb000",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#ffb00055"
  },
  "rhino_play": {
    "logo": "/skins/rhino_play/logo.avif",
    "icon": "/skins/rhino_play/icon-192.png",
    "background": "#101010",
    "primary": "#e17e01",
    "secondary": "#b53313",
    "accent": "#e17e01",
    "accentText": "#101010",
    "surface": "#16161a",
    "text": "#ffffff",
    "muted": "#98a7b5",
    "glow": "#e17e0155"
  }
};
function getMultiSkinBrand(code) {
  return { name: MULTI_SKIN_CATALOG[code].name, ...brands2[code] };
}

// components/public-landing/template7FastRuntime.ts
function buildTemplate7RuntimeConfig(slug, config, classicDeviceIdScript = "") {
  const isTemplate8 = config.layout?.template === 8;
  return {
    ...buildRuntimeConfig({ slug, config }),
    socialProofItems: [],
    automaticLandingSelection: !!classicDeviceIdScript,
    ...isTemplate8 ? {
      template: 7,
      entryTemplate: 8,
      template8: true,
      ctaDestination: "atrio",
      targetProvider: "",
      cardIndex: null,
      template8Cards: (config.content?.template8?.cards || []).map((card, i) => {
        const skinCode = card.targetProvider === "multi_skin" ? card.multiSkinCode ?? "ganamos_plus" : null;
        const gatewayOrigin = gatewayOriginFor(card.targetProvider, skinCode) || "";
        const brand = skinCode ? getMultiSkinBrand(skinCode) : brands[card.targetProvider];
        return {
          ...card,
          index: i + 1,
          gatewayOrigin,
          transitionBrand: brand,
          transitionLogo: gatewayOrigin + brand.logo.replace(/\.avif$/, ".webp"),
          transitionLogoAvif: brand.logo.endsWith(".avif") ? gatewayOrigin + brand.logo : ""
        };
      })
    } : {}
  };
}

// components/public-landing/template7RuntimeAssets.generated.json
var template7RuntimeAssets_generated_default = {
  "t7-builder": {
    name: "t7-builder-1e4c47651740702eb875a0d1.js",
    source: `
    (function () {
      if(window.__TEMPLATE7_REENTRY_PENDING__||window.__T7_RUNTIME_BOOTING__||window.__T7_RUNTIME_READY__)return;
      window.__T7_RUNTIME_BOOTING__=true;
      var cfg = window.__PUBLIC_LANDING_RUNTIME_CONFIG__ || {};
      try { delete window.__PUBLIC_LANDING_RUNTIME_CONFIG__; } catch (e) {}
      try { ((function(){var __name=function(fn){return fn;};return (function installEntryFunnel(config, suppliedContext, endpoint = "/api/entry-funnel") {
  const browser = window;
  if (browser.__entryFunnel) {
    if (!suppliedContext || browser.__entryFunnel.flowId === suppliedContext.flow_id) return browser.__entryFunnel;
    browser.__entryFunnel.stop();
  }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const template = suppliedContext?.template || (config.template8 || config.template === 8 ? 8 : config.template);
  const landing = suppliedContext?.landing_id || config.landingId;
  if (![7, 8].includes(Number(template)) || !uuid.test(String(landing))) return;
  const allowed = ["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "skin_selected", "cta_clicked", "destination_ready", "account_ready", "login_confirmed", "gateway_loaded", "chat_ready", "entry_error", "visibility_hidden", "resumed"];
  const errors = ["destination_unavailable", "account_unavailable", "prepare_rejected", "prepare_unavailable", "login_unavailable", "session_unavailable", "chat_unavailable", "request_timeout", "network_error", "rate_limited", "invalid_entry", "unknown"];
  const providers = ["rey_de_ases", "ases_del_norte", "ganamos_net", "multi_skin"];
  const skins = ["jugamos", "ganamos_plus", "casino_zeus", "bet30", "gana_en_casa", "celu_apuestas", "casino_zeta", "oro_puro", "fortu_bet", "gran_poseidon", "kona_bet", "mega_faraon", "camel_bet", "rhino_play"];
  const key = "entry-funnel:v1:" + landing;
  const now = Date.now();
  function id() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }
  const early = browser.__ENTRY_FUNNEL_EARLY__;
  let context = suppliedContext;
  try {
    if (!context) {
      const stored = early?.context || JSON.parse(sessionStorage.getItem(key) || "null");
      if (stored && uuid.test(stored.flow_id) && stored.landing_id === landing && stored.template === template && stored.telemetry_origin === location.origin && Number.isSafeInteger(stored.started_at) && stored.started_at <= now && stored.started_at > now - 864e5) context = stored;
    }
  } catch {
  }
  const earlyStart = Number(early?.started_at);
  if (!context) context = { landing_id: String(landing), flow_id: id(), template, telemetry_origin: location.origin, started_at: Number.isSafeInteger(earlyStart) && earlyStart <= now && earlyStart > now - 864e5 ? earlyStart : now };
  const flow = context;
  try {
    sessionStorage.setItem(key, JSON.stringify(flow));
  } catch {
  }
  let queue = [];
  let timer;
  let inflight = false;
  let count = 0;
  let active = true;
  let retries = 0;
  const seen = /* @__PURE__ */ new Set();
  const pendingKey = key + ":pending";
  try {
    const pending = JSON.parse(sessionStorage.getItem(pendingKey) || "null");
    if (pending?.flow_id === flow.flow_id && Array.isArray(pending.events)) {
      queue = pending.events.slice(0, 20).filter((e) => uuid.test(String(e.id)) && allowed.includes(String(e.name)));
    }
  } catch {
  }
  function saveQueue() {
    try {
      sessionStorage.setItem(pendingKey, JSON.stringify({ flow_id: flow.flow_id, events: queue }));
    } catch {
    }
  }
  function flush(beacon = false) {
    if (!active) return;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    if (!queue.length || inflight && !beacon) return;
    const events = queue.slice(0, 20);
    const payload = JSON.stringify({ landing_id: flow.landing_id, flow_id: flow.flow_id, template: flow.template, events });
    if (beacon && navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon(endpoint, new Blob([payload], { type: "text/plain" }))) return;
      } catch {
      }
    }
    inflight = true;
    fetch(endpoint, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, credentials: "same-origin", keepalive: true, cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error("unavailable");
      const sent = new Set(events.map((e) => e.id));
      queue = queue.filter((e) => !sent.has(e.id));
      retries = 0;
      saveQueue();
    }).catch(() => {
      retries += 1;
    }).finally(() => {
      inflight = false;
      if (active && queue.length && retries <= 1 && document.visibilityState !== "hidden") timer = setTimeout(() => flush(), 1800);
    });
  }
  function emit(name, details = {}) {
    if (!active || !allowed.includes(name) || count >= 80) return;
    const provider = details.provider || config.targetProvider;
    const skin = details.skin || config.skinCode;
    const once = !["cta_clicked", "entry_error", "visibility_hidden", "resumed"].includes(name);
    const stageKey = name + ":" + String(provider || "") + ":" + String(skin || "");
    if (once && seen.has(stageKey)) return;
    seen.add(stageKey);
    count += 1;
    const event = {
      id: uuid.test(String(details.event_id)) ? details.event_id : id(),
      name,
      elapsed_ms: Math.max(0, Math.min(864e5, Number.isSafeInteger(details.elapsed_ms) ? Number(details.elapsed_ms) : Date.now() - flow.started_at))
    };
    if (providers.includes(String(provider))) event.provider = provider;
    if (skins.includes(String(skin))) event.skin = skin;
    if (name === "entry_error") event.error_code = errors.includes(String(details.error_code)) ? details.error_code : "unknown";
    if (Number.isInteger(details.status) && Number(details.status) >= 100 && Number(details.status) <= 599) event.status = details.status;
    queue.push(event);
    if (queue.length > 40) queue = queue.slice(-40);
    saveQueue();
    if (!timer) timer = setTimeout(() => flush(), 500);
  }
  const api = { flowId: flow.flow_id, emit, flush, context: () => ({ ...flow }), stop: () => {
    active = false;
    if (timer) clearTimeout(timer);
  } };
  browser.__entryFunnel = api;
  if (!suppliedContext && Array.isArray(early?.events)) {
    early.events.slice(0, 8).forEach((event) => {
      if (["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "cta_clicked", "entry_error"].includes(event.name) && Number.isSafeInteger(event.at) && event.at >= flow.started_at && event.at <= Date.now()) emit(event.name, { elapsed_ms: event.at - flow.started_at, event_id: event.id, error_code: event.error_code });
    });
    delete browser.__ENTRY_FUNNEL_EARLY__;
  }
  if (!suppliedContext) {
    const visibleForm = () => {
      if (document.visibilityState === "hidden") return;
      emit("page_visible");
      const form = document.querySelector("[data-template7-form]");
      if (form && form.getClientRects().length) emit("form_visible");
    };
    document.addEventListener("focusin", (event) => {
      if (event.target?.matches?.("[data-template7-name]")) {
        visibleForm();
        emit("name_focus");
      }
    });
    document.addEventListener("input", (event) => {
      const target = event.target;
      if (!target?.matches?.("[data-template7-name]")) return;
      if (target.value.length > 0) emit("name_started");
      if (target.value.trim() && target.checkValidity()) emit("name_valid");
    });
    const begin = () => {
      requestAnimationFrame(visibleForm);
      const observer = new MutationObserver(visibleForm);
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "class"] });
      setTimeout(() => observer.disconnect(), 12e4);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", begin, { once: true });
    else begin();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      emit("visibility_hidden");
      flush(true);
    } else {
      emit("resumed");
      if (!suppliedContext) emit("page_visible");
      flush();
    }
  });
  window.addEventListener("pagehide", () => flush(true));
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      emit("resumed");
      flush();
    }
  });
  return api;
});})())(cfg); } catch (_) {}

      var template7IdentityReady = !window.__LB_IDENTITY_READY__;
      var template7IdentityWaiting = !!window.__LB_IDENTITY_READY__;
      var template7PendingIdentityClick = null;
      function releaseTemplate7Identity(ok) {
        template7IdentityWaiting = false;
        template7IdentityReady = ok === true;
        if (template7PendingIdentityClick) {
          var pending = template7PendingIdentityClick;
          template7PendingIdentityClick = null;
          pending.disabled = false;
          if (template7IdentityReady) handleCtaClick(pending);
          else { if (template7Transition) template7Transition.finish(); setTemplate7Error("No pudimos recuperar tu acceso. Intent\xE1 nuevamente."); }
        }
      }
      if (!template7IdentityReady) window.__LB_IDENTITY_READY__.then(releaseTemplate7Identity, function () { releaseTemplate7Identity(false); });
      var clickLocked = false;
      var landingResolution = (function captureLandingResolution(slug, allowAutomatic = false) {
  if (!globalThis.window) return null;
  const browser = window;
  const saved = browser.__LANDING_RESOLUTION__;
  if (saved?.slug === slug && saved.url === window.location.href) return saved.value;
  const url = new URL(window.location.href);
  const selections = url.searchParams.getAll("landing");
  const automatic = url.searchParams.getAll("__landing_auto");
  let value = null;
  let pathname = url.pathname.replace(/\\/$/, "");
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
  }
  if (selections.length === 1 && selections[0].trim() === slug) {
    value = "url_parameter";
  } else if (!selections.length || selections.length === 1 && !selections[0].trim()) {
    const expectedPath = allowAutomatic ? \`/\${slug}\` : \`/l/\${slug}\`;
    if (pathname === expectedPath) {
      value = allowAutomatic && automatic.length === 1 && automatic[0] === slug ? "automatic" : "path";
    }
  }
  if (url.searchParams.has("__landing_auto")) {
    url.searchParams.delete("__landing_auto");
    try {
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    } catch {
    }
  }
  browser.__LANDING_RESOLUTION__ = { slug, url: window.location.href, value };
  return value;
})(cfg.slug, cfg.automaticLandingSelection === true);
      var template7ContactSent = false;
      var template7AttemptContext = null;
      var noPhoneTimer = null;
      var metaTracking = {
        fbp: "",
        fbc: "",
        clientIpAddress: "",
        clientIpIssuedAt: null,
        clientIpProof: ""
      };
      var metaIpCollectorPromise = null;
      var metaParamBuilderPromise = null;
      var officialMetaTracking = null;
      var prearmedContact = null;
      var journeyStartInFlight = false;
      var leadCaptureModal = null;
      var pendingLeadCaptureButton = null;
      var CONTACT_DEDUP_TTL_MS = 5 * 60 * 1000;
      var JOURNEY_START_DEDUP_TTL_MS = CONTACT_DEDUP_TTL_MS;
      var SOCIAL_PROOF_INTERVAL_MS = 5000;

      function queryParams() {
        try { return new URLSearchParams(window.location.search); }
        catch (e) { return new URLSearchParams(); }
      }

      function deviceType() {
        var ua = (navigator.userAgent || "").toLowerCase();
        if (/tablet|ipad/.test(ua)) return "tablet";
        if (/mobi|iphone|android/.test(ua)) return "mobile";
        return "desktop";
      }

      function normalizePhone(raw, rawCountryCallingCode) {
  var digits = String(raw || "").replace(/\\D+/g, "");
  var countryCallingCode = String(rawCountryCallingCode || "").replace(/\\D+/g, "");
  if (!digits) return "";
  if (digits.indexOf("00") === 0) digits = digits.slice(2);
  if (countryCallingCode && digits.indexOf(countryCallingCode) === 0) return digits;

  var national = digits.replace(/^0+/, "");
  if (countryCallingCode === "54") {
    national = national.replace(/^15/, "");
    return national.length === 10 ? "54" + national : digits;
  }
  if (countryCallingCode === "595") {
    return national.length === 9 ? "595" + national : digits;
  }
  return digits;
}
      function normalizeArgentinaWhatsapp(rawValue){var digits=String(rawValue==null?"":rawValue).replace(/\\D/g,"");if(!digits)return"";if(digits.indexOf("00")===0)digits=digits.slice(2);digits=digits.replace(/^0+/,"");var national=digits;if(digits.indexOf("54")===0)national=digits.slice(2);else if(digits.indexOf("9")===0&&digits.length===11)national=digits.slice(1);national=national.replace(/^0+/,"");if(national.indexOf("9")===0&&national.length===11)national=national.slice(1);if(national.length===12){var lengths=[2,3,4];for(var i=0;i<lengths.length;i++){var areaLength=lengths[i];if(national.slice(areaLength,areaLength+2)!=="15")continue;var candidate=national.slice(0,areaLength)+national.slice(areaLength+2);if(candidate.length===10){national=candidate;break}}}return/^[1-9]\\d{9}$/.test(national)?"549"+national:""}

    function template7WebviewKind(ua) {
      var text = String(ua || "");
      var inApp = /Instagram|FBAN|FBAV|FB_IAB|FB4A|Messenger|TikTok|Bytedance|Musical_ly/i.test(text);
      if (/Android/i.test(text) && (inApp || /(?:;|\\s)wv(?:;|\\))/i.test(text))) return "android";
      if (/iPhone|iPad|iPod/i.test(text) && inApp) return "ios";
      return "normal";
    }

    function template7CheckedHandoff(raw) {
      var url = new URL(String(raw || ""));
      if (url.protocol !== "https:" || url.username || url.password || url.hash ||
          (url.pathname !== "/prepare" && url.pathname !== "/start") ||
          url.searchParams.getAll("t").length !== 1 || !url.searchParams.get("t") || url.searchParams.get("t").length > 12000 ||
          url.searchParams.getAll("ef").length > 1 || (url.searchParams.has("ef") &&
          (!url.searchParams.get("ef") || url.searchParams.get("ef").length > 2003))) {
        throw new Error("invalid handoff");
      }
      if(url.pathname==="/prepare"&&url.searchParams.has("skin")&&(url.searchParams.getAll("skin").length!==1||
          ["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(url.searchParams.get("skin"))===-1||
          (typeof cfg!=="undefined"&&cfg.targetProvider&&cfg.targetProvider!=="multi_skin")))throw new Error("invalid handoff skin");
      // Attribution is captured on the landing before this navigation. Future
      // advertising parameters must neither reject nor authorize an entry.
      var token=url.searchParams.get("t"),funnel=url.searchParams.get("ef"),skin=url.pathname==="/prepare"?url.searchParams.get("skin"):null;
      url.search="";url.searchParams.set("t",token);
      if(funnel)url.searchParams.set("ef",funnel);
      if(skin)url.searchParams.set("skin",skin);
      return url;
    }

    function template7HandoffIntent(raw) {
      var url = template7CheckedHandoff(raw);
      return "intent://" + url.host + url.pathname + url.search +
        "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
        encodeURIComponent(url.href) + ";end";
    }

    function navigateTemplate7Handoff(raw) {
      var url = template7CheckedHandoff(raw);
      try { window.localStorage.setItem("template7:gateway-visited:" + url.origin, String(Date.now())); } catch(e) {}
      // A Meta in-app browser can complete this same first-party navigation.
      // User-agent detection alone is not evidence of a failed entry.
      try { window.location.assign(url.href); return; }
      catch (error) { showTemplate7HandoffFallback(url.href); }
    }

    function showTemplate7HandoffFallback(raw) {
      var url = template7CheckedHandoff(raw);
      var kind = template7WebviewKind(navigator.userAgent);
      if (template7Transition) template7Transition.finish();
      var panel = document.querySelector("[data-template7-handoff-panel]");
      if (!panel) {
        panel = document.createElement("div");
        panel.className = "template7__handoff-panel";
        panel.setAttribute("data-template7-handoff-panel", "");
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "true");
        panel.innerHTML = '<div class="template7__handoff-card"><h2>Continu\xE1 con tu acceso</h2>' +
          '<p data-template7-handoff-help></p><a data-template7-handoff-open>Continuar</a>' +
          '<button type="button" data-template7-handoff-copy>Copiar enlace</button>' +
          '<small>El enlace es temporal y de un solo uso. Abrilo una sola vez.</small></div>';
        document.body.appendChild(panel);
      }
      var help = panel.querySelector("[data-template7-handoff-help]");
      var open = panel.querySelector("[data-template7-handoff-open]");
      var copy = panel.querySelector("[data-template7-handoff-copy]");
      if (kind === "android") {
        help.textContent = "No se pudo abrir tu acceso en este navegador. Pod\xE9s continuar en Chrome con la misma cuenta.";
        open.textContent = "Abrir en Chrome";
        open.href = template7HandoffIntent(url.href);
      } else {
        help.textContent = "No se pudo abrir tu acceso. Intent\xE1 abrir el enlace o copialo para continuar en otro navegador con la misma cuenta.";
        open.textContent = "Abrir enlace";
        open.href = url.href;
        open.target = "_blank";
        open.rel = "noopener noreferrer";
      }
      copy.onclick = function () {
        if (!navigator.clipboard || !navigator.clipboard.writeText) return;
        navigator.clipboard.writeText(url.href).then(function () {
          copy.textContent = "Enlace copiado";
        }).catch(function () { copy.textContent = "No se pudo copiar"; });
      };
      open.focus();
    }

      var fetchWithEntryRecovery = async function fetchWithEntryRecovery(url, init, onRetry) {
  const deadline = Date.now() + 45e3;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (init.signal?.aborted) throw init.signal.reason || new Error("entry_cancelled");
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("entry_recovery_pending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(42e3, remaining));
    const cancel = () => controller.abort(init.signal?.reason);
    init.signal?.addEventListener("abort", cancel, { once: true });
    if (init.signal?.aborted) cancel();
    const feedback = onRetry ? setTimeout(onRetry, Math.min(8e3, remaining)) : void 0;
    let response;
    let failure;
    let retryAfter = 0;
    try {
      response = await fetch(url, Object.assign({}, init, { signal: controller.signal }));
      if (!response.ok && ![408, 429, 500, 502, 503, 504].includes(response.status)) return response;
      const received = response;
      response = void 0;
      const text = await received.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch (error) {
        if (received.ok) throw error;
      }
      response = new Response(text, { status: received.status, statusText: received.statusText, headers: received.headers });
      if (response.ok) return response;
      if (body && (body.retryable === false || ["integration_pending", "api2_not_configured", "landing_unavailable", "advisor_not_assigned"].includes(body.error))) return response;
      const header = response.headers.get("Retry-After");
      if (header) retryAfter = /^\\d+$/.test(header) ? Number(header) * 1e3 : Math.max(0, Date.parse(header) - Date.now());
      if (retryAfter > 6e4) return response;
    } catch (error) {
      failure = error;
    } finally {
      clearTimeout(timer);
      if (feedback !== void 0) clearTimeout(feedback);
      init.signal?.removeEventListener("abort", cancel);
    }
    if (init.signal?.aborted) throw init.signal.reason || failure || new Error("entry_cancelled");
    if (attempt === 3) {
      if (response) return response;
      throw failure;
    }
    if (onRetry) onRetry();
    const delay = Math.max(Number.isFinite(retryAfter) ? retryAfter : 0, [500, 1500, 3500][attempt]);
    if (Date.now() + delay >= deadline) {
      if (response) return response;
      throw failure || new Error("entry_recovery_pending");
    }
    await new Promise((resolve, reject) => {
      const abort = () => {
        clearTimeout(pause);
        init.signal?.removeEventListener("abort", abort);
        reject(init.signal?.reason || new Error("entry_cancelled"));
      };
      const pause = setTimeout(() => {
        init.signal?.removeEventListener("abort", abort);
        resolve();
      }, delay);
      init.signal?.addEventListener("abort", abort, { once: true });
      if (init.signal?.aborted) abort();
    });
  }
  throw new Error("entry_recovery_exhausted");
};
      function setTemplate7Error(message) {
        var error = document.querySelector("[data-template7-error]");
        if (!error) return;
        error.textContent = message || "";
        error.hidden = !message;
      }


function createGatewayEntryTransition(root) {
  if (!root) return null;
  var frame=null,origin="",wallet=false,timer=0,retryTimer=0,automaticRetries=0,previous=null,themeSnapshot=null,addedTheme=null,canvasSnapshot=null;
  function applyPalette(){if(themeSnapshot!==null)return;if(document.documentElement&&document.documentElement.style){canvasSnapshot=document.documentElement.style.getPropertyValue("--gateway-entry-canvas");document.documentElement.style.setProperty("--gateway-entry-canvas",root.dataset.palette)}themeSnapshot=Array.from(document.querySelectorAll('meta[name="theme-color"]')).map(function(meta){var previous=meta.getAttribute("content");meta.setAttribute("content",root.dataset.palette);return [meta,previous]});if(!themeSnapshot.length){addedTheme=document.createElement("meta");addedTheme.name="theme-color";addedTheme.content=root.dataset.palette;document.head.appendChild(addedTheme)}}
  function restorePalette(){if(themeSnapshot===null)return;if(canvasSnapshot!==null&&document.documentElement&&document.documentElement.style){if(canvasSnapshot)document.documentElement.style.setProperty("--gateway-entry-canvas",canvasSnapshot);else document.documentElement.style.removeProperty("--gateway-entry-canvas");canvasSnapshot=null}themeSnapshot.forEach(function(item){if(item[1]===null)item[0].removeAttribute("content");else item[0].setAttribute("content",item[1])});if(addedTheme)addedTheme.remove();themeSnapshot=null;addedTheme=null}
  var title=root.querySelector("[data-entry-title]"),description=root.querySelector("[data-entry-description]");
  var spinner=root.querySelector(".entry-spinner"),actions=root.querySelector(".entry-actions");
  function milestone(name,details){try{if(window.__gatewayEntryFunnel)window.__gatewayEntryFunnel.emit(name,details)}catch(e){}}
  function finish(){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(root.hidden)return;root.hidden=true;restorePalette();if(previous&&previous.isConnected)previous.focus({preventScroll:true})}
  function fail(message){if(root.hidden)return;clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;milestone("entry_error",{error_code:"chat_unavailable"});root.dataset.stage="error";title.textContent="No pudimos completar la conexi\xF3n";description.textContent=message;spinner.hidden=true;actions.hidden=false}
  function reconnect(message){if(root.hidden||retryTimer)return;if(!frame||automaticRetries>=1){fail(message);return}clearTimeout(timer);automaticRetries++;var currentFrame=frame,currentSource=frame.src;description.textContent="Estamos recuperando la conexi\xF3n con tu asesor.";retryTimer=setTimeout(function(){retryTimer=0;if(root.hidden||frame!==currentFrame||frame.src!==currentSource)return;start("connecting",true);frame.src=currentSource},750)}
  function start(stage,recovering){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(!recovering)automaticRetries=0;previous=document.activeElement;root.dataset.stage=stage;root.hidden=false;applyPalette();spinner.hidden=false;actions.hidden=true;title.textContent=stage==="preparing"?"Preparando tu acceso":stage==="creating"?"Creando tu cuenta":"Conectando con tu asesor";description.textContent=stage==="connecting"?"Tu sesi\xF3n en la plataforma est\xE1 lista.":"Estamos preparando tu acceso.";root.querySelectorAll("[data-entry-source]").forEach(function(el){el.srcset=el.dataset.srcset});root.querySelectorAll("[data-entry-logo]").forEach(function(el){el.src=el.dataset.src});root.focus({preventScroll:true});if(stage==="connecting")timer=setTimeout(function(){reconnect("La conexi\xF3n est\xE1 tardando m\xE1s de lo esperado. Pod\xE9s reintentar sin crear otra cuenta.")},20000)}
  root.querySelector("[data-entry-retry]").addEventListener("click",function(){if(frame){start("connecting");frame.src=frame.src}else finish()});
  root.querySelector("[data-entry-continue]").addEventListener("click",function(){finish();if(frame)frame.focus()});
  root.addEventListener("keydown",function(event){if(event.key!=="Tab")return;var buttons=actions.hidden?[]:Array.from(actions.querySelectorAll("button"));if(!buttons.length){event.preventDefault();root.focus();return}if(event.shiftKey&&(document.activeElement===buttons[0]||document.activeElement===root)){event.preventDefault();buttons[buttons.length-1].focus()}else if(!event.shiftKey&&(document.activeElement===buttons[buttons.length-1]||document.activeElement===root)){event.preventDefault();buttons[0].focus()}});
  window.addEventListener("focusin",function(event){if(!root.hidden&&!root.contains(event.target))root.focus({preventScroll:true})});
  window.addEventListener("message",function(event){var data=event.data;if(!frame||event.source!==frame.contentWindow||event.origin!==origin||!data||data.source!=="atrio-widget"||data.type!=="atrio.widget.entry-ready")return;if(!wallet||(data.walletReady===true&&data.walletRequestCompleted===true)||data.walletAvailable===false){milestone("chat_ready");finish();return}if(data.walletRequestCompleted===true&&data.walletAvailable===true&&data.walletReady===false)reconnect("El chat est\xE1 disponible, pero no pudimos obtener los datos para cargar. Pod\xE9s reintentar o continuar al chat.")});
  return {start:start,finish:finish,fail:fail,bind:function(value,allowedOrigin,needsWallet){frame=value;origin=allowedOrigin;wallet=needsWallet;milestone("gateway_loaded")}};
}

      var template7Transition = createGatewayEntryTransition(document.getElementById("gateway-entry-transition"));
      var template7EntryGeneration = 0;
      function template7TransitionUrl(raw) {
        var url = template7CheckedHandoff(raw);
        if (url.pathname === "/start") {
          url.pathname = "/prepare";
          if(cfg.targetProvider==="multi_skin"&&["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(cfg.skinCode)!==-1)url.searchParams.set("skin",cfg.skinCode);
        }
        return url.href;
      }
      function failTemplate7(button, attempt) {
        if (attempt !== undefined && attempt !== template7EntryGeneration) return;
        if (template7Transition) template7Transition.finish();
        if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "account_unavailable" });
        clickLocked = false;
        button.disabled = false;
        setButtonText(button, getRestButtonText(button));
        setTemplate7Error("Tu acceso sigue pendiente. Toc\xE1 el bot\xF3n para continuar con el mismo intento.");
      }

      function startTemplate7Gateway(name, phone, promoCode, atrioData, tracking, params) {
        if (atrioData && atrioData.preparationReady && atrioData.existingName && atrioData.promoCode) {
          name = atrioData.existingName; promoCode = atrioData.promoCode;
        }
        var advisorId = firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id]);
        var advisorSlug = firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug]);
        var atrioClientId = firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id]);
        if (!advisorId || !advisorSlug || !atrioClientId) return Promise.reject(new Error("advisor unavailable"));
        return fetchWithEntryRecovery("/api/template7/prepare", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landing_id: cfg.landingId,
            landing_slug: cfg.slug,
            entry_funnel: window.__entryFunnel ? window.__entryFunnel.context() : undefined,
            name: name,
            phone: phone || undefined,
            atrio_client_id: atrioClientId,
            advisor_id: advisorId,
            advisor_slug: advisorSlug,
            promo_code: promoCode,
            attribution: {
              utm_source: params.get("utm_source") || "",
              utm_medium: params.get("utm_medium") || "",
              landing: cfg.slug,
              landing_resolution: landingResolution || "",
              facebook: params.get("facebook") || "",
              portofolio: params.get("portofolio") || "",
              cp: params.get("cp") || "",
              campana: params.get("campana") || "",
              conjunto: params.get("conjunto") || "",
              anuncio: params.get("anuncio") || "",
              utm_campaign: params.get("utm_campaign") || "",
              utm_content: params.get("utm_content") || "",
              utm_term: params.get("utm_term") || "",
              target_provider: cfg.targetProvider,
              skin_code: cfg.targetProvider === "multi_skin" ? cfg.skinCode : "",
              fbp: tracking.fbp || "",
              fbc: tracking.fbc || ""
            }
          })
        }).then(function (response) {
          if (!response.ok) throw new Error("gateway unavailable");
          return response.json();
        }).then(function (data) {
          if (!data || typeof data.handoff_url !== "string" || !data.handoff_url) throw new Error("handoff unavailable");
          return template7TransitionUrl(data.handoff_url);
        });
      }

      function generatePromoCode(tag) {
        return String(tag || "LP") + "-" + Math.random().toString(16).slice(2, 14);
      }

      function buildMessage(promoCode) {
        var baseMessage = ("Hola! quiero mas informacion por favor! " + promoCode + "\\nMi nombre es:").trim();
        var extraText = String(cfg.whatsappPrefillText || "").trim();
        return extraText ? baseMessage + "\\n\\n" + extraText : baseMessage;
      }

      function isAtrioDestination() {
        return cfg.template === 7;
      }

      function buildAtrioRedirectUrl(promoCode, atrioData) {
        try {
          var raw = firstNonEmpty([
            atrioData && atrioData.atrioRedirectUrl,
            atrioData && atrioData.atrio_redirect_url,
            cfg.atrioRedirectUrl
          ]);
          if (!raw) return "";
          var url = new URL(raw, window.location.href);
          if (url.protocol !== "http:" && url.protocol !== "https:") return "";
          url.searchParams.set("promo_code", promoCode);
          var atrioId = firstNonEmpty([
            atrioData && atrioData.atrioId,
            atrioData && atrioData.atrio_id,
            cfg.atrioId
          ]);
          if (atrioId) url.searchParams.set("atrio_id", atrioId);
          return url.toString();
        } catch (e) {
          return "";
        }
      }

      function safeUUID() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
          return window.crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0;
          var v = c === "x" ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function storageKey(key) {
        return String(cfg.storageNamespace || ("landing-builder:no-pixel:" + cfg.slug)) + ":" + key;
      }

      function getLocalStorageValue(key) {
        try { return window.localStorage.getItem(storageKey(key)) || ""; }
        catch (e) { return ""; }
      }

      function setLocalStorageValue(key, value) {
        try { if (value) window.localStorage.setItem(storageKey(key), value); }
        catch (e) {}
      }

      function getOrCreateExternalId() {
        var existing = getLocalStorageValue("external_id");
        if (existing) return existing;
        var created = safeUUID();
        setLocalStorageValue("external_id", created);
        return created;
      }

      function firstNonEmpty(values) {
        for (var i = 0; i < values.length; i += 1) {
          var value = values[i];
          if (value == null) continue;
          var text = String(value).trim();
          if (text) return text;
        }
        return "";
      }

      function normalizeEmail(raw) {
        return String(raw || "").trim().toLowerCase();
      }

      function readMeta() {
        try { return window.__META || {}; }
        catch (e) { return {}; }
      }

      function resolveIdentity(params) {
        var meta = readMeta();
        function getParam(name) { return params.get(name) || ""; }

        var emailRaw = firstNonEmpty([
          getParam("email"),
          getParam("em"),
          getLocalStorageValue("em"),
          meta.userEmail || ""
        ]);
        var phoneRaw = firstNonEmpty([
          getParam("phone"),
          getParam("ph"),
          getLocalStorageValue("ph"),
          meta.userPhone || ""
        ]);
        var externalId = firstNonEmpty([
          meta.externalId || "",
          getLocalStorageValue("external_id")
        ]) || getOrCreateExternalId();
        var fn = firstNonEmpty([getParam("fn"), getLocalStorageValue("fn"), meta.userFn || ""]);
        var ln = firstNonEmpty([getParam("ln"), getLocalStorageValue("ln"), meta.userLn || ""]);
        var ct = firstNonEmpty([getParam("ct"), getLocalStorageValue("ct")]);
        var st = firstNonEmpty([getParam("st"), getLocalStorageValue("st")]);
        var zip = firstNonEmpty([getParam("zip"), getLocalStorageValue("zip")]);
        var country = firstNonEmpty([getParam("country"), getLocalStorageValue("country")]);

        setLocalStorageValue("external_id", externalId);
        if (emailRaw) setLocalStorageValue("em", normalizeEmail(emailRaw));
        if (phoneRaw) setLocalStorageValue("ph", normalizePhone(phoneRaw, cfg.phoneCountryCode));
        if (fn) setLocalStorageValue("fn", fn);
        if (ln) setLocalStorageValue("ln", ln);
        if (ct) setLocalStorageValue("ct", ct);
        if (st) setLocalStorageValue("st", st);
        if (zip) setLocalStorageValue("zip", zip);
        if (country) setLocalStorageValue("country", country);

        return {
          emailRaw: emailRaw,
          phoneRaw: phoneRaw,
          ct: ct,
          st: st,
          zip: zip,
          country: country,
          email: emailRaw ? normalizeEmail(emailRaw) : "",
          ph: phoneRaw ? normalizePhone(phoneRaw, cfg.phoneCountryCode) : "",
          fn: fn,
          ln: ln,
          externalId: externalId
        };
      }

      function applyLeadCaptureToIdentity(identity, capture) {
        if (!capture || typeof capture !== "object") return identity;
        var fields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
        var firstName = (cfg.template === 7 || fields.firstName) ? String(capture.firstName || "").trim() : "";
        var lastName = fields.lastName ? String(capture.lastName || "").trim() : "";
        var emailRaw = fields.email ? String(capture.email || "").trim() : "";
        var phoneRaw = (fields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
          ? String(capture.phone || "").trim()
          : "";
        var normalizedPhone = phoneRaw
          ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(phoneRaw) : normalizePhone(phoneRaw, cfg.phoneCountryCode))
          : "";

        return {
          emailRaw: emailRaw || identity.emailRaw,
          phoneRaw: normalizedPhone ? phoneRaw : identity.phoneRaw,
          ct: identity.ct,
          st: identity.st,
          zip: identity.zip,
          country: identity.country,
          email: emailRaw ? normalizeEmail(emailRaw) : identity.email,
          ph: normalizedPhone || identity.ph,
          fn: firstName || identity.fn,
          ln: lastName || identity.ln,
          externalId: identity.externalId
        };
      }

      function readInlineEmail() {
        if (!cfg.emailCapture || cfg.emailCapture.enabled !== true) return "";
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return "";
        var value = String(input.value || "").trim();
        var valid = value.length <= 254 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value);
        var error = document.querySelector("[data-inline-email-error]");
        if (error) error.textContent = value && !valid
          ? "Email inv\xE1lido. Pod\xE9s seguir a WhatsApp." : "";
        return valid ? value.toLowerCase() : "";
      }

      function initInlineEmail() {
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return;
        input.addEventListener("input", function () {
          var error = document.querySelector("[data-inline-email-error]");
          if (error) error.textContent = "";
        });
        input.addEventListener("blur", readInlineEmail);
      }

      function cookieValue(name) {
        try {
          var parts = document.cookie ? document.cookie.split("; ") : [];
          for (var i = 0; i < parts.length; i += 1) {
            var part = parts[i];
            var eq = part.indexOf("=");
            var key = eq >= 0 ? part.slice(0, eq) : part;
            if (key === name) return decodeURIComponent(eq >= 0 ? part.slice(eq + 1) : "");
          }
        } catch (e) {}
        return "";
      }

      function collectMetaTrackingParams(params) {
        var fbp = cookieValue("_fbp");
        var fbc = cookieValue("_fbc");
        var fbclid = params.get("fbclid") || "";
        if (!fbc && fbclid) {
          fbc = "fb.1." + Date.now() + "." + fbclid;
        }
        metaTracking = {
          fbp: fbp || "",
          fbc: fbc || "",
          clientIpAddress: metaTracking.clientIpAddress || "",
          clientIpIssuedAt: metaTracking.clientIpIssuedAt || null,
          clientIpProof: metaTracking.clientIpProof || ""
        };
        return metaTracking;
      }

      function safeEventSourceUrl() {
        try {
          return window.location.origin + window.location.pathname;
        } catch (e) {
          return "";
        }
      }

      function sanitizeSensitiveQueryParams() {
        try {
          var url = new URL(window.location.href);
          var sensitiveKeys = ["email", "em", "phone", "ph", "fn", "ln", "external_id", "eid", "ct", "st", "zip", "country"];
          var changed = false;
          sensitiveKeys.forEach(function (key) {
            if (url.searchParams.has(key)) {
              url.searchParams.delete(key);
              changed = true;
            }
          });
          if (changed) {
            window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
          }
        } catch (e) {}
      }

      function mergeMetaTracking(base, incoming) {
        var next = incoming && typeof incoming === "object" ? incoming : {};
        return {
          fbp: String(next.fbp || base.fbp || ""),
          fbc: String(next.fbc || base.fbc || ""),
          clientIpAddress: String(next.clientIpAddress || base.clientIpAddress || ""),
          clientIpIssuedAt: Number(next.clientIpIssuedAt || base.clientIpIssuedAt) || null,
          clientIpProof: String(next.clientIpProof || base.clientIpProof || "")
        };
      }

      function getOfficialMetaParamBuilder() {
        try {
          var sdk = window.clientParamBuilder;
          if (
            sdk &&
            typeof sdk.processAndCollectAllParams === "function" &&
            typeof sdk.getFbc === "function" &&
            typeof sdk.getFbp === "function"
          ) {
            return sdk;
          }
        } catch (e) {}
        return null;
      }

      function loadOfficialMetaParamBuilder() {
        var available = getOfficialMetaParamBuilder();
        if (available) return Promise.resolve(available);
        if (metaParamBuilderPromise) return metaParamBuilderPromise;

        var source = String(cfg.metaParamBuilderSrc || "").trim();
        if (!source) return Promise.resolve(null);

        metaParamBuilderPromise = new Promise(function (resolve) {
          var existing = document.querySelector("script[data-meta-param-builder='official']");
          var script = existing || document.createElement("script");
          var settled = false;

          function finish(value) {
            if (settled) return;
            settled = true;
            resolve(value || null);
          }

          script.addEventListener("load", function () {
            finish(getOfficialMetaParamBuilder());
          }, { once: true });
          script.addEventListener("error", function () {
            finish(null);
          }, { once: true });

          if (!existing) {
            script.src = source;
            script.async = true;
            script.setAttribute("data-meta-param-builder", "official");
            document.head.appendChild(script);
          }
        }).finally(function () {
          metaParamBuilderPromise = null;
        });

        return metaParamBuilderPromise;
      }

      function readOfficialMetaParam(sdk, methodName) {
        try {
          var method = sdk && sdk[methodName];
          return typeof method === "function" ? String(method.call(sdk) || "") : "";
        } catch (e) {
          return "";
        }
      }

      function collectOfficialMetaTracking() {
        var sdk = getOfficialMetaParamBuilder();
        if (!sdk) return Promise.resolve(null);

        var trustedIp =
          metaTracking.clientIpAddress && metaTracking.clientIpProof
            ? metaTracking.clientIpAddress
            : "";
        var processResult;

        try {
          processResult = trustedIp
            ? sdk.processAndCollectAllParams(window.location.href, function () {
                return Promise.resolve(trustedIp);
              })
            : sdk.processAndCollectAllParams(window.location.href);
        } catch (e) {
          return Promise.resolve(null);
        }

        return Promise.resolve(processResult)
          .then(function () {
            officialMetaTracking = {
              fbp: readOfficialMetaParam(sdk, "getFbp"),
              fbc: readOfficialMetaParam(sdk, "getFbc"),
              clientIpAddress: trustedIp,
              clientIpIssuedAt: trustedIp ? metaTracking.clientIpIssuedAt : null,
              clientIpProof: trustedIp ? metaTracking.clientIpProof : ""
            };
            metaTracking = mergeMetaTracking(metaTracking, officialMetaTracking);
            return officialMetaTracking;
          })
          .catch(function () {
            return null;
          });
      }

      function collectMetaClientIpProof() {
        var collectorUrl = String(cfg.metaIpCollectorUrl || "").trim();
        if (!collectorUrl) return Promise.resolve(null);
        if (metaTracking.clientIpAddress && metaTracking.clientIpProof) {
          return Promise.resolve(metaTracking);
        }
        if (metaIpCollectorPromise) return metaIpCollectorPromise;

        metaIpCollectorPromise = new Promise(function (resolve) {
          var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
          var timeoutId = window.setTimeout(function () {
            if (controller) controller.abort();
            resolve(null);
          }, 800);

          fetch(collectorUrl, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            cache: "no-store",
            signal: controller ? controller.signal : undefined
          })
            .then(function (response) {
              if (!response.ok) return null;
              return response.json();
            })
            .then(function (value) {
              if (!value || typeof value !== "object") return null;
              var ip = String(value.ip || "").trim().toLowerCase();
              var issuedAt = Number(value.issued_at);
              var proof = String(value.proof || "").trim();
              var nowSeconds = Math.floor(Date.now() / 1000);
              if (
                !ip ||
                !proof ||
                !Number.isInteger(issuedAt) ||
                issuedAt > nowSeconds + 30 ||
                nowSeconds - issuedAt > 600
              ) {
                return null;
              }
              metaTracking = mergeMetaTracking(metaTracking, {
                clientIpAddress: ip,
                clientIpIssuedAt: issuedAt,
                clientIpProof: proof
              });
              return metaTracking;
            })
            .then(resolve)
            .catch(function () { resolve(null); })
            .finally(function () {
              window.clearTimeout(timeoutId);
              metaIpCollectorPromise = null;
            });
        });

        return metaIpCollectorPromise;
      }

      function scheduleMetaClientIpCollection() {
        var run = function () { void collectMetaClientIpProof(); };
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 800 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      function scheduleOfficialMetaParamBuilder() {
        var run = function () {
          Promise.all([
            loadOfficialMetaParamBuilder(),
            collectMetaClientIpProof()
          ])
            .then(function (values) {
              if (!values[0]) return null;
              return collectOfficialMetaTracking();
            })
            .catch(function () {});
        };

        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 1200 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      window.__PUBLIC_META_COLLECT_PARAMS = function () {
        return officialMetaTracking;
      };

      function refreshMetaTracking(params, fallback) {
        var base = mergeMetaTracking(collectMetaTrackingParams(params), fallback || {});
        var collector = window.__PUBLIC_META_COLLECT_PARAMS;
        if (typeof collector !== "function") return Promise.resolve(base);
        return waitWithTimeout(Promise.resolve(collector()), 450)
          .then(function (value) {
            metaTracking = mergeMetaTracking(base, value || {});
            return metaTracking;
          })
          .catch(function () {
            metaTracking = base;
            return base;
          });
      }

      function waitWithTimeout(promise, timeoutMs) {
        var timeoutId;
        var timeout = new Promise(function (resolve) {
          timeoutId = window.setTimeout(function () { resolve(null); }, timeoutMs);
        });
        return Promise.race([promise, timeout]).then(function (value) {
          if (timeoutId) window.clearTimeout(timeoutId);
          return value;
        }, function () {
          if (timeoutId) window.clearTimeout(timeoutId);
          return null;
        });
      }

      function ensurePhonePromise() {
        if (isAtrioDestination()) return Promise.resolve(null);
        window.__PUBLIC_LANDING_PHONE_PROMISES = window.__PUBLIC_LANDING_PHONE_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_PHONE_PROMISES[cfg.slug];
        if (existing) return existing;
        var baseUrl = cfg.supabaseUrl;
        var anonKey = cfg.supabaseAnonKey;
        if (!baseUrl || !anonKey) return Promise.resolve(null);
        var endpoint = baseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-phone?name=" + encodeURIComponent(cfg.slug);
        var promise = fetch(endpoint, {
          headers: { apikey: anonKey, Authorization: "Bearer " + anonKey },
          cache: "no-store",
          keepalive: true
        }).then(function (response) {
          if (!response.ok) return null;
          return response.json();
        }).catch(function () {
          return null;
        });
        window.__PUBLIC_LANDING_PHONE_PROMISES[cfg.slug] = promise;
        return promise;
      }

      function clearPrewarmedPhonePromise() {
        try {
          if (window.__PUBLIC_LANDING_PHONE_PROMISES) {
            delete window.__PUBLIC_LANDING_PHONE_PROMISES[cfg.slug];
          }
        } catch (e) {}
      }


      function ensureAtrioPromise() {
        window.__PUBLIC_LANDING_ATRIO_PROMISES = window.__PUBLIC_LANDING_ATRIO_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_ATRIO_PROMISES[cfg.slug];
        if (existing) return observeTemplate7Destination(existing);
        var promise = Promise.resolve(window.__LB_IDENTITY_READY__ || true).then(function (ready) {
          if (ready !== true) return null;
          return fetch("/api/template7/destination", {
            method: "POST", credentials: "same-origin", cache: "no-store", keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ landing_id: cfg.landingId, landing_slug: cfg.slug })
          }).then(function (response) { return response.ok ? response.json() : null; });
        }).catch(function () { return null; });
        window.__PUBLIC_LANDING_ATRIO_PROMISES[cfg.slug] = promise;
        return observeTemplate7Destination(promise);
      }

      function observeTemplate7Destination(promise) {
        window.__T7_DESTINATION_STATES__ = window.__T7_DESTINATION_STATES__ || {};
        var states = window.__T7_DESTINATION_STATES__;
        if (!states[cfg.slug] || states[cfg.slug].promise !== promise) {
          var state = { promise: promise, settled: false, value: null };
          states[cfg.slug] = state;
          promise.then(function(value) { state.settled = true; state.value = value; }, function() { state.settled = true; });
        }
        return promise;
      }

      function clearPrewarmedAtrioPromise() {
        var state = window.__T7_DESTINATION_STATES__ && window.__T7_DESTINATION_STATES__[cfg.slug];
        if (state && (!state.settled || (state.value && (state.value.atrioClientId || state.value.atrio_client_id) &&
            (state.value.atrioId || state.value.atrio_id) && (state.value.atrioSlug || state.value.atrio_slug)))) return;
        try {
          if (window.__PUBLIC_LANDING_ATRIO_PROMISES) {
            delete window.__PUBLIC_LANDING_ATRIO_PROMISES[cfg.slug];
          }
        } catch (e) {}
      }

      function sendTrackBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/track", blob)) return Promise.resolve();
          } catch (e) {}
        }
        return fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).catch(function () {});
      }

      function sendJourneyStartBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/journey-start", blob)) return Promise.resolve(true);
          } catch (e) {}
        }
        return fetch("/api/journey-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).then(function (response) {
          return !!(response && response.ok);
        }).catch(function () {
          return false;
        });
      }

      function contactDedupKey(slug, externalId) {
        return "contact_sent:" + slug + ":" + externalId;
      }

      function wasContactRecentlySent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = contactDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < CONTACT_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markContactSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(contactDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function journeyStartDedupKey(slug, externalId) {
        return "journey_start_sent:" + slug + ":" + externalId;
      }

      function wasJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = journeyStartDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < JOURNEY_START_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(journeyStartDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function extractPhoneId(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return null;
        var direct = phoneData.phoneId != null ? phoneData.phoneId : phoneData.phone_id;
        if (direct != null && direct !== "") {
          var asNumber = Number(direct);
          return isFinite(asNumber) ? asNumber : direct;
        }
        return null;
      }

      function extractAssignedGerenciaSnapshot(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return {};
        var gerencia = phoneData.gerencia && typeof phoneData.gerencia === "object"
          ? phoneData.gerencia
          : {};
        var internalId = gerencia.id != null ? Number(gerencia.id) : null;
        var externalId = firstNonEmpty([
          gerencia.externalId,
          gerencia.external_id,
          gerencia.gerencia_id,
          internalId
        ]);
        var name = firstNonEmpty([gerencia.name, gerencia.nombre]);
        var label = name && externalId ? name + " (ID " + externalId + ")" : (name || (externalId ? "Gerencia " + externalId : ""));
        return {
          assigned_gerencia_id: isFinite(internalId) && internalId > 0 ? internalId : undefined,
          assigned_gerencia_external_id: externalId || undefined,
          assigned_gerencia_name: name || undefined,
          assigned_gerencia_label: label || undefined
        };
      }

      function buildLandingJourneyStartPayload(params, identity, tracking, targetData) {
        var atrioMode = isAtrioDestination();
        var phoneData = atrioMode ? null : targetData;
        var assignedPhone = atrioMode ? "" : normalizePhone(
          (phoneData && phoneData.phone) || "",
          cfg.phoneCountryCode
        );
        var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
        return {
          event_name: "LandingPageView",
          slug: cfg.slug,
          landing_id: cfg.landingId,
          landing_name: cfg.landingName,
          target_provider: cfg.template === 7 ? cfg.targetProvider : undefined,
          skin_code: cfg.template === 7 && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
          workspace_currency: cfg.workspaceCurrency || undefined,
          external_id: identity.externalId,
          event_source_url: safeEventSourceUrl(),
          landing: cfg.slug,
              landing_resolution: landingResolution || "",
          facebook: params.get("facebook") || "",
          portofolio: params.get("portofolio") || "",
          cp: params.get("cp") || "",
          campana: params.get("campana") || "",
          conjunto: params.get("conjunto") || "",
          anuncio: params.get("anuncio") || "",
          utm_campaign: params.get("utm_campaign") || "",
          fbp: tracking.fbp,
          fbc: tracking.fbc,
          from_meta_ads: !!tracking.fbc,
          meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
          telefono_asignado: assignedPhone || undefined,
          assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
          assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
          assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
          assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
          device_type: deviceType(),
          client_ip_address: tracking.clientIpAddress || undefined,
          client_user_agent: navigator.userAgent || undefined
        };
      }

      function recordLandingJourneyStart() {
        if (journeyStartInFlight || !cfg.landingId) return;
        var params = queryParams();
        var identity = resolveIdentity(params);
        if (wasJourneyStartSent(cfg.slug, identity.externalId)) return;
        journeyStartInFlight = true;
        var tracking = collectMetaTrackingParams(params);
        var immediateBody = JSON.stringify(
          buildLandingJourneyStartPayload(params, identity, tracking, null)
        );
        sendJourneyStartBestEffort(immediateBody).then(function (sent) {
          if (sent) markJourneyStartSent(cfg.slug, identity.externalId);
          if (isAtrioDestination()) return sent;
          return ensurePhonePromise().then(function (phoneData) {
            if (!phoneData || !phoneData.phone) return sent;
            return sendJourneyStartBestEffort(JSON.stringify(
              buildLandingJourneyStartPayload(params, identity, tracking, phoneData)
            )).then(function (enrichedSent) {
              if (enrichedSent) markJourneyStartSent(cfg.slug, identity.externalId);
              return sent || enrichedSent;
            });
          });
        }).catch(function () {}).then(function () {
          journeyStartInFlight = false;
        });
      }

      function setButtonText(button, text) {
        var label = button.querySelector("[data-public-landing-cta-label]");
        if (label) label.textContent = text;
      }

      function getButtonLabel(button, attrName, fallback) {
        return button.getAttribute(attrName) || fallback;
      }

      function getRestButtonText(button) {
        return getButtonLabel(button, "data-public-landing-rest-label", cfg.ctaText);
      }

      function getLoadingButtonText(button) {
        return getButtonLabel(button, "data-public-landing-loading-label", "Abriendo...");
      }

      function getDisabledButtonText(button) {
        return getButtonLabel(button, "data-public-landing-disabled-label", "Sin numero disponible");
      }

      function setNoPhoneState(button) {
        button.disabled = true;
        setButtonText(button, getDisabledButtonText(button));
        if (noPhoneTimer) window.clearTimeout(noPhoneTimer);
        noPhoneTimer = window.setTimeout(function () {
          button.disabled = false;
          setButtonText(button, getRestButtonText(button));
          clickLocked = false;
          noPhoneTimer = null;
        }, 2000);
      }

      function notifyPhoneClick(phoneData, phone) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var effectivePhoneMode = phoneData && (phoneData.phoneMode || (phoneData.phoneSelection && phoneData.phoneSelection.mode) || "");
          var phoneId = extractPhoneId(phoneData);
          if ((effectivePhoneMode === "fair" || effectivePhoneMode === "random") && baseUrl && anonKey && phoneId != null) {
            var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/phone-click";
            fetch(notifyUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: anonKey,
                Authorization: "Bearer " + anonKey
              },
              body: JSON.stringify({
                landingName: (phoneData && phoneData.landingName) || cfg.landingName,
                phoneId: phoneId,
                phone: phone,
                reservationId: (phoneData && phoneData.assignmentReservationId) || undefined
              }),
              keepalive: true
            }).catch(function () {});
          }
        } catch (e) {}
      }

      function notifyTemplate6CardClick(button) {
        try {
          if (cfg.template !== 6 || !cfg.landingId || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
          var cardIndex = Number(button.getAttribute("data-template6-card-index"));
          if (!Number.isInteger(cardIndex) || cardIndex < 1 || cardIndex > 6) return;
          fetch(cfg.supabaseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-card-click", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: cfg.supabaseAnonKey,
              Authorization: "Bearer " + cfg.supabaseAnonKey
            },
            body: JSON.stringify({ landingId: cfg.landingId, cardIndex: cardIndex, eventId: safeUUID() }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function notifyAtrioClick(atrioData) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var atrioClientId = firstNonEmpty([
            atrioData && atrioData.atrioClientId,
            atrioData && atrioData.atrio_client_id,
            cfg.atrioClientId
          ]);
          if (!baseUrl || !anonKey || !atrioClientId) return;
          var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/atrio-click";
          fetch(notifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: anonKey,
              Authorization: "Bearer " + anonKey
            },
            body: JSON.stringify({
              landingName: cfg.landingName || cfg.slug,
              atrioClientId: atrioClientId
            }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function firePixelContact(eventId) {
        try {
          if (!cfg.sendContactPixel || !window.fbq) return;
          window.fbq("track", "Contact", { source: "main_button" }, { eventID: eventId });
        } catch (e) {}
      }

      function createContactPrearm() {
        var params = queryParams();
        var promoCode = generatePromoCode(cfg.landingTag || "LP");
        var identity = resolveIdentity(params);
        var tracking = collectMetaTrackingParams(params);
        var testEventCode = params.get("test_event_code") || "";
        sanitizeSensitiveQueryParams();

        return {
          params: params,
          promoCode: promoCode,
          message: buildMessage(promoCode),
          eventId: safeUUID(),
          identity: identity,
          tracking: tracking,
          testEventCode: testEventCode,
          shouldSkipContact: testEventCode ? false : wasContactRecentlySent(cfg.slug, identity.externalId),
          createdAt: Date.now()
        };
      }

      function prearmContactContext() {
        try {
          prearmedContact = createContactPrearm();
        } catch (e) {
          prearmedContact = null;
        }
      }

      function consumeContactContext() {
        if (cfg.template === 7 && template7AttemptContext) return template7AttemptContext;
        var context = prearmedContact || createContactPrearm();
        prearmedContact = null;
        window.setTimeout(prearmContactContext, 0);
        if (cfg.template === 7) template7AttemptContext = context;
        return context;
      }

      function hasLeadCaptureFields() {
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        return leadCapture.enabled === true &&
          (fields.firstName === true || fields.lastName === true || fields.phone === true || fields.email === true);
      }

      function shouldShowLeadCapture(button) {
        if (cfg.template === 7) return false;
        if (!hasLeadCaptureFields()) return false;
        return button.getAttribute("data-public-landing-auto-start") !== "true";
      }

      function closeLeadCaptureModal() {
        if (!leadCaptureModal) return;
        leadCaptureModal.hidden = true;
        document.body.classList.remove("public-lead-capture-open");
        pendingLeadCaptureButton = null;
      }

      function continueAfterLeadCapture(capture) {
        var button = pendingLeadCaptureButton;
        closeLeadCaptureModal();
        if (button) processCtaClick(button, capture || null);
      }

      function createLeadCaptureInput(name, label, type, autocomplete) {
        var wrapper = document.createElement("label");
        wrapper.className = "public-lead-capture__field";
        var input = document.createElement("input");
        input.type = type;
        input.name = name;
        input.autocomplete = autocomplete;
        input.setAttribute("aria-label", label);
        input.placeholder = label;
        input.className = "public-lead-capture__input";
        wrapper.appendChild(input);
        return wrapper;
      }

      function initLeadCaptureModal() {
        if (!hasLeadCaptureFields() || leadCaptureModal) return;
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        var overlay = document.createElement("div");
        overlay.className = "public-lead-capture";
        overlay.hidden = true;
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "public-lead-capture-title");

        var card = document.createElement("form");
        card.className = "public-lead-capture__card";
        card.noValidate = true;

        var close = document.createElement("button");
        close.type = "button";
        close.className = "public-lead-capture__close";
        close.setAttribute("aria-label", "Omitir formulario e ir a WhatsApp");
        close.textContent = "\xD7";

        var title = document.createElement("h2");
        title.id = "public-lead-capture-title";
        title.textContent = String(leadCapture.title || "Desbloque\xE1 atenci\xF3n personalizada");

        var description = document.createElement("p");
        description.className = "public-lead-capture__description";
        description.textContent = String(leadCapture.description || "");

        var grid = document.createElement("div");
        grid.className = "public-lead-capture__grid";
        if (fields.firstName === true) grid.appendChild(createLeadCaptureInput("firstName", "Nombre", "text", "given-name"));
        if (fields.lastName === true) grid.appendChild(createLeadCaptureInput("lastName", "Apellido", "text", "family-name"));
        if (fields.phone === true) grid.appendChild(createLeadCaptureInput("phone", "Tel\xE9fono", "tel", "tel"));
        if (fields.email === true) grid.appendChild(createLeadCaptureInput("email", "Email", "email", "email"));

        var actions = document.createElement("div");
        actions.className = "public-lead-capture__actions";
        var skip = document.createElement("button");
        skip.type = "button";
        skip.className = "public-lead-capture__skip";
        skip.textContent = "OMITIR E IR A WHATSAPP";
        var submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "public-lead-capture__submit";
        submit.textContent = "CONTINUAR A WHATSAPP \u2192";
        actions.appendChild(skip);
        actions.appendChild(submit);

        card.appendChild(close);
        card.appendChild(title);
        if (description.textContent) card.appendChild(description);
        card.appendChild(grid);
        card.appendChild(actions);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        leadCaptureModal = overlay;

        function readCaptureValues() {
          var data = {};
          Array.prototype.slice.call(card.querySelectorAll("input[name]")).forEach(function (input) {
            data[input.name] = String(input.value || "").trim();
          });
          return data;
        }

        card.addEventListener("submit", function (event) {
          event.preventDefault();
          continueAfterLeadCapture(readCaptureValues());
        });
        skip.addEventListener("click", function () { continueAfterLeadCapture(null); });
        close.addEventListener("click", function () { continueAfterLeadCapture(null); });
        overlay.addEventListener("click", function (event) {
          if (event.target === overlay) continueAfterLeadCapture(null);
        });
        document.addEventListener("keydown", function (event) {
          if (!leadCaptureModal || leadCaptureModal.hidden) return;
          if (event.key === "Escape") continueAfterLeadCapture(null);
        });
      }

      function openLeadCaptureModal(button) {
        initLeadCaptureModal();
        if (!leadCaptureModal) {
          processCtaClick(button, null);
          return;
        }
        pendingLeadCaptureButton = button;
        var inlineEmail = readInlineEmail();
        var modalEmail = leadCaptureModal.querySelector('input[name="email"]');
        if (modalEmail && cfg.emailCapture && cfg.emailCapture.enabled === true) modalEmail.value = inlineEmail;
        leadCaptureModal.hidden = false;
        document.body.classList.add("public-lead-capture-open");
        window.setTimeout(function () {
          var first = leadCaptureModal.querySelector("input, button");
          if (first && typeof first.focus === "function") first.focus();
        }, 0);
      }

      function handleCtaClick(button) {
        if (clickLocked || button.disabled) return;
        var entryName = document.querySelector("[data-template7-name]");
        if (!entryName || !String(entryName.value || "").trim()) return;
        template7EntryGeneration++;
        window.__T7_ENTRY_STARTED__ = true;
        window.__T7_ENTRY_STARTED__ = true;
        if (!template7IdentityReady) {
          if (!template7PendingIdentityClick) { template7PendingIdentityClick = button; button.disabled = true; if (template7Transition) template7Transition.start("preparing"); }
          if (!template7IdentityWaiting && window.__LB_BOOTSTRAP_IDENTITY__) {
            template7IdentityWaiting = true;
            window.__LB_BOOTSTRAP_IDENTITY__().then(releaseTemplate7Identity, function () { releaseTemplate7Identity(false); });
          }
          return;
        }
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7) {
          var nameInput = document.querySelector("[data-template7-name]");
          var whatsappInput = document.querySelector("[data-template7-whatsapp]");
          var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
          var firstName = nameInput ? String(nameInput.value || "").trim() : "";
          if (!firstName) {
            if (nameInput) nameInput.focus();
            button.disabled = true;
            return;
          }
          var rawWhatsapp = whatsappInput ? String(whatsappInput.value || "").trim() : "";
          var normalizedWhatsapp = rawWhatsapp ? normalizeArgentinaWhatsapp(rawWhatsapp) : "";
          if (whatsappWarning) {
            whatsappWarning.textContent = rawWhatsapp && !normalizedWhatsapp
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          }
          processCtaClick(button, { firstName: firstName, phone: normalizedWhatsapp });
          return;
        }
        if (shouldShowLeadCapture(button)) {
          openLeadCaptureModal(button);
          return;
        }
        processCtaClick(button, null);
      }

      function processCtaClick(button, leadCaptureValues) {
        var entryAttempt = template7EntryGeneration;
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7 && !String(leadCaptureValues && leadCaptureValues.firstName || "").trim()) return;
        if (cfg.template === 7 && window.__entryFunnel) {
          if (!window.__T7_EARLY_CTA_RECORDED__) window.__entryFunnel.emit("cta_clicked");
          window.__T7_EARLY_CTA_RECORDED__ = false;
        }
        if (cfg.template === 7) { setTemplate7Error(""); if (template7Transition) template7Transition.start("creating"); }
        clickLocked = true;
        button.disabled = true;
        if (cfg.template !== 7) setButtonText(button, getLoadingButtonText(button));
        notifyTemplate6CardClick(button);
        var tapStartedAt = Date.now();

        window.requestAnimationFrame(function () {
          if (entryAttempt !== template7EntryGeneration) return;
          var context = consumeContactContext();
          var params = context.params;
          var promoCode = context.promoCode;
          var message = context.message;
          var eventId = context.eventId;
          var inlineEmail = readInlineEmail();
          var safeCapture = leadCaptureValues;
          if (safeCapture && cfg.emailCapture && cfg.emailCapture.enabled === true) {
            var typedEmail = String(safeCapture.email || "").trim();
            safeCapture = Object.assign({}, safeCapture, {
              email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(typedEmail) ? typedEmail : ""
            });
          }
          var baseIdentity = inlineEmail
            ? Object.assign({}, context.identity, { emailRaw: inlineEmail, email: normalizeEmail(inlineEmail) })
            : context.identity;
          var identity = applyLeadCaptureToIdentity(baseIdentity, safeCapture);
          var captureFields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
          var hasLeadCaptureForm = !!leadCaptureValues;
          var formFn = hasLeadCaptureForm && (cfg.template === 7 || captureFields.firstName)
            ? String(leadCaptureValues.firstName || "").trim()
            : "";
          var formLn = hasLeadCaptureForm && captureFields.lastName
            ? String(leadCaptureValues.lastName || "").trim()
            : "";
          var formEmail = hasLeadCaptureForm && captureFields.email
            ? normalizeEmail(safeCapture.email || "")
            : "";
          var formPhoneRaw = hasLeadCaptureForm && (captureFields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
            ? String(leadCaptureValues.phone || "").trim()
            : "";
          var formPhone = formPhoneRaw
            ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(formPhoneRaw) : normalizePhone(formPhoneRaw, cfg.phoneCountryCode))
            : "";
          var tracking = context.tracking;
          var testEventCode = context.testEventCode;
          var shouldSkipContact = context.shouldSkipContact || (cfg.template === 7 && template7ContactSent);

          Promise.all([
            refreshMetaTracking(params, tracking),
            isAtrioDestination()
              ? waitWithTimeout(ensureAtrioPromise(), 1500)
              : waitWithTimeout(ensurePhonePromise(), 1500)
          ])
            .then(function (resolved) {
              tracking = resolved[0];
              return resolved[1];
            })
            .then(function (targetData) {
              if (isAtrioDestination()) {
                if (targetData && (cfg.template === 7
                  ? firstNonEmpty([targetData.atrioClientId, targetData.atrio_client_id]) && firstNonEmpty([targetData.atrioId, targetData.atrio_id]) && firstNonEmpty([targetData.atrioSlug, targetData.atrio_slug])
                  : (targetData.atrioRedirectUrl || targetData.atrio_redirect_url))) return targetData;
                clearPrewarmedAtrioPromise();
                return waitWithTimeout(ensureAtrioPromise(), 2500);
              }
              if (targetData && targetData.phone) return targetData;
              clearPrewarmedPhonePromise();
              return waitWithTimeout(ensurePhonePromise(), 2500);
            })
            .then(function (targetData) {
              if (entryAttempt !== template7EntryGeneration) return;
              var atrioMode = isAtrioDestination();
              var gatewayMode = cfg.template === 7;
              var atrioData = atrioMode ? (targetData || {}) : null;
              var phoneData = atrioMode ? null : targetData;
              var phone = atrioMode ? "" : normalizePhone(
                (phoneData && phoneData.phone) || "",
                cfg.phoneCountryCode
              );
              var redirectUrl = gatewayMode ? "" : atrioMode
                ? buildAtrioRedirectUrl(promoCode, atrioData)
                : "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
              if (gatewayMode && (!firstNonEmpty([atrioData.atrioClientId, atrioData.atrio_client_id]) || !firstNonEmpty([atrioData.atrioId, atrioData.atrio_id]) || !firstNonEmpty([atrioData.atrioSlug, atrioData.atrio_slug]))) {
                if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "destination_unavailable" });
                failTemplate7(button);
                return;
              }
              if (gatewayMode && window.__entryFunnel) window.__entryFunnel.emit("destination_ready");
              if ((!atrioMode && !phone) || (atrioMode && !gatewayMode && !redirectUrl)) {
                setNoPhoneState(button);
                return;
              }

              if (!shouldSkipContact) {
                firePixelContact(eventId);
              }

              if (!atrioMode) {
                notifyPhoneClick(phoneData, phone);
              } else {
                notifyAtrioClick(atrioData);
              }

              var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
              var payload = {
                event_name: "Contact",
                target_provider: gatewayMode ? cfg.targetProvider : undefined,
                skin_code: gatewayMode && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
                meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
                sendContactPixel: cfg.sendContactPixel,
                event_id: eventId,
                external_id: identity.externalId,
                event_source_url: safeEventSourceUrl(),
                email: identity.emailRaw,
                phone: identity.ph || identity.phoneRaw,
                phone_country_code: cfg.phoneCountryCode || undefined,
                currency: cfg.workspaceCurrency || undefined,
                workspace_currency: cfg.workspaceCurrency || undefined,
                lead_capture_form: hasLeadCaptureForm || undefined,
                form_fn: formFn || undefined,
                form_ln: formLn || undefined,
                form_email: formEmail || undefined,
                form_phone: formPhone || undefined,
                fn: identity.fn || undefined,
                ln: identity.ln || undefined,
                ct: identity.ct || undefined,
                st: identity.st || undefined,
                zip: identity.zip || undefined,
                country: identity.country || undefined,
                landing: cfg.slug,
              landing_resolution: landingResolution || "",
                facebook: params.get("facebook") || "",
                portofolio: params.get("portofolio") || "",
                cp: params.get("cp") || "",
                campana: params.get("campana") || "",
                conjunto: params.get("conjunto") || "",
                anuncio: params.get("anuncio") || "",
                utm_campaign: params.get("utm_campaign") || "",
                test_event_code: testEventCode || undefined,
                fbp: tracking.fbp,
                fbc: tracking.fbc,
                client_ip_address: tracking.clientIpAddress || undefined,
                client_ip_issued_at: tracking.clientIpIssuedAt || undefined,
                client_ip_proof: tracking.clientIpProof || undefined,
                client_user_agent: navigator.userAgent || undefined,
                telefono_asignado: atrioMode ? "" : phone,
                assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
                assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
                assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
                assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
                promo_code: promoCode,
                source: "main_button",
                source_platform: "landing",
                cta_destination: atrioMode ? "atrio" : "whatsapp",
                redirect_channel: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "rey_de_ases_gateway"
                  : atrioMode ? "atrio" : "whatsapp",
                gateway_app_id: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "reydeases_gateway"
                  : undefined,
                atrio_redirect_url: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioRedirectUrl, atrioData && atrioData.atrio_redirect_url, cfg.atrioRedirectUrl]) : undefined,
                atrio_client_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id, cfg.atrioClientId]) : undefined,
                atrio_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id, cfg.atrioId]) : undefined,
                atrio_slug: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug, cfg.atrioSlug]) : undefined,
                brand: cfg.landingName,
                landing_id: cfg.landingId,
                landing_name: cfg.landingName,
                device_type: deviceType(),
                cta_tap_to_redirect_ms: Date.now() - tapStartedAt,
                mode: cfg.backgroundMode,
                api_meta: null
              };

              try {
                if (!shouldSkipContact) {
                  sendTrackBestEffort(JSON.stringify({
                    postUrl: cfg.postUrl,
                    payload: payload
                  }));
                }
              } catch (e) {}

              if (!shouldSkipContact) markContactSent(cfg.slug, identity.externalId);
              if (gatewayMode && !shouldSkipContact) template7ContactSent = true;

              if (gatewayMode) {
                startTemplate7Gateway(formFn, formPhone, promoCode, atrioData, tracking, params)
                  .then(function (handoffUrl) { if (entryAttempt === template7EntryGeneration) navigateTemplate7Handoff(handoffUrl); })
                  .catch(function () { failTemplate7(button, entryAttempt); });
              } else {
                window.setTimeout(function () {
                  window.location.assign(redirectUrl);
                }, 180);
              }
            })
            .catch(function () {
              if (cfg.template === 7) failTemplate7(button, entryAttempt);
              else {
                clickLocked = false;
                button.disabled = false;
                setButtonText(button, getRestButtonText(button));
              }
            });
        });
      }

      function initCtas() {
        var ctas = Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-cta]"));
        ctas.forEach(function (button) {
          button.addEventListener("click", function () { handleCtaClick(button); });
        });

        // Al volver de WhatsApp con la pagina restaurada desde bfcache, un CTA nuevo
        // necesita una asignacion nueva; la deduplicacion de Contact sigue en storage.
        window.addEventListener("pageshow", function (event) {
          if (!event.persisted || cfg.template !== 6) return;
          clickLocked = false;
          ctas.forEach(function (button) {
            button.disabled = false;
            setButtonText(button, getRestButtonText(button));
          });
          clearPrewarmedPhonePromise();
          if (!isAtrioDestination()) ensurePhonePromise();
          prearmContactContext();
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-trigger]")).forEach(function (trigger) {
          trigger.addEventListener("click", function () {
            var firstCta = document.querySelector("[data-public-landing-cta]");
            if (firstCta) firstCta.click();
          });
        });

        var autoCta = document.querySelector("[data-public-landing-cta][data-public-landing-auto-start='true']");
        if (autoCta) {
          window.setTimeout(function () { autoCta.click(); }, 40);
        }
      }

      function initTemplate7Name() {
        if (cfg.template !== 7) return;
        var input = document.querySelector("[data-template7-name]");
        var whatsappInput = document.querySelector("[data-template7-whatsapp]");
        var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
        var button = document.querySelector(".template7__cta[data-public-landing-cta]");
        var form = document.querySelector("[data-template7-form]");
        if (!input || !button || !form) return;
        function sync() {
          if (clickLocked) return;
          button.disabled = !String(input.value || "").trim();
        }
        input.addEventListener("input", sync);
        if (whatsappInput && whatsappWarning) {
          whatsappInput.addEventListener("input", function () {
            if (!String(whatsappInput.value || "").trim() || normalizeArgentinaWhatsapp(whatsappInput.value)) {
              whatsappWarning.textContent = "";
              whatsappWarning.hidden = true;
            }
          });
          whatsappInput.addEventListener("blur", function () {
            var raw = String(whatsappInput.value || "").trim();
            whatsappWarning.textContent = raw && !normalizeArgentinaWhatsapp(raw)
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          });
        }
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          sync();
          if (!button.disabled) button.click();
          else input.focus();
        });
        window.addEventListener("pageshow", sync);
        sync();
      }

      function initPrivacyDialog() {
        var dialog = document.querySelector("[data-public-privacy-dialog]");
        var openButton = document.querySelector("[data-public-privacy-open]");
        if (!dialog || !openButton) return;

        function openDialog() {
          if (typeof dialog.showModal === "function") dialog.showModal();
          else dialog.setAttribute("open", "");
        }

        function closeDialog() {
          if (typeof dialog.close === "function") dialog.close();
          else dialog.removeAttribute("open");
        }

        openButton.addEventListener("click", openDialog);
        Array.prototype.slice.call(dialog.querySelectorAll("[data-public-privacy-close]")).forEach(function (button) {
          button.addEventListener("click", closeDialog);
        });
        dialog.addEventListener("click", function (event) {
          if (event.target === dialog) closeDialog();
        });
      }

      function parseImages(value) {
        try {
          var parsed = JSON.parse(value || "[]");
          return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } catch (e) {
          return [];
        }
      }

      function initialRotatingIndex(images, rotateEveryHours) {
        if (images.length <= 1) return 0;
        var everyMs = Math.max(1, Number(rotateEveryHours) || 24) * 60 * 60 * 1000;
        return Math.floor(Date.now() / everyMs) % images.length;
      }

      function initRotatingBackgrounds() {
        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-background]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.style.backgroundImage = "url(" + images[index] + ")";
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.style.backgroundImage = "url(" + images[index] + ")";
          }, everyMs);
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-image]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.setAttribute("src", images[index]);
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.setAttribute("src", images[index]);
          }, everyMs);
        });
      }

      function renderSocialProof(section, index) {
        var items = cfg.socialProofItems || [];
        if (!items.length) return;
        var item = items[index % items.length];
        var quote = section.querySelector("[data-public-landing-social-quote]");
        var meta = section.querySelector("[data-public-landing-social-meta]");
        var progress = section.querySelector("[data-public-landing-social-progress]");
        if (quote) quote.textContent = '"' + item.quote + '"';
        if (meta) meta.innerHTML = item.name + ' <span aria-hidden="true">-</span> <span class="social-proof__stars">\u2605\u2605\u2605\u2605\u2605</span>';
        if (progress) {
          progress.style.animation = "none";
          void progress.offsetHeight;
          progress.style.animation = "";
        }
      }

      function template7RecoveryAttribution() {
        var params=queryParams(),tracking=collectMetaTrackingParams(params);
        var result={landing:cfg.slug,landing_resolution:landingResolution||'',target_provider:cfg.targetProvider,
          skin_code:cfg.targetProvider==='multi_skin'?cfg.skinCode:'',fbp:tracking.fbp||'',fbc:tracking.fbc||''};
        ['facebook','portofolio','cp','campana','conjunto','anuncio','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(key){var value=params.get(key);if(value)result[key]=value;});
        if(cfg.template8&&cfg.cardIndex)result.card_index=String(cfg.cardIndex);
        return result;
      }
      function warmTemplate7Entry() {
        function resume(advisor, name, promo) {
          // The server still reuses this identity on submit. A late background
          // response must never pull an actively typing visitor off the form.
          if (window.__T7_ENTRY_STARTED__ || window.__T7_FORM_INTERACTED__) return;
          var entryAttempt = ++template7EntryGeneration;
          window.__T7_ENTRY_STARTED__ = true; clickLocked = true;
          if (template7Transition) template7Transition.start('preparing');
          return fetchWithEntryRecovery('/api/template7/prepare', {
            method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({landing_id:cfg.landingId,landing_slug:cfg.slug,
              entry_funnel:window.__entryFunnel?window.__entryFunnel.context():undefined,
              atrio_client_id:advisor.atrioClientId || advisor.atrio_client_id,advisor_id:advisor.atrioId || advisor.atrio_id,
              advisor_slug:advisor.atrioSlug || advisor.atrio_slug,name:name,promo_code:promo,attribution:template7RecoveryAttribution()})
          }).then(function(response){if(!response.ok)throw new Error('entry pending');return response.json()}).then(function(result){
            if (entryAttempt !== template7EntryGeneration) return;
            if(!result || typeof result.handoff_url !== 'string')throw new Error('entry pending');
            navigateTemplate7Handoff(template7TransitionUrl(result.handoff_url));
          }).catch(function(){
            if (entryAttempt !== template7EntryGeneration) return;
            window.__T7_ENTRY_STARTED__ = false; clickLocked = false;
            if(template7Transition)template7Transition.finish();
            var nameField=document.querySelector('[data-template7-name]');if(nameField)nameField.value=name;
            setTemplate7Error('Tu acceso sigue pendiente. Pod\xE9s retomar el mismo intento sin volver a completar tus datos.');
          });
        }
        Promise.all([window.__LB_IDENTITY_READY__ || Promise.resolve(), ensureAtrioPromise()]).then(function (values) {
          var advisor = values[1];
          if (!advisor || window.__T7_ENTRY_STARTED__ || (window.__LB_IDENTITY_READY__ && values[0] !== true)) return;
          if (advisor.preparationReady) {
            if (!advisor.existingName || !advisor.promoCode || window.__T7_ENTRY_STARTED__) return;
            return resume(advisor,advisor.existingName,advisor.promoCode);
          }
          return fetch('/api/template7/warm', {
            method: 'POST', credentials: 'same-origin', cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ landing_id: cfg.landingId, landing_slug: cfg.slug,
              atrio_client_id: advisor.atrioClientId || advisor.atrio_client_id,
              advisor_id: advisor.atrioId || advisor.atrio_id,
              advisor_slug: advisor.atrioSlug || advisor.atrio_slug })
          }).then(function (response) { return response.ok ? response.json() : null; }).then(function (result) {
            if(result && typeof result.existing_name === 'string' && typeof result.promo_code === 'string') {
              advisor.preparationReady=true;advisor.existingName=result.existing_name;advisor.promoCode=result.promo_code;
              return resume(advisor,result.existing_name,result.promo_code);
            }
            if (result && typeof result.handoff_url === 'string' && !window.__T7_ENTRY_STARTED__ && !window.__T7_FORM_INTERACTED__) {
              var restored = new URL(result.handoff_url);
              if (restored.protocol === 'https:' && restored.pathname === '/prepare' && restored.searchParams.has('t')) {
                window.__T7_ENTRY_STARTED__ = true;
                navigateTemplate7Handoff(template7TransitionUrl(restored.href));
                return;
              }
            }
            if (!result || !result.gateway_origin) return;
            var destination = new URL(result.gateway_origin);
            if (destination.protocol !== 'https:') return;
            var link = document.createElement('link'); link.rel = 'preconnect'; link.href = destination.origin;
            document.head.appendChild(link);
            window.__T7_GATEWAY_WARM__ = window.__T7_GATEWAY_WARM__ || {};
            if (!window.__T7_GATEWAY_WARM__[destination.origin]) window.__T7_GATEWAY_WARM__[destination.origin] = fetch(destination.origin + '/api/preparations/warm', { mode: 'no-cors', credentials: 'omit', cache: 'no-store' }).catch(function () {});
            return window.__T7_GATEWAY_WARM__[destination.origin];
          });
        }).catch(function () {});
      }
      function init() {
        function markFormIntent(event) {
          var target=event.target;
          if(!window.__T7_PROGRAMMATIC_FOCUS__&&target&&target.closest&&target.closest('[data-template7-form]'))window.__T7_FORM_INTERACTED__=true;
        }
        document.addEventListener('focusin',markFormIntent,{passive:true});
        document.addEventListener('input',markFormIntent,{passive:true});
        document.addEventListener('pointerdown',markFormIntent,{passive:true});
        warmTemplate7Entry();
        if (cfg.template === 7 && window.__LB_IDENTITY_READY__) {
          window.__LB_IDENTITY_READY__.then(function () {
            recordLandingJourneyStart();
            prearmContactContext();
            window.setTimeout(prearmContactContext, 700);
          });
        } else {
          recordLandingJourneyStart();
          prearmContactContext();
          window.setTimeout(prearmContactContext, 700);
        }
        if (isAtrioDestination()) ensureAtrioPromise();
        else ensurePhonePromise();
        scheduleMetaClientIpCollection();
        scheduleOfficialMetaParamBuilder();
        initRotatingBackgrounds();
        initCtas();
        initTemplate7Name();
        initInlineEmail();



        initPrivacyDialog();
      }

      init();
      window.__T7_RUNTIME_READY__=true;
      if(window.__T7_ASSET_READY__)window.__T7_ASSET_READY__();
      var early=window.__T7_EARLY_ACTION__;
      window.__T7_EARLY_ACTION__=null;
      if(early&&early.isConnected&&!early.disabled)early.click();
    })();
`
  },
  "t7-classic": {
    name: "t7-classic-f2a360541fac871e5c6f55c4.js",
    source: `
    (function () {
      if(window.__TEMPLATE7_REENTRY_PENDING__||window.__T7_RUNTIME_BOOTING__||window.__T7_RUNTIME_READY__)return;
      window.__T7_RUNTIME_BOOTING__=true;
      var cfg = window.__PUBLIC_LANDING_RUNTIME_CONFIG__ || {};
      try { delete window.__PUBLIC_LANDING_RUNTIME_CONFIG__; } catch (e) {}
      try { ((function(){var __name=function(fn){return fn;};return (function installEntryFunnel(config, suppliedContext, endpoint = "/api/entry-funnel") {
  const browser = window;
  if (browser.__entryFunnel) {
    if (!suppliedContext || browser.__entryFunnel.flowId === suppliedContext.flow_id) return browser.__entryFunnel;
    browser.__entryFunnel.stop();
  }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const template = suppliedContext?.template || (config.template8 || config.template === 8 ? 8 : config.template);
  const landing = suppliedContext?.landing_id || config.landingId;
  if (![7, 8].includes(Number(template)) || !uuid.test(String(landing))) return;
  const allowed = ["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "skin_selected", "cta_clicked", "destination_ready", "account_ready", "login_confirmed", "gateway_loaded", "chat_ready", "entry_error", "visibility_hidden", "resumed"];
  const errors = ["destination_unavailable", "account_unavailable", "prepare_rejected", "prepare_unavailable", "login_unavailable", "session_unavailable", "chat_unavailable", "request_timeout", "network_error", "rate_limited", "invalid_entry", "unknown"];
  const providers = ["rey_de_ases", "ases_del_norte", "ganamos_net", "multi_skin"];
  const skins = ["jugamos", "ganamos_plus", "casino_zeus", "bet30", "gana_en_casa", "celu_apuestas", "casino_zeta", "oro_puro", "fortu_bet", "gran_poseidon", "kona_bet", "mega_faraon", "camel_bet", "rhino_play"];
  const key = "entry-funnel:v1:" + landing;
  const now = Date.now();
  function id() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }
  const early = browser.__ENTRY_FUNNEL_EARLY__;
  let context = suppliedContext;
  try {
    if (!context) {
      const stored = early?.context || JSON.parse(sessionStorage.getItem(key) || "null");
      if (stored && uuid.test(stored.flow_id) && stored.landing_id === landing && stored.template === template && stored.telemetry_origin === location.origin && Number.isSafeInteger(stored.started_at) && stored.started_at <= now && stored.started_at > now - 864e5) context = stored;
    }
  } catch {
  }
  const earlyStart = Number(early?.started_at);
  if (!context) context = { landing_id: String(landing), flow_id: id(), template, telemetry_origin: location.origin, started_at: Number.isSafeInteger(earlyStart) && earlyStart <= now && earlyStart > now - 864e5 ? earlyStart : now };
  const flow = context;
  try {
    sessionStorage.setItem(key, JSON.stringify(flow));
  } catch {
  }
  let queue = [];
  let timer;
  let inflight = false;
  let count = 0;
  let active = true;
  let retries = 0;
  const seen = /* @__PURE__ */ new Set();
  const pendingKey = key + ":pending";
  try {
    const pending = JSON.parse(sessionStorage.getItem(pendingKey) || "null");
    if (pending?.flow_id === flow.flow_id && Array.isArray(pending.events)) {
      queue = pending.events.slice(0, 20).filter((e) => uuid.test(String(e.id)) && allowed.includes(String(e.name)));
    }
  } catch {
  }
  function saveQueue() {
    try {
      sessionStorage.setItem(pendingKey, JSON.stringify({ flow_id: flow.flow_id, events: queue }));
    } catch {
    }
  }
  function flush(beacon = false) {
    if (!active) return;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    if (!queue.length || inflight && !beacon) return;
    const events = queue.slice(0, 20);
    const payload = JSON.stringify({ landing_id: flow.landing_id, flow_id: flow.flow_id, template: flow.template, events });
    if (beacon && navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon(endpoint, new Blob([payload], { type: "text/plain" }))) return;
      } catch {
      }
    }
    inflight = true;
    fetch(endpoint, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, credentials: "same-origin", keepalive: true, cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error("unavailable");
      const sent = new Set(events.map((e) => e.id));
      queue = queue.filter((e) => !sent.has(e.id));
      retries = 0;
      saveQueue();
    }).catch(() => {
      retries += 1;
    }).finally(() => {
      inflight = false;
      if (active && queue.length && retries <= 1 && document.visibilityState !== "hidden") timer = setTimeout(() => flush(), 1800);
    });
  }
  function emit(name, details = {}) {
    if (!active || !allowed.includes(name) || count >= 80) return;
    const provider = details.provider || config.targetProvider;
    const skin = details.skin || config.skinCode;
    const once = !["cta_clicked", "entry_error", "visibility_hidden", "resumed"].includes(name);
    const stageKey = name + ":" + String(provider || "") + ":" + String(skin || "");
    if (once && seen.has(stageKey)) return;
    seen.add(stageKey);
    count += 1;
    const event = {
      id: uuid.test(String(details.event_id)) ? details.event_id : id(),
      name,
      elapsed_ms: Math.max(0, Math.min(864e5, Number.isSafeInteger(details.elapsed_ms) ? Number(details.elapsed_ms) : Date.now() - flow.started_at))
    };
    if (providers.includes(String(provider))) event.provider = provider;
    if (skins.includes(String(skin))) event.skin = skin;
    if (name === "entry_error") event.error_code = errors.includes(String(details.error_code)) ? details.error_code : "unknown";
    if (Number.isInteger(details.status) && Number(details.status) >= 100 && Number(details.status) <= 599) event.status = details.status;
    queue.push(event);
    if (queue.length > 40) queue = queue.slice(-40);
    saveQueue();
    if (!timer) timer = setTimeout(() => flush(), 500);
  }
  const api = { flowId: flow.flow_id, emit, flush, context: () => ({ ...flow }), stop: () => {
    active = false;
    if (timer) clearTimeout(timer);
  } };
  browser.__entryFunnel = api;
  if (!suppliedContext && Array.isArray(early?.events)) {
    early.events.slice(0, 8).forEach((event) => {
      if (["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "cta_clicked", "entry_error"].includes(event.name) && Number.isSafeInteger(event.at) && event.at >= flow.started_at && event.at <= Date.now()) emit(event.name, { elapsed_ms: event.at - flow.started_at, event_id: event.id, error_code: event.error_code });
    });
    delete browser.__ENTRY_FUNNEL_EARLY__;
  }
  if (!suppliedContext) {
    const visibleForm = () => {
      if (document.visibilityState === "hidden") return;
      emit("page_visible");
      const form = document.querySelector("[data-template7-form]");
      if (form && form.getClientRects().length) emit("form_visible");
    };
    document.addEventListener("focusin", (event) => {
      if (event.target?.matches?.("[data-template7-name]")) {
        visibleForm();
        emit("name_focus");
      }
    });
    document.addEventListener("input", (event) => {
      const target = event.target;
      if (!target?.matches?.("[data-template7-name]")) return;
      if (target.value.length > 0) emit("name_started");
      if (target.value.trim() && target.checkValidity()) emit("name_valid");
    });
    const begin = () => {
      requestAnimationFrame(visibleForm);
      const observer = new MutationObserver(visibleForm);
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "class"] });
      setTimeout(() => observer.disconnect(), 12e4);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", begin, { once: true });
    else begin();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      emit("visibility_hidden");
      flush(true);
    } else {
      emit("resumed");
      if (!suppliedContext) emit("page_visible");
      flush();
    }
  });
  window.addEventListener("pagehide", () => flush(true));
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      emit("resumed");
      flush();
    }
  });
  return api;
});})())(cfg); } catch (_) {}
function getOrCreateDeviceId(){return window.__TEMPLATE7_GET_DEVICE_ID__();}
      var clickLocked = false;
      var landingResolution = (function captureLandingResolution(slug, allowAutomatic = false) {
  if (!globalThis.window) return null;
  const browser = window;
  const saved = browser.__LANDING_RESOLUTION__;
  if (saved?.slug === slug && saved.url === window.location.href) return saved.value;
  const url = new URL(window.location.href);
  const selections = url.searchParams.getAll("landing");
  const automatic = url.searchParams.getAll("__landing_auto");
  let value = null;
  let pathname = url.pathname.replace(/\\/$/, "");
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
  }
  if (selections.length === 1 && selections[0].trim() === slug) {
    value = "url_parameter";
  } else if (!selections.length || selections.length === 1 && !selections[0].trim()) {
    const expectedPath = allowAutomatic ? \`/\${slug}\` : \`/l/\${slug}\`;
    if (pathname === expectedPath) {
      value = allowAutomatic && automatic.length === 1 && automatic[0] === slug ? "automatic" : "path";
    }
  }
  if (url.searchParams.has("__landing_auto")) {
    url.searchParams.delete("__landing_auto");
    try {
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    } catch {
    }
  }
  browser.__LANDING_RESOLUTION__ = { slug, url: window.location.href, value };
  return value;
})(cfg.slug, cfg.automaticLandingSelection === true);
      var template7ContactSent = false;
      var template7AttemptContext = null;
      var noPhoneTimer = null;
      var metaTracking = {
        fbp: "",
        fbc: "",
        clientIpAddress: "",
        clientIpIssuedAt: null,
        clientIpProof: ""
      };
      var metaIpCollectorPromise = null;
      var metaParamBuilderPromise = null;
      var officialMetaTracking = null;
      var prearmedContact = null;
      var journeyStartInFlight = false;
      var leadCaptureModal = null;
      var pendingLeadCaptureButton = null;
      var CONTACT_DEDUP_TTL_MS = 5 * 60 * 1000;
      var JOURNEY_START_DEDUP_TTL_MS = CONTACT_DEDUP_TTL_MS;
      var SOCIAL_PROOF_INTERVAL_MS = 5000;

      function queryParams() {
        try { return new URLSearchParams(window.location.search); }
        catch (e) { return new URLSearchParams(); }
      }

      function deviceType() {
        var ua = (navigator.userAgent || "").toLowerCase();
        if (/tablet|ipad/.test(ua)) return "tablet";
        if (/mobi|iphone|android/.test(ua)) return "mobile";
        return "desktop";
      }

      function normalizePhone(raw, rawCountryCallingCode) {
  var digits = String(raw || "").replace(/\\D+/g, "");
  var countryCallingCode = String(rawCountryCallingCode || "").replace(/\\D+/g, "");
  if (!digits) return "";
  if (digits.indexOf("00") === 0) digits = digits.slice(2);
  if (countryCallingCode && digits.indexOf(countryCallingCode) === 0) return digits;

  var national = digits.replace(/^0+/, "");
  if (countryCallingCode === "54") {
    national = national.replace(/^15/, "");
    return national.length === 10 ? "54" + national : digits;
  }
  if (countryCallingCode === "595") {
    return national.length === 9 ? "595" + national : digits;
  }
  return digits;
}
      function normalizeArgentinaWhatsapp(rawValue){var digits=String(rawValue==null?"":rawValue).replace(/\\D/g,"");if(!digits)return"";if(digits.indexOf("00")===0)digits=digits.slice(2);digits=digits.replace(/^0+/,"");var national=digits;if(digits.indexOf("54")===0)national=digits.slice(2);else if(digits.indexOf("9")===0&&digits.length===11)national=digits.slice(1);national=national.replace(/^0+/,"");if(national.indexOf("9")===0&&national.length===11)national=national.slice(1);if(national.length===12){var lengths=[2,3,4];for(var i=0;i<lengths.length;i++){var areaLength=lengths[i];if(national.slice(areaLength,areaLength+2)!=="15")continue;var candidate=national.slice(0,areaLength)+national.slice(areaLength+2);if(candidate.length===10){national=candidate;break}}}return/^[1-9]\\d{9}$/.test(national)?"549"+national:""}

    function template7WebviewKind(ua) {
      var text = String(ua || "");
      var inApp = /Instagram|FBAN|FBAV|FB_IAB|FB4A|Messenger|TikTok|Bytedance|Musical_ly/i.test(text);
      if (/Android/i.test(text) && (inApp || /(?:;|\\s)wv(?:;|\\))/i.test(text))) return "android";
      if (/iPhone|iPad|iPod/i.test(text) && inApp) return "ios";
      return "normal";
    }

    function template7CheckedHandoff(raw) {
      var url = new URL(String(raw || ""));
      if (url.protocol !== "https:" || url.username || url.password || url.hash ||
          (url.pathname !== "/prepare" && url.pathname !== "/start") ||
          url.searchParams.getAll("t").length !== 1 || !url.searchParams.get("t") || url.searchParams.get("t").length > 12000 ||
          url.searchParams.getAll("ef").length > 1 || (url.searchParams.has("ef") &&
          (!url.searchParams.get("ef") || url.searchParams.get("ef").length > 2003))) {
        throw new Error("invalid handoff");
      }
      if(url.pathname==="/prepare"&&url.searchParams.has("skin")&&(url.searchParams.getAll("skin").length!==1||
          ["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(url.searchParams.get("skin"))===-1||
          (typeof cfg!=="undefined"&&cfg.targetProvider&&cfg.targetProvider!=="multi_skin")))throw new Error("invalid handoff skin");
      // Attribution is captured on the landing before this navigation. Future
      // advertising parameters must neither reject nor authorize an entry.
      var token=url.searchParams.get("t"),funnel=url.searchParams.get("ef"),skin=url.pathname==="/prepare"?url.searchParams.get("skin"):null;
      url.search="";url.searchParams.set("t",token);
      if(funnel)url.searchParams.set("ef",funnel);
      if(skin)url.searchParams.set("skin",skin);
      return url;
    }

    function template7HandoffIntent(raw) {
      var url = template7CheckedHandoff(raw);
      return "intent://" + url.host + url.pathname + url.search +
        "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
        encodeURIComponent(url.href) + ";end";
    }

    function navigateTemplate7Handoff(raw) {
      var url = template7CheckedHandoff(raw);
      try { window.localStorage.setItem("template7:gateway-visited:" + url.origin, String(Date.now())); } catch(e) {}
      // A Meta in-app browser can complete this same first-party navigation.
      // User-agent detection alone is not evidence of a failed entry.
      try { window.location.assign(url.href); return; }
      catch (error) { showTemplate7HandoffFallback(url.href); }
    }

    function showTemplate7HandoffFallback(raw) {
      var url = template7CheckedHandoff(raw);
      var kind = template7WebviewKind(navigator.userAgent);
      if (template7Transition) template7Transition.finish();
      var panel = document.querySelector("[data-template7-handoff-panel]");
      if (!panel) {
        panel = document.createElement("div");
        panel.className = "template7__handoff-panel";
        panel.setAttribute("data-template7-handoff-panel", "");
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "true");
        panel.innerHTML = '<div class="template7__handoff-card"><h2>Continu\xE1 con tu acceso</h2>' +
          '<p data-template7-handoff-help></p><a data-template7-handoff-open>Continuar</a>' +
          '<button type="button" data-template7-handoff-copy>Copiar enlace</button>' +
          '<small>El enlace es temporal y de un solo uso. Abrilo una sola vez.</small></div>';
        document.body.appendChild(panel);
      }
      var help = panel.querySelector("[data-template7-handoff-help]");
      var open = panel.querySelector("[data-template7-handoff-open]");
      var copy = panel.querySelector("[data-template7-handoff-copy]");
      if (kind === "android") {
        help.textContent = "No se pudo abrir tu acceso en este navegador. Pod\xE9s continuar en Chrome con la misma cuenta.";
        open.textContent = "Abrir en Chrome";
        open.href = template7HandoffIntent(url.href);
      } else {
        help.textContent = "No se pudo abrir tu acceso. Intent\xE1 abrir el enlace o copialo para continuar en otro navegador con la misma cuenta.";
        open.textContent = "Abrir enlace";
        open.href = url.href;
        open.target = "_blank";
        open.rel = "noopener noreferrer";
      }
      copy.onclick = function () {
        if (!navigator.clipboard || !navigator.clipboard.writeText) return;
        navigator.clipboard.writeText(url.href).then(function () {
          copy.textContent = "Enlace copiado";
        }).catch(function () { copy.textContent = "No se pudo copiar"; });
      };
      open.focus();
    }

      var fetchWithEntryRecovery = async function fetchWithEntryRecovery(url, init, onRetry) {
  const deadline = Date.now() + 45e3;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (init.signal?.aborted) throw init.signal.reason || new Error("entry_cancelled");
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("entry_recovery_pending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(42e3, remaining));
    const cancel = () => controller.abort(init.signal?.reason);
    init.signal?.addEventListener("abort", cancel, { once: true });
    if (init.signal?.aborted) cancel();
    const feedback = onRetry ? setTimeout(onRetry, Math.min(8e3, remaining)) : void 0;
    let response;
    let failure;
    let retryAfter = 0;
    try {
      response = await fetch(url, Object.assign({}, init, { signal: controller.signal }));
      if (!response.ok && ![408, 429, 500, 502, 503, 504].includes(response.status)) return response;
      const received = response;
      response = void 0;
      const text = await received.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch (error) {
        if (received.ok) throw error;
      }
      response = new Response(text, { status: received.status, statusText: received.statusText, headers: received.headers });
      if (response.ok) return response;
      if (body && (body.retryable === false || ["integration_pending", "api2_not_configured", "landing_unavailable", "advisor_not_assigned"].includes(body.error))) return response;
      const header = response.headers.get("Retry-After");
      if (header) retryAfter = /^\\d+$/.test(header) ? Number(header) * 1e3 : Math.max(0, Date.parse(header) - Date.now());
      if (retryAfter > 6e4) return response;
    } catch (error) {
      failure = error;
    } finally {
      clearTimeout(timer);
      if (feedback !== void 0) clearTimeout(feedback);
      init.signal?.removeEventListener("abort", cancel);
    }
    if (init.signal?.aborted) throw init.signal.reason || failure || new Error("entry_cancelled");
    if (attempt === 3) {
      if (response) return response;
      throw failure;
    }
    if (onRetry) onRetry();
    const delay = Math.max(Number.isFinite(retryAfter) ? retryAfter : 0, [500, 1500, 3500][attempt]);
    if (Date.now() + delay >= deadline) {
      if (response) return response;
      throw failure || new Error("entry_recovery_pending");
    }
    await new Promise((resolve, reject) => {
      const abort = () => {
        clearTimeout(pause);
        init.signal?.removeEventListener("abort", abort);
        reject(init.signal?.reason || new Error("entry_cancelled"));
      };
      const pause = setTimeout(() => {
        init.signal?.removeEventListener("abort", abort);
        resolve();
      }, delay);
      init.signal?.addEventListener("abort", abort, { once: true });
      if (init.signal?.aborted) abort();
    });
  }
  throw new Error("entry_recovery_exhausted");
};
      function setTemplate7Error(message) {
        var error = document.querySelector("[data-template7-error]");
        if (!error) return;
        error.textContent = message || "";
        error.hidden = !message;
      }


function createGatewayEntryTransition(root) {
  if (!root) return null;
  var frame=null,origin="",wallet=false,timer=0,retryTimer=0,automaticRetries=0,previous=null,themeSnapshot=null,addedTheme=null,canvasSnapshot=null;
  function applyPalette(){if(themeSnapshot!==null)return;if(document.documentElement&&document.documentElement.style){canvasSnapshot=document.documentElement.style.getPropertyValue("--gateway-entry-canvas");document.documentElement.style.setProperty("--gateway-entry-canvas",root.dataset.palette)}themeSnapshot=Array.from(document.querySelectorAll('meta[name="theme-color"]')).map(function(meta){var previous=meta.getAttribute("content");meta.setAttribute("content",root.dataset.palette);return [meta,previous]});if(!themeSnapshot.length){addedTheme=document.createElement("meta");addedTheme.name="theme-color";addedTheme.content=root.dataset.palette;document.head.appendChild(addedTheme)}}
  function restorePalette(){if(themeSnapshot===null)return;if(canvasSnapshot!==null&&document.documentElement&&document.documentElement.style){if(canvasSnapshot)document.documentElement.style.setProperty("--gateway-entry-canvas",canvasSnapshot);else document.documentElement.style.removeProperty("--gateway-entry-canvas");canvasSnapshot=null}themeSnapshot.forEach(function(item){if(item[1]===null)item[0].removeAttribute("content");else item[0].setAttribute("content",item[1])});if(addedTheme)addedTheme.remove();themeSnapshot=null;addedTheme=null}
  var title=root.querySelector("[data-entry-title]"),description=root.querySelector("[data-entry-description]");
  var spinner=root.querySelector(".entry-spinner"),actions=root.querySelector(".entry-actions");
  function milestone(name,details){try{if(window.__gatewayEntryFunnel)window.__gatewayEntryFunnel.emit(name,details)}catch(e){}}
  function finish(){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(root.hidden)return;root.hidden=true;restorePalette();if(previous&&previous.isConnected)previous.focus({preventScroll:true})}
  function fail(message){if(root.hidden)return;clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;milestone("entry_error",{error_code:"chat_unavailable"});root.dataset.stage="error";title.textContent="No pudimos completar la conexi\xF3n";description.textContent=message;spinner.hidden=true;actions.hidden=false}
  function reconnect(message){if(root.hidden||retryTimer)return;if(!frame||automaticRetries>=1){fail(message);return}clearTimeout(timer);automaticRetries++;var currentFrame=frame,currentSource=frame.src;description.textContent="Estamos recuperando la conexi\xF3n con tu asesor.";retryTimer=setTimeout(function(){retryTimer=0;if(root.hidden||frame!==currentFrame||frame.src!==currentSource)return;start("connecting",true);frame.src=currentSource},750)}
  function start(stage,recovering){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(!recovering)automaticRetries=0;previous=document.activeElement;root.dataset.stage=stage;root.hidden=false;applyPalette();spinner.hidden=false;actions.hidden=true;title.textContent=stage==="preparing"?"Preparando tu acceso":stage==="creating"?"Creando tu cuenta":"Conectando con tu asesor";description.textContent=stage==="connecting"?"Tu sesi\xF3n en la plataforma est\xE1 lista.":"Estamos preparando tu acceso.";root.querySelectorAll("[data-entry-source]").forEach(function(el){el.srcset=el.dataset.srcset});root.querySelectorAll("[data-entry-logo]").forEach(function(el){el.src=el.dataset.src});root.focus({preventScroll:true});if(stage==="connecting")timer=setTimeout(function(){reconnect("La conexi\xF3n est\xE1 tardando m\xE1s de lo esperado. Pod\xE9s reintentar sin crear otra cuenta.")},20000)}
  root.querySelector("[data-entry-retry]").addEventListener("click",function(){if(frame){start("connecting");frame.src=frame.src}else finish()});
  root.querySelector("[data-entry-continue]").addEventListener("click",function(){finish();if(frame)frame.focus()});
  root.addEventListener("keydown",function(event){if(event.key!=="Tab")return;var buttons=actions.hidden?[]:Array.from(actions.querySelectorAll("button"));if(!buttons.length){event.preventDefault();root.focus();return}if(event.shiftKey&&(document.activeElement===buttons[0]||document.activeElement===root)){event.preventDefault();buttons[buttons.length-1].focus()}else if(!event.shiftKey&&(document.activeElement===buttons[buttons.length-1]||document.activeElement===root)){event.preventDefault();buttons[0].focus()}});
  window.addEventListener("focusin",function(event){if(!root.hidden&&!root.contains(event.target))root.focus({preventScroll:true})});
  window.addEventListener("message",function(event){var data=event.data;if(!frame||event.source!==frame.contentWindow||event.origin!==origin||!data||data.source!=="atrio-widget"||data.type!=="atrio.widget.entry-ready")return;if(!wallet||(data.walletReady===true&&data.walletRequestCompleted===true)||data.walletAvailable===false){milestone("chat_ready");finish();return}if(data.walletRequestCompleted===true&&data.walletAvailable===true&&data.walletReady===false)reconnect("El chat est\xE1 disponible, pero no pudimos obtener los datos para cargar. Pod\xE9s reintentar o continuar al chat.")});
  return {start:start,finish:finish,fail:fail,bind:function(value,allowedOrigin,needsWallet){frame=value;origin=allowedOrigin;wallet=needsWallet;milestone("gateway_loaded")}};
}

      var template7Transition = createGatewayEntryTransition(document.getElementById("gateway-entry-transition"));
      var template7EntryGeneration = 0;
      function template7TransitionUrl(raw) {
        var url = template7CheckedHandoff(raw);
        if (url.pathname === "/start") {
          url.pathname = "/prepare";
          if(cfg.targetProvider==="multi_skin"&&["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(cfg.skinCode)!==-1)url.searchParams.set("skin",cfg.skinCode);
        }
        return url.href;
      }
      function failTemplate7(button, attempt) {
        if (attempt !== undefined && attempt !== template7EntryGeneration) return;
        if (template7Transition) template7Transition.finish();
        if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "account_unavailable" });
        clickLocked = false;
        button.disabled = false;
        setButtonText(button, getRestButtonText(button));
        setTemplate7Error("Tu acceso sigue pendiente. Toc\xE1 el bot\xF3n para continuar con el mismo intento.");
      }

      function startTemplate7Gateway(name, phone, promoCode, atrioData, tracking, params) {
        if (atrioData && atrioData.preparationReady && atrioData.existingName && atrioData.promoCode) {
          name = atrioData.existingName; promoCode = atrioData.promoCode;
        }
        var advisorId = firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id]);
        var advisorSlug = firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug]);
        var atrioClientId = firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id]);
        if (!advisorId || !advisorSlug || !atrioClientId) return Promise.reject(new Error("advisor unavailable"));
        return fetchWithEntryRecovery("/api/template7/start", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: getOrCreateDeviceId(),
            landing_id: cfg.landingId,
            landing_slug: cfg.slug,
            entry_funnel: window.__entryFunnel ? window.__entryFunnel.context() : undefined,
            name: name,
            phone: phone || undefined,
            atrio_client_id: atrioClientId,
            advisor_id: advisorId,
            advisor_slug: advisorSlug,
            promo_code: promoCode,
            attribution: {
              utm_source: params.get("utm_source") || "",
              utm_medium: params.get("utm_medium") || "",
              landing: cfg.slug,
              landing_resolution: landingResolution || "",
              facebook: params.get("facebook") || "",
              portofolio: params.get("portofolio") || "",
              cp: params.get("cp") || "",
              campana: params.get("campana") || "",
              conjunto: params.get("conjunto") || "",
              anuncio: params.get("anuncio") || "",
              utm_campaign: params.get("utm_campaign") || "",
              utm_content: params.get("utm_content") || "",
              utm_term: params.get("utm_term") || "",
              target_provider: cfg.targetProvider,
              skin_code: cfg.targetProvider === "multi_skin" ? cfg.skinCode : "",
              fbp: tracking.fbp || "",
              fbc: tracking.fbc || ""
            }
          })
        }).then(function (response) {
          if (!response.ok) throw new Error("gateway unavailable");
          return response.json();
        }).then(function (data) {
          if (!data || typeof data.handoff_url !== "string" || !data.handoff_url) throw new Error("handoff unavailable");
          return template7TransitionUrl(data.handoff_url);
        });
      }

      function generatePromoCode(tag) {
        return String(tag || "LP") + "-" + Math.random().toString(16).slice(2, 14);
      }

      function buildMessage(promoCode) {
        var baseMessage = ("Hola! quiero mas informacion por favor! " + promoCode + "\\nMi nombre es:").trim();
        var extraText = String(cfg.whatsappPrefillText || "").trim();
        return extraText ? baseMessage + "\\n\\n" + extraText : baseMessage;
      }

      function isAtrioDestination() {
        return cfg.template === 7;
      }

      function buildAtrioRedirectUrl(promoCode, atrioData) {
        try {
          var raw = firstNonEmpty([
            atrioData && atrioData.atrioRedirectUrl,
            atrioData && atrioData.atrio_redirect_url,
            cfg.atrioRedirectUrl
          ]);
          if (!raw) return "";
          var url = new URL(raw, window.location.href);
          if (url.protocol !== "http:" && url.protocol !== "https:") return "";
          url.searchParams.set("promo_code", promoCode);
          var atrioId = firstNonEmpty([
            atrioData && atrioData.atrioId,
            atrioData && atrioData.atrio_id,
            cfg.atrioId
          ]);
          if (atrioId) url.searchParams.set("atrio_id", atrioId);
          return url.toString();
        } catch (e) {
          return "";
        }
      }

      function safeUUID() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
          return window.crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0;
          var v = c === "x" ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function storageKey(key) {
        return String(cfg.storageNamespace || ("landing-builder:no-pixel:" + cfg.slug)) + ":" + key;
      }

      function getLocalStorageValue(key) {
        try { return window.localStorage.getItem(storageKey(key)) || ""; }
        catch (e) { return ""; }
      }

      function setLocalStorageValue(key, value) {
        try { if (value) window.localStorage.setItem(storageKey(key), value); }
        catch (e) {}
      }

      function getOrCreateExternalId() {
        var existing = getLocalStorageValue("external_id");
        if (existing) return existing;
        var created = safeUUID();
        setLocalStorageValue("external_id", created);
        return created;
      }

      function firstNonEmpty(values) {
        for (var i = 0; i < values.length; i += 1) {
          var value = values[i];
          if (value == null) continue;
          var text = String(value).trim();
          if (text) return text;
        }
        return "";
      }

      function normalizeEmail(raw) {
        return String(raw || "").trim().toLowerCase();
      }

      function readMeta() {
        try { return window.__META || {}; }
        catch (e) { return {}; }
      }

      function resolveIdentity(params) {
        var meta = readMeta();
        function getParam(name) { return params.get(name) || ""; }

        var emailRaw = firstNonEmpty([
          getParam("email"),
          getParam("em"),
          getLocalStorageValue("em"),
          meta.userEmail || ""
        ]);
        var phoneRaw = firstNonEmpty([
          getParam("phone"),
          getParam("ph"),
          getLocalStorageValue("ph"),
          meta.userPhone || ""
        ]);
        var externalId = firstNonEmpty([
          meta.externalId || "",
          getLocalStorageValue("external_id")
        ]) || getOrCreateExternalId();
        var fn = firstNonEmpty([getParam("fn"), getLocalStorageValue("fn"), meta.userFn || ""]);
        var ln = firstNonEmpty([getParam("ln"), getLocalStorageValue("ln"), meta.userLn || ""]);
        var ct = firstNonEmpty([getParam("ct"), getLocalStorageValue("ct")]);
        var st = firstNonEmpty([getParam("st"), getLocalStorageValue("st")]);
        var zip = firstNonEmpty([getParam("zip"), getLocalStorageValue("zip")]);
        var country = firstNonEmpty([getParam("country"), getLocalStorageValue("country")]);

        setLocalStorageValue("external_id", externalId);
        if (emailRaw) setLocalStorageValue("em", normalizeEmail(emailRaw));
        if (phoneRaw) setLocalStorageValue("ph", normalizePhone(phoneRaw, cfg.phoneCountryCode));
        if (fn) setLocalStorageValue("fn", fn);
        if (ln) setLocalStorageValue("ln", ln);
        if (ct) setLocalStorageValue("ct", ct);
        if (st) setLocalStorageValue("st", st);
        if (zip) setLocalStorageValue("zip", zip);
        if (country) setLocalStorageValue("country", country);

        return {
          emailRaw: emailRaw,
          phoneRaw: phoneRaw,
          ct: ct,
          st: st,
          zip: zip,
          country: country,
          email: emailRaw ? normalizeEmail(emailRaw) : "",
          ph: phoneRaw ? normalizePhone(phoneRaw, cfg.phoneCountryCode) : "",
          fn: fn,
          ln: ln,
          externalId: externalId
        };
      }

      function applyLeadCaptureToIdentity(identity, capture) {
        if (!capture || typeof capture !== "object") return identity;
        var fields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
        var firstName = (cfg.template === 7 || fields.firstName) ? String(capture.firstName || "").trim() : "";
        var lastName = fields.lastName ? String(capture.lastName || "").trim() : "";
        var emailRaw = fields.email ? String(capture.email || "").trim() : "";
        var phoneRaw = (fields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
          ? String(capture.phone || "").trim()
          : "";
        var normalizedPhone = phoneRaw
          ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(phoneRaw) : normalizePhone(phoneRaw, cfg.phoneCountryCode))
          : "";

        return {
          emailRaw: emailRaw || identity.emailRaw,
          phoneRaw: normalizedPhone ? phoneRaw : identity.phoneRaw,
          ct: identity.ct,
          st: identity.st,
          zip: identity.zip,
          country: identity.country,
          email: emailRaw ? normalizeEmail(emailRaw) : identity.email,
          ph: normalizedPhone || identity.ph,
          fn: firstName || identity.fn,
          ln: lastName || identity.ln,
          externalId: identity.externalId
        };
      }

      function readInlineEmail() {
        if (!cfg.emailCapture || cfg.emailCapture.enabled !== true) return "";
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return "";
        var value = String(input.value || "").trim();
        var valid = value.length <= 254 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value);
        var error = document.querySelector("[data-inline-email-error]");
        if (error) error.textContent = value && !valid
          ? "Email inv\xE1lido. Pod\xE9s seguir a WhatsApp." : "";
        return valid ? value.toLowerCase() : "";
      }

      function initInlineEmail() {
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return;
        input.addEventListener("input", function () {
          var error = document.querySelector("[data-inline-email-error]");
          if (error) error.textContent = "";
        });
        input.addEventListener("blur", readInlineEmail);
      }

      function cookieValue(name) {
        try {
          var parts = document.cookie ? document.cookie.split("; ") : [];
          for (var i = 0; i < parts.length; i += 1) {
            var part = parts[i];
            var eq = part.indexOf("=");
            var key = eq >= 0 ? part.slice(0, eq) : part;
            if (key === name) return decodeURIComponent(eq >= 0 ? part.slice(eq + 1) : "");
          }
        } catch (e) {}
        return "";
      }

      function collectMetaTrackingParams(params) {
        var fbp = cookieValue("_fbp");
        var fbc = cookieValue("_fbc");
        var fbclid = params.get("fbclid") || "";
        if (!fbc && fbclid) {
          fbc = "fb.1." + Date.now() + "." + fbclid;
        }
        metaTracking = {
          fbp: fbp || "",
          fbc: fbc || "",
          clientIpAddress: metaTracking.clientIpAddress || "",
          clientIpIssuedAt: metaTracking.clientIpIssuedAt || null,
          clientIpProof: metaTracking.clientIpProof || ""
        };
        return metaTracking;
      }

      function safeEventSourceUrl() {
        try {
          return window.location.origin + window.location.pathname;
        } catch (e) {
          return "";
        }
      }

      function sanitizeSensitiveQueryParams() {
        try {
          var url = new URL(window.location.href);
          var sensitiveKeys = ["email", "em", "phone", "ph", "fn", "ln", "external_id", "eid", "ct", "st", "zip", "country"];
          var changed = false;
          sensitiveKeys.forEach(function (key) {
            if (url.searchParams.has(key)) {
              url.searchParams.delete(key);
              changed = true;
            }
          });
          if (changed) {
            window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
          }
        } catch (e) {}
      }

      function mergeMetaTracking(base, incoming) {
        var next = incoming && typeof incoming === "object" ? incoming : {};
        return {
          fbp: String(next.fbp || base.fbp || ""),
          fbc: String(next.fbc || base.fbc || ""),
          clientIpAddress: String(next.clientIpAddress || base.clientIpAddress || ""),
          clientIpIssuedAt: Number(next.clientIpIssuedAt || base.clientIpIssuedAt) || null,
          clientIpProof: String(next.clientIpProof || base.clientIpProof || "")
        };
      }

      function getOfficialMetaParamBuilder() {
        try {
          var sdk = window.clientParamBuilder;
          if (
            sdk &&
            typeof sdk.processAndCollectAllParams === "function" &&
            typeof sdk.getFbc === "function" &&
            typeof sdk.getFbp === "function"
          ) {
            return sdk;
          }
        } catch (e) {}
        return null;
      }

      function loadOfficialMetaParamBuilder() {
        var available = getOfficialMetaParamBuilder();
        if (available) return Promise.resolve(available);
        if (metaParamBuilderPromise) return metaParamBuilderPromise;

        var source = String(cfg.metaParamBuilderSrc || "").trim();
        if (!source) return Promise.resolve(null);

        metaParamBuilderPromise = new Promise(function (resolve) {
          var existing = document.querySelector("script[data-meta-param-builder='official']");
          var script = existing || document.createElement("script");
          var settled = false;

          function finish(value) {
            if (settled) return;
            settled = true;
            resolve(value || null);
          }

          script.addEventListener("load", function () {
            finish(getOfficialMetaParamBuilder());
          }, { once: true });
          script.addEventListener("error", function () {
            finish(null);
          }, { once: true });

          if (!existing) {
            script.src = source;
            script.async = true;
            script.setAttribute("data-meta-param-builder", "official");
            document.head.appendChild(script);
          }
        }).finally(function () {
          metaParamBuilderPromise = null;
        });

        return metaParamBuilderPromise;
      }

      function readOfficialMetaParam(sdk, methodName) {
        try {
          var method = sdk && sdk[methodName];
          return typeof method === "function" ? String(method.call(sdk) || "") : "";
        } catch (e) {
          return "";
        }
      }

      function collectOfficialMetaTracking() {
        var sdk = getOfficialMetaParamBuilder();
        if (!sdk) return Promise.resolve(null);

        var trustedIp =
          metaTracking.clientIpAddress && metaTracking.clientIpProof
            ? metaTracking.clientIpAddress
            : "";
        var processResult;

        try {
          processResult = trustedIp
            ? sdk.processAndCollectAllParams(window.location.href, function () {
                return Promise.resolve(trustedIp);
              })
            : sdk.processAndCollectAllParams(window.location.href);
        } catch (e) {
          return Promise.resolve(null);
        }

        return Promise.resolve(processResult)
          .then(function () {
            officialMetaTracking = {
              fbp: readOfficialMetaParam(sdk, "getFbp"),
              fbc: readOfficialMetaParam(sdk, "getFbc"),
              clientIpAddress: trustedIp,
              clientIpIssuedAt: trustedIp ? metaTracking.clientIpIssuedAt : null,
              clientIpProof: trustedIp ? metaTracking.clientIpProof : ""
            };
            metaTracking = mergeMetaTracking(metaTracking, officialMetaTracking);
            return officialMetaTracking;
          })
          .catch(function () {
            return null;
          });
      }

      function collectMetaClientIpProof() {
        var collectorUrl = String(cfg.metaIpCollectorUrl || "").trim();
        if (!collectorUrl) return Promise.resolve(null);
        if (metaTracking.clientIpAddress && metaTracking.clientIpProof) {
          return Promise.resolve(metaTracking);
        }
        if (metaIpCollectorPromise) return metaIpCollectorPromise;

        metaIpCollectorPromise = new Promise(function (resolve) {
          var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
          var timeoutId = window.setTimeout(function () {
            if (controller) controller.abort();
            resolve(null);
          }, 800);

          fetch(collectorUrl, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            cache: "no-store",
            signal: controller ? controller.signal : undefined
          })
            .then(function (response) {
              if (!response.ok) return null;
              return response.json();
            })
            .then(function (value) {
              if (!value || typeof value !== "object") return null;
              var ip = String(value.ip || "").trim().toLowerCase();
              var issuedAt = Number(value.issued_at);
              var proof = String(value.proof || "").trim();
              var nowSeconds = Math.floor(Date.now() / 1000);
              if (
                !ip ||
                !proof ||
                !Number.isInteger(issuedAt) ||
                issuedAt > nowSeconds + 30 ||
                nowSeconds - issuedAt > 600
              ) {
                return null;
              }
              metaTracking = mergeMetaTracking(metaTracking, {
                clientIpAddress: ip,
                clientIpIssuedAt: issuedAt,
                clientIpProof: proof
              });
              return metaTracking;
            })
            .then(resolve)
            .catch(function () { resolve(null); })
            .finally(function () {
              window.clearTimeout(timeoutId);
              metaIpCollectorPromise = null;
            });
        });

        return metaIpCollectorPromise;
      }

      function scheduleMetaClientIpCollection() {
        var run = function () { void collectMetaClientIpProof(); };
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 800 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      function scheduleOfficialMetaParamBuilder() {
        var run = function () {
          Promise.all([
            loadOfficialMetaParamBuilder(),
            collectMetaClientIpProof()
          ])
            .then(function (values) {
              if (!values[0]) return null;
              return collectOfficialMetaTracking();
            })
            .catch(function () {});
        };

        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 1200 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      window.__PUBLIC_META_COLLECT_PARAMS = function () {
        return officialMetaTracking;
      };

      function refreshMetaTracking(params, fallback) {
        var base = mergeMetaTracking(collectMetaTrackingParams(params), fallback || {});
        var collector = window.__PUBLIC_META_COLLECT_PARAMS;
        if (typeof collector !== "function") return Promise.resolve(base);
        return waitWithTimeout(Promise.resolve(collector()), 450)
          .then(function (value) {
            metaTracking = mergeMetaTracking(base, value || {});
            return metaTracking;
          })
          .catch(function () {
            metaTracking = base;
            return base;
          });
      }

      function waitWithTimeout(promise, timeoutMs) {
        var timeoutId;
        var timeout = new Promise(function (resolve) {
          timeoutId = window.setTimeout(function () { resolve(null); }, timeoutMs);
        });
        return Promise.race([promise, timeout]).then(function (value) {
          if (timeoutId) window.clearTimeout(timeoutId);
          return value;
        }, function () {
          if (timeoutId) window.clearTimeout(timeoutId);
          return null;
        });
      }

      function ensurePhonePromise() {
        if (isAtrioDestination()) return Promise.resolve(null);
        window.__PUBLIC_LANDING_PHONE_PROMISES = window.__PUBLIC_LANDING_PHONE_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_PHONE_PROMISES[cfg.slug];
        if (existing) return existing;
        var baseUrl = cfg.supabaseUrl;
        var anonKey = cfg.supabaseAnonKey;
        if (!baseUrl || !anonKey) return Promise.resolve(null);
        var endpoint = baseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-phone?name=" + encodeURIComponent(cfg.slug);
        var promise = fetch(endpoint, {
          headers: { apikey: anonKey, Authorization: "Bearer " + anonKey },
          cache: "no-store",
          keepalive: true
        }).then(function (response) {
          if (!response.ok) return null;
          return response.json();
        }).catch(function () {
          return null;
        });
        window.__PUBLIC_LANDING_PHONE_PROMISES[cfg.slug] = promise;
        return promise;
      }

      function clearPrewarmedPhonePromise() {
        try {
          if (window.__PUBLIC_LANDING_PHONE_PROMISES) {
            delete window.__PUBLIC_LANDING_PHONE_PROMISES[cfg.slug];
          }
        } catch (e) {}
      }


      function ensureAtrioPromise() {
        window.__PUBLIC_LANDING_ATRIO_PROMISES = window.__PUBLIC_LANDING_ATRIO_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_ATRIO_PROMISES[cfg.slug];
        if (existing) return observeTemplate7Destination(existing);
        var promise = Promise.resolve(window.__LB_IDENTITY_READY__ || true).then(function (ready) {
          if (ready !== true) return null;
          return fetch("/api/template7/destination", {
            method: "POST", credentials: "same-origin", cache: "no-store", keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ landing_id: cfg.landingId, landing_slug: cfg.slug, device_id: getOrCreateDeviceId() })
          }).then(function (response) { return response.ok ? response.json() : null; });
        }).catch(function () { return null; });
        window.__PUBLIC_LANDING_ATRIO_PROMISES[cfg.slug] = promise;
        return observeTemplate7Destination(promise);
      }

      function observeTemplate7Destination(promise) {
        window.__T7_DESTINATION_STATES__ = window.__T7_DESTINATION_STATES__ || {};
        var states = window.__T7_DESTINATION_STATES__;
        if (!states[cfg.slug] || states[cfg.slug].promise !== promise) {
          var state = { promise: promise, settled: false, value: null };
          states[cfg.slug] = state;
          promise.then(function(value) { state.settled = true; state.value = value; }, function() { state.settled = true; });
        }
        return promise;
      }

      function clearPrewarmedAtrioPromise() {
        var state = window.__T7_DESTINATION_STATES__ && window.__T7_DESTINATION_STATES__[cfg.slug];
        if (state && (!state.settled || (state.value && (state.value.atrioClientId || state.value.atrio_client_id) &&
            (state.value.atrioId || state.value.atrio_id) && (state.value.atrioSlug || state.value.atrio_slug)))) return;
        try {
          if (window.__PUBLIC_LANDING_ATRIO_PROMISES) {
            delete window.__PUBLIC_LANDING_ATRIO_PROMISES[cfg.slug];
          }
        } catch (e) {}
      }

      function sendTrackBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/track", blob)) return Promise.resolve();
          } catch (e) {}
        }
        return fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).catch(function () {});
      }

      function sendJourneyStartBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/journey-start", blob)) return Promise.resolve(true);
          } catch (e) {}
        }
        return fetch("/api/journey-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).then(function (response) {
          return !!(response && response.ok);
        }).catch(function () {
          return false;
        });
      }

      function contactDedupKey(slug, externalId) {
        return "contact_sent:" + slug + ":" + externalId;
      }

      function wasContactRecentlySent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = contactDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < CONTACT_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markContactSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(contactDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function journeyStartDedupKey(slug, externalId) {
        return "journey_start_sent:" + slug + ":" + externalId;
      }

      function wasJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = journeyStartDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < JOURNEY_START_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(journeyStartDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function extractPhoneId(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return null;
        var direct = phoneData.phoneId != null ? phoneData.phoneId : phoneData.phone_id;
        if (direct != null && direct !== "") {
          var asNumber = Number(direct);
          return isFinite(asNumber) ? asNumber : direct;
        }
        return null;
      }

      function extractAssignedGerenciaSnapshot(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return {};
        var gerencia = phoneData.gerencia && typeof phoneData.gerencia === "object"
          ? phoneData.gerencia
          : {};
        var internalId = gerencia.id != null ? Number(gerencia.id) : null;
        var externalId = firstNonEmpty([
          gerencia.externalId,
          gerencia.external_id,
          gerencia.gerencia_id,
          internalId
        ]);
        var name = firstNonEmpty([gerencia.name, gerencia.nombre]);
        var label = name && externalId ? name + " (ID " + externalId + ")" : (name || (externalId ? "Gerencia " + externalId : ""));
        return {
          assigned_gerencia_id: isFinite(internalId) && internalId > 0 ? internalId : undefined,
          assigned_gerencia_external_id: externalId || undefined,
          assigned_gerencia_name: name || undefined,
          assigned_gerencia_label: label || undefined
        };
      }

      function buildLandingJourneyStartPayload(params, identity, tracking, targetData) {
        var atrioMode = isAtrioDestination();
        var phoneData = atrioMode ? null : targetData;
        var assignedPhone = atrioMode ? "" : normalizePhone(
          (phoneData && phoneData.phone) || "",
          cfg.phoneCountryCode
        );
        var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
        return {
          event_name: "LandingPageView",
          slug: cfg.slug,
          landing_id: cfg.landingId,
          landing_name: cfg.landingName,
          target_provider: cfg.template === 7 ? cfg.targetProvider : undefined,
          skin_code: cfg.template === 7 && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
          workspace_currency: cfg.workspaceCurrency || undefined,
          external_id: identity.externalId,
          event_source_url: safeEventSourceUrl(),
          landing: cfg.slug,
              landing_resolution: landingResolution || "",
          facebook: params.get("facebook") || "",
          portofolio: params.get("portofolio") || "",
          cp: params.get("cp") || "",
          campana: params.get("campana") || "",
          conjunto: params.get("conjunto") || "",
          anuncio: params.get("anuncio") || "",
          utm_campaign: params.get("utm_campaign") || "",
          fbp: tracking.fbp,
          fbc: tracking.fbc,
          from_meta_ads: !!tracking.fbc,
          meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
          telefono_asignado: assignedPhone || undefined,
          assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
          assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
          assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
          assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
          device_type: deviceType(),
          client_ip_address: tracking.clientIpAddress || undefined,
          client_user_agent: navigator.userAgent || undefined
        };
      }

      function recordLandingJourneyStart() {
        if (journeyStartInFlight || !cfg.landingId) return;
        var params = queryParams();
        var identity = resolveIdentity(params);
        if (wasJourneyStartSent(cfg.slug, identity.externalId)) return;
        journeyStartInFlight = true;
        var tracking = collectMetaTrackingParams(params);
        var immediateBody = JSON.stringify(
          buildLandingJourneyStartPayload(params, identity, tracking, null)
        );
        sendJourneyStartBestEffort(immediateBody).then(function (sent) {
          if (sent) markJourneyStartSent(cfg.slug, identity.externalId);
          if (isAtrioDestination()) return sent;
          return ensurePhonePromise().then(function (phoneData) {
            if (!phoneData || !phoneData.phone) return sent;
            return sendJourneyStartBestEffort(JSON.stringify(
              buildLandingJourneyStartPayload(params, identity, tracking, phoneData)
            )).then(function (enrichedSent) {
              if (enrichedSent) markJourneyStartSent(cfg.slug, identity.externalId);
              return sent || enrichedSent;
            });
          });
        }).catch(function () {}).then(function () {
          journeyStartInFlight = false;
        });
      }

      function setButtonText(button, text) {
        var label = button.querySelector("[data-public-landing-cta-label]");
        if (label) label.textContent = text;
      }

      function getButtonLabel(button, attrName, fallback) {
        return button.getAttribute(attrName) || fallback;
      }

      function getRestButtonText(button) {
        return getButtonLabel(button, "data-public-landing-rest-label", cfg.ctaText);
      }

      function getLoadingButtonText(button) {
        return getButtonLabel(button, "data-public-landing-loading-label", "Abriendo...");
      }

      function getDisabledButtonText(button) {
        return getButtonLabel(button, "data-public-landing-disabled-label", "Sin numero disponible");
      }

      function setNoPhoneState(button) {
        button.disabled = true;
        setButtonText(button, getDisabledButtonText(button));
        if (noPhoneTimer) window.clearTimeout(noPhoneTimer);
        noPhoneTimer = window.setTimeout(function () {
          button.disabled = false;
          setButtonText(button, getRestButtonText(button));
          clickLocked = false;
          noPhoneTimer = null;
        }, 2000);
      }

      function notifyPhoneClick(phoneData, phone) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var effectivePhoneMode = phoneData && (phoneData.phoneMode || (phoneData.phoneSelection && phoneData.phoneSelection.mode) || "");
          var phoneId = extractPhoneId(phoneData);
          if ((effectivePhoneMode === "fair" || effectivePhoneMode === "random") && baseUrl && anonKey && phoneId != null) {
            var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/phone-click";
            fetch(notifyUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: anonKey,
                Authorization: "Bearer " + anonKey
              },
              body: JSON.stringify({
                landingName: (phoneData && phoneData.landingName) || cfg.landingName,
                phoneId: phoneId,
                phone: phone,
                reservationId: (phoneData && phoneData.assignmentReservationId) || undefined
              }),
              keepalive: true
            }).catch(function () {});
          }
        } catch (e) {}
      }

      function notifyTemplate6CardClick(button) {
        try {
          if (cfg.template !== 6 || !cfg.landingId || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
          var cardIndex = Number(button.getAttribute("data-template6-card-index"));
          if (!Number.isInteger(cardIndex) || cardIndex < 1 || cardIndex > 6) return;
          fetch(cfg.supabaseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-card-click", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: cfg.supabaseAnonKey,
              Authorization: "Bearer " + cfg.supabaseAnonKey
            },
            body: JSON.stringify({ landingId: cfg.landingId, cardIndex: cardIndex, eventId: safeUUID() }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function notifyAtrioClick(atrioData) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var atrioClientId = firstNonEmpty([
            atrioData && atrioData.atrioClientId,
            atrioData && atrioData.atrio_client_id,
            cfg.atrioClientId
          ]);
          if (!baseUrl || !anonKey || !atrioClientId) return;
          var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/atrio-click";
          fetch(notifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: anonKey,
              Authorization: "Bearer " + anonKey
            },
            body: JSON.stringify({
              landingName: cfg.landingName || cfg.slug,
              atrioClientId: atrioClientId
            }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function firePixelContact(eventId) {
        try {
          if (!cfg.sendContactPixel || !window.fbq) return;
          window.fbq("track", "Contact", { source: "main_button" }, { eventID: eventId });
        } catch (e) {}
      }

      function createContactPrearm() {
        var params = queryParams();
        var promoCode = generatePromoCode(cfg.landingTag || "LP");
        var identity = resolveIdentity(params);
        var tracking = collectMetaTrackingParams(params);
        var testEventCode = params.get("test_event_code") || "";
        sanitizeSensitiveQueryParams();

        return {
          params: params,
          promoCode: promoCode,
          message: buildMessage(promoCode),
          eventId: safeUUID(),
          identity: identity,
          tracking: tracking,
          testEventCode: testEventCode,
          shouldSkipContact: testEventCode ? false : wasContactRecentlySent(cfg.slug, identity.externalId),
          createdAt: Date.now()
        };
      }

      function prearmContactContext() {
        try {
          prearmedContact = createContactPrearm();
        } catch (e) {
          prearmedContact = null;
        }
      }

      function consumeContactContext() {
        if (cfg.template === 7 && template7AttemptContext) return template7AttemptContext;
        var context = prearmedContact || createContactPrearm();
        prearmedContact = null;
        window.setTimeout(prearmContactContext, 0);
        if (cfg.template === 7) template7AttemptContext = context;
        return context;
      }

      function hasLeadCaptureFields() {
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        return leadCapture.enabled === true &&
          (fields.firstName === true || fields.lastName === true || fields.phone === true || fields.email === true);
      }

      function shouldShowLeadCapture(button) {
        if (cfg.template === 7) return false;
        if (!hasLeadCaptureFields()) return false;
        return button.getAttribute("data-public-landing-auto-start") !== "true";
      }

      function closeLeadCaptureModal() {
        if (!leadCaptureModal) return;
        leadCaptureModal.hidden = true;
        document.body.classList.remove("public-lead-capture-open");
        pendingLeadCaptureButton = null;
      }

      function continueAfterLeadCapture(capture) {
        var button = pendingLeadCaptureButton;
        closeLeadCaptureModal();
        if (button) processCtaClick(button, capture || null);
      }

      function createLeadCaptureInput(name, label, type, autocomplete) {
        var wrapper = document.createElement("label");
        wrapper.className = "public-lead-capture__field";
        var input = document.createElement("input");
        input.type = type;
        input.name = name;
        input.autocomplete = autocomplete;
        input.setAttribute("aria-label", label);
        input.placeholder = label;
        input.className = "public-lead-capture__input";
        wrapper.appendChild(input);
        return wrapper;
      }

      function initLeadCaptureModal() {
        if (!hasLeadCaptureFields() || leadCaptureModal) return;
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        var overlay = document.createElement("div");
        overlay.className = "public-lead-capture";
        overlay.hidden = true;
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "public-lead-capture-title");

        var card = document.createElement("form");
        card.className = "public-lead-capture__card";
        card.noValidate = true;

        var close = document.createElement("button");
        close.type = "button";
        close.className = "public-lead-capture__close";
        close.setAttribute("aria-label", "Omitir formulario e ir a WhatsApp");
        close.textContent = "\xD7";

        var title = document.createElement("h2");
        title.id = "public-lead-capture-title";
        title.textContent = String(leadCapture.title || "Desbloque\xE1 atenci\xF3n personalizada");

        var description = document.createElement("p");
        description.className = "public-lead-capture__description";
        description.textContent = String(leadCapture.description || "");

        var grid = document.createElement("div");
        grid.className = "public-lead-capture__grid";
        if (fields.firstName === true) grid.appendChild(createLeadCaptureInput("firstName", "Nombre", "text", "given-name"));
        if (fields.lastName === true) grid.appendChild(createLeadCaptureInput("lastName", "Apellido", "text", "family-name"));
        if (fields.phone === true) grid.appendChild(createLeadCaptureInput("phone", "Tel\xE9fono", "tel", "tel"));
        if (fields.email === true) grid.appendChild(createLeadCaptureInput("email", "Email", "email", "email"));

        var actions = document.createElement("div");
        actions.className = "public-lead-capture__actions";
        var skip = document.createElement("button");
        skip.type = "button";
        skip.className = "public-lead-capture__skip";
        skip.textContent = "OMITIR E IR A WHATSAPP";
        var submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "public-lead-capture__submit";
        submit.textContent = "CONTINUAR A WHATSAPP \u2192";
        actions.appendChild(skip);
        actions.appendChild(submit);

        card.appendChild(close);
        card.appendChild(title);
        if (description.textContent) card.appendChild(description);
        card.appendChild(grid);
        card.appendChild(actions);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        leadCaptureModal = overlay;

        function readCaptureValues() {
          var data = {};
          Array.prototype.slice.call(card.querySelectorAll("input[name]")).forEach(function (input) {
            data[input.name] = String(input.value || "").trim();
          });
          return data;
        }

        card.addEventListener("submit", function (event) {
          event.preventDefault();
          continueAfterLeadCapture(readCaptureValues());
        });
        skip.addEventListener("click", function () { continueAfterLeadCapture(null); });
        close.addEventListener("click", function () { continueAfterLeadCapture(null); });
        overlay.addEventListener("click", function (event) {
          if (event.target === overlay) continueAfterLeadCapture(null);
        });
        document.addEventListener("keydown", function (event) {
          if (!leadCaptureModal || leadCaptureModal.hidden) return;
          if (event.key === "Escape") continueAfterLeadCapture(null);
        });
      }

      function openLeadCaptureModal(button) {
        initLeadCaptureModal();
        if (!leadCaptureModal) {
          processCtaClick(button, null);
          return;
        }
        pendingLeadCaptureButton = button;
        var inlineEmail = readInlineEmail();
        var modalEmail = leadCaptureModal.querySelector('input[name="email"]');
        if (modalEmail && cfg.emailCapture && cfg.emailCapture.enabled === true) modalEmail.value = inlineEmail;
        leadCaptureModal.hidden = false;
        document.body.classList.add("public-lead-capture-open");
        window.setTimeout(function () {
          var first = leadCaptureModal.querySelector("input, button");
          if (first && typeof first.focus === "function") first.focus();
        }, 0);
      }

      function handleCtaClick(button) {
        if (clickLocked || button.disabled) return;
        var entryName = document.querySelector("[data-template7-name]");
        if (!entryName || !String(entryName.value || "").trim()) return;
        template7EntryGeneration++;
        window.__T7_ENTRY_STARTED__ = true;
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7) {
          var nameInput = document.querySelector("[data-template7-name]");
          var whatsappInput = document.querySelector("[data-template7-whatsapp]");
          var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
          var firstName = nameInput ? String(nameInput.value || "").trim() : "";
          if (!firstName) {
            if (nameInput) nameInput.focus();
            button.disabled = true;
            return;
          }
          var rawWhatsapp = whatsappInput ? String(whatsappInput.value || "").trim() : "";
          var normalizedWhatsapp = rawWhatsapp ? normalizeArgentinaWhatsapp(rawWhatsapp) : "";
          if (whatsappWarning) {
            whatsappWarning.textContent = rawWhatsapp && !normalizedWhatsapp
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          }
          processCtaClick(button, { firstName: firstName, phone: normalizedWhatsapp });
          return;
        }
        if (shouldShowLeadCapture(button)) {
          openLeadCaptureModal(button);
          return;
        }
        processCtaClick(button, null);
      }

      function processCtaClick(button, leadCaptureValues) {
        var entryAttempt = template7EntryGeneration;
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7 && !String(leadCaptureValues && leadCaptureValues.firstName || "").trim()) return;
        if (cfg.template === 7 && window.__entryFunnel) {
          if (!window.__T7_EARLY_CTA_RECORDED__) window.__entryFunnel.emit("cta_clicked");
          window.__T7_EARLY_CTA_RECORDED__ = false;
        }
        if (cfg.template === 7) { setTemplate7Error(""); if (template7Transition) template7Transition.start("creating"); }
        clickLocked = true;
        button.disabled = true;
        if (cfg.template !== 7) setButtonText(button, getLoadingButtonText(button));
        notifyTemplate6CardClick(button);
        var tapStartedAt = Date.now();

        window.requestAnimationFrame(function () {
          if (entryAttempt !== template7EntryGeneration) return;
          var context = consumeContactContext();
          var params = context.params;
          var promoCode = context.promoCode;
          var message = context.message;
          var eventId = context.eventId;
          var inlineEmail = readInlineEmail();
          var safeCapture = leadCaptureValues;
          if (safeCapture && cfg.emailCapture && cfg.emailCapture.enabled === true) {
            var typedEmail = String(safeCapture.email || "").trim();
            safeCapture = Object.assign({}, safeCapture, {
              email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(typedEmail) ? typedEmail : ""
            });
          }
          var baseIdentity = inlineEmail
            ? Object.assign({}, context.identity, { emailRaw: inlineEmail, email: normalizeEmail(inlineEmail) })
            : context.identity;
          var identity = applyLeadCaptureToIdentity(baseIdentity, safeCapture);
          var captureFields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
          var hasLeadCaptureForm = !!leadCaptureValues;
          var formFn = hasLeadCaptureForm && (cfg.template === 7 || captureFields.firstName)
            ? String(leadCaptureValues.firstName || "").trim()
            : "";
          var formLn = hasLeadCaptureForm && captureFields.lastName
            ? String(leadCaptureValues.lastName || "").trim()
            : "";
          var formEmail = hasLeadCaptureForm && captureFields.email
            ? normalizeEmail(safeCapture.email || "")
            : "";
          var formPhoneRaw = hasLeadCaptureForm && (captureFields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
            ? String(leadCaptureValues.phone || "").trim()
            : "";
          var formPhone = formPhoneRaw
            ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(formPhoneRaw) : normalizePhone(formPhoneRaw, cfg.phoneCountryCode))
            : "";
          var tracking = context.tracking;
          var testEventCode = context.testEventCode;
          var shouldSkipContact = context.shouldSkipContact || (cfg.template === 7 && template7ContactSent);

          Promise.all([
            refreshMetaTracking(params, tracking),
            isAtrioDestination()
              ? waitWithTimeout(ensureAtrioPromise(), 1500)
              : waitWithTimeout(ensurePhonePromise(), 1500)
          ])
            .then(function (resolved) {
              tracking = resolved[0];
              return resolved[1];
            })
            .then(function (targetData) {
              if (isAtrioDestination()) {
                if (targetData && (cfg.template === 7
                  ? firstNonEmpty([targetData.atrioClientId, targetData.atrio_client_id]) && firstNonEmpty([targetData.atrioId, targetData.atrio_id]) && firstNonEmpty([targetData.atrioSlug, targetData.atrio_slug])
                  : (targetData.atrioRedirectUrl || targetData.atrio_redirect_url))) return targetData;
                clearPrewarmedAtrioPromise();
                return waitWithTimeout(ensureAtrioPromise(), 2500);
              }
              if (targetData && targetData.phone) return targetData;
              clearPrewarmedPhonePromise();
              return waitWithTimeout(ensurePhonePromise(), 2500);
            })
            .then(function (targetData) {
              if (entryAttempt !== template7EntryGeneration) return;
              var atrioMode = isAtrioDestination();
              var gatewayMode = cfg.template === 7;
              var atrioData = atrioMode ? (targetData || {}) : null;
              var phoneData = atrioMode ? null : targetData;
              var phone = atrioMode ? "" : normalizePhone(
                (phoneData && phoneData.phone) || "",
                cfg.phoneCountryCode
              );
              var redirectUrl = gatewayMode ? "" : atrioMode
                ? buildAtrioRedirectUrl(promoCode, atrioData)
                : "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
              if (gatewayMode && (!firstNonEmpty([atrioData.atrioClientId, atrioData.atrio_client_id]) || !firstNonEmpty([atrioData.atrioId, atrioData.atrio_id]) || !firstNonEmpty([atrioData.atrioSlug, atrioData.atrio_slug]))) {
                if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "destination_unavailable" });
                failTemplate7(button);
                return;
              }
              if (gatewayMode && window.__entryFunnel) window.__entryFunnel.emit("destination_ready");
              if ((!atrioMode && !phone) || (atrioMode && !gatewayMode && !redirectUrl)) {
                setNoPhoneState(button);
                return;
              }

              if (!shouldSkipContact) {
                firePixelContact(eventId);
              }

              if (!atrioMode) {
                notifyPhoneClick(phoneData, phone);
              } else {
                notifyAtrioClick(atrioData);
              }

              var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
              var payload = {
                event_name: "Contact",
                target_provider: gatewayMode ? cfg.targetProvider : undefined,
                skin_code: gatewayMode && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
                meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
                sendContactPixel: cfg.sendContactPixel,
                event_id: eventId,
                external_id: identity.externalId,
                event_source_url: safeEventSourceUrl(),
                email: identity.emailRaw,
                phone: identity.ph || identity.phoneRaw,
                phone_country_code: cfg.phoneCountryCode || undefined,
                currency: cfg.workspaceCurrency || undefined,
                workspace_currency: cfg.workspaceCurrency || undefined,
                lead_capture_form: hasLeadCaptureForm || undefined,
                form_fn: formFn || undefined,
                form_ln: formLn || undefined,
                form_email: formEmail || undefined,
                form_phone: formPhone || undefined,
                fn: identity.fn || undefined,
                ln: identity.ln || undefined,
                ct: identity.ct || undefined,
                st: identity.st || undefined,
                zip: identity.zip || undefined,
                country: identity.country || undefined,
                landing: cfg.slug,
              landing_resolution: landingResolution || "",
                facebook: params.get("facebook") || "",
                portofolio: params.get("portofolio") || "",
                cp: params.get("cp") || "",
                campana: params.get("campana") || "",
                conjunto: params.get("conjunto") || "",
                anuncio: params.get("anuncio") || "",
                utm_campaign: params.get("utm_campaign") || "",
                test_event_code: testEventCode || undefined,
                fbp: tracking.fbp,
                fbc: tracking.fbc,
                client_ip_address: tracking.clientIpAddress || undefined,
                client_ip_issued_at: tracking.clientIpIssuedAt || undefined,
                client_ip_proof: tracking.clientIpProof || undefined,
                client_user_agent: navigator.userAgent || undefined,
                telefono_asignado: atrioMode ? "" : phone,
                assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
                assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
                assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
                assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
                promo_code: promoCode,
                source: "main_button",
                source_platform: "landing",
                cta_destination: atrioMode ? "atrio" : "whatsapp",
                redirect_channel: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "rey_de_ases_gateway"
                  : atrioMode ? "atrio" : "whatsapp",
                gateway_app_id: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "reydeases_gateway"
                  : undefined,
                atrio_redirect_url: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioRedirectUrl, atrioData && atrioData.atrio_redirect_url, cfg.atrioRedirectUrl]) : undefined,
                atrio_client_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id, cfg.atrioClientId]) : undefined,
                atrio_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id, cfg.atrioId]) : undefined,
                atrio_slug: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug, cfg.atrioSlug]) : undefined,
                brand: cfg.landingName,
                landing_id: cfg.landingId,
                landing_name: cfg.landingName,
                device_type: deviceType(),
                cta_tap_to_redirect_ms: Date.now() - tapStartedAt,
                mode: cfg.backgroundMode,
                api_meta: null
              };

              try {
                if (!shouldSkipContact) {
                  sendTrackBestEffort(JSON.stringify({
                    postUrl: cfg.postUrl,
                    payload: payload
                  }));
                }
              } catch (e) {}

              if (!shouldSkipContact) markContactSent(cfg.slug, identity.externalId);
              if (gatewayMode && !shouldSkipContact) template7ContactSent = true;

              if (gatewayMode) {
                startTemplate7Gateway(formFn, formPhone, promoCode, atrioData, tracking, params)
                  .then(function (handoffUrl) { if (entryAttempt === template7EntryGeneration) navigateTemplate7Handoff(handoffUrl); })
                  .catch(function () { failTemplate7(button, entryAttempt); });
              } else {
                window.setTimeout(function () {
                  window.location.assign(redirectUrl);
                }, 180);
              }
            })
            .catch(function () {
              if (cfg.template === 7) failTemplate7(button, entryAttempt);
              else {
                clickLocked = false;
                button.disabled = false;
                setButtonText(button, getRestButtonText(button));
              }
            });
        });
      }

      function initCtas() {
        var ctas = Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-cta]"));
        ctas.forEach(function (button) {
          window.addEventListener("click", function (event) {
            if (event.target && event.target.nodeType && button.contains(event.target)) handleCtaClick(button);
          }, true);
        });

        // Al volver de WhatsApp con la pagina restaurada desde bfcache, un CTA nuevo
        // necesita una asignacion nueva; la deduplicacion de Contact sigue en storage.
        window.addEventListener("pageshow", function (event) {
          if (!event.persisted || cfg.template !== 6) return;
          clickLocked = false;
          ctas.forEach(function (button) {
            button.disabled = false;
            setButtonText(button, getRestButtonText(button));
          });
          clearPrewarmedPhonePromise();
          if (!isAtrioDestination()) ensurePhonePromise();
          prearmContactContext();
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-trigger]")).forEach(function (trigger) {
          trigger.addEventListener("click", function () {
            var firstCta = document.querySelector("[data-public-landing-cta]");
            if (firstCta) firstCta.click();
          });
        });

        var autoCta = document.querySelector("[data-public-landing-cta][data-public-landing-auto-start='true']");
        if (autoCta) {
          window.setTimeout(function () { autoCta.click(); }, 40);
        }
      }

      function initTemplate7Name() {
        if (cfg.template !== 7) return;
        var input = document.querySelector("[data-template7-name]");
        var whatsappInput = document.querySelector("[data-template7-whatsapp]");
        var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
        var button = document.querySelector(".template7__cta[data-public-landing-cta]");
        var form = document.querySelector("[data-template7-form]");
        if (!input || !button || !form) return;
        function sync() {
          if (clickLocked) return;
          button.disabled = !String(input.value || "").trim();
        }
        input.addEventListener("input", sync);
        if (whatsappInput && whatsappWarning) {
          whatsappInput.addEventListener("input", function () {
            if (!String(whatsappInput.value || "").trim() || normalizeArgentinaWhatsapp(whatsappInput.value)) {
              whatsappWarning.textContent = "";
              whatsappWarning.hidden = true;
            }
          });
          whatsappInput.addEventListener("blur", function () {
            var raw = String(whatsappInput.value || "").trim();
            whatsappWarning.textContent = raw && !normalizeArgentinaWhatsapp(raw)
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          });
        }
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          sync();
          if (!button.disabled) button.click();
          else input.focus();
        });
        window.addEventListener("pageshow", sync);
        sync();
      }

      function initPrivacyDialog() {
        var dialog = document.querySelector("[data-public-privacy-dialog]");
        var openButton = document.querySelector("[data-public-privacy-open]");
        if (!dialog || !openButton) return;

        function openDialog() {
          if (typeof dialog.showModal === "function") dialog.showModal();
          else dialog.setAttribute("open", "");
        }

        function closeDialog() {
          if (typeof dialog.close === "function") dialog.close();
          else dialog.removeAttribute("open");
        }

        openButton.addEventListener("click", openDialog);
        Array.prototype.slice.call(dialog.querySelectorAll("[data-public-privacy-close]")).forEach(function (button) {
          button.addEventListener("click", closeDialog);
        });
        dialog.addEventListener("click", function (event) {
          if (event.target === dialog) closeDialog();
        });
      }

      function parseImages(value) {
        try {
          var parsed = JSON.parse(value || "[]");
          return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } catch (e) {
          return [];
        }
      }

      function initialRotatingIndex(images, rotateEveryHours) {
        if (images.length <= 1) return 0;
        var everyMs = Math.max(1, Number(rotateEveryHours) || 24) * 60 * 60 * 1000;
        return Math.floor(Date.now() / everyMs) % images.length;
      }

      function initRotatingBackgrounds() {
        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-background]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.style.backgroundImage = "url(" + images[index] + ")";
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.style.backgroundImage = "url(" + images[index] + ")";
          }, everyMs);
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-image]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.setAttribute("src", images[index]);
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.setAttribute("src", images[index]);
          }, everyMs);
        });
      }

      function renderSocialProof(section, index) {
        var items = cfg.socialProofItems || [];
        if (!items.length) return;
        var item = items[index % items.length];
        var quote = section.querySelector("[data-public-landing-social-quote]");
        var meta = section.querySelector("[data-public-landing-social-meta]");
        var progress = section.querySelector("[data-public-landing-social-progress]");
        if (quote) quote.textContent = '"' + item.quote + '"';
        if (meta) meta.innerHTML = item.name + ' <span aria-hidden="true">-</span> <span class="social-proof__stars">\u2605\u2605\u2605\u2605\u2605</span>';
        if (progress) {
          progress.style.animation = "none";
          void progress.offsetHeight;
          progress.style.animation = "";
        }
      }

      function template7RecoveryAttribution() {
        var params=queryParams(),tracking=collectMetaTrackingParams(params);
        var result={landing:cfg.slug,landing_resolution:landingResolution||'',target_provider:cfg.targetProvider,
          skin_code:cfg.targetProvider==='multi_skin'?cfg.skinCode:'',fbp:tracking.fbp||'',fbc:tracking.fbc||''};
        ['facebook','portofolio','cp','campana','conjunto','anuncio','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(key){var value=params.get(key);if(value)result[key]=value;});
        if(cfg.template8&&cfg.cardIndex)result.card_index=String(cfg.cardIndex);
        return result;
      }
      function warmTemplate7Entry() {
        function resume(advisor, name, promo) {
          // The server still reuses this identity on submit. A late background
          // response must never pull an actively typing visitor off the form.
          if (window.__T7_ENTRY_STARTED__ || window.__T7_FORM_INTERACTED__) return;
          var entryAttempt = ++template7EntryGeneration;
          window.__T7_ENTRY_STARTED__ = true; clickLocked = true;
          if (template7Transition) template7Transition.start('preparing');
          return fetchWithEntryRecovery('/api/template7/start', {
            method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({device_id:getOrCreateDeviceId(),landing_id:cfg.landingId,landing_slug:cfg.slug,
              entry_funnel:window.__entryFunnel?window.__entryFunnel.context():undefined,
              atrio_client_id:advisor.atrioClientId || advisor.atrio_client_id,advisor_id:advisor.atrioId || advisor.atrio_id,
              advisor_slug:advisor.atrioSlug || advisor.atrio_slug,name:name,promo_code:promo,attribution:template7RecoveryAttribution()})
          }).then(function(response){if(!response.ok)throw new Error('entry pending');return response.json()}).then(function(result){
            if (entryAttempt !== template7EntryGeneration) return;
            if(!result || typeof result.handoff_url !== 'string')throw new Error('entry pending');
            navigateTemplate7Handoff(template7TransitionUrl(result.handoff_url));
          }).catch(function(){
            if (entryAttempt !== template7EntryGeneration) return;
            window.__T7_ENTRY_STARTED__ = false; clickLocked = false;
            if(template7Transition)template7Transition.finish();
            var nameField=document.querySelector('[data-template7-name]');if(nameField)nameField.value=name;
            setTemplate7Error('Tu acceso sigue pendiente. Pod\xE9s retomar el mismo intento sin volver a completar tus datos.');
          });
        }
        Promise.all([window.__LB_IDENTITY_READY__ || Promise.resolve(), ensureAtrioPromise()]).then(function (values) {
          var advisor = values[1];
          if (!advisor || window.__T7_ENTRY_STARTED__ || (window.__LB_IDENTITY_READY__ && values[0] !== true)) return;
          if (advisor.preparationReady) {
            if (!advisor.existingName || !advisor.promoCode || window.__T7_ENTRY_STARTED__) return;
            return resume(advisor,advisor.existingName,advisor.promoCode);
          }
          return fetch('/api/template7/warm', {
            method: 'POST', credentials: 'same-origin', cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: getOrCreateDeviceId(), landing_id: cfg.landingId, landing_slug: cfg.slug,
              atrio_client_id: advisor.atrioClientId || advisor.atrio_client_id,
              advisor_id: advisor.atrioId || advisor.atrio_id,
              advisor_slug: advisor.atrioSlug || advisor.atrio_slug })
          }).then(function (response) { return response.ok ? response.json() : null; }).then(function (result) {
            if(result && typeof result.existing_name === 'string' && typeof result.promo_code === 'string') {
              advisor.preparationReady=true;advisor.existingName=result.existing_name;advisor.promoCode=result.promo_code;
              return resume(advisor,result.existing_name,result.promo_code);
            }
            if (result && typeof result.handoff_url === 'string' && !window.__T7_ENTRY_STARTED__ && !window.__T7_FORM_INTERACTED__) {
              var restored = new URL(result.handoff_url);
              if (restored.protocol === 'https:' && restored.pathname === '/prepare' && restored.searchParams.has('t')) {
                window.__T7_ENTRY_STARTED__ = true;
                navigateTemplate7Handoff(template7TransitionUrl(restored.href));
                return;
              }
            }
            if (!result || !result.gateway_origin) return;
            var destination = new URL(result.gateway_origin);
            if (destination.protocol !== 'https:') return;
            var link = document.createElement('link'); link.rel = 'preconnect'; link.href = destination.origin;
            document.head.appendChild(link);
            window.__T7_GATEWAY_WARM__ = window.__T7_GATEWAY_WARM__ || {};
            if (!window.__T7_GATEWAY_WARM__[destination.origin]) window.__T7_GATEWAY_WARM__[destination.origin] = fetch(destination.origin + '/api/preparations/warm', { mode: 'no-cors', credentials: 'omit', cache: 'no-store' }).catch(function () {});
            return window.__T7_GATEWAY_WARM__[destination.origin];
          });
        }).catch(function () {});
      }
      function init() {
        function markFormIntent(event) {
          var target=event.target;
          if(!window.__T7_PROGRAMMATIC_FOCUS__&&target&&target.closest&&target.closest('[data-template7-form]'))window.__T7_FORM_INTERACTED__=true;
        }
        document.addEventListener('focusin',markFormIntent,{passive:true});
        document.addEventListener('input',markFormIntent,{passive:true});
        document.addEventListener('pointerdown',markFormIntent,{passive:true});
        warmTemplate7Entry();
        if (cfg.template === 7 && window.__LB_IDENTITY_READY__) {
          window.__LB_IDENTITY_READY__.then(function () {
            recordLandingJourneyStart();
            prearmContactContext();
            window.setTimeout(prearmContactContext, 700);
          });
        } else {
          recordLandingJourneyStart();
          prearmContactContext();
          window.setTimeout(prearmContactContext, 700);
        }
        if (isAtrioDestination()) ensureAtrioPromise();
        else ensurePhonePromise();
        scheduleMetaClientIpCollection();
        scheduleOfficialMetaParamBuilder();
        initRotatingBackgrounds();
        initCtas();
        initTemplate7Name();
        initInlineEmail();



        initPrivacyDialog();
      }

      init();
      window.__T7_RUNTIME_READY__=true;
      if(window.__T7_ASSET_READY__)window.__T7_ASSET_READY__();
      var early=window.__T7_EARLY_ACTION__;
      window.__T7_EARLY_ACTION__=null;
      if(early&&early.isConnected&&!early.disabled)early.click();
    })();
`
  },
  "t8-builder": {
    name: "t8-builder-d2c37c6723907a3fbe18bda6.js",
    source: `
    (function () {
      if(window.__TEMPLATE7_REENTRY_PENDING__||window.__T7_RUNTIME_BOOTING__||window.__T7_RUNTIME_READY__)return;
      window.__T7_RUNTIME_BOOTING__=true;
      var cfg = window.__PUBLIC_LANDING_RUNTIME_CONFIG__ || {};
      try { delete window.__PUBLIC_LANDING_RUNTIME_CONFIG__; } catch (e) {}
      try { ((function(){var __name=function(fn){return fn;};return (function installEntryFunnel(config, suppliedContext, endpoint = "/api/entry-funnel") {
  const browser = window;
  if (browser.__entryFunnel) {
    if (!suppliedContext || browser.__entryFunnel.flowId === suppliedContext.flow_id) return browser.__entryFunnel;
    browser.__entryFunnel.stop();
  }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const template = suppliedContext?.template || (config.template8 || config.template === 8 ? 8 : config.template);
  const landing = suppliedContext?.landing_id || config.landingId;
  if (![7, 8].includes(Number(template)) || !uuid.test(String(landing))) return;
  const allowed = ["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "skin_selected", "cta_clicked", "destination_ready", "account_ready", "login_confirmed", "gateway_loaded", "chat_ready", "entry_error", "visibility_hidden", "resumed"];
  const errors = ["destination_unavailable", "account_unavailable", "prepare_rejected", "prepare_unavailable", "login_unavailable", "session_unavailable", "chat_unavailable", "request_timeout", "network_error", "rate_limited", "invalid_entry", "unknown"];
  const providers = ["rey_de_ases", "ases_del_norte", "ganamos_net", "multi_skin"];
  const skins = ["jugamos", "ganamos_plus", "casino_zeus", "bet30", "gana_en_casa", "celu_apuestas", "casino_zeta", "oro_puro", "fortu_bet", "gran_poseidon", "kona_bet", "mega_faraon", "camel_bet", "rhino_play"];
  const key = "entry-funnel:v1:" + landing;
  const now = Date.now();
  function id() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }
  const early = browser.__ENTRY_FUNNEL_EARLY__;
  let context = suppliedContext;
  try {
    if (!context) {
      const stored = early?.context || JSON.parse(sessionStorage.getItem(key) || "null");
      if (stored && uuid.test(stored.flow_id) && stored.landing_id === landing && stored.template === template && stored.telemetry_origin === location.origin && Number.isSafeInteger(stored.started_at) && stored.started_at <= now && stored.started_at > now - 864e5) context = stored;
    }
  } catch {
  }
  const earlyStart = Number(early?.started_at);
  if (!context) context = { landing_id: String(landing), flow_id: id(), template, telemetry_origin: location.origin, started_at: Number.isSafeInteger(earlyStart) && earlyStart <= now && earlyStart > now - 864e5 ? earlyStart : now };
  const flow = context;
  try {
    sessionStorage.setItem(key, JSON.stringify(flow));
  } catch {
  }
  let queue = [];
  let timer;
  let inflight = false;
  let count = 0;
  let active = true;
  let retries = 0;
  const seen = /* @__PURE__ */ new Set();
  const pendingKey = key + ":pending";
  try {
    const pending = JSON.parse(sessionStorage.getItem(pendingKey) || "null");
    if (pending?.flow_id === flow.flow_id && Array.isArray(pending.events)) {
      queue = pending.events.slice(0, 20).filter((e) => uuid.test(String(e.id)) && allowed.includes(String(e.name)));
    }
  } catch {
  }
  function saveQueue() {
    try {
      sessionStorage.setItem(pendingKey, JSON.stringify({ flow_id: flow.flow_id, events: queue }));
    } catch {
    }
  }
  function flush(beacon = false) {
    if (!active) return;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    if (!queue.length || inflight && !beacon) return;
    const events = queue.slice(0, 20);
    const payload = JSON.stringify({ landing_id: flow.landing_id, flow_id: flow.flow_id, template: flow.template, events });
    if (beacon && navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon(endpoint, new Blob([payload], { type: "text/plain" }))) return;
      } catch {
      }
    }
    inflight = true;
    fetch(endpoint, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, credentials: "same-origin", keepalive: true, cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error("unavailable");
      const sent = new Set(events.map((e) => e.id));
      queue = queue.filter((e) => !sent.has(e.id));
      retries = 0;
      saveQueue();
    }).catch(() => {
      retries += 1;
    }).finally(() => {
      inflight = false;
      if (active && queue.length && retries <= 1 && document.visibilityState !== "hidden") timer = setTimeout(() => flush(), 1800);
    });
  }
  function emit(name, details = {}) {
    if (!active || !allowed.includes(name) || count >= 80) return;
    const provider = details.provider || config.targetProvider;
    const skin = details.skin || config.skinCode;
    const once = !["cta_clicked", "entry_error", "visibility_hidden", "resumed"].includes(name);
    const stageKey = name + ":" + String(provider || "") + ":" + String(skin || "");
    if (once && seen.has(stageKey)) return;
    seen.add(stageKey);
    count += 1;
    const event = {
      id: uuid.test(String(details.event_id)) ? details.event_id : id(),
      name,
      elapsed_ms: Math.max(0, Math.min(864e5, Number.isSafeInteger(details.elapsed_ms) ? Number(details.elapsed_ms) : Date.now() - flow.started_at))
    };
    if (providers.includes(String(provider))) event.provider = provider;
    if (skins.includes(String(skin))) event.skin = skin;
    if (name === "entry_error") event.error_code = errors.includes(String(details.error_code)) ? details.error_code : "unknown";
    if (Number.isInteger(details.status) && Number(details.status) >= 100 && Number(details.status) <= 599) event.status = details.status;
    queue.push(event);
    if (queue.length > 40) queue = queue.slice(-40);
    saveQueue();
    if (!timer) timer = setTimeout(() => flush(), 500);
  }
  const api = { flowId: flow.flow_id, emit, flush, context: () => ({ ...flow }), stop: () => {
    active = false;
    if (timer) clearTimeout(timer);
  } };
  browser.__entryFunnel = api;
  if (!suppliedContext && Array.isArray(early?.events)) {
    early.events.slice(0, 8).forEach((event) => {
      if (["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "cta_clicked", "entry_error"].includes(event.name) && Number.isSafeInteger(event.at) && event.at >= flow.started_at && event.at <= Date.now()) emit(event.name, { elapsed_ms: event.at - flow.started_at, event_id: event.id, error_code: event.error_code });
    });
    delete browser.__ENTRY_FUNNEL_EARLY__;
  }
  if (!suppliedContext) {
    const visibleForm = () => {
      if (document.visibilityState === "hidden") return;
      emit("page_visible");
      const form = document.querySelector("[data-template7-form]");
      if (form && form.getClientRects().length) emit("form_visible");
    };
    document.addEventListener("focusin", (event) => {
      if (event.target?.matches?.("[data-template7-name]")) {
        visibleForm();
        emit("name_focus");
      }
    });
    document.addEventListener("input", (event) => {
      const target = event.target;
      if (!target?.matches?.("[data-template7-name]")) return;
      if (target.value.length > 0) emit("name_started");
      if (target.value.trim() && target.checkValidity()) emit("name_valid");
    });
    const begin = () => {
      requestAnimationFrame(visibleForm);
      const observer = new MutationObserver(visibleForm);
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "class"] });
      setTimeout(() => observer.disconnect(), 12e4);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", begin, { once: true });
    else begin();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      emit("visibility_hidden");
      flush(true);
    } else {
      emit("resumed");
      if (!suppliedContext) emit("page_visible");
      flush();
    }
  });
  window.addEventListener("pagehide", () => flush(true));
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      emit("resumed");
      flush();
    }
  });
  return api;
});})())(cfg); } catch (_) {}

      var template7IdentityReady = !window.__LB_IDENTITY_READY__;
      var template7IdentityWaiting = !!window.__LB_IDENTITY_READY__;
      var template7PendingIdentityClick = null;
      function releaseTemplate7Identity(ok) {
        template7IdentityWaiting = false;
        template7IdentityReady = ok === true;
        if (template7PendingIdentityClick) {
          var pending = template7PendingIdentityClick;
          template7PendingIdentityClick = null;
          pending.disabled = false;
          if (template7IdentityReady) handleCtaClick(pending);
          else { if (template7Transition) template7Transition.finish(); setTemplate7Error("No pudimos recuperar tu acceso. Intent\xE1 nuevamente."); }
        }
      }
      if (!template7IdentityReady) window.__LB_IDENTITY_READY__.then(releaseTemplate7Identity, function () { releaseTemplate7Identity(false); });
      var clickLocked = false;
      var landingResolution = (function captureLandingResolution(slug, allowAutomatic = false) {
  if (!globalThis.window) return null;
  const browser = window;
  const saved = browser.__LANDING_RESOLUTION__;
  if (saved?.slug === slug && saved.url === window.location.href) return saved.value;
  const url = new URL(window.location.href);
  const selections = url.searchParams.getAll("landing");
  const automatic = url.searchParams.getAll("__landing_auto");
  let value = null;
  let pathname = url.pathname.replace(/\\/$/, "");
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
  }
  if (selections.length === 1 && selections[0].trim() === slug) {
    value = "url_parameter";
  } else if (!selections.length || selections.length === 1 && !selections[0].trim()) {
    const expectedPath = allowAutomatic ? \`/\${slug}\` : \`/l/\${slug}\`;
    if (pathname === expectedPath) {
      value = allowAutomatic && automatic.length === 1 && automatic[0] === slug ? "automatic" : "path";
    }
  }
  if (url.searchParams.has("__landing_auto")) {
    url.searchParams.delete("__landing_auto");
    try {
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    } catch {
    }
  }
  browser.__LANDING_RESOLUTION__ = { slug, url: window.location.href, value };
  return value;
})(cfg.slug, cfg.automaticLandingSelection === true);
      var template7ContactSent = false;
      var template7AttemptContext = null;
      var noPhoneTimer = null;
      var metaTracking = {
        fbp: "",
        fbc: "",
        clientIpAddress: "",
        clientIpIssuedAt: null,
        clientIpProof: ""
      };
      var metaIpCollectorPromise = null;
      var metaParamBuilderPromise = null;
      var officialMetaTracking = null;
      var prearmedContact = null;
      var journeyStartInFlight = false;
      var leadCaptureModal = null;
      var pendingLeadCaptureButton = null;
      var CONTACT_DEDUP_TTL_MS = 5 * 60 * 1000;
      var JOURNEY_START_DEDUP_TTL_MS = CONTACT_DEDUP_TTL_MS;
      var SOCIAL_PROOF_INTERVAL_MS = 5000;

      function queryParams() {
        try { return new URLSearchParams(window.location.search); }
        catch (e) { return new URLSearchParams(); }
      }

      function deviceType() {
        var ua = (navigator.userAgent || "").toLowerCase();
        if (/tablet|ipad/.test(ua)) return "tablet";
        if (/mobi|iphone|android/.test(ua)) return "mobile";
        return "desktop";
      }

      function normalizePhone(raw, rawCountryCallingCode) {
  var digits = String(raw || "").replace(/\\D+/g, "");
  var countryCallingCode = String(rawCountryCallingCode || "").replace(/\\D+/g, "");
  if (!digits) return "";
  if (digits.indexOf("00") === 0) digits = digits.slice(2);
  if (countryCallingCode && digits.indexOf(countryCallingCode) === 0) return digits;

  var national = digits.replace(/^0+/, "");
  if (countryCallingCode === "54") {
    national = national.replace(/^15/, "");
    return national.length === 10 ? "54" + national : digits;
  }
  if (countryCallingCode === "595") {
    return national.length === 9 ? "595" + national : digits;
  }
  return digits;
}
      function normalizeArgentinaWhatsapp(rawValue){var digits=String(rawValue==null?"":rawValue).replace(/\\D/g,"");if(!digits)return"";if(digits.indexOf("00")===0)digits=digits.slice(2);digits=digits.replace(/^0+/,"");var national=digits;if(digits.indexOf("54")===0)national=digits.slice(2);else if(digits.indexOf("9")===0&&digits.length===11)national=digits.slice(1);national=national.replace(/^0+/,"");if(national.indexOf("9")===0&&national.length===11)national=national.slice(1);if(national.length===12){var lengths=[2,3,4];for(var i=0;i<lengths.length;i++){var areaLength=lengths[i];if(national.slice(areaLength,areaLength+2)!=="15")continue;var candidate=national.slice(0,areaLength)+national.slice(areaLength+2);if(candidate.length===10){national=candidate;break}}}return/^[1-9]\\d{9}$/.test(national)?"549"+national:""}

    function template7WebviewKind(ua) {
      var text = String(ua || "");
      var inApp = /Instagram|FBAN|FBAV|FB_IAB|FB4A|Messenger|TikTok|Bytedance|Musical_ly/i.test(text);
      if (/Android/i.test(text) && (inApp || /(?:;|\\s)wv(?:;|\\))/i.test(text))) return "android";
      if (/iPhone|iPad|iPod/i.test(text) && inApp) return "ios";
      return "normal";
    }

    function template7CheckedHandoff(raw) {
      var url = new URL(String(raw || ""));
      if (url.protocol !== "https:" || url.username || url.password || url.hash ||
          (url.pathname !== "/prepare" && url.pathname !== "/start") ||
          url.searchParams.getAll("t").length !== 1 || !url.searchParams.get("t") || url.searchParams.get("t").length > 12000 ||
          url.searchParams.getAll("ef").length > 1 || (url.searchParams.has("ef") &&
          (!url.searchParams.get("ef") || url.searchParams.get("ef").length > 2003))) {
        throw new Error("invalid handoff");
      }
      if(url.pathname==="/prepare"&&url.searchParams.has("skin")&&(url.searchParams.getAll("skin").length!==1||
          ["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(url.searchParams.get("skin"))===-1||
          (typeof cfg!=="undefined"&&cfg.targetProvider&&cfg.targetProvider!=="multi_skin")))throw new Error("invalid handoff skin");
      // Attribution is captured on the landing before this navigation. Future
      // advertising parameters must neither reject nor authorize an entry.
      var token=url.searchParams.get("t"),funnel=url.searchParams.get("ef"),skin=url.pathname==="/prepare"?url.searchParams.get("skin"):null;
      url.search="";url.searchParams.set("t",token);
      if(funnel)url.searchParams.set("ef",funnel);
      if(skin)url.searchParams.set("skin",skin);
      return url;
    }

    function template7HandoffIntent(raw) {
      var url = template7CheckedHandoff(raw);
      return "intent://" + url.host + url.pathname + url.search +
        "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
        encodeURIComponent(url.href) + ";end";
    }

    function navigateTemplate7Handoff(raw) {
      var url = template7CheckedHandoff(raw);
      try { window.localStorage.setItem("template7:gateway-visited:" + url.origin, String(Date.now())); } catch(e) {}
      // A Meta in-app browser can complete this same first-party navigation.
      // User-agent detection alone is not evidence of a failed entry.
      try { window.location.assign(url.href); return; }
      catch (error) { showTemplate7HandoffFallback(url.href); }
    }

    function showTemplate7HandoffFallback(raw) {
      var url = template7CheckedHandoff(raw);
      var kind = template7WebviewKind(navigator.userAgent);
      if (template7Transition) template7Transition.finish();
      var panel = document.querySelector("[data-template7-handoff-panel]");
      if (!panel) {
        panel = document.createElement("div");
        panel.className = "template7__handoff-panel";
        panel.setAttribute("data-template7-handoff-panel", "");
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "true");
        panel.innerHTML = '<div class="template7__handoff-card"><h2>Continu\xE1 con tu acceso</h2>' +
          '<p data-template7-handoff-help></p><a data-template7-handoff-open>Continuar</a>' +
          '<button type="button" data-template7-handoff-copy>Copiar enlace</button>' +
          '<small>El enlace es temporal y de un solo uso. Abrilo una sola vez.</small></div>';
        document.body.appendChild(panel);
      }
      var help = panel.querySelector("[data-template7-handoff-help]");
      var open = panel.querySelector("[data-template7-handoff-open]");
      var copy = panel.querySelector("[data-template7-handoff-copy]");
      if (kind === "android") {
        help.textContent = "No se pudo abrir tu acceso en este navegador. Pod\xE9s continuar en Chrome con la misma cuenta.";
        open.textContent = "Abrir en Chrome";
        open.href = template7HandoffIntent(url.href);
      } else {
        help.textContent = "No se pudo abrir tu acceso. Intent\xE1 abrir el enlace o copialo para continuar en otro navegador con la misma cuenta.";
        open.textContent = "Abrir enlace";
        open.href = url.href;
        open.target = "_blank";
        open.rel = "noopener noreferrer";
      }
      copy.onclick = function () {
        if (!navigator.clipboard || !navigator.clipboard.writeText) return;
        navigator.clipboard.writeText(url.href).then(function () {
          copy.textContent = "Enlace copiado";
        }).catch(function () { copy.textContent = "No se pudo copiar"; });
      };
      open.focus();
    }

      var fetchWithEntryRecovery = async function fetchWithEntryRecovery(url, init, onRetry) {
  const deadline = Date.now() + 45e3;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (init.signal?.aborted) throw init.signal.reason || new Error("entry_cancelled");
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("entry_recovery_pending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(42e3, remaining));
    const cancel = () => controller.abort(init.signal?.reason);
    init.signal?.addEventListener("abort", cancel, { once: true });
    if (init.signal?.aborted) cancel();
    const feedback = onRetry ? setTimeout(onRetry, Math.min(8e3, remaining)) : void 0;
    let response;
    let failure;
    let retryAfter = 0;
    try {
      response = await fetch(url, Object.assign({}, init, { signal: controller.signal }));
      if (!response.ok && ![408, 429, 500, 502, 503, 504].includes(response.status)) return response;
      const received = response;
      response = void 0;
      const text = await received.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch (error) {
        if (received.ok) throw error;
      }
      response = new Response(text, { status: received.status, statusText: received.statusText, headers: received.headers });
      if (response.ok) return response;
      if (body && (body.retryable === false || ["integration_pending", "api2_not_configured", "landing_unavailable", "advisor_not_assigned"].includes(body.error))) return response;
      const header = response.headers.get("Retry-After");
      if (header) retryAfter = /^\\d+$/.test(header) ? Number(header) * 1e3 : Math.max(0, Date.parse(header) - Date.now());
      if (retryAfter > 6e4) return response;
    } catch (error) {
      failure = error;
    } finally {
      clearTimeout(timer);
      if (feedback !== void 0) clearTimeout(feedback);
      init.signal?.removeEventListener("abort", cancel);
    }
    if (init.signal?.aborted) throw init.signal.reason || failure || new Error("entry_cancelled");
    if (attempt === 3) {
      if (response) return response;
      throw failure;
    }
    if (onRetry) onRetry();
    const delay = Math.max(Number.isFinite(retryAfter) ? retryAfter : 0, [500, 1500, 3500][attempt]);
    if (Date.now() + delay >= deadline) {
      if (response) return response;
      throw failure || new Error("entry_recovery_pending");
    }
    await new Promise((resolve, reject) => {
      const abort = () => {
        clearTimeout(pause);
        init.signal?.removeEventListener("abort", abort);
        reject(init.signal?.reason || new Error("entry_cancelled"));
      };
      const pause = setTimeout(() => {
        init.signal?.removeEventListener("abort", abort);
        resolve();
      }, delay);
      init.signal?.addEventListener("abort", abort, { once: true });
      if (init.signal?.aborted) abort();
    });
  }
  throw new Error("entry_recovery_exhausted");
};
      function setTemplate7Error(message) {
        var error = document.querySelector("[data-template7-error]");
        if (!error) return;
        error.textContent = message || "";
        error.hidden = !message;
      }


function createGatewayEntryTransition(root) {
  if (!root) return null;
  var frame=null,origin="",wallet=false,timer=0,retryTimer=0,automaticRetries=0,previous=null,themeSnapshot=null,addedTheme=null,canvasSnapshot=null;
  function applyPalette(){if(themeSnapshot!==null)return;if(document.documentElement&&document.documentElement.style){canvasSnapshot=document.documentElement.style.getPropertyValue("--gateway-entry-canvas");document.documentElement.style.setProperty("--gateway-entry-canvas",root.dataset.palette)}themeSnapshot=Array.from(document.querySelectorAll('meta[name="theme-color"]')).map(function(meta){var previous=meta.getAttribute("content");meta.setAttribute("content",root.dataset.palette);return [meta,previous]});if(!themeSnapshot.length){addedTheme=document.createElement("meta");addedTheme.name="theme-color";addedTheme.content=root.dataset.palette;document.head.appendChild(addedTheme)}}
  function restorePalette(){if(themeSnapshot===null)return;if(canvasSnapshot!==null&&document.documentElement&&document.documentElement.style){if(canvasSnapshot)document.documentElement.style.setProperty("--gateway-entry-canvas",canvasSnapshot);else document.documentElement.style.removeProperty("--gateway-entry-canvas");canvasSnapshot=null}themeSnapshot.forEach(function(item){if(item[1]===null)item[0].removeAttribute("content");else item[0].setAttribute("content",item[1])});if(addedTheme)addedTheme.remove();themeSnapshot=null;addedTheme=null}
  var title=root.querySelector("[data-entry-title]"),description=root.querySelector("[data-entry-description]");
  var spinner=root.querySelector(".entry-spinner"),actions=root.querySelector(".entry-actions");
  function milestone(name,details){try{if(window.__gatewayEntryFunnel)window.__gatewayEntryFunnel.emit(name,details)}catch(e){}}
  function finish(){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(root.hidden)return;root.hidden=true;restorePalette();if(previous&&previous.isConnected)previous.focus({preventScroll:true})}
  function fail(message){if(root.hidden)return;clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;milestone("entry_error",{error_code:"chat_unavailable"});root.dataset.stage="error";title.textContent="No pudimos completar la conexi\xF3n";description.textContent=message;spinner.hidden=true;actions.hidden=false}
  function reconnect(message){if(root.hidden||retryTimer)return;if(!frame||automaticRetries>=1){fail(message);return}clearTimeout(timer);automaticRetries++;var currentFrame=frame,currentSource=frame.src;description.textContent="Estamos recuperando la conexi\xF3n con tu asesor.";retryTimer=setTimeout(function(){retryTimer=0;if(root.hidden||frame!==currentFrame||frame.src!==currentSource)return;start("connecting",true);frame.src=currentSource},750)}
  function start(stage,recovering){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(!recovering)automaticRetries=0;previous=document.activeElement;root.dataset.stage=stage;root.hidden=false;applyPalette();spinner.hidden=false;actions.hidden=true;title.textContent=stage==="preparing"?"Preparando tu acceso":stage==="creating"?"Creando tu cuenta":"Conectando con tu asesor";description.textContent=stage==="connecting"?"Tu sesi\xF3n en la plataforma est\xE1 lista.":"Estamos preparando tu acceso.";root.querySelectorAll("[data-entry-source]").forEach(function(el){el.srcset=el.dataset.srcset});root.querySelectorAll("[data-entry-logo]").forEach(function(el){el.src=el.dataset.src});root.focus({preventScroll:true});if(stage==="connecting")timer=setTimeout(function(){reconnect("La conexi\xF3n est\xE1 tardando m\xE1s de lo esperado. Pod\xE9s reintentar sin crear otra cuenta.")},20000)}
  root.querySelector("[data-entry-retry]").addEventListener("click",function(){if(frame){start("connecting");frame.src=frame.src}else finish()});
  root.querySelector("[data-entry-continue]").addEventListener("click",function(){finish();if(frame)frame.focus()});
  root.addEventListener("keydown",function(event){if(event.key!=="Tab")return;var buttons=actions.hidden?[]:Array.from(actions.querySelectorAll("button"));if(!buttons.length){event.preventDefault();root.focus();return}if(event.shiftKey&&(document.activeElement===buttons[0]||document.activeElement===root)){event.preventDefault();buttons[buttons.length-1].focus()}else if(!event.shiftKey&&(document.activeElement===buttons[buttons.length-1]||document.activeElement===root)){event.preventDefault();buttons[0].focus()}});
  window.addEventListener("focusin",function(event){if(!root.hidden&&!root.contains(event.target))root.focus({preventScroll:true})});
  window.addEventListener("message",function(event){var data=event.data;if(!frame||event.source!==frame.contentWindow||event.origin!==origin||!data||data.source!=="atrio-widget"||data.type!=="atrio.widget.entry-ready")return;if(!wallet||(data.walletReady===true&&data.walletRequestCompleted===true)||data.walletAvailable===false){milestone("chat_ready");finish();return}if(data.walletRequestCompleted===true&&data.walletAvailable===true&&data.walletReady===false)reconnect("El chat est\xE1 disponible, pero no pudimos obtener los datos para cargar. Pod\xE9s reintentar o continuar al chat.")});
  return {start:start,finish:finish,fail:fail,bind:function(value,allowedOrigin,needsWallet){frame=value;origin=allowedOrigin;wallet=needsWallet;milestone("gateway_loaded")}};
}

      var template7Transition = createGatewayEntryTransition(document.getElementById("gateway-entry-transition"));
      var template7EntryGeneration = 0;
      function template7TransitionUrl(raw) {
        var url = template7CheckedHandoff(raw);
        if (url.pathname === "/start") {
          url.pathname = "/prepare";
          if(cfg.targetProvider==="multi_skin"&&["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(cfg.skinCode)!==-1)url.searchParams.set("skin",cfg.skinCode);
        }
        return url.href;
      }
      function failTemplate7(button, attempt) {
        if (attempt !== undefined && attempt !== template7EntryGeneration) return;
        if (template7Transition) template7Transition.finish();
        if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "account_unavailable" });
        clickLocked = false;
        button.disabled = false;
        setButtonText(button, getRestButtonText(button));
        setTemplate7Error("Tu acceso sigue pendiente. Toc\xE1 el bot\xF3n para continuar con el mismo intento.");
      }

      function startTemplate7Gateway(name, phone, promoCode, atrioData, tracking, params) {
        if (atrioData && atrioData.preparationReady && atrioData.existingName && atrioData.promoCode) {
          name = atrioData.existingName; promoCode = atrioData.promoCode;
        }
        var advisorId = firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id]);
        var advisorSlug = firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug]);
        var atrioClientId = firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id]);
        if (!advisorId || !advisorSlug || !atrioClientId) return Promise.reject(new Error("advisor unavailable"));
        return fetchWithEntryRecovery("/api/template7/prepare", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landing_id: cfg.landingId,
            landing_slug: cfg.slug, card_index: cfg.cardIndex,
            entry_funnel: window.__entryFunnel ? window.__entryFunnel.context() : undefined,
            name: name,
            phone: phone || undefined,
            atrio_client_id: atrioClientId,
            advisor_id: advisorId,
            advisor_slug: advisorSlug,
            promo_code: promoCode,
            attribution: {
              utm_source: params.get("utm_source") || "",
              utm_medium: params.get("utm_medium") || "",
              landing: cfg.slug,
              landing_resolution: landingResolution || "",
              facebook: params.get("facebook") || "",
              portofolio: params.get("portofolio") || "",
              cp: params.get("cp") || "",
              campana: params.get("campana") || "",
              conjunto: params.get("conjunto") || "",
              anuncio: params.get("anuncio") || "",
              utm_campaign: params.get("utm_campaign") || "",
              utm_content: params.get("utm_content") || "",
              utm_term: params.get("utm_term") || "",
              card_index: String(cfg.cardIndex), target_provider: cfg.targetProvider,
              skin_code: cfg.targetProvider === "multi_skin" ? cfg.skinCode : "",
              fbp: tracking.fbp || "",
              fbc: tracking.fbc || ""
            }
          })
        }).then(function (response) {
          if (!response.ok) throw new Error("gateway unavailable");
          return response.json();
        }).then(function (data) {
          if (!data || typeof data.handoff_url !== "string" || !data.handoff_url) throw new Error("handoff unavailable");
          return template7TransitionUrl(data.handoff_url);
        });
      }

      function generatePromoCode(tag) {
        return String(tag || "LP") + "-" + Math.random().toString(16).slice(2, 14);
      }

      function buildMessage(promoCode) {
        var baseMessage = ("Hola! quiero mas informacion por favor! " + promoCode + "\\nMi nombre es:").trim();
        var extraText = String(cfg.whatsappPrefillText || "").trim();
        return extraText ? baseMessage + "\\n\\n" + extraText : baseMessage;
      }

      function isAtrioDestination() {
        return cfg.template === 7;
      }

      function buildAtrioRedirectUrl(promoCode, atrioData) {
        try {
          var raw = firstNonEmpty([
            atrioData && atrioData.atrioRedirectUrl,
            atrioData && atrioData.atrio_redirect_url,
            cfg.atrioRedirectUrl
          ]);
          if (!raw) return "";
          var url = new URL(raw, window.location.href);
          if (url.protocol !== "http:" && url.protocol !== "https:") return "";
          url.searchParams.set("promo_code", promoCode);
          var atrioId = firstNonEmpty([
            atrioData && atrioData.atrioId,
            atrioData && atrioData.atrio_id,
            cfg.atrioId
          ]);
          if (atrioId) url.searchParams.set("atrio_id", atrioId);
          return url.toString();
        } catch (e) {
          return "";
        }
      }

      function safeUUID() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
          return window.crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0;
          var v = c === "x" ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function storageKey(key) {
        return String(cfg.storageNamespace || ("landing-builder:no-pixel:" + cfg.slug)) + ":" + key;
      }

      function getLocalStorageValue(key) {
        try { return window.localStorage.getItem(storageKey(key)) || ""; }
        catch (e) { return ""; }
      }

      function setLocalStorageValue(key, value) {
        try { if (value) window.localStorage.setItem(storageKey(key), value); }
        catch (e) {}
      }

      function getOrCreateExternalId() {
        var existing = getLocalStorageValue("external_id");
        if (existing) return existing;
        var created = safeUUID();
        setLocalStorageValue("external_id", created);
        return created;
      }

      function firstNonEmpty(values) {
        for (var i = 0; i < values.length; i += 1) {
          var value = values[i];
          if (value == null) continue;
          var text = String(value).trim();
          if (text) return text;
        }
        return "";
      }

      function normalizeEmail(raw) {
        return String(raw || "").trim().toLowerCase();
      }

      function readMeta() {
        try { return window.__META || {}; }
        catch (e) { return {}; }
      }

      function resolveIdentity(params) {
        var meta = readMeta();
        function getParam(name) { return params.get(name) || ""; }

        var emailRaw = firstNonEmpty([
          getParam("email"),
          getParam("em"),
          getLocalStorageValue("em"),
          meta.userEmail || ""
        ]);
        var phoneRaw = firstNonEmpty([
          getParam("phone"),
          getParam("ph"),
          getLocalStorageValue("ph"),
          meta.userPhone || ""
        ]);
        var externalId = firstNonEmpty([
          meta.externalId || "",
          getLocalStorageValue("external_id")
        ]) || getOrCreateExternalId();
        var fn = firstNonEmpty([getParam("fn"), getLocalStorageValue("fn"), meta.userFn || ""]);
        var ln = firstNonEmpty([getParam("ln"), getLocalStorageValue("ln"), meta.userLn || ""]);
        var ct = firstNonEmpty([getParam("ct"), getLocalStorageValue("ct")]);
        var st = firstNonEmpty([getParam("st"), getLocalStorageValue("st")]);
        var zip = firstNonEmpty([getParam("zip"), getLocalStorageValue("zip")]);
        var country = firstNonEmpty([getParam("country"), getLocalStorageValue("country")]);

        setLocalStorageValue("external_id", externalId);
        if (emailRaw) setLocalStorageValue("em", normalizeEmail(emailRaw));
        if (phoneRaw) setLocalStorageValue("ph", normalizePhone(phoneRaw, cfg.phoneCountryCode));
        if (fn) setLocalStorageValue("fn", fn);
        if (ln) setLocalStorageValue("ln", ln);
        if (ct) setLocalStorageValue("ct", ct);
        if (st) setLocalStorageValue("st", st);
        if (zip) setLocalStorageValue("zip", zip);
        if (country) setLocalStorageValue("country", country);

        return {
          emailRaw: emailRaw,
          phoneRaw: phoneRaw,
          ct: ct,
          st: st,
          zip: zip,
          country: country,
          email: emailRaw ? normalizeEmail(emailRaw) : "",
          ph: phoneRaw ? normalizePhone(phoneRaw, cfg.phoneCountryCode) : "",
          fn: fn,
          ln: ln,
          externalId: externalId
        };
      }

      function applyLeadCaptureToIdentity(identity, capture) {
        if (!capture || typeof capture !== "object") return identity;
        var fields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
        var firstName = (cfg.template === 7 || fields.firstName) ? String(capture.firstName || "").trim() : "";
        var lastName = fields.lastName ? String(capture.lastName || "").trim() : "";
        var emailRaw = fields.email ? String(capture.email || "").trim() : "";
        var phoneRaw = (fields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
          ? String(capture.phone || "").trim()
          : "";
        var normalizedPhone = phoneRaw
          ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(phoneRaw) : normalizePhone(phoneRaw, cfg.phoneCountryCode))
          : "";

        return {
          emailRaw: emailRaw || identity.emailRaw,
          phoneRaw: normalizedPhone ? phoneRaw : identity.phoneRaw,
          ct: identity.ct,
          st: identity.st,
          zip: identity.zip,
          country: identity.country,
          email: emailRaw ? normalizeEmail(emailRaw) : identity.email,
          ph: normalizedPhone || identity.ph,
          fn: firstName || identity.fn,
          ln: lastName || identity.ln,
          externalId: identity.externalId
        };
      }

      function readInlineEmail() {
        if (!cfg.emailCapture || cfg.emailCapture.enabled !== true) return "";
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return "";
        var value = String(input.value || "").trim();
        var valid = value.length <= 254 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value);
        var error = document.querySelector("[data-inline-email-error]");
        if (error) error.textContent = value && !valid
          ? "Email inv\xE1lido. Pod\xE9s seguir a WhatsApp." : "";
        return valid ? value.toLowerCase() : "";
      }

      function initInlineEmail() {
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return;
        input.addEventListener("input", function () {
          var error = document.querySelector("[data-inline-email-error]");
          if (error) error.textContent = "";
        });
        input.addEventListener("blur", readInlineEmail);
      }

      function cookieValue(name) {
        try {
          var parts = document.cookie ? document.cookie.split("; ") : [];
          for (var i = 0; i < parts.length; i += 1) {
            var part = parts[i];
            var eq = part.indexOf("=");
            var key = eq >= 0 ? part.slice(0, eq) : part;
            if (key === name) return decodeURIComponent(eq >= 0 ? part.slice(eq + 1) : "");
          }
        } catch (e) {}
        return "";
      }

      function collectMetaTrackingParams(params) {
        var fbp = cookieValue("_fbp");
        var fbc = cookieValue("_fbc");
        var fbclid = params.get("fbclid") || "";
        if (!fbc && fbclid) {
          fbc = "fb.1." + Date.now() + "." + fbclid;
        }
        metaTracking = {
          fbp: fbp || "",
          fbc: fbc || "",
          clientIpAddress: metaTracking.clientIpAddress || "",
          clientIpIssuedAt: metaTracking.clientIpIssuedAt || null,
          clientIpProof: metaTracking.clientIpProof || ""
        };
        return metaTracking;
      }

      function safeEventSourceUrl() {
        try {
          return window.location.origin + window.location.pathname;
        } catch (e) {
          return "";
        }
      }

      function sanitizeSensitiveQueryParams() {
        try {
          var url = new URL(window.location.href);
          var sensitiveKeys = ["email", "em", "phone", "ph", "fn", "ln", "external_id", "eid", "ct", "st", "zip", "country"];
          var changed = false;
          sensitiveKeys.forEach(function (key) {
            if (url.searchParams.has(key)) {
              url.searchParams.delete(key);
              changed = true;
            }
          });
          if (changed) {
            window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
          }
        } catch (e) {}
      }

      function mergeMetaTracking(base, incoming) {
        var next = incoming && typeof incoming === "object" ? incoming : {};
        return {
          fbp: String(next.fbp || base.fbp || ""),
          fbc: String(next.fbc || base.fbc || ""),
          clientIpAddress: String(next.clientIpAddress || base.clientIpAddress || ""),
          clientIpIssuedAt: Number(next.clientIpIssuedAt || base.clientIpIssuedAt) || null,
          clientIpProof: String(next.clientIpProof || base.clientIpProof || "")
        };
      }

      function getOfficialMetaParamBuilder() {
        try {
          var sdk = window.clientParamBuilder;
          if (
            sdk &&
            typeof sdk.processAndCollectAllParams === "function" &&
            typeof sdk.getFbc === "function" &&
            typeof sdk.getFbp === "function"
          ) {
            return sdk;
          }
        } catch (e) {}
        return null;
      }

      function loadOfficialMetaParamBuilder() {
        var available = getOfficialMetaParamBuilder();
        if (available) return Promise.resolve(available);
        if (metaParamBuilderPromise) return metaParamBuilderPromise;

        var source = String(cfg.metaParamBuilderSrc || "").trim();
        if (!source) return Promise.resolve(null);

        metaParamBuilderPromise = new Promise(function (resolve) {
          var existing = document.querySelector("script[data-meta-param-builder='official']");
          var script = existing || document.createElement("script");
          var settled = false;

          function finish(value) {
            if (settled) return;
            settled = true;
            resolve(value || null);
          }

          script.addEventListener("load", function () {
            finish(getOfficialMetaParamBuilder());
          }, { once: true });
          script.addEventListener("error", function () {
            finish(null);
          }, { once: true });

          if (!existing) {
            script.src = source;
            script.async = true;
            script.setAttribute("data-meta-param-builder", "official");
            document.head.appendChild(script);
          }
        }).finally(function () {
          metaParamBuilderPromise = null;
        });

        return metaParamBuilderPromise;
      }

      function readOfficialMetaParam(sdk, methodName) {
        try {
          var method = sdk && sdk[methodName];
          return typeof method === "function" ? String(method.call(sdk) || "") : "";
        } catch (e) {
          return "";
        }
      }

      function collectOfficialMetaTracking() {
        var sdk = getOfficialMetaParamBuilder();
        if (!sdk) return Promise.resolve(null);

        var trustedIp =
          metaTracking.clientIpAddress && metaTracking.clientIpProof
            ? metaTracking.clientIpAddress
            : "";
        var processResult;

        try {
          processResult = trustedIp
            ? sdk.processAndCollectAllParams(window.location.href, function () {
                return Promise.resolve(trustedIp);
              })
            : sdk.processAndCollectAllParams(window.location.href);
        } catch (e) {
          return Promise.resolve(null);
        }

        return Promise.resolve(processResult)
          .then(function () {
            officialMetaTracking = {
              fbp: readOfficialMetaParam(sdk, "getFbp"),
              fbc: readOfficialMetaParam(sdk, "getFbc"),
              clientIpAddress: trustedIp,
              clientIpIssuedAt: trustedIp ? metaTracking.clientIpIssuedAt : null,
              clientIpProof: trustedIp ? metaTracking.clientIpProof : ""
            };
            metaTracking = mergeMetaTracking(metaTracking, officialMetaTracking);
            return officialMetaTracking;
          })
          .catch(function () {
            return null;
          });
      }

      function collectMetaClientIpProof() {
        var collectorUrl = String(cfg.metaIpCollectorUrl || "").trim();
        if (!collectorUrl) return Promise.resolve(null);
        if (metaTracking.clientIpAddress && metaTracking.clientIpProof) {
          return Promise.resolve(metaTracking);
        }
        if (metaIpCollectorPromise) return metaIpCollectorPromise;

        metaIpCollectorPromise = new Promise(function (resolve) {
          var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
          var timeoutId = window.setTimeout(function () {
            if (controller) controller.abort();
            resolve(null);
          }, 800);

          fetch(collectorUrl, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            cache: "no-store",
            signal: controller ? controller.signal : undefined
          })
            .then(function (response) {
              if (!response.ok) return null;
              return response.json();
            })
            .then(function (value) {
              if (!value || typeof value !== "object") return null;
              var ip = String(value.ip || "").trim().toLowerCase();
              var issuedAt = Number(value.issued_at);
              var proof = String(value.proof || "").trim();
              var nowSeconds = Math.floor(Date.now() / 1000);
              if (
                !ip ||
                !proof ||
                !Number.isInteger(issuedAt) ||
                issuedAt > nowSeconds + 30 ||
                nowSeconds - issuedAt > 600
              ) {
                return null;
              }
              metaTracking = mergeMetaTracking(metaTracking, {
                clientIpAddress: ip,
                clientIpIssuedAt: issuedAt,
                clientIpProof: proof
              });
              return metaTracking;
            })
            .then(resolve)
            .catch(function () { resolve(null); })
            .finally(function () {
              window.clearTimeout(timeoutId);
              metaIpCollectorPromise = null;
            });
        });

        return metaIpCollectorPromise;
      }

      function scheduleMetaClientIpCollection() {
        var run = function () { void collectMetaClientIpProof(); };
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 800 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      function scheduleOfficialMetaParamBuilder() {
        var run = function () {
          Promise.all([
            loadOfficialMetaParamBuilder(),
            collectMetaClientIpProof()
          ])
            .then(function (values) {
              if (!values[0]) return null;
              return collectOfficialMetaTracking();
            })
            .catch(function () {});
        };

        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 1200 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      window.__PUBLIC_META_COLLECT_PARAMS = function () {
        return officialMetaTracking;
      };

      function refreshMetaTracking(params, fallback) {
        var base = mergeMetaTracking(collectMetaTrackingParams(params), fallback || {});
        var collector = window.__PUBLIC_META_COLLECT_PARAMS;
        if (typeof collector !== "function") return Promise.resolve(base);
        return waitWithTimeout(Promise.resolve(collector()), 450)
          .then(function (value) {
            metaTracking = mergeMetaTracking(base, value || {});
            return metaTracking;
          })
          .catch(function () {
            metaTracking = base;
            return base;
          });
      }

      function waitWithTimeout(promise, timeoutMs) {
        var timeoutId;
        var timeout = new Promise(function (resolve) {
          timeoutId = window.setTimeout(function () { resolve(null); }, timeoutMs);
        });
        return Promise.race([promise, timeout]).then(function (value) {
          if (timeoutId) window.clearTimeout(timeoutId);
          return value;
        }, function () {
          if (timeoutId) window.clearTimeout(timeoutId);
          return null;
        });
      }

      function ensurePhonePromise() {
        if (isAtrioDestination()) return Promise.resolve(null);
        window.__PUBLIC_LANDING_PHONE_PROMISES = window.__PUBLIC_LANDING_PHONE_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_PHONE_PROMISES[template8DestinationKey()];
        if (existing) return existing;
        var baseUrl = cfg.supabaseUrl;
        var anonKey = cfg.supabaseAnonKey;
        if (!baseUrl || !anonKey) return Promise.resolve(null);
        var endpoint = baseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-phone?name=" + encodeURIComponent(cfg.slug);
        var promise = fetch(endpoint, {
          headers: { apikey: anonKey, Authorization: "Bearer " + anonKey },
          cache: "no-store",
          keepalive: true
        }).then(function (response) {
          if (!response.ok) return null;
          return response.json();
        }).catch(function () {
          return null;
        });
        window.__PUBLIC_LANDING_PHONE_PROMISES[template8DestinationKey()] = promise;
        return promise;
      }

      function clearPrewarmedPhonePromise() {
        try {
          if (window.__PUBLIC_LANDING_PHONE_PROMISES) {
            delete window.__PUBLIC_LANDING_PHONE_PROMISES[template8DestinationKey()];
          }
        } catch (e) {}
      }


      function ensureAtrioPromise() {
        if (!cfg.cardIndex) return Promise.resolve(null);
        window.__PUBLIC_LANDING_ATRIO_PROMISES = window.__PUBLIC_LANDING_ATRIO_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_ATRIO_PROMISES[template8DestinationKey()];
        if (existing) return observeTemplate7Destination(existing);
        var promise = Promise.resolve(window.__LB_IDENTITY_READY__ || true).then(function (ready) {
          if (ready !== true) return null;
          return fetch("/api/template7/destination", {
            method: "POST", credentials: "same-origin", cache: "no-store", keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ landing_id: cfg.landingId, landing_slug: cfg.slug, card_index: cfg.cardIndex })
          }).then(function (response) { return response.ok ? response.json() : null; });
        }).catch(function () { return null; });
        window.__PUBLIC_LANDING_ATRIO_PROMISES[template8DestinationKey()] = promise;
        return observeTemplate7Destination(promise);
      }

      function observeTemplate7Destination(promise) {
        window.__T7_DESTINATION_STATES__ = window.__T7_DESTINATION_STATES__ || {};
        var states = window.__T7_DESTINATION_STATES__;
        if (!states[template8DestinationKey()] || states[template8DestinationKey()].promise !== promise) {
          var state = { promise: promise, settled: false, value: null };
          states[template8DestinationKey()] = state;
          promise.then(function(value) { state.settled = true; state.value = value; }, function() { state.settled = true; });
        }
        return promise;
      }

      function clearPrewarmedAtrioPromise() {
        var state = window.__T7_DESTINATION_STATES__ && window.__T7_DESTINATION_STATES__[template8DestinationKey()];
        if (state && (!state.settled || (state.value && (state.value.atrioClientId || state.value.atrio_client_id) &&
            (state.value.atrioId || state.value.atrio_id) && (state.value.atrioSlug || state.value.atrio_slug)))) return;
        try {
          if (window.__PUBLIC_LANDING_ATRIO_PROMISES) {
            delete window.__PUBLIC_LANDING_ATRIO_PROMISES[template8DestinationKey()];
          }
        } catch (e) {}
      }

      function sendTrackBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/track", blob)) return Promise.resolve();
          } catch (e) {}
        }
        return fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).catch(function () {});
      }

      function sendJourneyStartBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/journey-start", blob)) return Promise.resolve(true);
          } catch (e) {}
        }
        return fetch("/api/journey-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).then(function (response) {
          return !!(response && response.ok);
        }).catch(function () {
          return false;
        });
      }

      function contactDedupKey(slug, externalId) {
        return "contact_sent:" + slug + ":" + externalId;
      }

      function wasContactRecentlySent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = contactDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < CONTACT_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markContactSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(contactDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function journeyStartDedupKey(slug, externalId) {
        return "journey_start_sent:" + slug + ":" + externalId;
      }

      function wasJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = journeyStartDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < JOURNEY_START_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(journeyStartDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function extractPhoneId(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return null;
        var direct = phoneData.phoneId != null ? phoneData.phoneId : phoneData.phone_id;
        if (direct != null && direct !== "") {
          var asNumber = Number(direct);
          return isFinite(asNumber) ? asNumber : direct;
        }
        return null;
      }

      function extractAssignedGerenciaSnapshot(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return {};
        var gerencia = phoneData.gerencia && typeof phoneData.gerencia === "object"
          ? phoneData.gerencia
          : {};
        var internalId = gerencia.id != null ? Number(gerencia.id) : null;
        var externalId = firstNonEmpty([
          gerencia.externalId,
          gerencia.external_id,
          gerencia.gerencia_id,
          internalId
        ]);
        var name = firstNonEmpty([gerencia.name, gerencia.nombre]);
        var label = name && externalId ? name + " (ID " + externalId + ")" : (name || (externalId ? "Gerencia " + externalId : ""));
        return {
          assigned_gerencia_id: isFinite(internalId) && internalId > 0 ? internalId : undefined,
          assigned_gerencia_external_id: externalId || undefined,
          assigned_gerencia_name: name || undefined,
          assigned_gerencia_label: label || undefined
        };
      }

      function buildLandingJourneyStartPayload(params, identity, tracking, targetData) {
        var atrioMode = isAtrioDestination();
        var phoneData = atrioMode ? null : targetData;
        var assignedPhone = atrioMode ? "" : normalizePhone(
          (phoneData && phoneData.phone) || "",
          cfg.phoneCountryCode
        );
        var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
        return {
          event_name: "LandingPageView",
          slug: cfg.slug,
          landing_id: cfg.landingId,
          landing_name: cfg.landingName,
          target_provider: cfg.template === 7 ? cfg.targetProvider : undefined,
          skin_code: cfg.template === 7 && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
          workspace_currency: cfg.workspaceCurrency || undefined,
          external_id: identity.externalId,
          event_source_url: safeEventSourceUrl(),
          landing: cfg.slug,
              landing_resolution: landingResolution || "",
          facebook: params.get("facebook") || "",
          portofolio: params.get("portofolio") || "",
          cp: params.get("cp") || "",
          campana: params.get("campana") || "",
          conjunto: params.get("conjunto") || "",
          anuncio: params.get("anuncio") || "",
          utm_campaign: params.get("utm_campaign") || "",
          fbp: tracking.fbp,
          fbc: tracking.fbc,
          from_meta_ads: !!tracking.fbc,
          meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
          telefono_asignado: assignedPhone || undefined,
          assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
          assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
          assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
          assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
          device_type: deviceType(),
          client_ip_address: tracking.clientIpAddress || undefined,
          client_user_agent: navigator.userAgent || undefined
        };
      }

      function recordLandingJourneyStart() {
        if (journeyStartInFlight || !cfg.landingId) return;
        var params = queryParams();
        var identity = resolveIdentity(params);
        if (wasJourneyStartSent(cfg.slug, identity.externalId)) return;
        journeyStartInFlight = true;
        var tracking = collectMetaTrackingParams(params);
        var immediateBody = JSON.stringify(
          buildLandingJourneyStartPayload(params, identity, tracking, null)
        );
        sendJourneyStartBestEffort(immediateBody).then(function (sent) {
          if (sent) markJourneyStartSent(cfg.slug, identity.externalId);
          if (isAtrioDestination()) return sent;
          return ensurePhonePromise().then(function (phoneData) {
            if (!phoneData || !phoneData.phone) return sent;
            return sendJourneyStartBestEffort(JSON.stringify(
              buildLandingJourneyStartPayload(params, identity, tracking, phoneData)
            )).then(function (enrichedSent) {
              if (enrichedSent) markJourneyStartSent(cfg.slug, identity.externalId);
              return sent || enrichedSent;
            });
          });
        }).catch(function () {}).then(function () {
          journeyStartInFlight = false;
        });
      }

      function setButtonText(button, text) {
        var label = button.querySelector("[data-public-landing-cta-label]");
        if (label) label.textContent = text;
      }

      function getButtonLabel(button, attrName, fallback) {
        return button.getAttribute(attrName) || fallback;
      }

      function getRestButtonText(button) {
        return getButtonLabel(button, "data-public-landing-rest-label", cfg.ctaText);
      }

      function getLoadingButtonText(button) {
        return getButtonLabel(button, "data-public-landing-loading-label", "Abriendo...");
      }

      function getDisabledButtonText(button) {
        return getButtonLabel(button, "data-public-landing-disabled-label", "Sin numero disponible");
      }

      function setNoPhoneState(button) {
        button.disabled = true;
        setButtonText(button, getDisabledButtonText(button));
        if (noPhoneTimer) window.clearTimeout(noPhoneTimer);
        noPhoneTimer = window.setTimeout(function () {
          button.disabled = false;
          setButtonText(button, getRestButtonText(button));
          clickLocked = false;
          noPhoneTimer = null;
        }, 2000);
      }

      function notifyPhoneClick(phoneData, phone) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var effectivePhoneMode = phoneData && (phoneData.phoneMode || (phoneData.phoneSelection && phoneData.phoneSelection.mode) || "");
          var phoneId = extractPhoneId(phoneData);
          if ((effectivePhoneMode === "fair" || effectivePhoneMode === "random") && baseUrl && anonKey && phoneId != null) {
            var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/phone-click";
            fetch(notifyUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: anonKey,
                Authorization: "Bearer " + anonKey
              },
              body: JSON.stringify({
                landingName: (phoneData && phoneData.landingName) || cfg.landingName,
                phoneId: phoneId,
                phone: phone,
                reservationId: (phoneData && phoneData.assignmentReservationId) || undefined
              }),
              keepalive: true
            }).catch(function () {});
          }
        } catch (e) {}
      }

      function notifyTemplate6CardClick(button) {
        try {
          if ((cfg.template !== 6 && !cfg.template8) || !cfg.landingId || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
          var cardIndex = Number(button.getAttribute("data-template6-card-index"));
          if (!Number.isInteger(cardIndex) || cardIndex < 1 || cardIndex > 6) return;
          fetch(cfg.supabaseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-card-click", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: cfg.supabaseAnonKey,
              Authorization: "Bearer " + cfg.supabaseAnonKey
            },
            body: JSON.stringify({ landingId: cfg.landingId, cardIndex: cardIndex, eventId: safeUUID() }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function notifyAtrioClick(atrioData) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var atrioClientId = firstNonEmpty([
            atrioData && atrioData.atrioClientId,
            atrioData && atrioData.atrio_client_id,
            cfg.atrioClientId
          ]);
          if (!baseUrl || !anonKey || !atrioClientId) return;
          var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/atrio-click";
          fetch(notifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: anonKey,
              Authorization: "Bearer " + anonKey
            },
            body: JSON.stringify({
              landingName: cfg.landingName || cfg.slug,
              atrioClientId: atrioClientId
            }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function firePixelContact(eventId) {
        try {
          if (!cfg.sendContactPixel || !window.fbq) return;
          window.fbq("track", "Contact", { source: "main_button" }, { eventID: eventId });
        } catch (e) {}
      }

      function createContactPrearm() {
        var params = queryParams();
        var promoCode = generatePromoCode(cfg.landingTag || "LP");
        var identity = resolveIdentity(params);
        var tracking = collectMetaTrackingParams(params);
        var testEventCode = params.get("test_event_code") || "";
        sanitizeSensitiveQueryParams();

        return {
          params: params,
          promoCode: promoCode,
          message: buildMessage(promoCode),
          eventId: safeUUID(),
          identity: identity,
          tracking: tracking,
          testEventCode: testEventCode,
          shouldSkipContact: testEventCode ? false : wasContactRecentlySent(cfg.slug, identity.externalId),
          createdAt: Date.now()
        };
      }

      function prearmContactContext() {
        try {
          prearmedContact = createContactPrearm();
        } catch (e) {
          prearmedContact = null;
        }
      }

      function consumeContactContext() {
        if (cfg.template === 7 && template7AttemptContext) return template7AttemptContext;
        var context = prearmedContact || createContactPrearm();
        prearmedContact = null;
        window.setTimeout(prearmContactContext, 0);
        if (cfg.template === 7) template7AttemptContext = context;
        return context;
      }

      function hasLeadCaptureFields() {
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        return leadCapture.enabled === true &&
          (fields.firstName === true || fields.lastName === true || fields.phone === true || fields.email === true);
      }

      function shouldShowLeadCapture(button) {
        if (cfg.template === 7) return false;
        if (!hasLeadCaptureFields()) return false;
        return button.getAttribute("data-public-landing-auto-start") !== "true";
      }

      function closeLeadCaptureModal() {
        if (!leadCaptureModal) return;
        leadCaptureModal.hidden = true;
        document.body.classList.remove("public-lead-capture-open");
        pendingLeadCaptureButton = null;
      }

      function continueAfterLeadCapture(capture) {
        var button = pendingLeadCaptureButton;
        closeLeadCaptureModal();
        if (button) processCtaClick(button, capture || null);
      }

      function createLeadCaptureInput(name, label, type, autocomplete) {
        var wrapper = document.createElement("label");
        wrapper.className = "public-lead-capture__field";
        var input = document.createElement("input");
        input.type = type;
        input.name = name;
        input.autocomplete = autocomplete;
        input.setAttribute("aria-label", label);
        input.placeholder = label;
        input.className = "public-lead-capture__input";
        wrapper.appendChild(input);
        return wrapper;
      }

      function initLeadCaptureModal() {
        if (!hasLeadCaptureFields() || leadCaptureModal) return;
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        var overlay = document.createElement("div");
        overlay.className = "public-lead-capture";
        overlay.hidden = true;
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "public-lead-capture-title");

        var card = document.createElement("form");
        card.className = "public-lead-capture__card";
        card.noValidate = true;

        var close = document.createElement("button");
        close.type = "button";
        close.className = "public-lead-capture__close";
        close.setAttribute("aria-label", "Omitir formulario e ir a WhatsApp");
        close.textContent = "\xD7";

        var title = document.createElement("h2");
        title.id = "public-lead-capture-title";
        title.textContent = String(leadCapture.title || "Desbloque\xE1 atenci\xF3n personalizada");

        var description = document.createElement("p");
        description.className = "public-lead-capture__description";
        description.textContent = String(leadCapture.description || "");

        var grid = document.createElement("div");
        grid.className = "public-lead-capture__grid";
        if (fields.firstName === true) grid.appendChild(createLeadCaptureInput("firstName", "Nombre", "text", "given-name"));
        if (fields.lastName === true) grid.appendChild(createLeadCaptureInput("lastName", "Apellido", "text", "family-name"));
        if (fields.phone === true) grid.appendChild(createLeadCaptureInput("phone", "Tel\xE9fono", "tel", "tel"));
        if (fields.email === true) grid.appendChild(createLeadCaptureInput("email", "Email", "email", "email"));

        var actions = document.createElement("div");
        actions.className = "public-lead-capture__actions";
        var skip = document.createElement("button");
        skip.type = "button";
        skip.className = "public-lead-capture__skip";
        skip.textContent = "OMITIR E IR A WHATSAPP";
        var submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "public-lead-capture__submit";
        submit.textContent = "CONTINUAR A WHATSAPP \u2192";
        actions.appendChild(skip);
        actions.appendChild(submit);

        card.appendChild(close);
        card.appendChild(title);
        if (description.textContent) card.appendChild(description);
        card.appendChild(grid);
        card.appendChild(actions);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        leadCaptureModal = overlay;

        function readCaptureValues() {
          var data = {};
          Array.prototype.slice.call(card.querySelectorAll("input[name]")).forEach(function (input) {
            data[input.name] = String(input.value || "").trim();
          });
          return data;
        }

        card.addEventListener("submit", function (event) {
          event.preventDefault();
          continueAfterLeadCapture(readCaptureValues());
        });
        skip.addEventListener("click", function () { continueAfterLeadCapture(null); });
        close.addEventListener("click", function () { continueAfterLeadCapture(null); });
        overlay.addEventListener("click", function (event) {
          if (event.target === overlay) continueAfterLeadCapture(null);
        });
        document.addEventListener("keydown", function (event) {
          if (!leadCaptureModal || leadCaptureModal.hidden) return;
          if (event.key === "Escape") continueAfterLeadCapture(null);
        });
      }

      function openLeadCaptureModal(button) {
        initLeadCaptureModal();
        if (!leadCaptureModal) {
          processCtaClick(button, null);
          return;
        }
        pendingLeadCaptureButton = button;
        var inlineEmail = readInlineEmail();
        var modalEmail = leadCaptureModal.querySelector('input[name="email"]');
        if (modalEmail && cfg.emailCapture && cfg.emailCapture.enabled === true) modalEmail.value = inlineEmail;
        leadCaptureModal.hidden = false;
        document.body.classList.add("public-lead-capture-open");
        window.setTimeout(function () {
          var first = leadCaptureModal.querySelector("input, button");
          if (first && typeof first.focus === "function") first.focus();
        }, 0);
      }

      function handleCtaClick(button) {
        if (clickLocked || button.disabled) return;
        var entryName = document.querySelector("[data-template7-name]");
        if (!entryName || !String(entryName.value || "").trim()) return;
        template7EntryGeneration++;
        window.__T7_ENTRY_STARTED__ = true;
        window.__T7_ENTRY_STARTED__ = true;
        if (!template7IdentityReady) {
          if (!template7PendingIdentityClick) { template7PendingIdentityClick = button; button.disabled = true; if (template7Transition) template7Transition.start("preparing"); }
          if (!template7IdentityWaiting && window.__LB_BOOTSTRAP_IDENTITY__) {
            template7IdentityWaiting = true;
            window.__LB_BOOTSTRAP_IDENTITY__().then(releaseTemplate7Identity, function () { releaseTemplate7Identity(false); });
          }
          return;
        }
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7) {
          var nameInput = document.querySelector("[data-template7-name]");
          var whatsappInput = document.querySelector("[data-template7-whatsapp]");
          var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
          var firstName = nameInput ? String(nameInput.value || "").trim() : "";
          if (!firstName) {
            if (nameInput) nameInput.focus();
            button.disabled = true;
            return;
          }
          var rawWhatsapp = whatsappInput ? String(whatsappInput.value || "").trim() : "";
          var normalizedWhatsapp = rawWhatsapp ? normalizeArgentinaWhatsapp(rawWhatsapp) : "";
          if (whatsappWarning) {
            whatsappWarning.textContent = rawWhatsapp && !normalizedWhatsapp
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          }
          processCtaClick(button, { firstName: firstName, phone: normalizedWhatsapp });
          return;
        }
        if (shouldShowLeadCapture(button)) {
          openLeadCaptureModal(button);
          return;
        }
        processCtaClick(button, null);
      }

      function processCtaClick(button, leadCaptureValues) {
        var entryAttempt = template7EntryGeneration;
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7 && !String(leadCaptureValues && leadCaptureValues.firstName || "").trim()) return;
        if (cfg.template === 7 && window.__entryFunnel) {
          if (!window.__T7_EARLY_CTA_RECORDED__) window.__entryFunnel.emit("cta_clicked");
          window.__T7_EARLY_CTA_RECORDED__ = false;
        }
        if (cfg.template === 7) { setTemplate7Error(""); if (template7Transition) template7Transition.start("creating"); }
        clickLocked = true;
        button.disabled = true;
        if (cfg.template !== 7) setButtonText(button, getLoadingButtonText(button));
        notifyTemplate6CardClick(button);
        var tapStartedAt = Date.now();

        window.requestAnimationFrame(function () {
          if (entryAttempt !== template7EntryGeneration) return;
          var context = consumeContactContext();
          var params = context.params;
          var promoCode = context.promoCode;
          var message = context.message;
          var eventId = context.eventId;
          var inlineEmail = readInlineEmail();
          var safeCapture = leadCaptureValues;
          if (safeCapture && cfg.emailCapture && cfg.emailCapture.enabled === true) {
            var typedEmail = String(safeCapture.email || "").trim();
            safeCapture = Object.assign({}, safeCapture, {
              email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(typedEmail) ? typedEmail : ""
            });
          }
          var baseIdentity = inlineEmail
            ? Object.assign({}, context.identity, { emailRaw: inlineEmail, email: normalizeEmail(inlineEmail) })
            : context.identity;
          var identity = applyLeadCaptureToIdentity(baseIdentity, safeCapture);
          var captureFields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
          var hasLeadCaptureForm = !!leadCaptureValues;
          var formFn = hasLeadCaptureForm && (cfg.template === 7 || captureFields.firstName)
            ? String(leadCaptureValues.firstName || "").trim()
            : "";
          var formLn = hasLeadCaptureForm && captureFields.lastName
            ? String(leadCaptureValues.lastName || "").trim()
            : "";
          var formEmail = hasLeadCaptureForm && captureFields.email
            ? normalizeEmail(safeCapture.email || "")
            : "";
          var formPhoneRaw = hasLeadCaptureForm && (captureFields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
            ? String(leadCaptureValues.phone || "").trim()
            : "";
          var formPhone = formPhoneRaw
            ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(formPhoneRaw) : normalizePhone(formPhoneRaw, cfg.phoneCountryCode))
            : "";
          var tracking = context.tracking;
          var testEventCode = context.testEventCode;
          var shouldSkipContact = context.shouldSkipContact || (cfg.template === 7 && template7ContactSent);

          Promise.all([
            refreshMetaTracking(params, tracking),
            isAtrioDestination()
              ? waitWithTimeout(ensureAtrioPromise(), 1500)
              : waitWithTimeout(ensurePhonePromise(), 1500)
          ])
            .then(function (resolved) {
              tracking = resolved[0];
              return resolved[1];
            })
            .then(function (targetData) {
              if (isAtrioDestination()) {
                if (targetData && (cfg.template === 7
                  ? firstNonEmpty([targetData.atrioClientId, targetData.atrio_client_id]) && firstNonEmpty([targetData.atrioId, targetData.atrio_id]) && firstNonEmpty([targetData.atrioSlug, targetData.atrio_slug])
                  : (targetData.atrioRedirectUrl || targetData.atrio_redirect_url))) return targetData;
                clearPrewarmedAtrioPromise();
                return waitWithTimeout(ensureAtrioPromise(), 2500);
              }
              if (targetData && targetData.phone) return targetData;
              clearPrewarmedPhonePromise();
              return waitWithTimeout(ensurePhonePromise(), 2500);
            })
            .then(function (targetData) {
              if (entryAttempt !== template7EntryGeneration) return;
              var atrioMode = isAtrioDestination();
              var gatewayMode = cfg.template === 7;
              var atrioData = atrioMode ? (targetData || {}) : null;
              var phoneData = atrioMode ? null : targetData;
              var phone = atrioMode ? "" : normalizePhone(
                (phoneData && phoneData.phone) || "",
                cfg.phoneCountryCode
              );
              var redirectUrl = gatewayMode ? "" : atrioMode
                ? buildAtrioRedirectUrl(promoCode, atrioData)
                : "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
              if (gatewayMode && (!firstNonEmpty([atrioData.atrioClientId, atrioData.atrio_client_id]) || !firstNonEmpty([atrioData.atrioId, atrioData.atrio_id]) || !firstNonEmpty([atrioData.atrioSlug, atrioData.atrio_slug]))) {
                if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "destination_unavailable" });
                failTemplate7(button);
                return;
              }
              if (gatewayMode && window.__entryFunnel) window.__entryFunnel.emit("destination_ready");
              if ((!atrioMode && !phone) || (atrioMode && !gatewayMode && !redirectUrl)) {
                setNoPhoneState(button);
                return;
              }

              if (!shouldSkipContact) {
                firePixelContact(eventId);
              }

              if (!atrioMode) {
                notifyPhoneClick(phoneData, phone);
              } else {
                notifyAtrioClick(atrioData);
              }

              var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
              var payload = {
                event_name: "Contact",
                card_index: cfg.cardIndex, target_provider: gatewayMode ? cfg.targetProvider : undefined,
                skin_code: gatewayMode && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
                meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
                sendContactPixel: cfg.sendContactPixel,
                event_id: eventId,
                external_id: identity.externalId,
                event_source_url: safeEventSourceUrl(),
                email: identity.emailRaw,
                phone: identity.ph || identity.phoneRaw,
                phone_country_code: cfg.phoneCountryCode || undefined,
                currency: cfg.workspaceCurrency || undefined,
                workspace_currency: cfg.workspaceCurrency || undefined,
                lead_capture_form: hasLeadCaptureForm || undefined,
                form_fn: formFn || undefined,
                form_ln: formLn || undefined,
                form_email: formEmail || undefined,
                form_phone: formPhone || undefined,
                fn: identity.fn || undefined,
                ln: identity.ln || undefined,
                ct: identity.ct || undefined,
                st: identity.st || undefined,
                zip: identity.zip || undefined,
                country: identity.country || undefined,
                landing: cfg.slug,
              landing_resolution: landingResolution || "",
                facebook: params.get("facebook") || "",
                portofolio: params.get("portofolio") || "",
                cp: params.get("cp") || "",
                campana: params.get("campana") || "",
                conjunto: params.get("conjunto") || "",
                anuncio: params.get("anuncio") || "",
                utm_campaign: params.get("utm_campaign") || "",
                test_event_code: testEventCode || undefined,
                fbp: tracking.fbp,
                fbc: tracking.fbc,
                client_ip_address: tracking.clientIpAddress || undefined,
                client_ip_issued_at: tracking.clientIpIssuedAt || undefined,
                client_ip_proof: tracking.clientIpProof || undefined,
                client_user_agent: navigator.userAgent || undefined,
                telefono_asignado: atrioMode ? "" : phone,
                assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
                assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
                assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
                assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
                promo_code: promoCode,
                source: "main_button",
                source_platform: "landing",
                cta_destination: atrioMode ? "atrio" : "whatsapp",
                redirect_channel: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "rey_de_ases_gateway"
                  : atrioMode ? "atrio" : "whatsapp",
                gateway_app_id: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "reydeases_gateway"
                  : undefined,
                atrio_redirect_url: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioRedirectUrl, atrioData && atrioData.atrio_redirect_url, cfg.atrioRedirectUrl]) : undefined,
                atrio_client_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id, cfg.atrioClientId]) : undefined,
                atrio_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id, cfg.atrioId]) : undefined,
                atrio_slug: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug, cfg.atrioSlug]) : undefined,
                brand: cfg.landingName,
                landing_id: cfg.landingId,
                landing_name: cfg.landingName,
                device_type: deviceType(),
                cta_tap_to_redirect_ms: Date.now() - tapStartedAt,
                mode: cfg.backgroundMode,
                api_meta: null
              };

              try {
                if (!shouldSkipContact) {
                  sendTrackBestEffort(JSON.stringify({
                    postUrl: cfg.postUrl,
                    payload: payload
                  }));
                }
              } catch (e) {}

              if (!shouldSkipContact) markContactSent(cfg.slug, identity.externalId);
              if (gatewayMode && !shouldSkipContact) template7ContactSent = true;

              if (gatewayMode) {
                startTemplate7Gateway(formFn, formPhone, promoCode, atrioData, tracking, params)
                  .then(function (handoffUrl) { if (entryAttempt === template7EntryGeneration) navigateTemplate7Handoff(handoffUrl); })
                  .catch(function () { failTemplate7(button, entryAttempt); });
              } else {
                window.setTimeout(function () {
                  window.location.assign(redirectUrl);
                }, 180);
              }
            })
            .catch(function () {
              if (cfg.template === 7) failTemplate7(button, entryAttempt);
              else {
                clickLocked = false;
                button.disabled = false;
                setButtonText(button, getRestButtonText(button));
              }
            });
        });
      }

      function initCtas() {
        var ctas = Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-cta]"));
        ctas.forEach(function (button) {
          button.addEventListener("click", function () { handleCtaClick(button); });
        });

        // Al volver de WhatsApp con la pagina restaurada desde bfcache, un CTA nuevo
        // necesita una asignacion nueva; la deduplicacion de Contact sigue en storage.
        window.addEventListener("pageshow", function (event) {
          if (!event.persisted || cfg.template !== 6) return;
          clickLocked = false;
          ctas.forEach(function (button) {
            button.disabled = false;
            setButtonText(button, getRestButtonText(button));
          });
          clearPrewarmedPhonePromise();
          if (!isAtrioDestination()) ensurePhonePromise();
          prearmContactContext();
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-trigger]")).forEach(function (trigger) {
          trigger.addEventListener("click", function () {
            var firstCta = document.querySelector("[data-public-landing-cta]");
            if (firstCta) firstCta.click();
          });
        });

        var autoCta = document.querySelector("[data-public-landing-cta][data-public-landing-auto-start='true']");
        if (autoCta) {
          window.setTimeout(function () { autoCta.click(); }, 40);
        }
      }

      function initTemplate7Name() {
        if (cfg.template !== 7) return;
        var input = document.querySelector("[data-template7-name]");
        var whatsappInput = document.querySelector("[data-template7-whatsapp]");
        var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
        var button = document.querySelector(".template7__cta[data-public-landing-cta]");
        var form = document.querySelector("[data-template7-form]");
        if (!input || !button || !form) return;
        function sync() {
          if (clickLocked) return;
          button.disabled = !String(input.value || "").trim();
        }
        input.addEventListener("input", sync);
        if (whatsappInput && whatsappWarning) {
          whatsappInput.addEventListener("input", function () {
            if (!String(whatsappInput.value || "").trim() || normalizeArgentinaWhatsapp(whatsappInput.value)) {
              whatsappWarning.textContent = "";
              whatsappWarning.hidden = true;
            }
          });
          whatsappInput.addEventListener("blur", function () {
            var raw = String(whatsappInput.value || "").trim();
            whatsappWarning.textContent = raw && !normalizeArgentinaWhatsapp(raw)
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          });
        }
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          sync();
          if (!button.disabled) button.click();
          else input.focus();
        });
        window.addEventListener("pageshow", sync);
        sync();
      }

      function initPrivacyDialog() {
        var dialog = document.querySelector("[data-public-privacy-dialog]");
        var openButton = document.querySelector("[data-public-privacy-open]");
        if (!dialog || !openButton) return;

        function openDialog() {
          if (typeof dialog.showModal === "function") dialog.showModal();
          else dialog.setAttribute("open", "");
        }

        function closeDialog() {
          if (typeof dialog.close === "function") dialog.close();
          else dialog.removeAttribute("open");
        }

        openButton.addEventListener("click", openDialog);
        Array.prototype.slice.call(dialog.querySelectorAll("[data-public-privacy-close]")).forEach(function (button) {
          button.addEventListener("click", closeDialog);
        });
        dialog.addEventListener("click", function (event) {
          if (event.target === dialog) closeDialog();
        });
      }

      function parseImages(value) {
        try {
          var parsed = JSON.parse(value || "[]");
          return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } catch (e) {
          return [];
        }
      }

      function initialRotatingIndex(images, rotateEveryHours) {
        if (images.length <= 1) return 0;
        var everyMs = Math.max(1, Number(rotateEveryHours) || 24) * 60 * 60 * 1000;
        return Math.floor(Date.now() / everyMs) % images.length;
      }

      function initRotatingBackgrounds() {
        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-background]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.style.backgroundImage = "url(" + images[index] + ")";
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.style.backgroundImage = "url(" + images[index] + ")";
          }, everyMs);
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-image]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.setAttribute("src", images[index]);
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.setAttribute("src", images[index]);
          }, everyMs);
        });
      }

      function renderSocialProof(section, index) {
        var items = cfg.socialProofItems || [];
        if (!items.length) return;
        var item = items[index % items.length];
        var quote = section.querySelector("[data-public-landing-social-quote]");
        var meta = section.querySelector("[data-public-landing-social-meta]");
        var progress = section.querySelector("[data-public-landing-social-progress]");
        if (quote) quote.textContent = '"' + item.quote + '"';
        if (meta) meta.innerHTML = item.name + ' <span aria-hidden="true">-</span> <span class="social-proof__stars">\u2605\u2605\u2605\u2605\u2605</span>';
        if (progress) {
          progress.style.animation = "none";
          void progress.offsetHeight;
          progress.style.animation = "";
        }
      }

      function template7RecoveryAttribution() {
        var params=queryParams(),tracking=collectMetaTrackingParams(params);
        var result={landing:cfg.slug,landing_resolution:landingResolution||'',target_provider:cfg.targetProvider,
          skin_code:cfg.targetProvider==='multi_skin'?cfg.skinCode:'',fbp:tracking.fbp||'',fbc:tracking.fbc||''};
        ['facebook','portofolio','cp','campana','conjunto','anuncio','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(key){var value=params.get(key);if(value)result[key]=value;});
        if(cfg.template8&&cfg.cardIndex)result.card_index=String(cfg.cardIndex);
        return result;
      }
      function warmTemplate7Entry() {
        if (!cfg.cardIndex) return;
        function resume(advisor, name, promo) {
          // The server still reuses this identity on submit. A late background
          // response must never pull an actively typing visitor off the form.
          if (window.__T7_ENTRY_STARTED__ || window.__T7_FORM_INTERACTED__) return;
          var entryAttempt = ++template7EntryGeneration;
          window.__T7_ENTRY_STARTED__ = true; clickLocked = true;
          if (template7Transition) template7Transition.start('preparing');
          return fetchWithEntryRecovery('/api/template7/prepare', {
            method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({landing_id:cfg.landingId,landing_slug:cfg.slug, card_index: cfg.cardIndex,
              entry_funnel:window.__entryFunnel?window.__entryFunnel.context():undefined,
              atrio_client_id:advisor.atrioClientId || advisor.atrio_client_id,advisor_id:advisor.atrioId || advisor.atrio_id,
              advisor_slug:advisor.atrioSlug || advisor.atrio_slug,name:name,promo_code:promo,attribution:template7RecoveryAttribution()})
          }).then(function(response){if(!response.ok)throw new Error('entry pending');return response.json()}).then(function(result){
            if (entryAttempt !== template7EntryGeneration) return;
            if(!result || typeof result.handoff_url !== 'string')throw new Error('entry pending');
            navigateTemplate7Handoff(template7TransitionUrl(result.handoff_url));
          }).catch(function(){
            if (entryAttempt !== template7EntryGeneration) return;
            window.__T7_ENTRY_STARTED__ = false; clickLocked = false;
            if(template7Transition)template7Transition.finish();
            var nameField=document.querySelector('[data-template7-name]');if(nameField)nameField.value=name;
            setTemplate7Error('Tu acceso sigue pendiente. Pod\xE9s retomar el mismo intento sin volver a completar tus datos.');
          });
        }
        Promise.all([window.__LB_IDENTITY_READY__ || Promise.resolve(), ensureAtrioPromise()]).then(function (values) {
          var advisor = values[1];
          if (!advisor || window.__T7_ENTRY_STARTED__ || (window.__LB_IDENTITY_READY__ && values[0] !== true)) return;
          if (advisor.preparationReady) {
            if (!advisor.existingName || !advisor.promoCode || window.__T7_ENTRY_STARTED__) return;
            return resume(advisor,advisor.existingName,advisor.promoCode);
          }
          return fetch('/api/template7/warm', {
            method: 'POST', credentials: 'same-origin', cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ landing_id: cfg.landingId, landing_slug: cfg.slug, card_index: cfg.cardIndex,
              atrio_client_id: advisor.atrioClientId || advisor.atrio_client_id,
              advisor_id: advisor.atrioId || advisor.atrio_id,
              advisor_slug: advisor.atrioSlug || advisor.atrio_slug })
          }).then(function (response) { return response.ok ? response.json() : null; }).then(function (result) {
            if(result && typeof result.existing_name === 'string' && typeof result.promo_code === 'string') {
              advisor.preparationReady=true;advisor.existingName=result.existing_name;advisor.promoCode=result.promo_code;
              return resume(advisor,result.existing_name,result.promo_code);
            }
            if (result && typeof result.handoff_url === 'string' && !window.__T7_ENTRY_STARTED__ && !window.__T7_FORM_INTERACTED__) {
              var restored = new URL(result.handoff_url);
              if (restored.protocol === 'https:' && restored.pathname === '/prepare' && restored.searchParams.has('t')) {
                window.__T7_ENTRY_STARTED__ = true;
                navigateTemplate7Handoff(template7TransitionUrl(restored.href));
                return;
              }
            }
            if (!result || !result.gateway_origin) return;
            var destination = new URL(result.gateway_origin);
            if (destination.protocol !== 'https:') return;
            var link = document.createElement('link'); link.rel = 'preconnect'; link.href = destination.origin;
            document.head.appendChild(link);
            window.__T7_GATEWAY_WARM__ = window.__T7_GATEWAY_WARM__ || {};
            if (!window.__T7_GATEWAY_WARM__[destination.origin]) window.__T7_GATEWAY_WARM__[destination.origin] = fetch(destination.origin + '/api/preparations/warm', { mode: 'no-cors', credentials: 'omit', cache: 'no-store' }).catch(function () {});
            return window.__T7_GATEWAY_WARM__[destination.origin];
          });
        }).catch(function () {});
      }

      var template8SelectionVersion = 0;
      function template8DestinationKey() { return cfg.slug + ':' + (cfg.cardIndex || 'unselected'); }
      function template8Destination(card, commit) {
        return Promise.resolve(window.__LB_IDENTITY_READY__ || true).then(function(ready) {
          if (ready !== true) throw new Error('identity_pending');
          return fetch('/api/template7/destination', {
            method:'POST', credentials:'same-origin', cache:'no-store', headers:{'Content-Type':'application/json'},
            body:JSON.stringify({landing_id:cfg.landingId, landing_slug:cfg.slug, card_index:card.index, commit:commit})
          }).then(function(response) { if (!response.ok) throw new Error('page_unavailable'); return response.json(); });
        });
      }
      function initTemplate8Selection() {
        var grid = document.querySelector('[data-template8-grid]');
        var entry = document.querySelector('[data-template8-entry]');
        var status = document.querySelector('[data-template8-status]');
        window.addEventListener('click', function(event) {
          var back = event.target && event.target.closest && event.target.closest('[data-template8-back]');
          if (back && !clickLocked && !window.__T7_ENTRY_STARTED__) { template8SelectionVersion++; entry.hidden = true; grid.hidden = false; cfg.cardIndex = null; return; }
          var button = event.target && event.target.closest && event.target.closest('[data-template8-card-index]');
          if (!button || button.disabled || clickLocked || window.__T7_ENTRY_STARTED__) return;
          var index = Number(button.getAttribute('data-template8-card-index'));
          var card = cfg.template8Cards[index - 1];
          if (!card) return;
          var selectionVersion = ++template8SelectionVersion;
          notifyTemplate6CardClick(button);
          cfg.cardIndex = index; cfg.targetProvider = card.targetProvider; cfg.skinCode = card.multiSkinCode || '';
          if(window.__entryFunnel)window.__entryFunnel.emit('skin_selected',{provider:cfg.targetProvider,skin:cfg.skinCode});
          window.__T7_SELECTED_GATEWAY__=card.gatewayOrigin;
          if(window.__T7_WARM_RESOURCES__)window.__T7_WARM_RESOURCES__(card.gatewayOrigin);
          try { var selectedUrl = new URL(window.location.href); selectedUrl.searchParams.set('card_index',String(index)); selectedUrl.searchParams.set('target_provider',card.targetProvider); window.history.replaceState(window.history.state,'',selectedUrl.href); } catch(e) {}
          var login = document.querySelector('[data-template8-login]');
          if (login && card.gatewayOrigin) login.href = card.gatewayOrigin;
          var logo = document.querySelector('[data-entry-logo]');
          if (logo && card.transitionLogo) { logo.removeAttribute('src'); logo.setAttribute('data-src',card.transitionLogo); logo.alt = card.text; }
          var transitionRoot = document.getElementById('gateway-entry-transition');
          if (transitionRoot && card.transitionBrand) {
            var brand = card.transitionBrand;
            transitionRoot.dataset.palette = brand.background;
            transitionRoot.style.setProperty('--entry-background',brand.background);
            transitionRoot.style.setProperty('--entry-accent',brand.accent || '#f6c84b');
            transitionRoot.style.setProperty('--entry-track',(brand.accent || '#f6c84b') + '33');
            transitionRoot.style.setProperty('--entry-accent-text',brand.accentText || '#171105');
            transitionRoot.style.setProperty('--entry-glow',brand.glow);
            transitionRoot.querySelectorAll('[data-entry-source]').forEach(function(source) {
              source.removeAttribute('srcset'); source.dataset.srcset = card.transitionLogoAvif || '';
            });
          }
          grid.hidden = true; entry.hidden = false;
          var title = document.querySelector('[data-template8-selected-page]');
          if (title) title.textContent = card.text;
          var pageLogo = document.querySelector('.template7__logo');
          if (!pageLogo && title && card.imageUrl) { pageLogo=document.createElement('img'); pageLogo.className='template7__logo'; title.parentNode.insertBefore(pageLogo,title); }
          if (pageLogo) { pageLogo.hidden=!card.imageUrl; if(card.imageUrl){pageLogo.src=card.imageUrl;pageLogo.alt=card.text;} }
          var input = document.querySelector('[data-template7-name]');
          window.__T7_PROGRAMMATIC_FOCUS__=true;
          if (input) input.focus();
          window.__T7_PROGRAMMATIC_FOCUS__=false;
          var key = template8DestinationKey();
          window.__PUBLIC_LANDING_ATRIO_PROMISES=window.__PUBLIC_LANDING_ATRIO_PROMISES||{};
          // Selection owns its own request. Never wait for another card's warmup.
          var selected = template8Destination(card, true);
          window.__PUBLIC_LANDING_ATRIO_PROMISES[key] = selected.catch(function() { return null; });
          selected.then(function(advisor) {
            if (selectionVersion !== template8SelectionVersion) return;
            if (advisor && advisor.preparationReady) warmTemplate7Entry();
          }).catch(function() {
            if (selectionVersion !== template8SelectionVersion) return;
            entry.hidden = true; grid.hidden = false; cfg.cardIndex = null;
            status.textContent = 'Esta p\xE1gina no est\xE1 disponible ahora. Eleg\xED otra o volv\xE9 a intentar.';
          });
        }, true);
      }
      function init() {
        initTemplate8Selection();
        function markFormIntent(event) {
          var target=event.target;
          if(!window.__T7_PROGRAMMATIC_FOCUS__&&target&&target.closest&&target.closest('[data-template7-form]'))window.__T7_FORM_INTERACTED__=true;
        }
        document.addEventListener('focusin',markFormIntent,{passive:true});
        document.addEventListener('input',markFormIntent,{passive:true});
        document.addEventListener('pointerdown',markFormIntent,{passive:true});
        warmTemplate7Entry();
        if (cfg.template === 7 && window.__LB_IDENTITY_READY__) {
          window.__LB_IDENTITY_READY__.then(function () {
            recordLandingJourneyStart();
            prearmContactContext();
            window.setTimeout(prearmContactContext, 700);
          });
        } else {
          recordLandingJourneyStart();
          prearmContactContext();
          window.setTimeout(prearmContactContext, 700);
        }
        if (isAtrioDestination()) ensureAtrioPromise();
        else ensurePhonePromise();
        scheduleMetaClientIpCollection();
        scheduleOfficialMetaParamBuilder();
        initRotatingBackgrounds();
        initCtas();
        initTemplate7Name();
        initInlineEmail();



        initPrivacyDialog();
      }

      init();
      window.__T7_RUNTIME_READY__=true;
      if(window.__T7_ASSET_READY__)window.__T7_ASSET_READY__();
      var early=window.__T7_EARLY_ACTION__;
      window.__T7_EARLY_ACTION__=null;
      if(early&&early.isConnected&&!early.disabled)early.click();
    })();
`
  },
  "t8-classic": {
    name: "t8-classic-214c82c310068c50975e8648.js",
    source: `
    (function () {
      if(window.__TEMPLATE7_REENTRY_PENDING__||window.__T7_RUNTIME_BOOTING__||window.__T7_RUNTIME_READY__)return;
      window.__T7_RUNTIME_BOOTING__=true;
      var cfg = window.__PUBLIC_LANDING_RUNTIME_CONFIG__ || {};
      try { delete window.__PUBLIC_LANDING_RUNTIME_CONFIG__; } catch (e) {}
      try { ((function(){var __name=function(fn){return fn;};return (function installEntryFunnel(config, suppliedContext, endpoint = "/api/entry-funnel") {
  const browser = window;
  if (browser.__entryFunnel) {
    if (!suppliedContext || browser.__entryFunnel.flowId === suppliedContext.flow_id) return browser.__entryFunnel;
    browser.__entryFunnel.stop();
  }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const template = suppliedContext?.template || (config.template8 || config.template === 8 ? 8 : config.template);
  const landing = suppliedContext?.landing_id || config.landingId;
  if (![7, 8].includes(Number(template)) || !uuid.test(String(landing))) return;
  const allowed = ["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "skin_selected", "cta_clicked", "destination_ready", "account_ready", "login_confirmed", "gateway_loaded", "chat_ready", "entry_error", "visibility_hidden", "resumed"];
  const errors = ["destination_unavailable", "account_unavailable", "prepare_rejected", "prepare_unavailable", "login_unavailable", "session_unavailable", "chat_unavailable", "request_timeout", "network_error", "rate_limited", "invalid_entry", "unknown"];
  const providers = ["rey_de_ases", "ases_del_norte", "ganamos_net", "multi_skin"];
  const skins = ["jugamos", "ganamos_plus", "casino_zeus", "bet30", "gana_en_casa", "celu_apuestas", "casino_zeta", "oro_puro", "fortu_bet", "gran_poseidon", "kona_bet", "mega_faraon", "camel_bet", "rhino_play"];
  const key = "entry-funnel:v1:" + landing;
  const now = Date.now();
  function id() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }
  const early = browser.__ENTRY_FUNNEL_EARLY__;
  let context = suppliedContext;
  try {
    if (!context) {
      const stored = early?.context || JSON.parse(sessionStorage.getItem(key) || "null");
      if (stored && uuid.test(stored.flow_id) && stored.landing_id === landing && stored.template === template && stored.telemetry_origin === location.origin && Number.isSafeInteger(stored.started_at) && stored.started_at <= now && stored.started_at > now - 864e5) context = stored;
    }
  } catch {
  }
  const earlyStart = Number(early?.started_at);
  if (!context) context = { landing_id: String(landing), flow_id: id(), template, telemetry_origin: location.origin, started_at: Number.isSafeInteger(earlyStart) && earlyStart <= now && earlyStart > now - 864e5 ? earlyStart : now };
  const flow = context;
  try {
    sessionStorage.setItem(key, JSON.stringify(flow));
  } catch {
  }
  let queue = [];
  let timer;
  let inflight = false;
  let count = 0;
  let active = true;
  let retries = 0;
  const seen = /* @__PURE__ */ new Set();
  const pendingKey = key + ":pending";
  try {
    const pending = JSON.parse(sessionStorage.getItem(pendingKey) || "null");
    if (pending?.flow_id === flow.flow_id && Array.isArray(pending.events)) {
      queue = pending.events.slice(0, 20).filter((e) => uuid.test(String(e.id)) && allowed.includes(String(e.name)));
    }
  } catch {
  }
  function saveQueue() {
    try {
      sessionStorage.setItem(pendingKey, JSON.stringify({ flow_id: flow.flow_id, events: queue }));
    } catch {
    }
  }
  function flush(beacon = false) {
    if (!active) return;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    if (!queue.length || inflight && !beacon) return;
    const events = queue.slice(0, 20);
    const payload = JSON.stringify({ landing_id: flow.landing_id, flow_id: flow.flow_id, template: flow.template, events });
    if (beacon && navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon(endpoint, new Blob([payload], { type: "text/plain" }))) return;
      } catch {
      }
    }
    inflight = true;
    fetch(endpoint, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, credentials: "same-origin", keepalive: true, cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error("unavailable");
      const sent = new Set(events.map((e) => e.id));
      queue = queue.filter((e) => !sent.has(e.id));
      retries = 0;
      saveQueue();
    }).catch(() => {
      retries += 1;
    }).finally(() => {
      inflight = false;
      if (active && queue.length && retries <= 1 && document.visibilityState !== "hidden") timer = setTimeout(() => flush(), 1800);
    });
  }
  function emit(name, details = {}) {
    if (!active || !allowed.includes(name) || count >= 80) return;
    const provider = details.provider || config.targetProvider;
    const skin = details.skin || config.skinCode;
    const once = !["cta_clicked", "entry_error", "visibility_hidden", "resumed"].includes(name);
    const stageKey = name + ":" + String(provider || "") + ":" + String(skin || "");
    if (once && seen.has(stageKey)) return;
    seen.add(stageKey);
    count += 1;
    const event = {
      id: uuid.test(String(details.event_id)) ? details.event_id : id(),
      name,
      elapsed_ms: Math.max(0, Math.min(864e5, Number.isSafeInteger(details.elapsed_ms) ? Number(details.elapsed_ms) : Date.now() - flow.started_at))
    };
    if (providers.includes(String(provider))) event.provider = provider;
    if (skins.includes(String(skin))) event.skin = skin;
    if (name === "entry_error") event.error_code = errors.includes(String(details.error_code)) ? details.error_code : "unknown";
    if (Number.isInteger(details.status) && Number(details.status) >= 100 && Number(details.status) <= 599) event.status = details.status;
    queue.push(event);
    if (queue.length > 40) queue = queue.slice(-40);
    saveQueue();
    if (!timer) timer = setTimeout(() => flush(), 500);
  }
  const api = { flowId: flow.flow_id, emit, flush, context: () => ({ ...flow }), stop: () => {
    active = false;
    if (timer) clearTimeout(timer);
  } };
  browser.__entryFunnel = api;
  if (!suppliedContext && Array.isArray(early?.events)) {
    early.events.slice(0, 8).forEach((event) => {
      if (["page_visible", "form_visible", "name_focus", "name_started", "name_valid", "cta_clicked", "entry_error"].includes(event.name) && Number.isSafeInteger(event.at) && event.at >= flow.started_at && event.at <= Date.now()) emit(event.name, { elapsed_ms: event.at - flow.started_at, event_id: event.id, error_code: event.error_code });
    });
    delete browser.__ENTRY_FUNNEL_EARLY__;
  }
  if (!suppliedContext) {
    const visibleForm = () => {
      if (document.visibilityState === "hidden") return;
      emit("page_visible");
      const form = document.querySelector("[data-template7-form]");
      if (form && form.getClientRects().length) emit("form_visible");
    };
    document.addEventListener("focusin", (event) => {
      if (event.target?.matches?.("[data-template7-name]")) {
        visibleForm();
        emit("name_focus");
      }
    });
    document.addEventListener("input", (event) => {
      const target = event.target;
      if (!target?.matches?.("[data-template7-name]")) return;
      if (target.value.length > 0) emit("name_started");
      if (target.value.trim() && target.checkValidity()) emit("name_valid");
    });
    const begin = () => {
      requestAnimationFrame(visibleForm);
      const observer = new MutationObserver(visibleForm);
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "class"] });
      setTimeout(() => observer.disconnect(), 12e4);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", begin, { once: true });
    else begin();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      emit("visibility_hidden");
      flush(true);
    } else {
      emit("resumed");
      if (!suppliedContext) emit("page_visible");
      flush();
    }
  });
  window.addEventListener("pagehide", () => flush(true));
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      emit("resumed");
      flush();
    }
  });
  return api;
});})())(cfg); } catch (_) {}
function getOrCreateDeviceId(){return window.__TEMPLATE7_GET_DEVICE_ID__();}
      var clickLocked = false;
      var landingResolution = (function captureLandingResolution(slug, allowAutomatic = false) {
  if (!globalThis.window) return null;
  const browser = window;
  const saved = browser.__LANDING_RESOLUTION__;
  if (saved?.slug === slug && saved.url === window.location.href) return saved.value;
  const url = new URL(window.location.href);
  const selections = url.searchParams.getAll("landing");
  const automatic = url.searchParams.getAll("__landing_auto");
  let value = null;
  let pathname = url.pathname.replace(/\\/$/, "");
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
  }
  if (selections.length === 1 && selections[0].trim() === slug) {
    value = "url_parameter";
  } else if (!selections.length || selections.length === 1 && !selections[0].trim()) {
    const expectedPath = allowAutomatic ? \`/\${slug}\` : \`/l/\${slug}\`;
    if (pathname === expectedPath) {
      value = allowAutomatic && automatic.length === 1 && automatic[0] === slug ? "automatic" : "path";
    }
  }
  if (url.searchParams.has("__landing_auto")) {
    url.searchParams.delete("__landing_auto");
    try {
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    } catch {
    }
  }
  browser.__LANDING_RESOLUTION__ = { slug, url: window.location.href, value };
  return value;
})(cfg.slug, cfg.automaticLandingSelection === true);
      var template7ContactSent = false;
      var template7AttemptContext = null;
      var noPhoneTimer = null;
      var metaTracking = {
        fbp: "",
        fbc: "",
        clientIpAddress: "",
        clientIpIssuedAt: null,
        clientIpProof: ""
      };
      var metaIpCollectorPromise = null;
      var metaParamBuilderPromise = null;
      var officialMetaTracking = null;
      var prearmedContact = null;
      var journeyStartInFlight = false;
      var leadCaptureModal = null;
      var pendingLeadCaptureButton = null;
      var CONTACT_DEDUP_TTL_MS = 5 * 60 * 1000;
      var JOURNEY_START_DEDUP_TTL_MS = CONTACT_DEDUP_TTL_MS;
      var SOCIAL_PROOF_INTERVAL_MS = 5000;

      function queryParams() {
        try { return new URLSearchParams(window.location.search); }
        catch (e) { return new URLSearchParams(); }
      }

      function deviceType() {
        var ua = (navigator.userAgent || "").toLowerCase();
        if (/tablet|ipad/.test(ua)) return "tablet";
        if (/mobi|iphone|android/.test(ua)) return "mobile";
        return "desktop";
      }

      function normalizePhone(raw, rawCountryCallingCode) {
  var digits = String(raw || "").replace(/\\D+/g, "");
  var countryCallingCode = String(rawCountryCallingCode || "").replace(/\\D+/g, "");
  if (!digits) return "";
  if (digits.indexOf("00") === 0) digits = digits.slice(2);
  if (countryCallingCode && digits.indexOf(countryCallingCode) === 0) return digits;

  var national = digits.replace(/^0+/, "");
  if (countryCallingCode === "54") {
    national = national.replace(/^15/, "");
    return national.length === 10 ? "54" + national : digits;
  }
  if (countryCallingCode === "595") {
    return national.length === 9 ? "595" + national : digits;
  }
  return digits;
}
      function normalizeArgentinaWhatsapp(rawValue){var digits=String(rawValue==null?"":rawValue).replace(/\\D/g,"");if(!digits)return"";if(digits.indexOf("00")===0)digits=digits.slice(2);digits=digits.replace(/^0+/,"");var national=digits;if(digits.indexOf("54")===0)national=digits.slice(2);else if(digits.indexOf("9")===0&&digits.length===11)national=digits.slice(1);national=national.replace(/^0+/,"");if(national.indexOf("9")===0&&national.length===11)national=national.slice(1);if(national.length===12){var lengths=[2,3,4];for(var i=0;i<lengths.length;i++){var areaLength=lengths[i];if(national.slice(areaLength,areaLength+2)!=="15")continue;var candidate=national.slice(0,areaLength)+national.slice(areaLength+2);if(candidate.length===10){national=candidate;break}}}return/^[1-9]\\d{9}$/.test(national)?"549"+national:""}

    function template7WebviewKind(ua) {
      var text = String(ua || "");
      var inApp = /Instagram|FBAN|FBAV|FB_IAB|FB4A|Messenger|TikTok|Bytedance|Musical_ly/i.test(text);
      if (/Android/i.test(text) && (inApp || /(?:;|\\s)wv(?:;|\\))/i.test(text))) return "android";
      if (/iPhone|iPad|iPod/i.test(text) && inApp) return "ios";
      return "normal";
    }

    function template7CheckedHandoff(raw) {
      var url = new URL(String(raw || ""));
      if (url.protocol !== "https:" || url.username || url.password || url.hash ||
          (url.pathname !== "/prepare" && url.pathname !== "/start") ||
          url.searchParams.getAll("t").length !== 1 || !url.searchParams.get("t") || url.searchParams.get("t").length > 12000 ||
          url.searchParams.getAll("ef").length > 1 || (url.searchParams.has("ef") &&
          (!url.searchParams.get("ef") || url.searchParams.get("ef").length > 2003))) {
        throw new Error("invalid handoff");
      }
      if(url.pathname==="/prepare"&&url.searchParams.has("skin")&&(url.searchParams.getAll("skin").length!==1||
          ["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(url.searchParams.get("skin"))===-1||
          (typeof cfg!=="undefined"&&cfg.targetProvider&&cfg.targetProvider!=="multi_skin")))throw new Error("invalid handoff skin");
      // Attribution is captured on the landing before this navigation. Future
      // advertising parameters must neither reject nor authorize an entry.
      var token=url.searchParams.get("t"),funnel=url.searchParams.get("ef"),skin=url.pathname==="/prepare"?url.searchParams.get("skin"):null;
      url.search="";url.searchParams.set("t",token);
      if(funnel)url.searchParams.set("ef",funnel);
      if(skin)url.searchParams.set("skin",skin);
      return url;
    }

    function template7HandoffIntent(raw) {
      var url = template7CheckedHandoff(raw);
      return "intent://" + url.host + url.pathname + url.search +
        "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
        encodeURIComponent(url.href) + ";end";
    }

    function navigateTemplate7Handoff(raw) {
      var url = template7CheckedHandoff(raw);
      try { window.localStorage.setItem("template7:gateway-visited:" + url.origin, String(Date.now())); } catch(e) {}
      // A Meta in-app browser can complete this same first-party navigation.
      // User-agent detection alone is not evidence of a failed entry.
      try { window.location.assign(url.href); return; }
      catch (error) { showTemplate7HandoffFallback(url.href); }
    }

    function showTemplate7HandoffFallback(raw) {
      var url = template7CheckedHandoff(raw);
      var kind = template7WebviewKind(navigator.userAgent);
      if (template7Transition) template7Transition.finish();
      var panel = document.querySelector("[data-template7-handoff-panel]");
      if (!panel) {
        panel = document.createElement("div");
        panel.className = "template7__handoff-panel";
        panel.setAttribute("data-template7-handoff-panel", "");
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-modal", "true");
        panel.innerHTML = '<div class="template7__handoff-card"><h2>Continu\xE1 con tu acceso</h2>' +
          '<p data-template7-handoff-help></p><a data-template7-handoff-open>Continuar</a>' +
          '<button type="button" data-template7-handoff-copy>Copiar enlace</button>' +
          '<small>El enlace es temporal y de un solo uso. Abrilo una sola vez.</small></div>';
        document.body.appendChild(panel);
      }
      var help = panel.querySelector("[data-template7-handoff-help]");
      var open = panel.querySelector("[data-template7-handoff-open]");
      var copy = panel.querySelector("[data-template7-handoff-copy]");
      if (kind === "android") {
        help.textContent = "No se pudo abrir tu acceso en este navegador. Pod\xE9s continuar en Chrome con la misma cuenta.";
        open.textContent = "Abrir en Chrome";
        open.href = template7HandoffIntent(url.href);
      } else {
        help.textContent = "No se pudo abrir tu acceso. Intent\xE1 abrir el enlace o copialo para continuar en otro navegador con la misma cuenta.";
        open.textContent = "Abrir enlace";
        open.href = url.href;
        open.target = "_blank";
        open.rel = "noopener noreferrer";
      }
      copy.onclick = function () {
        if (!navigator.clipboard || !navigator.clipboard.writeText) return;
        navigator.clipboard.writeText(url.href).then(function () {
          copy.textContent = "Enlace copiado";
        }).catch(function () { copy.textContent = "No se pudo copiar"; });
      };
      open.focus();
    }

      var fetchWithEntryRecovery = async function fetchWithEntryRecovery(url, init, onRetry) {
  const deadline = Date.now() + 45e3;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (init.signal?.aborted) throw init.signal.reason || new Error("entry_cancelled");
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("entry_recovery_pending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(42e3, remaining));
    const cancel = () => controller.abort(init.signal?.reason);
    init.signal?.addEventListener("abort", cancel, { once: true });
    if (init.signal?.aborted) cancel();
    const feedback = onRetry ? setTimeout(onRetry, Math.min(8e3, remaining)) : void 0;
    let response;
    let failure;
    let retryAfter = 0;
    try {
      response = await fetch(url, Object.assign({}, init, { signal: controller.signal }));
      if (!response.ok && ![408, 429, 500, 502, 503, 504].includes(response.status)) return response;
      const received = response;
      response = void 0;
      const text = await received.text();
      let body = null;
      try {
        body = JSON.parse(text);
      } catch (error) {
        if (received.ok) throw error;
      }
      response = new Response(text, { status: received.status, statusText: received.statusText, headers: received.headers });
      if (response.ok) return response;
      if (body && (body.retryable === false || ["integration_pending", "api2_not_configured", "landing_unavailable", "advisor_not_assigned"].includes(body.error))) return response;
      const header = response.headers.get("Retry-After");
      if (header) retryAfter = /^\\d+$/.test(header) ? Number(header) * 1e3 : Math.max(0, Date.parse(header) - Date.now());
      if (retryAfter > 6e4) return response;
    } catch (error) {
      failure = error;
    } finally {
      clearTimeout(timer);
      if (feedback !== void 0) clearTimeout(feedback);
      init.signal?.removeEventListener("abort", cancel);
    }
    if (init.signal?.aborted) throw init.signal.reason || failure || new Error("entry_cancelled");
    if (attempt === 3) {
      if (response) return response;
      throw failure;
    }
    if (onRetry) onRetry();
    const delay = Math.max(Number.isFinite(retryAfter) ? retryAfter : 0, [500, 1500, 3500][attempt]);
    if (Date.now() + delay >= deadline) {
      if (response) return response;
      throw failure || new Error("entry_recovery_pending");
    }
    await new Promise((resolve, reject) => {
      const abort = () => {
        clearTimeout(pause);
        init.signal?.removeEventListener("abort", abort);
        reject(init.signal?.reason || new Error("entry_cancelled"));
      };
      const pause = setTimeout(() => {
        init.signal?.removeEventListener("abort", abort);
        resolve();
      }, delay);
      init.signal?.addEventListener("abort", abort, { once: true });
      if (init.signal?.aborted) abort();
    });
  }
  throw new Error("entry_recovery_exhausted");
};
      function setTemplate7Error(message) {
        var error = document.querySelector("[data-template7-error]");
        if (!error) return;
        error.textContent = message || "";
        error.hidden = !message;
      }


function createGatewayEntryTransition(root) {
  if (!root) return null;
  var frame=null,origin="",wallet=false,timer=0,retryTimer=0,automaticRetries=0,previous=null,themeSnapshot=null,addedTheme=null,canvasSnapshot=null;
  function applyPalette(){if(themeSnapshot!==null)return;if(document.documentElement&&document.documentElement.style){canvasSnapshot=document.documentElement.style.getPropertyValue("--gateway-entry-canvas");document.documentElement.style.setProperty("--gateway-entry-canvas",root.dataset.palette)}themeSnapshot=Array.from(document.querySelectorAll('meta[name="theme-color"]')).map(function(meta){var previous=meta.getAttribute("content");meta.setAttribute("content",root.dataset.palette);return [meta,previous]});if(!themeSnapshot.length){addedTheme=document.createElement("meta");addedTheme.name="theme-color";addedTheme.content=root.dataset.palette;document.head.appendChild(addedTheme)}}
  function restorePalette(){if(themeSnapshot===null)return;if(canvasSnapshot!==null&&document.documentElement&&document.documentElement.style){if(canvasSnapshot)document.documentElement.style.setProperty("--gateway-entry-canvas",canvasSnapshot);else document.documentElement.style.removeProperty("--gateway-entry-canvas");canvasSnapshot=null}themeSnapshot.forEach(function(item){if(item[1]===null)item[0].removeAttribute("content");else item[0].setAttribute("content",item[1])});if(addedTheme)addedTheme.remove();themeSnapshot=null;addedTheme=null}
  var title=root.querySelector("[data-entry-title]"),description=root.querySelector("[data-entry-description]");
  var spinner=root.querySelector(".entry-spinner"),actions=root.querySelector(".entry-actions");
  function milestone(name,details){try{if(window.__gatewayEntryFunnel)window.__gatewayEntryFunnel.emit(name,details)}catch(e){}}
  function finish(){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(root.hidden)return;root.hidden=true;restorePalette();if(previous&&previous.isConnected)previous.focus({preventScroll:true})}
  function fail(message){if(root.hidden)return;clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;milestone("entry_error",{error_code:"chat_unavailable"});root.dataset.stage="error";title.textContent="No pudimos completar la conexi\xF3n";description.textContent=message;spinner.hidden=true;actions.hidden=false}
  function reconnect(message){if(root.hidden||retryTimer)return;if(!frame||automaticRetries>=1){fail(message);return}clearTimeout(timer);automaticRetries++;var currentFrame=frame,currentSource=frame.src;description.textContent="Estamos recuperando la conexi\xF3n con tu asesor.";retryTimer=setTimeout(function(){retryTimer=0;if(root.hidden||frame!==currentFrame||frame.src!==currentSource)return;start("connecting",true);frame.src=currentSource},750)}
  function start(stage,recovering){clearTimeout(timer);clearTimeout(retryTimer);retryTimer=0;if(!recovering)automaticRetries=0;previous=document.activeElement;root.dataset.stage=stage;root.hidden=false;applyPalette();spinner.hidden=false;actions.hidden=true;title.textContent=stage==="preparing"?"Preparando tu acceso":stage==="creating"?"Creando tu cuenta":"Conectando con tu asesor";description.textContent=stage==="connecting"?"Tu sesi\xF3n en la plataforma est\xE1 lista.":"Estamos preparando tu acceso.";root.querySelectorAll("[data-entry-source]").forEach(function(el){el.srcset=el.dataset.srcset});root.querySelectorAll("[data-entry-logo]").forEach(function(el){el.src=el.dataset.src});root.focus({preventScroll:true});if(stage==="connecting")timer=setTimeout(function(){reconnect("La conexi\xF3n est\xE1 tardando m\xE1s de lo esperado. Pod\xE9s reintentar sin crear otra cuenta.")},20000)}
  root.querySelector("[data-entry-retry]").addEventListener("click",function(){if(frame){start("connecting");frame.src=frame.src}else finish()});
  root.querySelector("[data-entry-continue]").addEventListener("click",function(){finish();if(frame)frame.focus()});
  root.addEventListener("keydown",function(event){if(event.key!=="Tab")return;var buttons=actions.hidden?[]:Array.from(actions.querySelectorAll("button"));if(!buttons.length){event.preventDefault();root.focus();return}if(event.shiftKey&&(document.activeElement===buttons[0]||document.activeElement===root)){event.preventDefault();buttons[buttons.length-1].focus()}else if(!event.shiftKey&&(document.activeElement===buttons[buttons.length-1]||document.activeElement===root)){event.preventDefault();buttons[0].focus()}});
  window.addEventListener("focusin",function(event){if(!root.hidden&&!root.contains(event.target))root.focus({preventScroll:true})});
  window.addEventListener("message",function(event){var data=event.data;if(!frame||event.source!==frame.contentWindow||event.origin!==origin||!data||data.source!=="atrio-widget"||data.type!=="atrio.widget.entry-ready")return;if(!wallet||(data.walletReady===true&&data.walletRequestCompleted===true)||data.walletAvailable===false){milestone("chat_ready");finish();return}if(data.walletRequestCompleted===true&&data.walletAvailable===true&&data.walletReady===false)reconnect("El chat est\xE1 disponible, pero no pudimos obtener los datos para cargar. Pod\xE9s reintentar o continuar al chat.")});
  return {start:start,finish:finish,fail:fail,bind:function(value,allowedOrigin,needsWallet){frame=value;origin=allowedOrigin;wallet=needsWallet;milestone("gateway_loaded")}};
}

      var template7Transition = createGatewayEntryTransition(document.getElementById("gateway-entry-transition"));
      var template7EntryGeneration = 0;
      function template7TransitionUrl(raw) {
        var url = template7CheckedHandoff(raw);
        if (url.pathname === "/start") {
          url.pathname = "/prepare";
          if(cfg.targetProvider==="multi_skin"&&["ganamos_plus","jugamos","casino_zeus","bet30","gana_en_casa","celu_apuestas","casino_zeta","oro_puro","fortu_bet","gran_poseidon","kona_bet","mega_faraon","camel_bet","rhino_play"].indexOf(cfg.skinCode)!==-1)url.searchParams.set("skin",cfg.skinCode);
        }
        return url.href;
      }
      function failTemplate7(button, attempt) {
        if (attempt !== undefined && attempt !== template7EntryGeneration) return;
        if (template7Transition) template7Transition.finish();
        if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "account_unavailable" });
        clickLocked = false;
        button.disabled = false;
        setButtonText(button, getRestButtonText(button));
        setTemplate7Error("Tu acceso sigue pendiente. Toc\xE1 el bot\xF3n para continuar con el mismo intento.");
      }

      function startTemplate7Gateway(name, phone, promoCode, atrioData, tracking, params) {
        if (atrioData && atrioData.preparationReady && atrioData.existingName && atrioData.promoCode) {
          name = atrioData.existingName; promoCode = atrioData.promoCode;
        }
        var advisorId = firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id]);
        var advisorSlug = firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug]);
        var atrioClientId = firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id]);
        if (!advisorId || !advisorSlug || !atrioClientId) return Promise.reject(new Error("advisor unavailable"));
        return fetchWithEntryRecovery("/api/template7/start", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: getOrCreateDeviceId(),
            landing_id: cfg.landingId,
            landing_slug: cfg.slug, card_index: cfg.cardIndex,
            entry_funnel: window.__entryFunnel ? window.__entryFunnel.context() : undefined,
            name: name,
            phone: phone || undefined,
            atrio_client_id: atrioClientId,
            advisor_id: advisorId,
            advisor_slug: advisorSlug,
            promo_code: promoCode,
            attribution: {
              utm_source: params.get("utm_source") || "",
              utm_medium: params.get("utm_medium") || "",
              landing: cfg.slug,
              landing_resolution: landingResolution || "",
              facebook: params.get("facebook") || "",
              portofolio: params.get("portofolio") || "",
              cp: params.get("cp") || "",
              campana: params.get("campana") || "",
              conjunto: params.get("conjunto") || "",
              anuncio: params.get("anuncio") || "",
              utm_campaign: params.get("utm_campaign") || "",
              utm_content: params.get("utm_content") || "",
              utm_term: params.get("utm_term") || "",
              card_index: String(cfg.cardIndex), target_provider: cfg.targetProvider,
              skin_code: cfg.targetProvider === "multi_skin" ? cfg.skinCode : "",
              fbp: tracking.fbp || "",
              fbc: tracking.fbc || ""
            }
          })
        }).then(function (response) {
          if (!response.ok) throw new Error("gateway unavailable");
          return response.json();
        }).then(function (data) {
          if (!data || typeof data.handoff_url !== "string" || !data.handoff_url) throw new Error("handoff unavailable");
          return template7TransitionUrl(data.handoff_url);
        });
      }

      function generatePromoCode(tag) {
        return String(tag || "LP") + "-" + Math.random().toString(16).slice(2, 14);
      }

      function buildMessage(promoCode) {
        var baseMessage = ("Hola! quiero mas informacion por favor! " + promoCode + "\\nMi nombre es:").trim();
        var extraText = String(cfg.whatsappPrefillText || "").trim();
        return extraText ? baseMessage + "\\n\\n" + extraText : baseMessage;
      }

      function isAtrioDestination() {
        return cfg.template === 7;
      }

      function buildAtrioRedirectUrl(promoCode, atrioData) {
        try {
          var raw = firstNonEmpty([
            atrioData && atrioData.atrioRedirectUrl,
            atrioData && atrioData.atrio_redirect_url,
            cfg.atrioRedirectUrl
          ]);
          if (!raw) return "";
          var url = new URL(raw, window.location.href);
          if (url.protocol !== "http:" && url.protocol !== "https:") return "";
          url.searchParams.set("promo_code", promoCode);
          var atrioId = firstNonEmpty([
            atrioData && atrioData.atrioId,
            atrioData && atrioData.atrio_id,
            cfg.atrioId
          ]);
          if (atrioId) url.searchParams.set("atrio_id", atrioId);
          return url.toString();
        } catch (e) {
          return "";
        }
      }

      function safeUUID() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
          return window.crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0;
          var v = c === "x" ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function storageKey(key) {
        return String(cfg.storageNamespace || ("landing-builder:no-pixel:" + cfg.slug)) + ":" + key;
      }

      function getLocalStorageValue(key) {
        try { return window.localStorage.getItem(storageKey(key)) || ""; }
        catch (e) { return ""; }
      }

      function setLocalStorageValue(key, value) {
        try { if (value) window.localStorage.setItem(storageKey(key), value); }
        catch (e) {}
      }

      function getOrCreateExternalId() {
        var existing = getLocalStorageValue("external_id");
        if (existing) return existing;
        var created = safeUUID();
        setLocalStorageValue("external_id", created);
        return created;
      }

      function firstNonEmpty(values) {
        for (var i = 0; i < values.length; i += 1) {
          var value = values[i];
          if (value == null) continue;
          var text = String(value).trim();
          if (text) return text;
        }
        return "";
      }

      function normalizeEmail(raw) {
        return String(raw || "").trim().toLowerCase();
      }

      function readMeta() {
        try { return window.__META || {}; }
        catch (e) { return {}; }
      }

      function resolveIdentity(params) {
        var meta = readMeta();
        function getParam(name) { return params.get(name) || ""; }

        var emailRaw = firstNonEmpty([
          getParam("email"),
          getParam("em"),
          getLocalStorageValue("em"),
          meta.userEmail || ""
        ]);
        var phoneRaw = firstNonEmpty([
          getParam("phone"),
          getParam("ph"),
          getLocalStorageValue("ph"),
          meta.userPhone || ""
        ]);
        var externalId = firstNonEmpty([
          meta.externalId || "",
          getLocalStorageValue("external_id")
        ]) || getOrCreateExternalId();
        var fn = firstNonEmpty([getParam("fn"), getLocalStorageValue("fn"), meta.userFn || ""]);
        var ln = firstNonEmpty([getParam("ln"), getLocalStorageValue("ln"), meta.userLn || ""]);
        var ct = firstNonEmpty([getParam("ct"), getLocalStorageValue("ct")]);
        var st = firstNonEmpty([getParam("st"), getLocalStorageValue("st")]);
        var zip = firstNonEmpty([getParam("zip"), getLocalStorageValue("zip")]);
        var country = firstNonEmpty([getParam("country"), getLocalStorageValue("country")]);

        setLocalStorageValue("external_id", externalId);
        if (emailRaw) setLocalStorageValue("em", normalizeEmail(emailRaw));
        if (phoneRaw) setLocalStorageValue("ph", normalizePhone(phoneRaw, cfg.phoneCountryCode));
        if (fn) setLocalStorageValue("fn", fn);
        if (ln) setLocalStorageValue("ln", ln);
        if (ct) setLocalStorageValue("ct", ct);
        if (st) setLocalStorageValue("st", st);
        if (zip) setLocalStorageValue("zip", zip);
        if (country) setLocalStorageValue("country", country);

        return {
          emailRaw: emailRaw,
          phoneRaw: phoneRaw,
          ct: ct,
          st: st,
          zip: zip,
          country: country,
          email: emailRaw ? normalizeEmail(emailRaw) : "",
          ph: phoneRaw ? normalizePhone(phoneRaw, cfg.phoneCountryCode) : "",
          fn: fn,
          ln: ln,
          externalId: externalId
        };
      }

      function applyLeadCaptureToIdentity(identity, capture) {
        if (!capture || typeof capture !== "object") return identity;
        var fields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
        var firstName = (cfg.template === 7 || fields.firstName) ? String(capture.firstName || "").trim() : "";
        var lastName = fields.lastName ? String(capture.lastName || "").trim() : "";
        var emailRaw = fields.email ? String(capture.email || "").trim() : "";
        var phoneRaw = (fields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
          ? String(capture.phone || "").trim()
          : "";
        var normalizedPhone = phoneRaw
          ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(phoneRaw) : normalizePhone(phoneRaw, cfg.phoneCountryCode))
          : "";

        return {
          emailRaw: emailRaw || identity.emailRaw,
          phoneRaw: normalizedPhone ? phoneRaw : identity.phoneRaw,
          ct: identity.ct,
          st: identity.st,
          zip: identity.zip,
          country: identity.country,
          email: emailRaw ? normalizeEmail(emailRaw) : identity.email,
          ph: normalizedPhone || identity.ph,
          fn: firstName || identity.fn,
          ln: lastName || identity.ln,
          externalId: identity.externalId
        };
      }

      function readInlineEmail() {
        if (!cfg.emailCapture || cfg.emailCapture.enabled !== true) return "";
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return "";
        var value = String(input.value || "").trim();
        var valid = value.length <= 254 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value);
        var error = document.querySelector("[data-inline-email-error]");
        if (error) error.textContent = value && !valid
          ? "Email inv\xE1lido. Pod\xE9s seguir a WhatsApp." : "";
        return valid ? value.toLowerCase() : "";
      }

      function initInlineEmail() {
        var input = document.querySelector("[data-inline-email-input]");
        if (!input) return;
        input.addEventListener("input", function () {
          var error = document.querySelector("[data-inline-email-error]");
          if (error) error.textContent = "";
        });
        input.addEventListener("blur", readInlineEmail);
      }

      function cookieValue(name) {
        try {
          var parts = document.cookie ? document.cookie.split("; ") : [];
          for (var i = 0; i < parts.length; i += 1) {
            var part = parts[i];
            var eq = part.indexOf("=");
            var key = eq >= 0 ? part.slice(0, eq) : part;
            if (key === name) return decodeURIComponent(eq >= 0 ? part.slice(eq + 1) : "");
          }
        } catch (e) {}
        return "";
      }

      function collectMetaTrackingParams(params) {
        var fbp = cookieValue("_fbp");
        var fbc = cookieValue("_fbc");
        var fbclid = params.get("fbclid") || "";
        if (!fbc && fbclid) {
          fbc = "fb.1." + Date.now() + "." + fbclid;
        }
        metaTracking = {
          fbp: fbp || "",
          fbc: fbc || "",
          clientIpAddress: metaTracking.clientIpAddress || "",
          clientIpIssuedAt: metaTracking.clientIpIssuedAt || null,
          clientIpProof: metaTracking.clientIpProof || ""
        };
        return metaTracking;
      }

      function safeEventSourceUrl() {
        try {
          return window.location.origin + window.location.pathname;
        } catch (e) {
          return "";
        }
      }

      function sanitizeSensitiveQueryParams() {
        try {
          var url = new URL(window.location.href);
          var sensitiveKeys = ["email", "em", "phone", "ph", "fn", "ln", "external_id", "eid", "ct", "st", "zip", "country"];
          var changed = false;
          sensitiveKeys.forEach(function (key) {
            if (url.searchParams.has(key)) {
              url.searchParams.delete(key);
              changed = true;
            }
          });
          if (changed) {
            window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
          }
        } catch (e) {}
      }

      function mergeMetaTracking(base, incoming) {
        var next = incoming && typeof incoming === "object" ? incoming : {};
        return {
          fbp: String(next.fbp || base.fbp || ""),
          fbc: String(next.fbc || base.fbc || ""),
          clientIpAddress: String(next.clientIpAddress || base.clientIpAddress || ""),
          clientIpIssuedAt: Number(next.clientIpIssuedAt || base.clientIpIssuedAt) || null,
          clientIpProof: String(next.clientIpProof || base.clientIpProof || "")
        };
      }

      function getOfficialMetaParamBuilder() {
        try {
          var sdk = window.clientParamBuilder;
          if (
            sdk &&
            typeof sdk.processAndCollectAllParams === "function" &&
            typeof sdk.getFbc === "function" &&
            typeof sdk.getFbp === "function"
          ) {
            return sdk;
          }
        } catch (e) {}
        return null;
      }

      function loadOfficialMetaParamBuilder() {
        var available = getOfficialMetaParamBuilder();
        if (available) return Promise.resolve(available);
        if (metaParamBuilderPromise) return metaParamBuilderPromise;

        var source = String(cfg.metaParamBuilderSrc || "").trim();
        if (!source) return Promise.resolve(null);

        metaParamBuilderPromise = new Promise(function (resolve) {
          var existing = document.querySelector("script[data-meta-param-builder='official']");
          var script = existing || document.createElement("script");
          var settled = false;

          function finish(value) {
            if (settled) return;
            settled = true;
            resolve(value || null);
          }

          script.addEventListener("load", function () {
            finish(getOfficialMetaParamBuilder());
          }, { once: true });
          script.addEventListener("error", function () {
            finish(null);
          }, { once: true });

          if (!existing) {
            script.src = source;
            script.async = true;
            script.setAttribute("data-meta-param-builder", "official");
            document.head.appendChild(script);
          }
        }).finally(function () {
          metaParamBuilderPromise = null;
        });

        return metaParamBuilderPromise;
      }

      function readOfficialMetaParam(sdk, methodName) {
        try {
          var method = sdk && sdk[methodName];
          return typeof method === "function" ? String(method.call(sdk) || "") : "";
        } catch (e) {
          return "";
        }
      }

      function collectOfficialMetaTracking() {
        var sdk = getOfficialMetaParamBuilder();
        if (!sdk) return Promise.resolve(null);

        var trustedIp =
          metaTracking.clientIpAddress && metaTracking.clientIpProof
            ? metaTracking.clientIpAddress
            : "";
        var processResult;

        try {
          processResult = trustedIp
            ? sdk.processAndCollectAllParams(window.location.href, function () {
                return Promise.resolve(trustedIp);
              })
            : sdk.processAndCollectAllParams(window.location.href);
        } catch (e) {
          return Promise.resolve(null);
        }

        return Promise.resolve(processResult)
          .then(function () {
            officialMetaTracking = {
              fbp: readOfficialMetaParam(sdk, "getFbp"),
              fbc: readOfficialMetaParam(sdk, "getFbc"),
              clientIpAddress: trustedIp,
              clientIpIssuedAt: trustedIp ? metaTracking.clientIpIssuedAt : null,
              clientIpProof: trustedIp ? metaTracking.clientIpProof : ""
            };
            metaTracking = mergeMetaTracking(metaTracking, officialMetaTracking);
            return officialMetaTracking;
          })
          .catch(function () {
            return null;
          });
      }

      function collectMetaClientIpProof() {
        var collectorUrl = String(cfg.metaIpCollectorUrl || "").trim();
        if (!collectorUrl) return Promise.resolve(null);
        if (metaTracking.clientIpAddress && metaTracking.clientIpProof) {
          return Promise.resolve(metaTracking);
        }
        if (metaIpCollectorPromise) return metaIpCollectorPromise;

        metaIpCollectorPromise = new Promise(function (resolve) {
          var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
          var timeoutId = window.setTimeout(function () {
            if (controller) controller.abort();
            resolve(null);
          }, 800);

          fetch(collectorUrl, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            cache: "no-store",
            signal: controller ? controller.signal : undefined
          })
            .then(function (response) {
              if (!response.ok) return null;
              return response.json();
            })
            .then(function (value) {
              if (!value || typeof value !== "object") return null;
              var ip = String(value.ip || "").trim().toLowerCase();
              var issuedAt = Number(value.issued_at);
              var proof = String(value.proof || "").trim();
              var nowSeconds = Math.floor(Date.now() / 1000);
              if (
                !ip ||
                !proof ||
                !Number.isInteger(issuedAt) ||
                issuedAt > nowSeconds + 30 ||
                nowSeconds - issuedAt > 600
              ) {
                return null;
              }
              metaTracking = mergeMetaTracking(metaTracking, {
                clientIpAddress: ip,
                clientIpIssuedAt: issuedAt,
                clientIpProof: proof
              });
              return metaTracking;
            })
            .then(resolve)
            .catch(function () { resolve(null); })
            .finally(function () {
              window.clearTimeout(timeoutId);
              metaIpCollectorPromise = null;
            });
        });

        return metaIpCollectorPromise;
      }

      function scheduleMetaClientIpCollection() {
        var run = function () { void collectMetaClientIpProof(); };
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 800 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      function scheduleOfficialMetaParamBuilder() {
        var run = function () {
          Promise.all([
            loadOfficialMetaParamBuilder(),
            collectMetaClientIpProof()
          ])
            .then(function (values) {
              if (!values[0]) return null;
              return collectOfficialMetaTracking();
            })
            .catch(function () {});
        };

        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(run, { timeout: 1200 });
        } else {
          window.setTimeout(run, 0);
        }
      }

      window.__PUBLIC_META_COLLECT_PARAMS = function () {
        return officialMetaTracking;
      };

      function refreshMetaTracking(params, fallback) {
        var base = mergeMetaTracking(collectMetaTrackingParams(params), fallback || {});
        var collector = window.__PUBLIC_META_COLLECT_PARAMS;
        if (typeof collector !== "function") return Promise.resolve(base);
        return waitWithTimeout(Promise.resolve(collector()), 450)
          .then(function (value) {
            metaTracking = mergeMetaTracking(base, value || {});
            return metaTracking;
          })
          .catch(function () {
            metaTracking = base;
            return base;
          });
      }

      function waitWithTimeout(promise, timeoutMs) {
        var timeoutId;
        var timeout = new Promise(function (resolve) {
          timeoutId = window.setTimeout(function () { resolve(null); }, timeoutMs);
        });
        return Promise.race([promise, timeout]).then(function (value) {
          if (timeoutId) window.clearTimeout(timeoutId);
          return value;
        }, function () {
          if (timeoutId) window.clearTimeout(timeoutId);
          return null;
        });
      }

      function ensurePhonePromise() {
        if (isAtrioDestination()) return Promise.resolve(null);
        window.__PUBLIC_LANDING_PHONE_PROMISES = window.__PUBLIC_LANDING_PHONE_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_PHONE_PROMISES[template8DestinationKey()];
        if (existing) return existing;
        var baseUrl = cfg.supabaseUrl;
        var anonKey = cfg.supabaseAnonKey;
        if (!baseUrl || !anonKey) return Promise.resolve(null);
        var endpoint = baseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-phone?name=" + encodeURIComponent(cfg.slug);
        var promise = fetch(endpoint, {
          headers: { apikey: anonKey, Authorization: "Bearer " + anonKey },
          cache: "no-store",
          keepalive: true
        }).then(function (response) {
          if (!response.ok) return null;
          return response.json();
        }).catch(function () {
          return null;
        });
        window.__PUBLIC_LANDING_PHONE_PROMISES[template8DestinationKey()] = promise;
        return promise;
      }

      function clearPrewarmedPhonePromise() {
        try {
          if (window.__PUBLIC_LANDING_PHONE_PROMISES) {
            delete window.__PUBLIC_LANDING_PHONE_PROMISES[template8DestinationKey()];
          }
        } catch (e) {}
      }


      function ensureAtrioPromise() {
        if (!cfg.cardIndex) return Promise.resolve(null);
        window.__PUBLIC_LANDING_ATRIO_PROMISES = window.__PUBLIC_LANDING_ATRIO_PROMISES || {};
        var existing = window.__PUBLIC_LANDING_ATRIO_PROMISES[template8DestinationKey()];
        if (existing) return observeTemplate7Destination(existing);
        var promise = Promise.resolve(window.__LB_IDENTITY_READY__ || true).then(function (ready) {
          if (ready !== true) return null;
          return fetch("/api/template7/destination", {
            method: "POST", credentials: "same-origin", cache: "no-store", keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ landing_id: cfg.landingId, landing_slug: cfg.slug, card_index: cfg.cardIndex, device_id: getOrCreateDeviceId() })
          }).then(function (response) { return response.ok ? response.json() : null; });
        }).catch(function () { return null; });
        window.__PUBLIC_LANDING_ATRIO_PROMISES[template8DestinationKey()] = promise;
        return observeTemplate7Destination(promise);
      }

      function observeTemplate7Destination(promise) {
        window.__T7_DESTINATION_STATES__ = window.__T7_DESTINATION_STATES__ || {};
        var states = window.__T7_DESTINATION_STATES__;
        if (!states[template8DestinationKey()] || states[template8DestinationKey()].promise !== promise) {
          var state = { promise: promise, settled: false, value: null };
          states[template8DestinationKey()] = state;
          promise.then(function(value) { state.settled = true; state.value = value; }, function() { state.settled = true; });
        }
        return promise;
      }

      function clearPrewarmedAtrioPromise() {
        var state = window.__T7_DESTINATION_STATES__ && window.__T7_DESTINATION_STATES__[template8DestinationKey()];
        if (state && (!state.settled || (state.value && (state.value.atrioClientId || state.value.atrio_client_id) &&
            (state.value.atrioId || state.value.atrio_id) && (state.value.atrioSlug || state.value.atrio_slug)))) return;
        try {
          if (window.__PUBLIC_LANDING_ATRIO_PROMISES) {
            delete window.__PUBLIC_LANDING_ATRIO_PROMISES[template8DestinationKey()];
          }
        } catch (e) {}
      }

      function sendTrackBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/track", blob)) return Promise.resolve();
          } catch (e) {}
        }
        return fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).catch(function () {});
      }

      function sendJourneyStartBestEffort(body) {
        if (navigator && "sendBeacon" in navigator) {
          try {
            var blob = new Blob([body], { type: "application/json" });
            if (navigator.sendBeacon("/api/journey-start", blob)) return Promise.resolve(true);
          } catch (e) {}
        }
        return fetch("/api/journey-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true
        }).then(function (response) {
          return !!(response && response.ok);
        }).catch(function () {
          return false;
        });
      }

      function contactDedupKey(slug, externalId) {
        return "contact_sent:" + slug + ":" + externalId;
      }

      function wasContactRecentlySent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = contactDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < CONTACT_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markContactSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(contactDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function journeyStartDedupKey(slug, externalId) {
        return "journey_start_sent:" + slug + ":" + externalId;
      }

      function wasJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return false;
        try {
          var key = journeyStartDedupKey(slug, externalId);
          var raw = window.localStorage.getItem(key);
          if (!raw) return false;
          var sentAt = Number(raw);
          if (!isFinite(sentAt)) {
            window.localStorage.removeItem(key);
            return false;
          }
          var isFresh = Date.now() - sentAt < JOURNEY_START_DEDUP_TTL_MS;
          if (!isFresh) window.localStorage.removeItem(key);
          return isFresh;
        } catch (e) {
          return false;
        }
      }

      function markJourneyStartSent(slug, externalId) {
        if (!slug || !externalId) return;
        try {
          window.localStorage.setItem(journeyStartDedupKey(slug, externalId), String(Date.now()));
        } catch (e) {}
      }

      function extractPhoneId(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return null;
        var direct = phoneData.phoneId != null ? phoneData.phoneId : phoneData.phone_id;
        if (direct != null && direct !== "") {
          var asNumber = Number(direct);
          return isFinite(asNumber) ? asNumber : direct;
        }
        return null;
      }

      function extractAssignedGerenciaSnapshot(phoneData) {
        if (!phoneData || typeof phoneData !== "object") return {};
        var gerencia = phoneData.gerencia && typeof phoneData.gerencia === "object"
          ? phoneData.gerencia
          : {};
        var internalId = gerencia.id != null ? Number(gerencia.id) : null;
        var externalId = firstNonEmpty([
          gerencia.externalId,
          gerencia.external_id,
          gerencia.gerencia_id,
          internalId
        ]);
        var name = firstNonEmpty([gerencia.name, gerencia.nombre]);
        var label = name && externalId ? name + " (ID " + externalId + ")" : (name || (externalId ? "Gerencia " + externalId : ""));
        return {
          assigned_gerencia_id: isFinite(internalId) && internalId > 0 ? internalId : undefined,
          assigned_gerencia_external_id: externalId || undefined,
          assigned_gerencia_name: name || undefined,
          assigned_gerencia_label: label || undefined
        };
      }

      function buildLandingJourneyStartPayload(params, identity, tracking, targetData) {
        var atrioMode = isAtrioDestination();
        var phoneData = atrioMode ? null : targetData;
        var assignedPhone = atrioMode ? "" : normalizePhone(
          (phoneData && phoneData.phone) || "",
          cfg.phoneCountryCode
        );
        var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
        return {
          event_name: "LandingPageView",
          slug: cfg.slug,
          landing_id: cfg.landingId,
          landing_name: cfg.landingName,
          target_provider: cfg.template === 7 ? cfg.targetProvider : undefined,
          skin_code: cfg.template === 7 && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
          workspace_currency: cfg.workspaceCurrency || undefined,
          external_id: identity.externalId,
          event_source_url: safeEventSourceUrl(),
          landing: cfg.slug,
              landing_resolution: landingResolution || "",
          facebook: params.get("facebook") || "",
          portofolio: params.get("portofolio") || "",
          cp: params.get("cp") || "",
          campana: params.get("campana") || "",
          conjunto: params.get("conjunto") || "",
          anuncio: params.get("anuncio") || "",
          utm_campaign: params.get("utm_campaign") || "",
          fbp: tracking.fbp,
          fbc: tracking.fbc,
          from_meta_ads: !!tracking.fbc,
          meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
          telefono_asignado: assignedPhone || undefined,
          assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
          assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
          assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
          assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
          device_type: deviceType(),
          client_ip_address: tracking.clientIpAddress || undefined,
          client_user_agent: navigator.userAgent || undefined
        };
      }

      function recordLandingJourneyStart() {
        if (journeyStartInFlight || !cfg.landingId) return;
        var params = queryParams();
        var identity = resolveIdentity(params);
        if (wasJourneyStartSent(cfg.slug, identity.externalId)) return;
        journeyStartInFlight = true;
        var tracking = collectMetaTrackingParams(params);
        var immediateBody = JSON.stringify(
          buildLandingJourneyStartPayload(params, identity, tracking, null)
        );
        sendJourneyStartBestEffort(immediateBody).then(function (sent) {
          if (sent) markJourneyStartSent(cfg.slug, identity.externalId);
          if (isAtrioDestination()) return sent;
          return ensurePhonePromise().then(function (phoneData) {
            if (!phoneData || !phoneData.phone) return sent;
            return sendJourneyStartBestEffort(JSON.stringify(
              buildLandingJourneyStartPayload(params, identity, tracking, phoneData)
            )).then(function (enrichedSent) {
              if (enrichedSent) markJourneyStartSent(cfg.slug, identity.externalId);
              return sent || enrichedSent;
            });
          });
        }).catch(function () {}).then(function () {
          journeyStartInFlight = false;
        });
      }

      function setButtonText(button, text) {
        var label = button.querySelector("[data-public-landing-cta-label]");
        if (label) label.textContent = text;
      }

      function getButtonLabel(button, attrName, fallback) {
        return button.getAttribute(attrName) || fallback;
      }

      function getRestButtonText(button) {
        return getButtonLabel(button, "data-public-landing-rest-label", cfg.ctaText);
      }

      function getLoadingButtonText(button) {
        return getButtonLabel(button, "data-public-landing-loading-label", "Abriendo...");
      }

      function getDisabledButtonText(button) {
        return getButtonLabel(button, "data-public-landing-disabled-label", "Sin numero disponible");
      }

      function setNoPhoneState(button) {
        button.disabled = true;
        setButtonText(button, getDisabledButtonText(button));
        if (noPhoneTimer) window.clearTimeout(noPhoneTimer);
        noPhoneTimer = window.setTimeout(function () {
          button.disabled = false;
          setButtonText(button, getRestButtonText(button));
          clickLocked = false;
          noPhoneTimer = null;
        }, 2000);
      }

      function notifyPhoneClick(phoneData, phone) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var effectivePhoneMode = phoneData && (phoneData.phoneMode || (phoneData.phoneSelection && phoneData.phoneSelection.mode) || "");
          var phoneId = extractPhoneId(phoneData);
          if ((effectivePhoneMode === "fair" || effectivePhoneMode === "random") && baseUrl && anonKey && phoneId != null) {
            var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/phone-click";
            fetch(notifyUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: anonKey,
                Authorization: "Bearer " + anonKey
              },
              body: JSON.stringify({
                landingName: (phoneData && phoneData.landingName) || cfg.landingName,
                phoneId: phoneId,
                phone: phone,
                reservationId: (phoneData && phoneData.assignmentReservationId) || undefined
              }),
              keepalive: true
            }).catch(function () {});
          }
        } catch (e) {}
      }

      function notifyTemplate6CardClick(button) {
        try {
          if ((cfg.template !== 6 && !cfg.template8) || !cfg.landingId || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
          var cardIndex = Number(button.getAttribute("data-template6-card-index"));
          if (!Number.isInteger(cardIndex) || cardIndex < 1 || cardIndex > 6) return;
          fetch(cfg.supabaseUrl.replace(/\\/+$/, "") + "/functions/v1/landing-card-click", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: cfg.supabaseAnonKey,
              Authorization: "Bearer " + cfg.supabaseAnonKey
            },
            body: JSON.stringify({ landingId: cfg.landingId, cardIndex: cardIndex, eventId: safeUUID() }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function notifyAtrioClick(atrioData) {
        try {
          var baseUrl = cfg.supabaseUrl;
          var anonKey = cfg.supabaseAnonKey;
          var atrioClientId = firstNonEmpty([
            atrioData && atrioData.atrioClientId,
            atrioData && atrioData.atrio_client_id,
            cfg.atrioClientId
          ]);
          if (!baseUrl || !anonKey || !atrioClientId) return;
          var notifyUrl = baseUrl.replace(/\\/+$/, "") + "/functions/v1/atrio-click";
          fetch(notifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: anonKey,
              Authorization: "Bearer " + anonKey
            },
            body: JSON.stringify({
              landingName: cfg.landingName || cfg.slug,
              atrioClientId: atrioClientId
            }),
            keepalive: true
          }).catch(function () {});
        } catch (e) {}
      }

      function firePixelContact(eventId) {
        try {
          if (!cfg.sendContactPixel || !window.fbq) return;
          window.fbq("track", "Contact", { source: "main_button" }, { eventID: eventId });
        } catch (e) {}
      }

      function createContactPrearm() {
        var params = queryParams();
        var promoCode = generatePromoCode(cfg.landingTag || "LP");
        var identity = resolveIdentity(params);
        var tracking = collectMetaTrackingParams(params);
        var testEventCode = params.get("test_event_code") || "";
        sanitizeSensitiveQueryParams();

        return {
          params: params,
          promoCode: promoCode,
          message: buildMessage(promoCode),
          eventId: safeUUID(),
          identity: identity,
          tracking: tracking,
          testEventCode: testEventCode,
          shouldSkipContact: testEventCode ? false : wasContactRecentlySent(cfg.slug, identity.externalId),
          createdAt: Date.now()
        };
      }

      function prearmContactContext() {
        try {
          prearmedContact = createContactPrearm();
        } catch (e) {
          prearmedContact = null;
        }
      }

      function consumeContactContext() {
        if (cfg.template === 7 && template7AttemptContext) return template7AttemptContext;
        var context = prearmedContact || createContactPrearm();
        prearmedContact = null;
        window.setTimeout(prearmContactContext, 0);
        if (cfg.template === 7) template7AttemptContext = context;
        return context;
      }

      function hasLeadCaptureFields() {
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        return leadCapture.enabled === true &&
          (fields.firstName === true || fields.lastName === true || fields.phone === true || fields.email === true);
      }

      function shouldShowLeadCapture(button) {
        if (cfg.template === 7) return false;
        if (!hasLeadCaptureFields()) return false;
        return button.getAttribute("data-public-landing-auto-start") !== "true";
      }

      function closeLeadCaptureModal() {
        if (!leadCaptureModal) return;
        leadCaptureModal.hidden = true;
        document.body.classList.remove("public-lead-capture-open");
        pendingLeadCaptureButton = null;
      }

      function continueAfterLeadCapture(capture) {
        var button = pendingLeadCaptureButton;
        closeLeadCaptureModal();
        if (button) processCtaClick(button, capture || null);
      }

      function createLeadCaptureInput(name, label, type, autocomplete) {
        var wrapper = document.createElement("label");
        wrapper.className = "public-lead-capture__field";
        var input = document.createElement("input");
        input.type = type;
        input.name = name;
        input.autocomplete = autocomplete;
        input.setAttribute("aria-label", label);
        input.placeholder = label;
        input.className = "public-lead-capture__input";
        wrapper.appendChild(input);
        return wrapper;
      }

      function initLeadCaptureModal() {
        if (!hasLeadCaptureFields() || leadCaptureModal) return;
        var leadCapture = cfg.leadCapture || {};
        var fields = leadCapture.fields || {};
        var overlay = document.createElement("div");
        overlay.className = "public-lead-capture";
        overlay.hidden = true;
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "public-lead-capture-title");

        var card = document.createElement("form");
        card.className = "public-lead-capture__card";
        card.noValidate = true;

        var close = document.createElement("button");
        close.type = "button";
        close.className = "public-lead-capture__close";
        close.setAttribute("aria-label", "Omitir formulario e ir a WhatsApp");
        close.textContent = "\xD7";

        var title = document.createElement("h2");
        title.id = "public-lead-capture-title";
        title.textContent = String(leadCapture.title || "Desbloque\xE1 atenci\xF3n personalizada");

        var description = document.createElement("p");
        description.className = "public-lead-capture__description";
        description.textContent = String(leadCapture.description || "");

        var grid = document.createElement("div");
        grid.className = "public-lead-capture__grid";
        if (fields.firstName === true) grid.appendChild(createLeadCaptureInput("firstName", "Nombre", "text", "given-name"));
        if (fields.lastName === true) grid.appendChild(createLeadCaptureInput("lastName", "Apellido", "text", "family-name"));
        if (fields.phone === true) grid.appendChild(createLeadCaptureInput("phone", "Tel\xE9fono", "tel", "tel"));
        if (fields.email === true) grid.appendChild(createLeadCaptureInput("email", "Email", "email", "email"));

        var actions = document.createElement("div");
        actions.className = "public-lead-capture__actions";
        var skip = document.createElement("button");
        skip.type = "button";
        skip.className = "public-lead-capture__skip";
        skip.textContent = "OMITIR E IR A WHATSAPP";
        var submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "public-lead-capture__submit";
        submit.textContent = "CONTINUAR A WHATSAPP \u2192";
        actions.appendChild(skip);
        actions.appendChild(submit);

        card.appendChild(close);
        card.appendChild(title);
        if (description.textContent) card.appendChild(description);
        card.appendChild(grid);
        card.appendChild(actions);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        leadCaptureModal = overlay;

        function readCaptureValues() {
          var data = {};
          Array.prototype.slice.call(card.querySelectorAll("input[name]")).forEach(function (input) {
            data[input.name] = String(input.value || "").trim();
          });
          return data;
        }

        card.addEventListener("submit", function (event) {
          event.preventDefault();
          continueAfterLeadCapture(readCaptureValues());
        });
        skip.addEventListener("click", function () { continueAfterLeadCapture(null); });
        close.addEventListener("click", function () { continueAfterLeadCapture(null); });
        overlay.addEventListener("click", function (event) {
          if (event.target === overlay) continueAfterLeadCapture(null);
        });
        document.addEventListener("keydown", function (event) {
          if (!leadCaptureModal || leadCaptureModal.hidden) return;
          if (event.key === "Escape") continueAfterLeadCapture(null);
        });
      }

      function openLeadCaptureModal(button) {
        initLeadCaptureModal();
        if (!leadCaptureModal) {
          processCtaClick(button, null);
          return;
        }
        pendingLeadCaptureButton = button;
        var inlineEmail = readInlineEmail();
        var modalEmail = leadCaptureModal.querySelector('input[name="email"]');
        if (modalEmail && cfg.emailCapture && cfg.emailCapture.enabled === true) modalEmail.value = inlineEmail;
        leadCaptureModal.hidden = false;
        document.body.classList.add("public-lead-capture-open");
        window.setTimeout(function () {
          var first = leadCaptureModal.querySelector("input, button");
          if (first && typeof first.focus === "function") first.focus();
        }, 0);
      }

      function handleCtaClick(button) {
        if (clickLocked || button.disabled) return;
        var entryName = document.querySelector("[data-template7-name]");
        if (!entryName || !String(entryName.value || "").trim()) return;
        template7EntryGeneration++;
        window.__T7_ENTRY_STARTED__ = true;
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7) {
          var nameInput = document.querySelector("[data-template7-name]");
          var whatsappInput = document.querySelector("[data-template7-whatsapp]");
          var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
          var firstName = nameInput ? String(nameInput.value || "").trim() : "";
          if (!firstName) {
            if (nameInput) nameInput.focus();
            button.disabled = true;
            return;
          }
          var rawWhatsapp = whatsappInput ? String(whatsappInput.value || "").trim() : "";
          var normalizedWhatsapp = rawWhatsapp ? normalizeArgentinaWhatsapp(rawWhatsapp) : "";
          if (whatsappWarning) {
            whatsappWarning.textContent = rawWhatsapp && !normalizedWhatsapp
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          }
          processCtaClick(button, { firstName: firstName, phone: normalizedWhatsapp });
          return;
        }
        if (shouldShowLeadCapture(button)) {
          openLeadCaptureModal(button);
          return;
        }
        processCtaClick(button, null);
      }

      function processCtaClick(button, leadCaptureValues) {
        var entryAttempt = template7EntryGeneration;
        if (clickLocked || button.disabled) return;
        if (cfg.template === 7 && !String(leadCaptureValues && leadCaptureValues.firstName || "").trim()) return;
        if (cfg.template === 7 && window.__entryFunnel) {
          if (!window.__T7_EARLY_CTA_RECORDED__) window.__entryFunnel.emit("cta_clicked");
          window.__T7_EARLY_CTA_RECORDED__ = false;
        }
        if (cfg.template === 7) { setTemplate7Error(""); if (template7Transition) template7Transition.start("creating"); }
        clickLocked = true;
        button.disabled = true;
        if (cfg.template !== 7) setButtonText(button, getLoadingButtonText(button));
        notifyTemplate6CardClick(button);
        var tapStartedAt = Date.now();

        window.requestAnimationFrame(function () {
          if (entryAttempt !== template7EntryGeneration) return;
          var context = consumeContactContext();
          var params = context.params;
          var promoCode = context.promoCode;
          var message = context.message;
          var eventId = context.eventId;
          var inlineEmail = readInlineEmail();
          var safeCapture = leadCaptureValues;
          if (safeCapture && cfg.emailCapture && cfg.emailCapture.enabled === true) {
            var typedEmail = String(safeCapture.email || "").trim();
            safeCapture = Object.assign({}, safeCapture, {
              email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(typedEmail) ? typedEmail : ""
            });
          }
          var baseIdentity = inlineEmail
            ? Object.assign({}, context.identity, { emailRaw: inlineEmail, email: normalizeEmail(inlineEmail) })
            : context.identity;
          var identity = applyLeadCaptureToIdentity(baseIdentity, safeCapture);
          var captureFields = (cfg.leadCapture && cfg.leadCapture.fields) || {};
          var hasLeadCaptureForm = !!leadCaptureValues;
          var formFn = hasLeadCaptureForm && (cfg.template === 7 || captureFields.firstName)
            ? String(leadCaptureValues.firstName || "").trim()
            : "";
          var formLn = hasLeadCaptureForm && captureFields.lastName
            ? String(leadCaptureValues.lastName || "").trim()
            : "";
          var formEmail = hasLeadCaptureForm && captureFields.email
            ? normalizeEmail(safeCapture.email || "")
            : "";
          var formPhoneRaw = hasLeadCaptureForm && (captureFields.phone || (cfg.template === 7 && cfg.template7Whatsapp))
            ? String(leadCaptureValues.phone || "").trim()
            : "";
          var formPhone = formPhoneRaw
            ? (cfg.template === 7 ? normalizeArgentinaWhatsapp(formPhoneRaw) : normalizePhone(formPhoneRaw, cfg.phoneCountryCode))
            : "";
          var tracking = context.tracking;
          var testEventCode = context.testEventCode;
          var shouldSkipContact = context.shouldSkipContact || (cfg.template === 7 && template7ContactSent);

          Promise.all([
            refreshMetaTracking(params, tracking),
            isAtrioDestination()
              ? waitWithTimeout(ensureAtrioPromise(), 1500)
              : waitWithTimeout(ensurePhonePromise(), 1500)
          ])
            .then(function (resolved) {
              tracking = resolved[0];
              return resolved[1];
            })
            .then(function (targetData) {
              if (isAtrioDestination()) {
                if (targetData && (cfg.template === 7
                  ? firstNonEmpty([targetData.atrioClientId, targetData.atrio_client_id]) && firstNonEmpty([targetData.atrioId, targetData.atrio_id]) && firstNonEmpty([targetData.atrioSlug, targetData.atrio_slug])
                  : (targetData.atrioRedirectUrl || targetData.atrio_redirect_url))) return targetData;
                clearPrewarmedAtrioPromise();
                return waitWithTimeout(ensureAtrioPromise(), 2500);
              }
              if (targetData && targetData.phone) return targetData;
              clearPrewarmedPhonePromise();
              return waitWithTimeout(ensurePhonePromise(), 2500);
            })
            .then(function (targetData) {
              if (entryAttempt !== template7EntryGeneration) return;
              var atrioMode = isAtrioDestination();
              var gatewayMode = cfg.template === 7;
              var atrioData = atrioMode ? (targetData || {}) : null;
              var phoneData = atrioMode ? null : targetData;
              var phone = atrioMode ? "" : normalizePhone(
                (phoneData && phoneData.phone) || "",
                cfg.phoneCountryCode
              );
              var redirectUrl = gatewayMode ? "" : atrioMode
                ? buildAtrioRedirectUrl(promoCode, atrioData)
                : "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
              if (gatewayMode && (!firstNonEmpty([atrioData.atrioClientId, atrioData.atrio_client_id]) || !firstNonEmpty([atrioData.atrioId, atrioData.atrio_id]) || !firstNonEmpty([atrioData.atrioSlug, atrioData.atrio_slug]))) {
                if (window.__entryFunnel) window.__entryFunnel.emit("entry_error", { error_code: "destination_unavailable" });
                failTemplate7(button);
                return;
              }
              if (gatewayMode && window.__entryFunnel) window.__entryFunnel.emit("destination_ready");
              if ((!atrioMode && !phone) || (atrioMode && !gatewayMode && !redirectUrl)) {
                setNoPhoneState(button);
                return;
              }

              if (!shouldSkipContact) {
                firePixelContact(eventId);
              }

              if (!atrioMode) {
                notifyPhoneClick(phoneData, phone);
              } else {
                notifyAtrioClick(atrioData);
              }

              var assignedGerenciaSnapshot = atrioMode ? {} : extractAssignedGerenciaSnapshot(phoneData);
              var payload = {
                event_name: "Contact",
                card_index: cfg.cardIndex, target_provider: gatewayMode ? cfg.targetProvider : undefined,
                skin_code: gatewayMode && cfg.targetProvider === "multi_skin" ? cfg.skinCode : undefined,
                meta_pixel_id: String(cfg.pixelId || "").trim() || undefined,
                sendContactPixel: cfg.sendContactPixel,
                event_id: eventId,
                external_id: identity.externalId,
                event_source_url: safeEventSourceUrl(),
                email: identity.emailRaw,
                phone: identity.ph || identity.phoneRaw,
                phone_country_code: cfg.phoneCountryCode || undefined,
                currency: cfg.workspaceCurrency || undefined,
                workspace_currency: cfg.workspaceCurrency || undefined,
                lead_capture_form: hasLeadCaptureForm || undefined,
                form_fn: formFn || undefined,
                form_ln: formLn || undefined,
                form_email: formEmail || undefined,
                form_phone: formPhone || undefined,
                fn: identity.fn || undefined,
                ln: identity.ln || undefined,
                ct: identity.ct || undefined,
                st: identity.st || undefined,
                zip: identity.zip || undefined,
                country: identity.country || undefined,
                landing: cfg.slug,
              landing_resolution: landingResolution || "",
                facebook: params.get("facebook") || "",
                portofolio: params.get("portofolio") || "",
                cp: params.get("cp") || "",
                campana: params.get("campana") || "",
                conjunto: params.get("conjunto") || "",
                anuncio: params.get("anuncio") || "",
                utm_campaign: params.get("utm_campaign") || "",
                test_event_code: testEventCode || undefined,
                fbp: tracking.fbp,
                fbc: tracking.fbc,
                client_ip_address: tracking.clientIpAddress || undefined,
                client_ip_issued_at: tracking.clientIpIssuedAt || undefined,
                client_ip_proof: tracking.clientIpProof || undefined,
                client_user_agent: navigator.userAgent || undefined,
                telefono_asignado: atrioMode ? "" : phone,
                assigned_gerencia_id: assignedGerenciaSnapshot.assigned_gerencia_id,
                assigned_gerencia_external_id: assignedGerenciaSnapshot.assigned_gerencia_external_id,
                assigned_gerencia_name: assignedGerenciaSnapshot.assigned_gerencia_name,
                assigned_gerencia_label: assignedGerenciaSnapshot.assigned_gerencia_label,
                promo_code: promoCode,
                source: "main_button",
                source_platform: "landing",
                cta_destination: atrioMode ? "atrio" : "whatsapp",
                redirect_channel: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "rey_de_ases_gateway"
                  : atrioMode ? "atrio" : "whatsapp",
                gateway_app_id: gatewayMode
                  ? cfg.targetProvider === "multi_skin"
                    ? "multi_skin_gateway"
                    : cfg.targetProvider === "ases_del_norte"
                      ? "ases_del_norte_gateway"
                      : cfg.targetProvider === "ganamos_net"
                        ? "ganamos_net_gateway"
                      : "reydeases_gateway"
                  : undefined,
                atrio_redirect_url: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioRedirectUrl, atrioData && atrioData.atrio_redirect_url, cfg.atrioRedirectUrl]) : undefined,
                atrio_client_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioClientId, atrioData && atrioData.atrio_client_id, cfg.atrioClientId]) : undefined,
                atrio_id: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioId, atrioData && atrioData.atrio_id, cfg.atrioId]) : undefined,
                atrio_slug: atrioMode ? firstNonEmpty([atrioData && atrioData.atrioSlug, atrioData && atrioData.atrio_slug, cfg.atrioSlug]) : undefined,
                brand: cfg.landingName,
                landing_id: cfg.landingId,
                landing_name: cfg.landingName,
                device_type: deviceType(),
                cta_tap_to_redirect_ms: Date.now() - tapStartedAt,
                mode: cfg.backgroundMode,
                api_meta: null
              };

              try {
                if (!shouldSkipContact) {
                  sendTrackBestEffort(JSON.stringify({
                    postUrl: cfg.postUrl,
                    payload: payload
                  }));
                }
              } catch (e) {}

              if (!shouldSkipContact) markContactSent(cfg.slug, identity.externalId);
              if (gatewayMode && !shouldSkipContact) template7ContactSent = true;

              if (gatewayMode) {
                startTemplate7Gateway(formFn, formPhone, promoCode, atrioData, tracking, params)
                  .then(function (handoffUrl) { if (entryAttempt === template7EntryGeneration) navigateTemplate7Handoff(handoffUrl); })
                  .catch(function () { failTemplate7(button, entryAttempt); });
              } else {
                window.setTimeout(function () {
                  window.location.assign(redirectUrl);
                }, 180);
              }
            })
            .catch(function () {
              if (cfg.template === 7) failTemplate7(button, entryAttempt);
              else {
                clickLocked = false;
                button.disabled = false;
                setButtonText(button, getRestButtonText(button));
              }
            });
        });
      }

      function initCtas() {
        var ctas = Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-cta]"));
        ctas.forEach(function (button) {
          window.addEventListener("click", function (event) {
            if (event.target && event.target.nodeType && button.contains(event.target)) handleCtaClick(button);
          }, true);
        });

        // Al volver de WhatsApp con la pagina restaurada desde bfcache, un CTA nuevo
        // necesita una asignacion nueva; la deduplicacion de Contact sigue en storage.
        window.addEventListener("pageshow", function (event) {
          if (!event.persisted || cfg.template !== 6) return;
          clickLocked = false;
          ctas.forEach(function (button) {
            button.disabled = false;
            setButtonText(button, getRestButtonText(button));
          });
          clearPrewarmedPhonePromise();
          if (!isAtrioDestination()) ensurePhonePromise();
          prearmContactContext();
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-trigger]")).forEach(function (trigger) {
          trigger.addEventListener("click", function () {
            var firstCta = document.querySelector("[data-public-landing-cta]");
            if (firstCta) firstCta.click();
          });
        });

        var autoCta = document.querySelector("[data-public-landing-cta][data-public-landing-auto-start='true']");
        if (autoCta) {
          window.setTimeout(function () { autoCta.click(); }, 40);
        }
      }

      function initTemplate7Name() {
        if (cfg.template !== 7) return;
        var input = document.querySelector("[data-template7-name]");
        var whatsappInput = document.querySelector("[data-template7-whatsapp]");
        var whatsappWarning = document.querySelector("[data-template7-phone-warning]");
        var button = document.querySelector(".template7__cta[data-public-landing-cta]");
        var form = document.querySelector("[data-template7-form]");
        if (!input || !button || !form) return;
        function sync() {
          if (clickLocked) return;
          button.disabled = !String(input.value || "").trim();
        }
        input.addEventListener("input", sync);
        if (whatsappInput && whatsappWarning) {
          whatsappInput.addEventListener("input", function () {
            if (!String(whatsappInput.value || "").trim() || normalizeArgentinaWhatsapp(whatsappInput.value)) {
              whatsappWarning.textContent = "";
              whatsappWarning.hidden = true;
            }
          });
          whatsappInput.addEventListener("blur", function () {
            var raw = String(whatsappInput.value || "").trim();
            whatsappWarning.textContent = raw && !normalizeArgentinaWhatsapp(raw)
              ? "No parece un WhatsApp argentino v\xE1lido. Continuaremos sin guardarlo."
              : "";
            whatsappWarning.hidden = !whatsappWarning.textContent;
          });
        }
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          sync();
          if (!button.disabled) button.click();
          else input.focus();
        });
        window.addEventListener("pageshow", sync);
        sync();
      }

      function initPrivacyDialog() {
        var dialog = document.querySelector("[data-public-privacy-dialog]");
        var openButton = document.querySelector("[data-public-privacy-open]");
        if (!dialog || !openButton) return;

        function openDialog() {
          if (typeof dialog.showModal === "function") dialog.showModal();
          else dialog.setAttribute("open", "");
        }

        function closeDialog() {
          if (typeof dialog.close === "function") dialog.close();
          else dialog.removeAttribute("open");
        }

        openButton.addEventListener("click", openDialog);
        Array.prototype.slice.call(dialog.querySelectorAll("[data-public-privacy-close]")).forEach(function (button) {
          button.addEventListener("click", closeDialog);
        });
        dialog.addEventListener("click", function (event) {
          if (event.target === dialog) closeDialog();
        });
      }

      function parseImages(value) {
        try {
          var parsed = JSON.parse(value || "[]");
          return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } catch (e) {
          return [];
        }
      }

      function initialRotatingIndex(images, rotateEveryHours) {
        if (images.length <= 1) return 0;
        var everyMs = Math.max(1, Number(rotateEveryHours) || 24) * 60 * 60 * 1000;
        return Math.floor(Date.now() / everyMs) % images.length;
      }

      function initRotatingBackgrounds() {
        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-background]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.style.backgroundImage = "url(" + images[index] + ")";
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.style.backgroundImage = "url(" + images[index] + ")";
          }, everyMs);
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-public-landing-rotating-image]")).forEach(function (node) {
          var images = parseImages(node.getAttribute("data-public-landing-images"));
          if (!images.length) return;
          var hours = node.getAttribute("data-public-landing-rotate-hours") || "24";
          var index = initialRotatingIndex(images, hours);
          node.setAttribute("src", images[index]);
          if (images.length <= 1) return;
          var everyMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
          window.setInterval(function () {
            index = (index + 1) % images.length;
            node.setAttribute("src", images[index]);
          }, everyMs);
        });
      }

      function renderSocialProof(section, index) {
        var items = cfg.socialProofItems || [];
        if (!items.length) return;
        var item = items[index % items.length];
        var quote = section.querySelector("[data-public-landing-social-quote]");
        var meta = section.querySelector("[data-public-landing-social-meta]");
        var progress = section.querySelector("[data-public-landing-social-progress]");
        if (quote) quote.textContent = '"' + item.quote + '"';
        if (meta) meta.innerHTML = item.name + ' <span aria-hidden="true">-</span> <span class="social-proof__stars">\u2605\u2605\u2605\u2605\u2605</span>';
        if (progress) {
          progress.style.animation = "none";
          void progress.offsetHeight;
          progress.style.animation = "";
        }
      }

      function template7RecoveryAttribution() {
        var params=queryParams(),tracking=collectMetaTrackingParams(params);
        var result={landing:cfg.slug,landing_resolution:landingResolution||'',target_provider:cfg.targetProvider,
          skin_code:cfg.targetProvider==='multi_skin'?cfg.skinCode:'',fbp:tracking.fbp||'',fbc:tracking.fbc||''};
        ['facebook','portofolio','cp','campana','conjunto','anuncio','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(key){var value=params.get(key);if(value)result[key]=value;});
        if(cfg.template8&&cfg.cardIndex)result.card_index=String(cfg.cardIndex);
        return result;
      }
      function warmTemplate7Entry() {
        if (!cfg.cardIndex) return;
        function resume(advisor, name, promo) {
          // The server still reuses this identity on submit. A late background
          // response must never pull an actively typing visitor off the form.
          if (window.__T7_ENTRY_STARTED__ || window.__T7_FORM_INTERACTED__) return;
          var entryAttempt = ++template7EntryGeneration;
          window.__T7_ENTRY_STARTED__ = true; clickLocked = true;
          if (template7Transition) template7Transition.start('preparing');
          return fetchWithEntryRecovery('/api/template7/start', {
            method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({device_id:getOrCreateDeviceId(),landing_id:cfg.landingId,landing_slug:cfg.slug, card_index: cfg.cardIndex,
              entry_funnel:window.__entryFunnel?window.__entryFunnel.context():undefined,
              atrio_client_id:advisor.atrioClientId || advisor.atrio_client_id,advisor_id:advisor.atrioId || advisor.atrio_id,
              advisor_slug:advisor.atrioSlug || advisor.atrio_slug,name:name,promo_code:promo,attribution:template7RecoveryAttribution()})
          }).then(function(response){if(!response.ok)throw new Error('entry pending');return response.json()}).then(function(result){
            if (entryAttempt !== template7EntryGeneration) return;
            if(!result || typeof result.handoff_url !== 'string')throw new Error('entry pending');
            navigateTemplate7Handoff(template7TransitionUrl(result.handoff_url));
          }).catch(function(){
            if (entryAttempt !== template7EntryGeneration) return;
            window.__T7_ENTRY_STARTED__ = false; clickLocked = false;
            if(template7Transition)template7Transition.finish();
            var nameField=document.querySelector('[data-template7-name]');if(nameField)nameField.value=name;
            setTemplate7Error('Tu acceso sigue pendiente. Pod\xE9s retomar el mismo intento sin volver a completar tus datos.');
          });
        }
        Promise.all([window.__LB_IDENTITY_READY__ || Promise.resolve(), ensureAtrioPromise()]).then(function (values) {
          var advisor = values[1];
          if (!advisor || window.__T7_ENTRY_STARTED__ || (window.__LB_IDENTITY_READY__ && values[0] !== true)) return;
          if (advisor.preparationReady) {
            if (!advisor.existingName || !advisor.promoCode || window.__T7_ENTRY_STARTED__) return;
            return resume(advisor,advisor.existingName,advisor.promoCode);
          }
          return fetch('/api/template7/warm', {
            method: 'POST', credentials: 'same-origin', cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: getOrCreateDeviceId(), landing_id: cfg.landingId, landing_slug: cfg.slug, card_index: cfg.cardIndex,
              atrio_client_id: advisor.atrioClientId || advisor.atrio_client_id,
              advisor_id: advisor.atrioId || advisor.atrio_id,
              advisor_slug: advisor.atrioSlug || advisor.atrio_slug })
          }).then(function (response) { return response.ok ? response.json() : null; }).then(function (result) {
            if(result && typeof result.existing_name === 'string' && typeof result.promo_code === 'string') {
              advisor.preparationReady=true;advisor.existingName=result.existing_name;advisor.promoCode=result.promo_code;
              return resume(advisor,result.existing_name,result.promo_code);
            }
            if (result && typeof result.handoff_url === 'string' && !window.__T7_ENTRY_STARTED__ && !window.__T7_FORM_INTERACTED__) {
              var restored = new URL(result.handoff_url);
              if (restored.protocol === 'https:' && restored.pathname === '/prepare' && restored.searchParams.has('t')) {
                window.__T7_ENTRY_STARTED__ = true;
                navigateTemplate7Handoff(template7TransitionUrl(restored.href));
                return;
              }
            }
            if (!result || !result.gateway_origin) return;
            var destination = new URL(result.gateway_origin);
            if (destination.protocol !== 'https:') return;
            var link = document.createElement('link'); link.rel = 'preconnect'; link.href = destination.origin;
            document.head.appendChild(link);
            window.__T7_GATEWAY_WARM__ = window.__T7_GATEWAY_WARM__ || {};
            if (!window.__T7_GATEWAY_WARM__[destination.origin]) window.__T7_GATEWAY_WARM__[destination.origin] = fetch(destination.origin + '/api/preparations/warm', { mode: 'no-cors', credentials: 'omit', cache: 'no-store' }).catch(function () {});
            return window.__T7_GATEWAY_WARM__[destination.origin];
          });
        }).catch(function () {});
      }

      var template8SelectionVersion = 0;
      function template8DestinationKey() { return cfg.slug + ':' + (cfg.cardIndex || 'unselected'); }
      function template8Destination(card, commit) {
        return Promise.resolve(window.__LB_IDENTITY_READY__ || true).then(function(ready) {
          if (ready !== true) throw new Error('identity_pending');
          return fetch('/api/template7/destination', {
            method:'POST', credentials:'same-origin', cache:'no-store', headers:{'Content-Type':'application/json'},
            body:JSON.stringify({landing_id:cfg.landingId, landing_slug:cfg.slug, card_index:card.index, commit:commit, device_id:getOrCreateDeviceId()})
          }).then(function(response) { if (!response.ok) throw new Error('page_unavailable'); return response.json(); });
        });
      }
      function initTemplate8Selection() {
        var grid = document.querySelector('[data-template8-grid]');
        var entry = document.querySelector('[data-template8-entry]');
        var status = document.querySelector('[data-template8-status]');
        window.addEventListener('click', function(event) {
          var back = event.target && event.target.closest && event.target.closest('[data-template8-back]');
          if (back && !clickLocked && !window.__T7_ENTRY_STARTED__) { template8SelectionVersion++; entry.hidden = true; grid.hidden = false; cfg.cardIndex = null; return; }
          var button = event.target && event.target.closest && event.target.closest('[data-template8-card-index]');
          if (!button || button.disabled || clickLocked || window.__T7_ENTRY_STARTED__) return;
          var index = Number(button.getAttribute('data-template8-card-index'));
          var card = cfg.template8Cards[index - 1];
          if (!card) return;
          var selectionVersion = ++template8SelectionVersion;
          notifyTemplate6CardClick(button);
          cfg.cardIndex = index; cfg.targetProvider = card.targetProvider; cfg.skinCode = card.multiSkinCode || '';
          if(window.__entryFunnel)window.__entryFunnel.emit('skin_selected',{provider:cfg.targetProvider,skin:cfg.skinCode});
          window.__T7_SELECTED_GATEWAY__=card.gatewayOrigin;
          if(window.__T7_WARM_RESOURCES__)window.__T7_WARM_RESOURCES__(card.gatewayOrigin);
          try { var selectedUrl = new URL(window.location.href); selectedUrl.searchParams.set('card_index',String(index)); selectedUrl.searchParams.set('target_provider',card.targetProvider); window.history.replaceState(window.history.state,'',selectedUrl.href); } catch(e) {}
          var login = document.querySelector('[data-template8-login]');
          if (login && card.gatewayOrigin) login.href = card.gatewayOrigin;
          var logo = document.querySelector('[data-entry-logo]');
          if (logo && card.transitionLogo) { logo.removeAttribute('src'); logo.setAttribute('data-src',card.transitionLogo); logo.alt = card.text; }
          var transitionRoot = document.getElementById('gateway-entry-transition');
          if (transitionRoot && card.transitionBrand) {
            var brand = card.transitionBrand;
            transitionRoot.dataset.palette = brand.background;
            transitionRoot.style.setProperty('--entry-background',brand.background);
            transitionRoot.style.setProperty('--entry-accent',brand.accent || '#f6c84b');
            transitionRoot.style.setProperty('--entry-track',(brand.accent || '#f6c84b') + '33');
            transitionRoot.style.setProperty('--entry-accent-text',brand.accentText || '#171105');
            transitionRoot.style.setProperty('--entry-glow',brand.glow);
            transitionRoot.querySelectorAll('[data-entry-source]').forEach(function(source) {
              source.removeAttribute('srcset'); source.dataset.srcset = card.transitionLogoAvif || '';
            });
          }
          grid.hidden = true; entry.hidden = false;
          var title = document.querySelector('[data-template8-selected-page]');
          if (title) title.textContent = card.text;
          var pageLogo = document.querySelector('.template7__logo');
          if (!pageLogo && title && card.imageUrl) { pageLogo=document.createElement('img'); pageLogo.className='template7__logo'; title.parentNode.insertBefore(pageLogo,title); }
          if (pageLogo) { pageLogo.hidden=!card.imageUrl; if(card.imageUrl){pageLogo.src=card.imageUrl;pageLogo.alt=card.text;} }
          var input = document.querySelector('[data-template7-name]');
          window.__T7_PROGRAMMATIC_FOCUS__=true;
          if (input) input.focus();
          window.__T7_PROGRAMMATIC_FOCUS__=false;
          var key = template8DestinationKey();
          window.__PUBLIC_LANDING_ATRIO_PROMISES=window.__PUBLIC_LANDING_ATRIO_PROMISES||{};
          // Selection owns its own request. Never wait for another card's warmup.
          var selected = template8Destination(card, true);
          window.__PUBLIC_LANDING_ATRIO_PROMISES[key] = selected.catch(function() { return null; });
          selected.then(function(advisor) {
            if (selectionVersion !== template8SelectionVersion) return;
            if (advisor && advisor.preparationReady) warmTemplate7Entry();
          }).catch(function() {
            if (selectionVersion !== template8SelectionVersion) return;
            entry.hidden = true; grid.hidden = false; cfg.cardIndex = null;
            status.textContent = 'Esta p\xE1gina no est\xE1 disponible ahora. Eleg\xED otra o volv\xE9 a intentar.';
          });
        }, true);
      }
      function init() {
        initTemplate8Selection();
        function markFormIntent(event) {
          var target=event.target;
          if(!window.__T7_PROGRAMMATIC_FOCUS__&&target&&target.closest&&target.closest('[data-template7-form]'))window.__T7_FORM_INTERACTED__=true;
        }
        document.addEventListener('focusin',markFormIntent,{passive:true});
        document.addEventListener('input',markFormIntent,{passive:true});
        document.addEventListener('pointerdown',markFormIntent,{passive:true});
        warmTemplate7Entry();
        if (cfg.template === 7 && window.__LB_IDENTITY_READY__) {
          window.__LB_IDENTITY_READY__.then(function () {
            recordLandingJourneyStart();
            prearmContactContext();
            window.setTimeout(prearmContactContext, 700);
          });
        } else {
          recordLandingJourneyStart();
          prearmContactContext();
          window.setTimeout(prearmContactContext, 700);
        }
        if (isAtrioDestination()) ensureAtrioPromise();
        else ensurePhonePromise();
        scheduleMetaClientIpCollection();
        scheduleOfficialMetaParamBuilder();
        initRotatingBackgrounds();
        initCtas();
        initTemplate7Name();
        initInlineEmail();



        initPrivacyDialog();
      }

      init();
      window.__T7_RUNTIME_READY__=true;
      if(window.__T7_ASSET_READY__)window.__T7_ASSET_READY__();
      var early=window.__T7_EARLY_ACTION__;
      window.__T7_EARLY_ACTION__=null;
      if(early&&early.isConnected&&!early.disabled)early.click();
    })();
`
  }
};

// components/public-landing/template7RuntimeAsset.ts
function template7RuntimeAsset(template, classic) {
  const variant = `t${template}-${classic ? "classic" : "builder"}`;
  const asset = template7RuntimeAssets_generated_default[variant];
  if (!asset) throw new Error("Run scripts/build-template7-runtime-assets.mjs before rendering Template 7/8");
  return asset;
}
function template7RuntimeAssetResponse(name) {
  const match = /^t([78])-(classic|builder)-[a-f0-9]{24}\.js$/.exec(name);
  if (!match) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  const asset = template7RuntimeAsset(Number(match[1]), match[2] === "classic");
  if (asset.name !== name) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  return new Response(asset.source, { headers: {
    "Content-Type": "text/javascript; charset=utf-8",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff"
  } });
}
var EARLY_FORM = `
window.__T7_RUNTIME_READY__=false;
var t7AssetTimer,t7AssetRetries=0,t7AssetLoadSerial=0,t7AssetFailed=false;
function t7AssetStatus(message){
  var grid=document.querySelector('[data-template8-grid]');
  var status=document.querySelector(grid&&!grid.hidden?'[data-template8-status]':'[data-template7-error]');
  if(status){status.textContent=message;status.hidden=!message;}
}
function t7EarlyBusy(action,busy){
  if(!action)return;
  action.setAttribute('aria-busy',String(busy));
  var label=action.querySelector('[data-public-landing-cta-label]');
  if(label)label.textContent=busy?'Preparando...':action.getAttribute('data-public-landing-rest-label')||'Continuar';
}
window.__T7_ASSET_READY__=function(){
  clearTimeout(t7AssetTimer);t7AssetFailed=false;t7AssetStatus('');
  t7EarlyBusy(window.__T7_EARLY_ACTION__,false);
};
function t7AssetRetry(){
  if(window.__T7_RUNTIME_READY__)return;
  clearTimeout(t7AssetTimer);
  var script=document.createElement('script');script.src=window.__T7_RUNTIME_ASSET_URL__+'?entry_retry='+(++t7AssetLoadSerial);
  script.onload=function(){if(!window.__T7_RUNTIME_READY__)t7AssetFailure()};script.onerror=t7AssetFailure;
  document.head.appendChild(script);t7AssetTimer=setTimeout(t7AssetFailure,10000);
}
function t7AssetFailure(){
  if(window.__T7_RUNTIME_READY__)return;
  clearTimeout(t7AssetTimer);
  if(t7AssetRetries++<1){setTimeout(t7AssetRetry,400);return;}
  t7AssetFailed=true;t7EarlyBusy(window.__T7_EARLY_ACTION__,false);
  t7EarlyStage('entry_error','network_error');t7EarlyFlush();
  t7AssetStatus('No pudimos preparar el acceso. Toc\xE1 nuevamente el bot\xF3n para reintentar; tus datos siguen ac\xE1.');
}
window.__T7_ASSET_FAILED__=t7AssetFailure;
t7AssetTimer=setTimeout(t7AssetFailure,10000);
window.__ENTRY_FUNNEL_EARLY__={started_at:Date.now(),events:[]};
try{
  var t7Cfg=window.__PUBLIC_LANDING_RUNTIME_CONFIG__||{};
  var t7Uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if(t7Uuid.test(String(t7Cfg.landingId))&&crypto.randomUUID){
    var t7Key='entry-funnel:v1:'+t7Cfg.landingId,t7Template=t7Cfg.template8?8:7,t7Flow=null,t7Now=Date.now();
    try{t7Flow=JSON.parse(sessionStorage.getItem(t7Key)||'null')}catch(e){}
    if(!t7Flow||!t7Uuid.test(String(t7Flow.flow_id))||t7Flow.landing_id!==t7Cfg.landingId||t7Flow.template!==t7Template||t7Flow.telemetry_origin!==location.origin||!Number.isSafeInteger(t7Flow.started_at)||t7Flow.started_at>t7Now||t7Flow.started_at<t7Now-86400000)
      t7Flow={flow_id:crypto.randomUUID(),landing_id:t7Cfg.landingId,template:t7Template,telemetry_origin:location.origin,started_at:t7Now};
    window.__ENTRY_FUNNEL_EARLY__.context=t7Flow;window.__ENTRY_FUNNEL_EARLY__.started_at=t7Flow.started_at;
    try{sessionStorage.setItem(t7Key,JSON.stringify(t7Flow))}catch(e){}
  }
}catch(e){}
function t7EarlyStage(name,errorCode){
  var early=window.__ENTRY_FUNNEL_EARLY__;
  if(!early||early.events.some(function(item){return item.name===name}))return;
  if(early.events.length<8)early.events.push({id:crypto.randomUUID?crypto.randomUUID():undefined,name:name,at:Date.now(),...(errorCode?{error_code:errorCode}:{})});
}
function t7EarlyFlush(){
  if(window.__T7_RUNTIME_READY__)return;
  try{
    var early=window.__ENTRY_FUNNEL_EARLY__,flow=early&&early.context;
    if(!flow||!early.events.length||!navigator.sendBeacon)return;
    var events=early.events.filter(function(event){return event.id}).map(function(event){return {id:event.id,name:event.name,elapsed_ms:Math.max(0,Math.min(86400000,event.at-flow.started_at)),...(event.error_code?{error_code:event.error_code}:{})}});
    navigator.sendBeacon('/api/entry-funnel',new Blob([JSON.stringify({landing_id:flow.landing_id,flow_id:flow.flow_id,template:flow.template,events:events})],{type:'text/plain'}));
  }catch(e){}
}
window.addEventListener('pagehide',t7EarlyFlush);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')t7EarlyFlush()});
requestAnimationFrame(function(){if(document.visibilityState!=='hidden')t7EarlyStage('page_visible')});
function t7Early(event){
  var target=event.target;
  if(!target||!target.closest||window.__T7_RUNTIME_READY__)return;
  var form=target.closest('[data-template7-form]');
  if(form){
    window.__T7_FORM_INTERACTED__=true;
    var input=form.querySelector('[data-template7-name]');
    var cta=form.querySelector('[data-public-landing-cta]');
    if(cta)cta.disabled=!input||!String(input.value||'').trim();
    if(event.type==='focusin'&&target.matches('[data-template7-name]'))t7EarlyStage('name_focus');
    if(event.type==='input'&&target.matches('[data-template7-name]')){
      if(target.value.length)t7EarlyStage('name_started');
      if(target.value.trim()&&target.checkValidity())t7EarlyStage('name_valid');
    }
  }
  var action=target.closest('[data-template8-card-index],[data-public-landing-cta]');
  if(event.type==='submit'&&form)action=form.querySelector('[data-public-landing-cta]');
  if((event.type==='click'||event.type==='submit')&&action){
    event.preventDefault();event.stopImmediatePropagation();
    if(!action.disabled){
      if(action.matches('[data-public-landing-cta]')){t7EarlyStage('cta_clicked');window.__T7_EARLY_CTA_RECORDED__=true;}
      if(window.__T7_EARLY_ACTION__!==action)t7EarlyBusy(window.__T7_EARLY_ACTION__,false);
      window.__T7_EARLY_ACTION__=action;t7EarlyBusy(action,true);
      if(t7AssetFailed){t7AssetFailed=false;t7AssetRetries=0;t7AssetStatus('');t7AssetRetry();}
    }
  }
}
['focusin','input','click','submit'].forEach(function(type){window.addEventListener(type,t7Early,true)});
`;
function renderTemplate7RuntimeAsset(slug, config, deviceIdScript = "") {
  const asset = template7RuntimeAsset(config.layout?.template === 8 ? 8 : 7, !!deviceIdScript);
  const settings = JSON.stringify(buildTemplate7RuntimeConfig(slug, config, deviceIdScript)).replace(/[<>&\u2028\u2029]/g, (value) => `\\u${value.charCodeAt(0).toString(16).padStart(4, "0")}`);
  const identity = deviceIdScript ? `(function(){${deviceIdScript};window.__TEMPLATE7_GET_DEVICE_ID__=getOrCreateDeviceId;})();` : "";
  const url = `/public-assets/template-entry/${asset.name}`;
  return {
    preload: `<link rel="preload" as="script" href="${url}">`,
    config: `<script data-template7-runtime-config>window.__PUBLIC_LANDING_RUNTIME_CONFIG__=${settings};window.__T7_RUNTIME_ASSET_URL__=${JSON.stringify(url)};${identity}${EARLY_FORM}</script>`,
    script: `<script src="${url}" data-template7-runtime defer onerror="window.__T7_ASSET_FAILED__()"></script>`
  };
}

// components/public-landing/AtrioPrewarmScript.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function escapeScriptJson(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => ({
    "<": "\\u003c",
    ">": "\\u003e",
    "&": "\\u0026",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  })[character] || character);
}
function AtrioPrewarmScript({ slug, landingId, deviceIdScript = "" }) {
  if (!slug || !landingId) return null;
  const script = `
    (function () {
      try {
        ${deviceIdScript}
        var slug = ${escapeScriptJson(slug)};
        window.__PUBLIC_LANDING_ATRIO_PROMISES = window.__PUBLIC_LANDING_ATRIO_PROMISES || {};
        if (!window.__PUBLIC_LANDING_ATRIO_PROMISES[slug]) {
          window.__PUBLIC_LANDING_ATRIO_PROMISES[slug] = Promise.resolve(window.__LB_IDENTITY_READY__ || true).then(function (ready) {
            if (ready !== true) return null;
            return fetch("/api/template7/destination", {
            method: "POST", credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ landing_id: ${escapeScriptJson(landingId)}, landing_slug: slug${deviceIdScript ? ", device_id: getOrCreateDeviceId()" : ""} }),
            cache: "no-store",
            keepalive: true
          }).then(function (response) {
            if (!response.ok) return null;
            return response.json();
          }); }).catch(function () { return null; });
        }
      } catch (e) {}
    })();
  `;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("script", { dangerouslySetInnerHTML: { __html: script } });
}

// components/public-landing/template7ReentryScript.ts
function buildTemplate7ReentryScript(gatewayOrigin, landingPath, checkGatewaySession = true) {
  let origin;
  try {
    const url = new URL(gatewayOrigin);
    if (url.protocol !== "https:" || url.username || url.password) return "";
    origin = url.origin;
  } catch {
    return "";
  }
  const encoded = JSON.stringify(origin).replace(/</g, "\\u003c");
  const encodedPath = JSON.stringify(landingPath || "").replace(/</g, "\\u003c");
  const landingOrigins = [
    "https://mkt.panelbotadmin.com",
    "https://landing.panelbotadmin.com",
    ...(process.env.TEMPLATE7_LANDING_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean)
  ];
  const allowed = JSON.stringify(landingOrigins).replace(
    /[<>&\u2028\u2029]/g,
    (value) => `\\u${value.charCodeAt(0).toString(16).padStart(4, "0")}`
  );
  return `<script data-template7-reentry>
    (function () {
      if (window.self !== window.top) return;
      try {
        var gateway = ${encoded};
        var url = new URL(window.location.href);
        var landingPath = ${encodedPath} || url.pathname;
        if (${allowed}.indexOf(url.origin) === -1) return;
        if (!/^\\/(?:l\\/)?[a-z0-9][a-z0-9_-]{0,159}\\/?$/i.test(url.pathname) && url.pathname !== "/") return;
        var key = "template7:reentry:" + gateway;
        var stored = JSON.parse(window.sessionStorage.getItem(key) || "null");
        var returned = url.searchParams.get("__t7_resume");
        if (returned && stored && stored.nonce === returned && stored.expiresAt > Date.now()) {
          var original = new URL(stored.url);
          if (original.origin === url.origin && (stored.returnPath || original.pathname) === url.pathname && url.pathname === landingPath) {
            window.sessionStorage.removeItem(key);
            // A missing gateway session should not bounce on every refresh.
            try { window.localStorage.removeItem("template7:gateway-visited:" + gateway); } catch(e) {}
            window.history.replaceState(window.history.state, "", original.pathname + original.search + original.hash);
            return;
          }
        }
        // Shared accounts can carry another skin's gateway cookie. Resolve that
        // account through this landing's saved skin instead of reopening it.
        if (!${JSON.stringify(checkGatewaySession)}) return;
        // This hint never authorizes access or identifies an account. The
        // gateway must validate its own cookie; start validates local identity.
        var visited = Number(window.localStorage.getItem("template7:gateway-visited:" + gateway) || 0);
        if (!visited || visited > Date.now() || Date.now() - visited > 31536000000) return;
        // Keep attribution and form-prefill parameters on the landing's origin.
        // Return to the rendered landing, even when ?landing selected it from
        // the root or another route. The gateway sees no attribution/prefill.
        url.searchParams.delete("__t7_resume");
        var nonce = window.crypto.randomUUID();
        var back = new URL(landingPath, url.origin);
        window.sessionStorage.setItem(key, JSON.stringify({ nonce: nonce, url: url.href, returnPath: back.pathname, expiresAt: Date.now() + 120000 }));
        back.searchParams.set("__t7_resume", nonce);
        var destination = new URL("/resume", gateway);
        destination.searchParams.set("return_to", back.href);
        window.__TEMPLATE7_REENTRY_PENDING__ = true;
        window.location.replace(destination.href);
      } catch (e) { window.__TEMPLATE7_REENTRY_PENDING__ = false; }
    })();
  </script>`;
}
function guardTemplate7ReentryScripts(html) {
  return html.replace(
    /<script>([\s\S]*?)<\/script>/g,
    (_, source) => `<script>if (!window.__TEMPLATE7_REENTRY_PENDING__) {${source}
}</script>`
  );
}

// lib/landing/template7Images.ts
var OBJECT_PATH = "/storage/v1/object/public/landing-images/";
var RENDER_PATH = "/storage/v1/render/image/public/landing-images/";
function template7ImageUrl(raw, width, height) {
  try {
    const url = new URL(raw);
    if (!Number.isInteger(width) || width < 1 || width > 2500 || height !== void 0 && (!Number.isInteger(height) || height < 1 || height > 2500) || url.protocol !== "https:" || url.username || url.password || url.hash || !/^[a-z0-9-]+\.supabase\.co$/i.test(url.hostname) || !url.pathname.startsWith(OBJECT_PATH) && !url.pathname.startsWith(RENDER_PATH)) return raw;
    if ([...url.searchParams.keys()].some((key) => !["width", "height", "quality", "resize", "format"].includes(key))) return raw;
    url.pathname = url.pathname.replace(OBJECT_PATH, RENDER_PATH);
    url.search = "";
    url.searchParams.set("width", String(width));
    if (height) url.searchParams.set("height", String(height));
    url.searchParams.set("resize", "contain");
    url.searchParams.set("quality", height ? "80" : "65");
    return url.toString();
  } catch {
    return raw;
  }
}
function originalUrl(raw) {
  if (template7ImageUrl(raw, 1) === raw) return raw;
  const url = new URL(raw);
  url.pathname = url.pathname.replace(RENDER_PATH, OBJECT_PATH);
  url.search = "";
  return url.toString();
}
function template7Logo(raw) {
  const variants = [1, 2, 3].map((scale) => template7ImageUrl(raw, 170 * scale, 138 * scale));
  return {
    src: variants[1],
    srcSet: variants[0] === raw ? "" : variants.map((url, index) => `${url} ${index + 1}x`).join(", "),
    variants: [...new Set(variants)]
  };
}
function template8Image(raw, background = false) {
  const widths = background ? [640, 1024, 1600] : [240, 480, 720];
  const variants = widths.map((width) => template7ImageUrl(raw, width));
  return {
    src: variants[background ? 0 : 1],
    srcSet: variants.every((url) => url === raw) ? "" : variants.map((url, index) => `${url} ${widths[index]}w`).join(", "),
    sizes: background ? "100vw" : "(max-width: 540px) calc((100vw - 42px) / 2), 240px"
  };
}
function optimizeTemplate7Images(config) {
  if (config.layout?.template === 8 && config.content?.template8) {
    const cover = config.content.template8;
    return { ...config, content: { ...config.content, template8: {
      ...cover,
      backgroundImageUrl: template8Image(cover.backgroundImageUrl || "", true).src,
      cards: (cover.cards || []).map((card) => ({ ...card, imageUrl: template8Image(card.imageUrl).src }))
    } } };
  }
  if (config.layout?.template !== 7) return config;
  const logo = template7Logo(config.content?.logoUrl || "");
  const images = config.background?.images || [];
  return {
    ...config,
    ...config.content ? { content: { ...config.content, logoUrl: logo.src, logoSrcSet: logo.srcSet, logoOriginalUrl: originalUrl(config.content.logoUrl || "") } } : {},
    ...config.background ? { background: {
      ...config.background,
      images: images.map((url) => template7ImageUrl(url, 640)),
      imagesOriginal: images.map(originalUrl),
      imagesResponsive: images.map((url) => ({
        mobile: template7ImageUrl(url, 640),
        tablet: template7ImageUrl(url, 1024),
        desktop: template7ImageUrl(url, 1600)
      }))
    } } : {}
  };
}

// components/public-landing/metaPixelHtml.ts
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeScriptJson2(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => {
    switch (character) {
      case "<":
        return "\\u003c";
      case ">":
        return "\\u003e";
      case "&":
        return "\\u0026";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        return character;
    }
  });
}
function buildPixelInitScript(pixelId, slug, phoneCountryCode = "54") {
  const safePixelId = pixelId.replace(/\D+/g, "");
  if (!safePixelId) return "";
  const storageNamespace = `landing-builder:${safePixelId}:${slug}`;
  return `<script>
    (function () {
      !function(f,b,e,v,n,t,s){
        if(f.fbq) return;
        n=f.fbq=function(){
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if(!f._fbq) f._fbq=n;
        n.push=n;
        n.loaded=!0;
        n.version='2.0';
        n.queue=[];
        t=b.createElement(e);
        t.async=!0;
        t.src=v;
        s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      try {
        var params = new URLSearchParams(window.location.search);
        var storageNamespace = ${escapeScriptJson2(storageNamespace)};

        function storageKey(key){
          return storageNamespace + ':' + key;
        }

        function readMeta(key){
          try {
            return window.__META && window.__META[key] ? window.__META[key] : '';
          } catch (e) {
            return '';
          }
        }

        function readLocalStorage(key){
          try {
            return localStorage.getItem(storageKey(key)) || '';
          } catch (e) {
            return '';
          }
        }

        function writeLocalStorage(key, value){
          try {
            if (value) localStorage.setItem(storageKey(key), value);
          } catch (e) {}
        }

        function sanitizeAddressBar(){
          try {
            var url = new URL(window.location.href);
            var sensitiveKeys = ['email', 'em', 'phone', 'ph', 'fn', 'ln', 'external_id', 'eid', 'ct', 'st', 'zip', 'country'];
            var changed = false;
            sensitiveKeys.forEach(function(key){
              if (url.searchParams.has(key)) {
                url.searchParams.delete(key);
                changed = true;
              }
            });
            if (changed) {
              window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
            }
          } catch (e) {}
        }

        function firstNonEmpty(values){
          for (var i = 0; i < values.length; i += 1) {
            var value = values[i];
            if (value != null) {
              var text = String(value).trim();
              if (text) return text;
            }
          }
          return '';
        }

        function normEmail(v){
          v = (v || '').trim().toLowerCase();
          return v || undefined;
        }

        ${buildPhoneNormalizerScript("normPhone")}

        function safeUUID(){
          if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
          }
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }

        function getOrCreateExternalId(){
          try {
            var existing = readLocalStorage('external_id');
            if (existing) return existing;
            var created = safeUUID();
            localStorage.setItem(storageKey('external_id'), created);
            return created;
          } catch (e) {
            return safeUUID();
          }
        }

        var userEmail = normEmail(firstNonEmpty([
          params.get('email'),
          params.get('em'),
          readLocalStorage('em'),
          readMeta('userEmail')
        ]));

        var userPhone = normPhone(firstNonEmpty([
          params.get('phone'),
          params.get('ph'),
          readLocalStorage('ph'),
          readMeta('userPhone')
        ]), ${escapeScriptJson2(phoneCountryCode)}) || undefined;

        var userFn = firstNonEmpty([
          params.get('fn'),
          readMeta('userFn')
        ]) || undefined;

        var userLn = firstNonEmpty([
          params.get('ln'),
          readMeta('userLn')
        ]) || undefined;

        var externalId =
          firstNonEmpty([readMeta('externalId'), readLocalStorage('external_id')]) ||
          getOrCreateExternalId();

        writeLocalStorage('external_id', externalId);
        writeLocalStorage('em', userEmail);
        writeLocalStorage('ph', userPhone);
        writeLocalStorage('ct', params.get('ct') || '');
        writeLocalStorage('st', params.get('st') || '');
        writeLocalStorage('zip', params.get('zip') || '');
        writeLocalStorage('country', params.get('country') || '');
        sanitizeAddressBar();

        fbq('init', ${escapeScriptJson2(safePixelId)}, {
          em: userEmail,
          ph: userPhone,
          fn: userFn,
          ln: userLn,
          external_id: externalId
        });

        fbq('track', 'PageView');

        window.__META = {
          PIXEL_ID: ${escapeScriptJson2(safePixelId)},
          userEmail: userEmail,
          userPhone: userPhone,
          userFn: userFn,
          userLn: userLn,
          externalId: externalId,
          safeUUID: safeUUID
        };
      } catch (e) {
        console.error('Meta Pixel init error', e);
      }
    })();
  </script>`;
}
function buildPixelNoscript(pixelId) {
  const safePixelId = pixelId.replace(/\D+/g, "");
  if (!safePixelId) return "";
  return `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${escapeHtml(
    safePixelId
  )}&amp;ev=PageView&amp;noscript=1" alt=""></noscript>`;
}

// components/public-landing/whatsAppBrandIcon.ts
var WHATSAPP_GREEN_PATH = "M16.04 3A12.82 12.82 0 0 0 5.08 22.47L3 30l7.72-2.02A12.88 12.88 0 1 0 16.04 3Z";
var WHATSAPP_WHITE_PATH = "M16.04 3A12.82 12.82 0 0 0 5.08 22.47L3 30l7.72-2.02A12.88 12.88 0 1 0 16.04 3Zm0 23.58a10.66 10.66 0 0 1-5.43-1.49l-.39-.23-4.58 1.2 1.22-4.46-.25-.4a10.68 10.68 0 1 1 9.43 5.38Zm5.85-7.99c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.63 9.63 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.06-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.26 3.45 5.47 4.84.77.33 1.36.53 1.83.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.14-.29-.22-.61-.38Z";

// components/public-landing/renderPublicLandingHtml.tsx
var SOCIAL_PROOF_ITEMS2 = [
  { quote: "Muy buena atencion, me respondieron al toque \u{1F64C}", name: "Nico R." },
  { quote: "Me guiaron con paciencia y buena onda \u2705", name: "Juan P." },
  { quote: "Todo super claro, sin vueltas y rapido \u{1F4AC}", name: "Mica F." },
  { quote: "Atencion de diez, se nota que estan atentos \u{1F91D}", name: "Seba L." },
  { quote: "Respondieron enseguida y me ayudaron con todo \u26A1", name: "Romi D." },
  { quote: "Muy buena predisposicion desde el primer mensaje \u{1F64F}", name: "Lau T." },
  { quote: "Me explicaron todo facil y con mucha claridad \u2728", name: "Dario C." },
  { quote: "Da confianza cuando te responden tan rapido \u{1F4F2}", name: "Cami V." },
  { quote: "Excelente trato, muy humanos para atender \u{1F60A}", name: "Pablo M." },
  { quote: "Me senti bien acompa\xF1ado en todo momento \u{1F64C}", name: "Gise A." },
  { quote: "Rapidos, claros y muy atentos \u2705", name: "Fede L." },
  { quote: "La atencion fue simple y re amable \u{1F4AC}", name: "Sofi B." },
  { quote: "Siempre contestan con buena onda \u{1F91D}", name: "Tomi A." },
  { quote: "Me resolvieron la consulta en minutos \u26A1", name: "Vale M." },
  { quote: "Muy prolijos para explicar cada paso \u2728", name: "Leo C." },
  { quote: "Atencion cercana, nada robotica \u{1F60A}", name: "Flor G." },
  { quote: "Te responden rapido y van al punto \u{1F4F2}", name: "Maxi N." },
  { quote: "Buena energia y mucha predisposicion \u{1F64F}", name: "Agus R." },
  { quote: "Todo facil desde el primer WhatsApp \u2705", name: "Dani P." },
  { quote: "Me gusto la claridad con la que atienden \u{1F4AC}", name: "Juli S." },
  { quote: "Super atentos, se nota el compromiso \u{1F64C}", name: "Mati V." },
  { quote: "Muy buena respuesta, cero vueltas \u26A1", name: "Carla D." },
  { quote: "Atencion amable y bien organizada \u{1F91D}", name: "Lucas E." },
  { quote: "Me ayudaron rapido y con paciencia \u{1F60A}", name: "Meli Q." },
  { quote: "Siempre atentos a cada mensaje \u{1F4F2}", name: "Nacho T." },
  { quote: "Muy claro todo, excelente predisposicion \u2728", name: "Ana K." },
  { quote: "Se nota que hay equipo atras respondiendo \u{1F64C}", name: "Bruno F." },
  { quote: "Buena atencion y seguimiento constante \u2705", name: "Rocio L." },
  { quote: "Responden rapido y con trato cordial \u{1F4AC}", name: "Marcos H." },
  { quote: "Todo ordenado, claro y muy humano \u{1F91D}", name: "Pau M." }
];
function escapeHtml2(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function attr(name, value) {
  if (value === void 0 || value === null || value === false || value === "") return "";
  return ` ${name}="${escapeHtml2(value)}"`;
}
function styleAttr(styles) {
  const css = Object.entries(styles).filter(([, value]) => value !== void 0 && value !== null && value !== false && value !== "").map(([key, value]) => `${key}:${String(value)}`).join(";");
  return css ? attr("style", css) : "";
}
function renderScriptElement(element) {
  const script = element?.props?.dangerouslySetInnerHTML?.__html;
  return script ? `<script>${script}</script>` : "";
}
function buildImageSrcSet(image) {
  if (!image) return "";
  return [
    image.mobile ? `${image.mobile} 640w` : "",
    image.tablet ? `${image.tablet} 1024w` : "",
    image.desktop ? `${image.desktop} 1600w` : ""
  ].filter(Boolean).join(", ");
}
function buildPreloadLinks(config) {
  if (config.layout?.template === 7) {
    const logo = config.content;
    return logo?.logoUrl ? `<link rel="preload" as="image" href="${escapeHtml2(logo.logoUrl)}"${attr("imagesrcset", logo.logoSrcSet)} fetchpriority="high">` : "";
  }
  if (config.layout?.template === 8) {
    const background = config.content?.template8?.backgroundImageUrl || "";
    const image = template8Image(background || config.content?.template8?.cards?.[0]?.imageUrl || "", !!background);
    return image.src ? `<link rel="preload" as="image" href="${escapeHtml2(image.src)}"${attr("imagesrcset", image.srcSet)}${attr("imagesizes", image.srcSet ? image.sizes : "")} fetchpriority="high">` : "";
  }
  if (config.layout?.template === 6) {
    const firstImage = config.content?.template6?.backgroundImageUrl || config.content?.template6?.cards?.[0]?.imageUrl || "";
    return firstImage ? `<link rel="preload" as="image" href="${escapeHtml2(firstImage)}" fetchpriority="high">` : "";
  }
  const firstResponsiveBackground = config.background?.imagesResponsive?.[0];
  const firstBackground = firstResponsiveBackground?.mobile || config.background?.images?.[0] || "";
  const firstBackgroundSrcSet = buildImageSrcSet(firstResponsiveBackground);
  const firstBackgroundSizes = config.layout?.template === 2 ? "(max-width: 430px) 100vw, 430px" : "100vw";
  const logoUrl = config.content?.logoUrl || "";
  return [
    firstBackground ? `<link rel="preload" as="image" href="${escapeHtml2(firstBackground)}"${firstBackgroundSrcSet ? ` imagesrcset="${escapeHtml2(firstBackgroundSrcSet)}" imagesizes="${escapeHtml2(firstBackgroundSizes)}"` : ""} fetchpriority="high">` : "",
    logoUrl ? `<link rel="preload" as="image" href="${escapeHtml2(logoUrl)}" fetchpriority="high">` : ""
  ].filter(Boolean).join("");
}
function template7GatewayOrigin(config) {
  if (config.layout?.template !== 7) return "";
  const raw = gatewayOriginFor(config.tracking?.target_provider, config.tracking?.skin_code);
  try {
    const url = new URL(raw || "");
    return url.protocol === "https:" ? url.origin : "";
  } catch {
    return "";
  }
}
function renderWhatsAppIcon(className) {
  return `<svg class="${escapeHtml2(
    className
  )}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="#25D366" d="${WHATSAPP_GREEN_PATH}"/><path fill="#FFFFFF" d="${WHATSAPP_WHITE_PATH}"/></svg>`;
}
function formatTemplate4Time(offsetMinutes = 0) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires"
  }).format(new Date(Date.now() + offsetMinutes * 60 * 1e3));
}
function renderTemplate4Avatar(profileImageUrl, large = false) {
  const className = large ? "template4__photo template4__photo--large" : "template4__photo";
  if (profileImageUrl) {
    return `<img src="${escapeHtml2(profileImageUrl)}" alt="" class="${className}" decoding="async" loading="eager">`;
  }
  return `<div class="${className}">foto${large ? "<br>asesora" : ""}</div>`;
}
function template4Text(value, fallback, name) {
  return escapeHtml2((value || fallback).replace(/\{\{\s*name\s*\}\}/gi, name));
}
function template5Lines(value, fallback, maxLines) {
  const lines = String(value || fallback).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, maxLines);
  return lines.length > 0 ? lines : fallback.split(/\r?\n/).slice(0, maxLines);
}
function renderTemplate5Title(lines) {
  return lines.map(
    (line, index) => index === 0 ? `<span>${escapeHtml2(line)}</span>` : `<b>${escapeHtml2(line)}</b>`
  ).join("");
}
function renderTemplate5Avatar(profileImageUrl) {
  if (profileImageUrl) {
    return `<img src="${escapeHtml2(profileImageUrl)}" alt="" class="template5__avatar-img" decoding="async" loading="eager">`;
  }
  return `<div class="template5__avatar-placeholder">foto<br>asesor</div>`;
}
function renderPrivacyFooter(config) {
  const businessName = config.name || "el responsable de esta landing";
  const template7IdentityNotice = config.layout?.template === 7 ? "<p><strong>Identidad t\xE9cnica.</strong> Usamos la cookie propia necesaria <code>lb_cid</code> para conservar su identidad t\xE9cnica y evitar cuentas duplicadas. Dura dos a\xF1os. Si elimina las cookies del navegador, puede generarse una identidad nueva.</p>" : "";
  return `<footer class="public-privacy-footer"><button type="button" class="public-privacy-link" data-public-privacy-open aria-haspopup="dialog">Pol\xEDtica de privacidad</button></footer><dialog class="public-privacy-dialog" data-public-privacy-dialog aria-labelledby="public-privacy-title"><div class="public-privacy-dialog__header"><h2 id="public-privacy-title">Pol\xEDtica de privacidad</h2><button type="button" class="public-privacy-dialog__close" data-public-privacy-close aria-label="Cerrar pol\xEDtica de privacidad">\xD7</button></div><div class="public-privacy-dialog__content"><p><strong>Responsable.</strong> Esta landing es gestionada por ${escapeHtml2(
    businessName
  )}.</p>${template7IdentityNotice}<p><strong>Datos tratados.</strong> Al navegar o utilizar el bot\xF3n de contacto pueden procesarse datos t\xE9cnicos del dispositivo y la conexi\xF3n, cookies e identificadores publicitarios, la procedencia de la visita y los datos que usted proporcione voluntariamente.</p><p><strong>Finalidades.</strong> Los datos se utilizan para atender consultas por WhatsApp, operar el servicio, medir resultados y atribuir conversiones publicitarias.</p><p><strong>Meta.</strong> Esta landing puede utilizar Meta Pixel y Conversions API. En consecuencia, cierta informaci\xF3n puede compartirse con Meta Platforms para medici\xF3n, atribuci\xF3n y publicidad, de acuerdo con sus pol\xEDticas.</p><p><strong>Derechos y contacto.</strong> Puede solicitar informaci\xF3n, actualizaci\xF3n o supresi\xF3n de sus datos mediante el canal de WhatsApp ofrecido en esta landing.</p><p>Tambi\xE9n puede administrar las cookies desde su navegador y revisar sus preferencias publicitarias en Meta.</p><div class="public-privacy-dialog__links"><a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer noopener">Pol\xEDtica de privacidad de Meta</a><a href="https://www.facebook.com/adpreferences/ad_settings" target="_blank" rel="noreferrer noopener">Preferencias de anuncios de Meta</a></div></div></dialog>`;
}
function pixelScriptForTemplate(pixelId, slug, phoneCountryCode, template) {
  const original = buildPixelInitScript(pixelId, slug, phoneCountryCode);
  if (template !== 7 || !original) return original;
  const body = original.slice("<script>".length, -"</script>".length);
  return `<script>(function(){function init(){${body}}var ready=window.__LB_IDENTITY_READY__;if(ready&&typeof ready.then==="function")ready.then(init,init);else init();})();</script>`;
}
function renderTextLines(lines) {
  return lines.map((line, index) => `${escapeHtml2(line)}${index < lines.length - 1 ? "<br>" : ""}`).join("");
}
function getResponsiveBackgroundData(config) {
  const images = config.background?.images || [];
  const responsiveImages = config.background?.imagesResponsive || [];
  const safeImages = images.filter(Boolean);
  const mobileImages = responsiveImages.map((image) => image.mobile).filter((image) => Boolean(image));
  const rotationImages = mobileImages.length ? mobileImages : safeImages;
  const firstResponsiveImage = responsiveImages[0];
  const currentImage = firstResponsiveImage?.mobile || safeImages[0] || "";
  const srcSet = buildImageSrcSet(firstResponsiveImage);
  return {
    currentImage,
    rotationImages,
    srcSet,
    rotateEveryHours: config.background?.rotateEveryHours ?? 24
  };
}
function renderRotatingBackground(config, overlay = true) {
  const { currentImage, rotationImages, srcSet, rotateEveryHours } = getResponsiveBackgroundData(config);
  if (currentImage) {
    return `<img src="${escapeHtml2(currentImage)}"${attr("srcset", srcSet)} sizes="100vw" alt="" class="background-layer background-layer__image" data-public-landing-rotating-image="true" data-public-landing-images="${escapeHtml2(
      JSON.stringify(rotationImages)
    )}" data-public-landing-rotate-hours="${escapeHtml2(rotateEveryHours)}" loading="eager" fetchpriority="high" decoding="async" width="1080" height="1920">${overlay ? '<div class="overlay"></div>' : ""}`;
  }
  return `<div class="background-layer">${overlay ? '<div class="overlay"></div>' : ""}</div>`;
}
function renderFrameBackgroundTemplate2(config) {
  const { currentImage, rotationImages, srcSet, rotateEveryHours } = getResponsiveBackgroundData(config);
  if (!currentImage) return "";
  return `<img src="${escapeHtml2(currentImage)}"${attr(
    "srcset",
    srcSet
  )} sizes="(max-width: 430px) 100vw, 430px" alt="" class="frame__bg"${attr(
    "data-public-landing-rotating-image",
    rotationImages.length > 0 ? "true" : ""
  )} data-public-landing-images="${escapeHtml2(
    JSON.stringify(rotationImages)
  )}" data-public-landing-rotate-hours="${escapeHtml2(
    rotateEveryHours
  )}" loading="eager" fetchpriority="high" decoding="async" width="430" height="780">`;
}
function renderFrameBackgroundTemplate7(config) {
  const { currentImage, rotationImages, srcSet, rotateEveryHours } = getResponsiveBackgroundData(config);
  if (!currentImage) return "";
  return `<img src="${escapeHtml2(currentImage)}"${attr("data-image-fallback", config.background?.imagesOriginal?.[0])} onerror="this.onerror=null;this.removeAttribute('srcset');if(this.dataset.imageFallback)this.src=this.dataset.imageFallback"${attr(
    "srcset",
    srcSet
  )} sizes="100vw" alt="" class="template7__background-image"${attr(
    "data-public-landing-rotating-image",
    rotationImages.length > 0 ? "true" : ""
  )} data-public-landing-images="${escapeHtml2(
    JSON.stringify(rotationImages)
  )}" data-public-landing-rotate-hours="${escapeHtml2(
    rotateEveryHours
  )}" loading="eager" fetchpriority="low" decoding="async" width="1600" height="900">`;
}
function renderWhatsAppButton(config, templateVariant = "default", options = {}) {
  const ctaText = config.content?.ctaText || "\xA1Contactar ya!";
  if (templateVariant === "template3") {
    return `<button type="button" class="template3__retry"${styleAttr({
      display: options.hideButton ? "none" : void 0
    })} data-public-landing-cta${attr(
      "data-public-landing-auto-start",
      options.autoStart ? "true" : ""
    )} data-public-landing-rest-label="haz clic aqu\xED." data-public-landing-loading-label="conectando..." data-public-landing-disabled-label="reintenta en un momento" aria-label="Reintentar redirecci\xF3n a WhatsApp"><span data-public-landing-cta-label>haz clic aqu\xED.</span></button>`;
  }
  const isTemplate2Like = templateVariant === "template2";
  const buttonClass = isTemplate2Like ? "cta" : "whatsapp-button";
  const iconClass = isTemplate2Like ? "cta__icon" : "whatsapp-icon";
  const buttonStyle = {
    color: config.colors?.ctaText ?? "#FFFFFF",
    background: config.colors?.ctaBackground ?? "#25D366",
    "font-size": `${config.typography?.cta?.sizePx ?? 18}px`,
    "font-weight": config.typography?.cta?.weight ?? 700,
    display: options.hideButton ? "none" : void 0,
    "box-shadow": isTemplate2Like ? void 0 : `0 0 30px 8px ${config.colors?.ctaGlow ?? "#FFD700"}`
  };
  return `<button type="button" class="${buttonClass}"${styleAttr(buttonStyle)} data-public-landing-cta${attr(
    "data-public-landing-auto-start",
    options.autoStart ? "true" : ""
  )} aria-label="${escapeHtml2(ctaText)}"><span${isTemplate2Like ? ' class="cta__fill"' : ""} data-public-landing-cta-label>${escapeHtml2(ctaText)}</span>${options.hideButton ? "" : renderWhatsAppIcon(iconClass)}</button>`;
}
function normalizeCtaPosition(config) {
  const rawPosition = config.layout?.ctaPosition ?? "between_title_and_info";
  const value = rawPosition === "below_info" ? "between_info_and_badge" : rawPosition;
  const allowed = ["top", "between_title_and_info", "between_info_and_badge", "bottom"];
  return allowed.includes(value) ? value : "between_title_and_info";
}
function renderInlineEmailCapture() {
  return `<div class="inline-email-capture"><div class="inline-email-capture__field"><svg class="inline-email-capture__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg><input data-inline-email-input type="email" inputmode="email" autocomplete="email" maxlength="254" aria-label="Email para desbloquear un bono" aria-describedby="inline-email-error" placeholder="Ingresa tu email para desbloquear un bono"></div><small id="inline-email-error" data-inline-email-error role="status"></small></div>`;
}
function renderTemplate1({ config }) {
  const hasLogo = Boolean(config.content?.logoUrl);
  const titleLines = config.content?.title || [];
  const subtitleLines = config.content?.subtitle || [];
  const badgeText = config.content?.footerBadgeText || "";
  const ctaPosition = normalizeCtaPosition(config);
  const isBottomCta = ctaPosition === "bottom";
  const emailCaptureEnabled = config.emailCapture?.enabled === true;
  const cta = `${emailCaptureEnabled ? renderInlineEmailCapture() : ""}${renderWhatsAppButton(config)}`;
  return `<main class="public-landing landing-shell"><section class="container background-image${isBottomCta ? " template1-bottom-layout" : ""}${emailCaptureEnabled ? " has-inline-email" : ""}">${renderRotatingBackground(
    config,
    false
  )}<div class="content">${hasLogo ? `<img src="${escapeHtml2(config.content?.logoUrl)}" class="logo" alt="${escapeHtml2(
    config.name
  )}" decoding="async" fetchpriority="high" width="200" height="150" data-public-landing-trigger style="cursor:pointer">` : ""}${ctaPosition === "top" ? cta : ""}<p class="title" data-public-landing-trigger${styleAttr(
    {
      color: config.colors?.title ?? "#FFFFFF",
      "font-size": `${config.typography?.title?.sizePx ?? 26}px`,
      "font-weight": config.typography?.title?.weight ?? 700,
      cursor: "pointer"
    }
  )}>${renderTextLines(titleLines)}</p>${ctaPosition === "between_title_and_info" ? cta : ""}<p class="subtitle" data-public-landing-trigger${styleAttr({
    color: config.colors?.subtitle ?? "#FFFFFF",
    "font-size": `${config.typography?.subtitle?.sizePx ?? 16}px`,
    "font-weight": config.typography?.subtitle?.weight ?? 400,
    cursor: "pointer"
  })}>${renderTextLines(subtitleLines)}</p>${ctaPosition === "between_info_and_badge" ? cta : ""}${badgeText ? `<p class="description" data-public-landing-trigger${styleAttr({
    color: config.colors?.badge ?? "#FFD700",
    "font-size": `${config.typography?.badge?.sizePx ?? 16}px`,
    "font-weight": config.typography?.badge?.weight ?? 700,
    cursor: "pointer"
  })}>-${escapeHtml2(badgeText)}-</p>` : ""}</div>${isBottomCta ? `<div class="template1-bottom-cta-slot">${cta}</div>` : ""}</section></main>`;
}
function renderTemplate2({ config }) {
  const hasLogo = Boolean(config.content?.logoUrl);
  const titleLines = config.content?.title || [];
  const subtitleLines = config.content?.subtitle || [];
  const badgeArray = config.content?.footerBadge || [];
  const badgeText = (badgeArray.find((line) => line && line.trim().length > 0) || config.content?.footerBadgeText || "").trim();
  const isSocialProofEnabled = config.socialProof?.enabled !== false;
  const activeSocialProof = SOCIAL_PROOF_ITEMS2[0];
  const emailCaptureEnabled = config.emailCapture?.enabled === true;
  return `<main class="public-landing lp"><section class="phone-view"><div class="artboard${emailCaptureEnabled ? " has-inline-email" : ""}"><div class="frame">${renderFrameBackgroundTemplate2(config)}${hasLogo ? `<img src="${escapeHtml2(config.content?.logoUrl)}" alt="${escapeHtml2(
    config.name
  )}" class="frame__logo" decoding="async" fetchpriority="high" width="220" height="160" data-public-landing-trigger style="cursor:pointer">` : ""}<div class="frame__copy">${badgeText ? `<p class="eyebrow"${styleAttr({
    color: config.colors?.badge ?? "#FFD700",
    "font-size": `${config.typography?.badge?.sizePx ?? 16}px`,
    "font-weight": config.typography?.badge?.weight ?? 700,
    cursor: "pointer"
  })} data-public-landing-trigger>${escapeHtml2(badgeText)}</p>` : ""}<h1 class="title"${styleAttr({
    color: config.colors?.title ?? "#FFFFFF",
    "font-size": `${config.typography?.title?.sizePx ?? 26}px`,
    "font-weight": config.typography?.title?.weight ?? 700,
    cursor: "pointer"
  })} data-public-landing-trigger>${renderTextLines(titleLines)}</h1></div></div>${emailCaptureEnabled ? renderInlineEmailCapture() : ""}${renderWhatsAppButton(
    config,
    "template2"
  )}${isSocialProofEnabled ? `<section class="social-proof" aria-label="Prueba social" data-public-landing-social-proof data-public-landing-trigger style="cursor:pointer"><p class="social-proof__quote" data-public-landing-social-quote>&quot;${escapeHtml2(
    activeSocialProof.quote
  )}&quot;</p><p class="social-proof__meta" data-public-landing-social-meta>${escapeHtml2(
    activeSocialProof.name
  )} <span aria-hidden="true">-</span> <span class="social-proof__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span></p><div class="social-proof__progress" data-public-landing-social-progress aria-hidden="true"></div></section>` : ""}<div class="features" data-public-landing-trigger style="cursor:pointer">${subtitleLines.map(
    (line) => `<p${styleAttr({
      color: config.colors?.subtitle ?? "#FFFFFF",
      "font-size": `${config.typography?.subtitle?.sizePx ?? 16}px`,
      "font-weight": config.typography?.subtitle?.weight ?? 400
    })}>${escapeHtml2(line)}</p>`
  ).join("")}</div></div></section></main>`;
}
function renderTemplate7({ config }) {
  const code = config.tracking?.skin_code;
  const skinBrand = config.tracking?.target_provider === "multi_skin" && isMultiSkinCode(code) ? getMultiSkinBrand(code) : void 0;
  const hasLogo = Boolean(config.content?.logoUrl);
  const titleLines = (config.content?.title || []).map((line) => line.trim()).filter(Boolean);
  const subtitleLines = (config.content?.subtitle || []).map((line) => line.trim()).filter(Boolean);
  const ctaText = config.content?.ctaText || "Continuar";
  const captureWhatsapp = config.template7Capture?.whatsapp === true;
  return `<main class="public-landing template7">${renderFrameBackgroundTemplate7(config)}<div class="template7__veil"></div><section class="template7__card">${hasLogo ? `<img src="${escapeHtml2(config.content?.logoUrl)}"${attr("srcset", config.content?.logoSrcSet)}${attr("data-image-fallback", config.content?.logoOriginalUrl)} onerror="this.onerror=null;this.removeAttribute('srcset');if(this.dataset.imageFallback)this.src=this.dataset.imageFallback" alt="${escapeHtml2(config.name)}" class="template7__logo" decoding="async" fetchpriority="high">` : ""}<h1 class="template7__title"${styleAttr({
    color: config.colors?.title ?? "#FFFFFF",
    "--template7-title-size": `${config.typography?.title?.sizePx ?? 26}px`,
    "font-weight": config.typography?.title?.weight ?? 700
  })}>${renderTextLines(titleLines)}</h1>${subtitleLines.length ? `<p class="template7__subtitle"${styleAttr({
    color: config.colors?.subtitle ?? "#FFFFFF",
    "--template7-subtitle-size": `${config.typography?.subtitle?.sizePx ?? 16}px`,
    "font-weight": config.typography?.subtitle?.weight ?? 400
  })}>${renderTextLines(subtitleLines)}</p>` : ""}<form class="template7__form" data-template7-form><label class="template7__label" for="template7-name">Tu nombre</label><input id="template7-name" class="template7__input" data-template7-name type="text" name="firstName" autocomplete="given-name" maxlength="80" required placeholder="Ej.: Mart\xEDn">${captureWhatsapp ? '<label class="template7__label" for="template7-whatsapp">WhatsApp <span>(opcional)</span></label><input id="template7-whatsapp" class="template7__input" data-template7-whatsapp type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="32" placeholder="Ej.: 11 2345-6789"><p class="template7__phone-warning" data-template7-phone-warning role="status" hidden></p>' : ""}<button type="button" class="template7__cta" data-public-landing-cta data-public-landing-rest-label="${escapeHtml2(ctaText)}" data-public-landing-loading-label="Abriendo..." data-public-landing-disabled-label="No disponible"${styleAttr({
    color: config.colors?.ctaText ?? "#111111",
    background: config.colors?.ctaBackground ?? "#FFD700",
    "--template7-cta-size": `${config.typography?.cta?.sizePx ?? 18}px`,
    "font-weight": config.typography?.cta?.weight ?? 700
  })} disabled><span data-public-landing-cta-label>${escapeHtml2(ctaText)}</span></button><p class="template7__error" data-template7-error role="alert" hidden></p></form></section></main>${renderGatewayEntryTransition(config.tracking?.target_provider || "rey_de_ases", { stage: "creating", gatewayOrigin: template7GatewayOrigin(config), brand: skinBrand })}`;
}
function renderTemplate3({ config }) {
  return `<main class="public-landing template3"><section class="template3__card" aria-live="polite"><svg class="template3__whatsapp" viewBox="0 0 32 32" role="img" aria-label="WhatsApp"><path fill="currentColor" d="M16.04 3A12.82 12.82 0 0 0 5.08 22.47L3 30l7.72-2.02A12.88 12.88 0 1 0 16.04 3Zm0 23.58a10.66 10.66 0 0 1-5.43-1.49l-.39-.23-4.58 1.2 1.22-4.46-.25-.4a10.68 10.68 0 1 1 9.43 5.38Zm5.85-7.99c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.63 9.63 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.06-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.26 3.45 5.47 4.84.77.33 1.36.53 1.83.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.14-.29-.22-.61-.38Z"></path></svg><h1 class="template3__title">Conectando...</h1><p class="template3__copy">Te estamos redirigiendo a nuestro chat de<br>WhatsApp para atenderte enseguida.</p><span class="template3__spinner" aria-hidden="true"></span><div class="template3__fallback"><span>Si no eres redirigido en unos segundos,</span>${renderWhatsAppButton(config, "template3", {
    autoStart: true
  })}</div></section></main>`;
}
function renderTemplate4({ config }) {
  const rawName = config.name || "tu asesor";
  const name = escapeHtml2(rawName);
  const chat = config.content?.template4;
  const profileImageUrl = chat?.profileImageUrl || "";
  const backgroundImageUrl = chat?.backgroundImageUrl || "";
  const backgroundStyle = backgroundImageUrl ? ` style="--template4-chat-background-image:url(&quot;${escapeHtml2(backgroundImageUrl)}&quot;);--template4-chat-background-size:cover;--template4-chat-background-position:center;--template4-chat-background-opacity:1;--template4-chat-background-overlay:linear-gradient(rgba(7,16,19,.42),rgba(7,16,19,.42))"` : "";
  const bubble1 = template4Text(
    chat?.bubble1Text,
    "Hola, soy {{name}}, enviame un mensaje y comenzamos ya mismo.",
    rawName
  );
  const bubble2Intro = template4Text(
    chat?.bubble2Intro,
    "Te acompa\xF1o en todo el proceso",
    rawName
  );
  const bubble2Items = chat?.bubble2Items?.filter((item) => item.trim().length > 0) || [
    "\u{1F4B8} Cargas y retiros las 24hs",
    "\u{1F464} Atencion personalizada",
    "\u{1F6E1}\uFE0F Respaldo y mas de 5 anos de experiencia"
  ];
  const bubble3 = template4Text(
    chat?.bubble3Text,
    "Arrancamos? Toca abajo y comenzamos",
    rawName
  );
  const ctaText = config.content?.ctaText?.trim() || "ABRIR WHATSAPP";
  const ctaColor = config.colors?.ctaText || "#FFFFFF";
  const ctaBackground = config.colors?.ctaBackground || "#25D366";
  const timeOne = formatTemplate4Time(-2);
  const timeTwo = formatTemplate4Time(-1);
  const timeThree = formatTemplate4Time();
  return `<main class="public-landing template4"><section class="template4__phone" aria-label="Chat en vivo"${backgroundStyle}><div class="template4__intro"><div class="template4__spinner">${renderTemplate4Avatar(profileImageUrl, true)}</div><div class="template4__intro-copy"><span>Abriendo sala</span><strong>Abriendo tu chat con ${name}</strong><p>Atencion abierta ahora</p></div></div><header class="template4__header"><div class="template4__avatar-wrap">${renderTemplate4Avatar(profileImageUrl)}<i class="template4__online-dot"></i></div><div class="template4__who"><b>${name} \xB7 Asesora</b><span>En linea \xB7 responde en ~40 seg</span></div><time class="template4__time" data-template4-current-time>${timeThree}<br><i>24/7</i></time></header><div class="template4__thread" data-public-landing-trigger><div class="template4__stack"><div class="template4__live-pill"><i></i><span><b data-template4-live-count>14</b> personas en chat ahora mismo</span></div><div class="template4__bubble template4__bubble--in template4__bubble--delay-1"><p>${bubble1}</p><span data-template4-message-time>${timeOne}</span></div><div class="template4__bubble template4__bubble--in template4__bubble--delay-2"><p>${bubble2Intro}</p><ul>${bubble2Items.map((item) => `<li>${template4Text(item, "", rawName)}</li>`).join("")}</ul><span data-template4-message-time>${timeTwo}</span></div><div class="template4__bubble template4__bubble--in template4__bubble--delay-3"><p>${bubble3}</p><span data-template4-message-time>${timeThree}</span></div></div></div><footer class="template4__footer"><button type="button" class="template4__cta" style="color:${escapeHtml2(ctaColor)};background:${escapeHtml2(ctaBackground)}" data-public-landing-cta data-public-landing-rest-label="${escapeHtml2(ctaText)}" data-public-landing-loading-label="Abriendo..." data-public-landing-disabled-label="Sin numero disponible" aria-label="${escapeHtml2(ctaText)}">${renderWhatsAppIcon("template4__cta-icon")}<span data-public-landing-cta-label>${escapeHtml2(ctaText)}</span></button></footer></section></main>`;
}
function renderTemplate5Configured({ config }) {
  const name = escapeHtml2(config.name || "asesor");
  const currentTime = formatTemplate4Time();
  const live = config.content?.template5;
  const titleLines = template5Lines(
    live?.titleText,
    "ESTA PASANDO\nAHORA MISMO.",
    3
  );
  const subtitle = template5Lines(
    live?.subtitleText,
    "Un asesor te abre la cuenta en 2 minutos por WhatsApp y te acompa\xF1a en todo el proceso...",
    2
  ).map(escapeHtml2).join("<br>");
  const profileImageUrl = live?.profileImageUrl?.trim() || "";
  const backgroundImageUrl = live?.backgroundImageUrl?.trim() || "";
  const backgroundStyle = backgroundImageUrl ? ` style="--template5-background-image:url(&quot;${escapeHtml2(backgroundImageUrl)}&quot;);--template5-background-opacity:0.72"` : "";
  return `<main class="public-landing template5"><section class="template5__phone" aria-label="Atencion en vivo"${backgroundStyle}><div class="template5__ambient" aria-hidden="true"></div><div class="template5__curtain"><span>EN VIVO</span><strong>Entrando...</strong></div><div class="template5__scroll"><div class="template5__topline"><div class="template5__live-badge"><span class="template5__live-dot"></span><strong>EN VIVO</strong><time data-template5-current-time>${currentTime}</time></div><span class="template5__viewers"><b data-template5-viewer-count>1.278</b> viendo</span></div><section class="template5__hero" data-public-landing-trigger><h1>${renderTemplate5Title(titleLines)}</h1><p>${subtitle}</p></section><section class="template5__advisor"><div class="template5__avatar-wrap">${renderTemplate5Avatar(profileImageUrl)}<i class="template5__advisor-dot"></i></div><div><strong>${name} \xB7 tu asesora designada</strong><span>En linea \xB7 responde en ~40 seg</span></div></section><div class="template5__progress" aria-hidden="true"><span></span></div><section class="template5__feed" aria-label="Actividad en vivo"><div><strong><span class="template5__feed-dot"></span> EN VIVO</strong></div><p data-template5-feed-row><span><b>Camilo A.</b><small data-template5-feed-time>hace 5 s</small></span><strong>$ 1.150.000</strong></p><p data-template5-feed-row><span><b>Sebastian G.</b><small data-template5-feed-time>hace 17 s</small></span><strong>$ 260.000</strong></p><p data-template5-feed-row><span><b>Laura P.</b><small data-template5-feed-time>hace 29 s</small></span><strong>$ 780.000</strong></p></section><section class="template5__activity" aria-label="Actividad de asesores"><article><span>Cuentas creadas</span><strong><b data-template5-created-count>1323</b></strong></article><article><span>Asesores disponibles</span><strong><b data-template5-advisor-count>6</b> en vivo</strong></article></section></div><footer class="template5__footer"><button type="button" class="template5__cta" data-public-landing-cta data-public-landing-rest-label="ENTRAR POR WHATSAPP" data-public-landing-loading-label="Abriendo..." data-public-landing-disabled-label="Sin numero disponible" aria-label="ENTRAR POR WHATSAPP">${renderWhatsAppIcon("template5__cta-icon")}<span data-public-landing-cta-label>ENTRAR POR WHATSAPP</span></button></footer></section></main>`;
}
function renderTemplate6({ config }) {
  const isTemplate8 = config.layout?.template === 8;
  const cover = { ...config.content?.template6, ...isTemplate8 ? { ...config.content?.template8, showWhatsAppLogo: false } : {} };
  const backgroundImageUrl = cover?.backgroundImageUrl?.trim() || "";
  const grid = cover?.grid === "2x1" || cover?.grid === "2x3" ? cover.grid : "2x2";
  const cardCount = isTemplate8 ? Math.min(6, Math.max(1, config.content?.template8?.cardCount || 4)) : grid === "2x1" ? 2 : grid === "2x3" ? 6 : 4;
  const title = template5Lines(cover?.headerText, "Eleg\xED tu opci\xF3n", 2);
  const footer = template5Lines(cover?.footerText, "Estamos para ayudarte", 2);
  const cards = Array.from({ length: cardCount }, (_, index) => {
    const card = cover?.cards?.[index];
    const label = String(card?.ctaText || config.content?.ctaText || "Abrir WhatsApp").trim();
    const image = String(card?.imageUrl || "").trim();
    const responsive = isTemplate8 ? template8Image(image) : null;
    const caption = String(card?.text || `Opci\xF3n ${index + 1}`).trim();
    return `<article class="template6__card"><div class="template6__image">${image ? `<img src="${escapeHtml2(image)}"${responsive ? attr("srcset", responsive.srcSet) + attr("sizes", responsive.srcSet ? responsive.sizes : "") : ""} alt="${escapeHtml2(caption)}" width="480" height="480" loading="${index < 2 ? "eager" : "lazy"}" decoding="async"${index === 0 && !backgroundImageUrl ? ' fetchpriority="high"' : ""}>` : `<span>Imagen ${index + 1}</span>`}</div><p class="template6__caption">${escapeHtml2(caption)}</p><button type="button" class="template6__cta" ${isTemplate8 ? `data-template8-card-index="${index + 1}" ` : "data-public-landing-cta"} data-template6-card-index="${index + 1}" data-public-landing-rest-label="${escapeHtml2(label)}" data-public-landing-loading-label="Abriendo..." data-public-landing-disabled-label="Sin n\xFAmero disponible" aria-label="${escapeHtml2(label)}"><span data-public-landing-cta-label>${escapeHtml2(label)}</span>${cover?.showWhatsAppLogo === false ? "" : renderWhatsAppIcon("template6__cta-icon")}</button></article>`;
  }).join("");
  const styles = styleAttr({
    ...isTemplate8 ? {
      "--template8-rows": Math.ceil(cardCount / 2),
      "--template8-extra-copy": `${Math.max(0, title.length - 1) * 28 + Math.max(0, footer.length - 1) * 18}px`
    } : {},
    "--template6-title": config.colors?.title || "#FFFFFF",
    "--template6-caption": config.colors?.subtitle || "#FFFFFF",
    "--template6-footer": config.colors?.badge || "#FFD700",
    "--template6-cta-text": config.colors?.ctaText || "#000000",
    "--template6-cta-background": config.colors?.ctaBackground || "#FFD700",
    "--template6-cta-glow": config.colors?.ctaGlow || "#FFD700",
    "--template6-cta-size": `${Math.min(22, Math.max(11, config.typography?.cta?.sizePx || 14))}px`,
    "--template6-cta-weight": config.typography?.cta?.weight || 700
  });
  const backgroundResponsive = isTemplate8 ? template8Image(backgroundImageUrl, true) : null;
  const background = backgroundImageUrl ? `<div class="template6__background" aria-hidden="true"><img src="${escapeHtml2(backgroundImageUrl)}"${backgroundResponsive ? attr("srcset", backgroundResponsive.srcSet) + attr("sizes", backgroundResponsive.srcSet ? backgroundResponsive.sizes : "") : ""} alt="" loading="eager" decoding="async" fetchpriority="high"></div>` : "";
  return `<main class="public-landing template6${isTemplate8 ? " template8" : ""}${backgroundImageUrl ? " has-background" : ""}"${styles}>${background}<div class="template6__shell"><header class="template6__header"><h1>${title.map((line) => `<span>${escapeHtml2(line)}</span>`).join("")}</h1></header><section class="template6__grid" aria-label="Opciones disponibles">${cards}</section><footer class="template6__footer">${footer.map((line) => `<span>${escapeHtml2(line)}</span>`).join("")}</footer></div></main>`;
}
function resourceWarmup(config) {
  if (config.layout?.template !== 8) return buildTemplate7ResourceWarmup(template7GatewayOrigin(config));
  return buildTemplate7ResourceWarmup("", void 0, true);
}
function renderTemplate8(params) {
  const entryConfig = {
    ...params.config,
    content: params.config.content ? { ...params.config.content, logoUrl: "" } : void 0,
    background: void 0
  };
  const entry = renderTemplate7({ ...params, config: entryConfig }).replace("</form>", '</form><p style="text-align:center;margin-top:16px"><a data-template8-login href="#" style="color:inherit;text-underline-offset:3px">Ya tengo cuenta \xB7 Ingresar</a></p>').replace('<h1 class="template7__title"', '<h1 data-template8-selected-page class="template7__title"');
  return `<section data-template8-grid>${renderTemplate6(params)}<p data-template8-status role="status" class="template8__status"></p></section><section data-template8-entry hidden><button type="button" data-template8-back class="template8__back">\u2190 Cambiar p\xE1gina</button>${entry}</section>`;
}
function renderTemplate(params) {
  if (params.config.layout?.template === 8) return renderTemplate8(params);
  if (params.config.layout?.template === 7) return renderTemplate7(params);
  if (params.config.layout?.template === 6) return renderTemplate6(params);
  if (params.config.layout?.template === 5) return renderTemplate5Configured(params);
  if (params.config.layout?.template === 4) return renderTemplate4(params);
  if (params.config.layout?.template === 3) return renderTemplate3(params);
  if (params.config.layout?.template === 2) return renderTemplate2(params);
  return renderTemplate1(params);
}
function renderClassicTemplate7InlineHtml(params, deviceIdScript) {
  const config = optimizeTemplate7Images(params.config);
  const pixelId = String(config.tracking?.pixelId || "").trim().replace(/\D+/g, "");
  const isTemplate8 = config.layout?.template === 8;
  const runtimeAsset = renderTemplate7RuntimeAsset(params.slug, config, deviceIdScript);
  const html = `${runtimeAsset.preload}${runtimeAsset.config}${isTemplate8 ? "" : renderScriptElement(AtrioPrewarmScript({ slug: params.slug, landingId: config.id || "", deviceIdScript }))}${buildPreloadLinks(config)}<style data-template7-critical>${isTemplate8 ? TEMPLATE8_CRITICAL_CSS : TEMPLATE7_CRITICAL_CSS}</style>${pixelScriptForTemplate(pixelId, params.slug, config.tracking?.phoneCountryCode || "54", 7)}${buildPixelNoscript(pixelId)}${renderTemplate({ ...params, config })}${renderPrivacyFooter({ ...config, layout: { ...config.layout, template: 0 } })}${runtimeAsset.script}${resourceWarmup(config)}`;
  if (isTemplate8) return html;
  const reentry = buildTemplate7ReentryScript(template7GatewayOrigin(config), `/${encodeURIComponent(params.slug)}`, config.tracking?.target_provider !== "multi_skin");
  return reentry ? reentry + guardTemplate7ReentryScripts(html) : html;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  renderClassicTemplate7InlineHtml,
  template7RuntimeAssetResponse
});
