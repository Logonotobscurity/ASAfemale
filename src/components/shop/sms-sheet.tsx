import { useEffect, useRef, useState } from "react";
import { IconCheck, IconClose, IconHeart } from "@/components/shop/icons";
import { track } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

function digitsOf(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhone(raw: string) {
  const d = digitsOf(raw).slice(0, 14);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10), d.slice(10)].filter(Boolean).join(" ");
}

export function SmsSheet() {
  const open = useShop((s) => s.sheetOpen);
  const closeSheet = useShop((s) => s.closeSheet);
  const showToast = useShop((s) => s.showToast);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cc, setCc] = useState("+234");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpKey, setOtpKey] = useState(0);
  const [cd, setCd] = useState(30);
  const [resendOn, setResendOn] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const cdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeY = useRef<number | null>(null);

  const digits = digitsOf(phone);
  const nextOk = digits.length >= 10 && digits.length <= 14 && consent;
  const otpOk = otp.every((x) => x.length === 1);

  function clearCd() {
    if (cdTimer.current) {
      clearInterval(cdTimer.current);
      cdTimer.current = null;
    }
  }

  function startCd() {
    clearCd();
    setCd(30);
    setResendOn(false);
    let t = 30;
    cdTimer.current = setInterval(() => {
      t -= 1;
      setCd(t > 0 ? t : 0);
      if (t <= 0) {
        clearCd();
        setResendOn(true);
      }
    }, 1000);
  }

  function resetForm() {
    setStep(1);
    setCc("+234");
    setPhone("");
    setConsent(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpKey((k) => k + 1);
    setResendOn(false);
    setCd(30);
    clearCd();
  }

  useEffect(() => {
    if (!open) return;
    resetForm();
    const t = setTimeout(() => phoneRef.current?.focus(), 360);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => {
    clearCd();
    if (successTimer.current) clearTimeout(successTimer.current);
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (swipeY.current === null) return;
      if (e.clientY - swipeY.current > 70) {
        closeSheet("swipe", true);
        swipeY.current = null;
      }
    }
    function onUp() {
      swipeY.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [closeSheet]);

  function goOtp() {
    setStep(2);
    setOtp(["", "", "", "", "", ""]);
    setOtpKey((k) => k + 1);
    startCd();
    setTimeout(() => otpRefs.current[0]?.focus(), 350);
    track("sms_submit", { cc });
  }

  function onOtp(i: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function onOtpKey(i: number, key: string) {
    if (key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  function verify() {
    setStep(3);
    try {
      localStorage.setItem("asa_sub", "1");
    } catch {
      /* ignore */
    }
    track("sms_otp_ok", {});
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => {
      closeSheet("auto_success", false);
      showToast("YOU'RE IN — FIRST DROP TEXT FRIDAY");
    }, 2400);
  }

  function resend() {
    setOtp(["", "", "", "", "", ""]);
    setOtpKey((k) => k + 1);
    startCd();
    showToast("CODE RE-SENT");
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  }

  return (
    <div className={"sheetwrap" + (open ? " open" : "")}>
      <div className="sheetback" onClick={() => closeSheet("backdrop", true)} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Receive website updates by text">
        <div
          className="handle"
          aria-hidden="true"
          onPointerDown={(e) => {
            swipeY.current = e.clientY;
          }}
        />
        <button
          type="button"
          className="x sheetx"
          aria-label="Close"
          onClick={() => closeSheet("x", true)}
        >
          <IconClose />
        </button>

        <div className="step" hidden={step !== 1}>
          <h3 className="m">RECEIVE WEBSITE UPDATES</h3>
          <p className="sub">New drops via text, first.</p>
          <div className="prow">
            <select className="cc" aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)}>
              <option>+234</option>
              <option>+233</option>
              <option>+44</option>
              <option>+1</option>
            </select>
            <input
              ref={phoneRef}
              className="ph"
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="PHONE NUMBER"
              aria-label="Phone number"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
            />
          </div>
          <label className="consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I AGREE TO RECEIVE SMS UPDATES FROM ÀṢÀ. MSG FREQ VARIES. MSG & DATA RATES MAY
              APPLY. TEXT STOP TO OPT OUT. CONSENT NOT REQUIRED FOR PURCHASE.
            </span>
          </label>
          <button type="button" className="cta m" disabled={!nextOk} onClick={goOtp}>
            NEXT
          </button>
          <p className="m fn">NO SPAM. 2 TEXTS / MONTH.</p>
        </div>

        <div className="step" hidden={step !== 2}>
          <h3 className="m">ENTER CODE WE TEXTED YOU</h3>
          <p className="sub small">
            SENT TO {cc} {phone}
          </p>
          <div className="otps" key={otpKey}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  otpRefs.current[i] = el;
                }}
                inputMode="numeric"
                maxLength={1}
                aria-label={`Code digit ${i + 1}`}
                value={d}
                onChange={(e) => onOtp(i, e.target.value)}
                onKeyDown={(e) => onOtpKey(i, e.key)}
              />
            ))}
          </div>
          <button type="button" className="cta m" disabled={!otpOk} onClick={verify}>
            VERIFY
          </button>
          <div className="otprow">
            <button type="button" className="m link" disabled={!resendOn} onClick={resend}>
              RESEND CODE
            </button>
            <span className="m cd">{cd > 0 ? cd : "—"}</span>
          </div>
          <button type="button" className="m link backlink" onClick={() => setStep(1)}>
            ← EDIT NUMBER
          </button>
        </div>

        <div className="step" hidden={step !== 3}>
          <div className="okwrap">
            <IconCheck />
            <p className="sub" style={{ marginBottom: 4 }}>
              YOU'RE IN. FIRST DROP TEXT LANDS FRIDAY.
            </p>
            <p className="m fn">OPT-IN CONFIRMED VIA SMS</p>
            <div className="pulse">
              <IconHeart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
