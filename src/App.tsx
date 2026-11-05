import { FormEvent, useEffect, useState } from "react"

type FormStatus = "idle" | "loading" | "success" | "error"

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M14 7l5 5-5 5" />
  </svg>
)

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12 4 4L19 6" />
  </svg>
)

const Lock = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export default function App() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const animatedElements =
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 },
    )

    animatedElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("error")
      setMessage("Escribe un correo electrónico válido.")
      return
    }

    setStatus("loading")
    setMessage("")

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error")
      setMessage("La lista privada no está disponible por el momento.")
      return
    }

    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              to_email: normalizedEmail,
              subscriber_email: normalizedEmail,
              product_name: "Édition 01 — Voyage Chromatique",
              access_url: window.location.origin,
            },
          }),
        },
      )

      if (!response.ok) throw new Error("EmailJS request failed")

      setStatus("success")
      setMessage("Revisa tu bandeja de entrada para confirmar tu acceso.")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("No pudimos registrar tu correo. Inténtalo de nuevo.")
    }
  }

  return (
    <main>
      <nav className="nav-shell" aria-label="Navegación principal">
        <a
          className="wordmark"
          href="#inicio"
          aria-label="Louis Vuitton, inicio"
        >
          LOUIS <span>VUITTON</span>
        </a>
        <div className="nav-links">
          <a href="#edicion">La edición</a>
          <a href="#acceso">Acceso privado</a>
          <a className="nav-cta" href="#acceso">
            Unirme a la lista
          </a>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div className="color-orbits" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            Edición limitada · 01
          </div>
          <h1>
            Lo extraordinario
            <br />
            no <em>espera.</em>
          </h1>
          <p className="hero-lede">
            Una pieza de archivo reinventada para quienes coleccionan historias,
            no tendencias. Acceso exclusivo por orden de registro.
          </p>

          <form
            className="signup-form"
            id="acceso"
            onSubmit={handleSubmit}
            noValidate
          >
            {status === "success" ? (
              <div className="success-card" role="status">
                <span className="success-icon">
                  <Check />
                </span>
                <div>
                  <strong>Ya estás en la lista privada.</strong>
                  <p>{message}</p>
                </div>
              </div>
            ) : (
              <>
                <label htmlFor="email">Tu correo electrónico</label>
                <div className="input-row">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-describedby="form-message privacy-note"
                    disabled={status === "loading"}
                    required
                  />
                  <button type="submit" disabled={status === "loading"}>
                    <span>
                      {status === "loading"
                        ? "Reservando…"
                        : "Reservar mi lugar"}
                    </span>
                    {status !== "loading" && <ArrowRight />}
                  </button>
                </div>
                <p
                  className={
                    status === "error" ? "form-message error" : "form-message"
                  }
                  id="form-message"
                  aria-live="polite"
                >
                  {message}
                </p>
                <p className="privacy" id="privacy-note">
                  <Lock /> Sin spam. Solo acceso anticipado y beneficios de
                  colección.
                </p>
              </>
            )}
          </form>
        </div>

        <div
          className="visual-wrap"
          aria-label="Bolso Voyage Chromatique de edición limitada"
        >
          <img
            className="monogram-backdrop"
            src="/images/monogram-pattern.webp"
            alt=""
            aria-hidden="true"
          />
          <img
            className="denim-backdrop"
            src="/images/denim-monogram.webp"
            alt=""
            aria-hidden="true"
          />
          <img
            className="chain-backdrop"
            src="/images/chain-monogram.webp"
            alt=""
            aria-hidden="true"
          />
          <div className="edition-stamp">
            <span>PIEZA</span>
            <strong>01</strong>
            <span>DE 50</span>
          </div>
          <figure className="product-frame">
            <img
              src="/images/edition-01-bag.webp"
              alt="Bolso de viaje blanco con monograma multicolor y acabados de cuero natural"
            />
            <span className="product-shine" aria-hidden="true" />
          </figure>
          <div className="caption-card">
            <p>THE ARCHIVE SERIES</p>
            <div>
              <strong>Voyage Chromatique</strong>
              <span>Cuero natural · Monograma multicolor</span>
            </div>
          </div>
        </div>
      </section>

      <div
        className="monogram-ribbon reveal-section"
        aria-hidden="true"
        data-reveal
      >
        <div className="ribbon-pattern" />
        <div className="ribbon-copy">
          <span>Edición limitada</span>
          <i />
          <span>Acceso privado</span>
          <i />
          <span>50 piezas numeradas</span>
          <i />
          <span>Voyage Chromatique</span>
        </div>
      </div>

      <section
        className="kinetic-stage reveal-section"
        aria-label="Colección Color en movimiento"
        data-reveal
      >
        <div className="kinetic-copy">
          <p>THE ART OF TRAVEL · CAPSULE 01</p>
          <h2>
            Color en
            <br />
            <em>movimiento.</em>
          </h2>
          <span>
            Tres códigos visuales. Una pieza que no pasa desapercibida.
          </span>
        </div>

        <div className="pattern-deck" aria-hidden="true">
          <figure className="pattern-card pattern-card-denim">
            <img src="/images/denim-monogram.webp" alt="" />
            <figcaption>DENIM ARCHIVE</figcaption>
          </figure>
          <figure className="pattern-card pattern-card-chain">
            <img src="/images/chain-monogram.webp" alt="" />
            <figcaption>TRUNKS &amp; CHAINS</figcaption>
          </figure>
          <figure className="pattern-card pattern-card-color">
            <img src="/images/monogram-pattern.webp" alt="" />
            <figcaption>COLOR ICONS</figcaption>
          </figure>
        </div>

        <div className="kinetic-seal" aria-hidden="true">
          <div className="seal-ring">
            <span>LIMITED · PRIVATE · NUMBERED · </span>
          </div>
          <strong>LV</strong>
        </div>
      </section>

      <div className="type-marquee" aria-hidden="true">
        <div className="type-track">
          <span>VOYAGE CHROMATIQUE · COLOR IS THE SIGNATURE · </span>
          <span>VOYAGE CHROMATIQUE · COLOR IS THE SIGNATURE · </span>
        </div>
      </div>

      <section
        className="benefits"
        id="edicion"
        aria-label="Beneficios de la lista privada"
      >
        <article className="reveal-card" data-reveal>
          <span className="benefit-number">01</span>
          <div>
            <h2>Acceso anticipado</h2>
            <p>
              Tu lugar se respeta por orden de registro antes de la apertura
              pública.
            </p>
          </div>
        </article>
        <article className="reveal-card" data-reveal>
          <span className="benefit-number">02</span>
          <div>
            <h2>Ediciones numeradas</h2>
            <p>
              Cada lanzamiento es limitado, seleccionado y disponible por breve
              tiempo.
            </p>
          </div>
        </article>
        <article className="reveal-card" data-reveal>
          <span className="benefit-number">03</span>
          <div>
            <h2>Beneficios privados</h2>
            <p>
              Recibe nuevos descuentos y condiciones exclusivas para miembros.
            </p>
          </div>
        </article>
      </section>

      <footer className="reveal-section" data-reveal>
        <a className="wordmark footer-mark" href="#inicio">
          LOUIS <span>VUITTON</span>
        </a>
        <p>El viaje es color. La edición, irrepetible.</p>
        <p>© {new Date().getFullYear()} Louis Vuitton</p>
      </footer>
    </main>
  )
}
