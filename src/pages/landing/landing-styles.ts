export const pressingWaterStyles = `
  :root {
    --pressing-blue: #0284c7;
    --pressing-blue-light: #f0f9ff;
    --pressing-blue-dark: #075985;
    --pressing-blue-deep: #0c4a6e;
    --pressing-mint: #10b981;
    --pressing-white: #ffffff;
  }

  @keyframes floatSoft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }

  @keyframes waterShine {
    0% { transform: translateX(-130%) rotate(18deg); opacity: 0; }
    35% { opacity: 0.75; }
    100% { transform: translateX(230%) rotate(18deg); opacity: 0; }
  }

  @keyframes bubbleRise {
    0% { transform: translateY(0) scale(0.82); opacity: 0.25; }
    50% { opacity: 0.85; }
    100% { transform: translateY(-24px) scale(1.12); opacity: 0.12; }
  }

  @keyframes waveMove {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .pressing-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at 14% 8%, rgba(14, 165, 233, 0.16), transparent 28%),
      radial-gradient(circle at 88% 14%, rgba(16, 185, 129, 0.10), transparent 30%),
      linear-gradient(180deg, var(--pressing-white), var(--pressing-blue-light));
    color: var(--pressing-blue-deep);
  }

  .water-section {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 34%),
      radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.12), transparent 32%),
      linear-gradient(180deg, var(--pressing-white), var(--pressing-blue-light));
  }

  .water-section::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(circle, rgba(2, 132, 199, 0.16) 1.5px, transparent 1.5px),
      radial-gradient(circle, rgba(255, 255, 255, 0.85) 1px, transparent 1px);
    background-size: 42px 42px, 68px 68px;
    opacity: 0.55;
  }

  .water-section::after {
    content: "";
    position: absolute;
    left: -50%;
    bottom: -130px;
    width: 200%;
    height: 230px;
    pointer-events: none;
    background:
      radial-gradient(60% 100% at 50% 0%, rgba(255,255,255,0.95), transparent 66%),
      linear-gradient(90deg, rgba(14,165,233,0.10), rgba(255,255,255,0.72), rgba(16,185,129,0.10));
    border-radius: 50% 50% 0 0;
    animation: waveMove 18s linear infinite;
    opacity: 0.82;
  }

  .water-hero {
    min-height: calc(100vh - 64px);
    display: flex;
    align-items: center;
  }

  .water-title {
    color: var(--pressing-blue-deep);
    letter-spacing: -0.025em;
  }

  .water-title span {
    color: var(--pressing-blue);
    text-shadow: 0 18px 40px rgba(2, 132, 199, 0.18);
  }

  .water-subtitle { color: rgba(12, 74, 110, 0.74); }
  .water-muted { color: rgba(12, 74, 110, 0.64); }

  .water-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: fit-content;
    border-radius: 999px;
    border: 1px solid rgba(2, 132, 199, 0.18);
    background: rgba(255, 255, 255, 0.78);
    color: var(--pressing-blue-dark);
    box-shadow: 0 10px 30px rgba(2, 132, 199, 0.08);
    backdrop-filter: blur(14px);
  }

  .water-badge-dot {
    position: relative;
    height: 0.55rem;
    width: 0.55rem;
    border-radius: 999px;
    background: var(--pressing-blue);
  }

  .water-badge-dot::after {
    content: "";
    position: absolute;
    inset: -5px;
    border-radius: inherit;
    border: 1px solid rgba(2, 132, 199, 0.25);
    animation: bubbleRise 2.4s ease-in-out infinite;
  }

  .water-card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    border: 1px solid rgba(2, 132, 199, 0.18) !important;
    background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(240,249,255,0.92)) !important;
    box-shadow: 0 18px 45px rgba(2, 132, 199, 0.10), inset 0 1px 0 rgba(255,255,255,0.95);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
  }

  .water-card::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 18% 20%, rgba(14,165,233,0.14), transparent 22%),
      radial-gradient(circle at 90% 15%, rgba(255,255,255,0.9), transparent 24%),
      radial-gradient(circle at 50% 100%, rgba(16,185,129,0.09), transparent 34%);
    opacity: 0.95;
  }

  .water-card::after {
    content: "";
    position: absolute;
    top: -85%;
    left: -70%;
    width: 45%;
    height: 240%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent);
    transform: rotate(18deg);
    opacity: 0;
  }

  .water-card:hover {
    transform: translateY(-8px);
    border-color: rgba(2,132,199,0.42) !important;
    box-shadow: 0 28px 60px rgba(2,132,199,0.18), inset 0 1px 0 rgba(255,255,255,1);
  }

  .water-card:hover::after { animation: waterShine 0.95s ease forwards; }

  .water-icon,
  .water-button {
    background:
      radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 30%),
      linear-gradient(180deg, #38bdf8, #0284c7);
    color: white;
  }

  .water-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    box-shadow: 0 14px 26px rgba(2,132,199,0.22), inset 0 1px 0 rgba(255,255,255,0.55);
  }

  .water-icon-soft {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    border: 1px solid rgba(2,132,199,0.14);
    background: rgba(255,255,255,0.76);
    color: var(--pressing-blue);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
  }

  .water-button,
  .water-button-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    font-weight: 800;
    transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
  }

  .water-button { box-shadow: 0 18px 34px rgba(2,132,199,0.26); }
  .water-button:hover { transform: translateY(-2px); box-shadow: 0 24px 42px rgba(2,132,199,0.32); filter: saturate(1.08); }

  .water-button-outline {
    border: 1px solid rgba(2,132,199,0.20);
    background: rgba(255,255,255,0.84);
    color: var(--pressing-blue-deep);
    box-shadow: 0 12px 28px rgba(2,132,199,0.08);
    backdrop-filter: blur(14px);
  }

  .water-button-outline:hover { transform: translateY(-2px); border-color: rgba(2,132,199,0.42); background: white; }

  .water-panel {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(2,132,199,0.16);
    background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(240,249,255,0.88));
    box-shadow: 0 24px 65px rgba(2,132,199,0.16), inset 0 1px 0 rgba(255,255,255,0.95);
  }

  .water-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(14,165,233,0.13), transparent 26%),
      radial-gradient(circle at 84% 18%, rgba(255,255,255,0.92), transparent 24%);
    pointer-events: none;
  }

  .water-float { animation: floatSoft 6s ease-in-out infinite; }
  .water-kpi-value { color: var(--pressing-blue-deep); }
  .nav-dot { width: 10px; height: 10px; border-radius: 999px; background: rgba(2,132,199,0.24); }
`;
