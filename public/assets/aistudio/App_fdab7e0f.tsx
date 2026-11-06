import { useEffect, useState } from "react"

type IconName = "menu" | "close" | "search" | "pin" | "user" | "bag" | "arrow" | "sparkle"

function Icon({ name, size = 22 }: { name: IconName size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21c.7-4.2 3.2-6 7.5-6s6.8 1.8 7.5 6" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    sparkle: (
      <>
        <path d="M12 2c.7 5 2 6.3 7 7-5 .7-6.3 2-7 7-.7-5-2-6.3-7-7 5-.7 6.3-2 7-7Z" />
        <path d="M19 16c.3 2.2.8 2.7 3 3-2.2.3-2.7.8-3 3-.3-2.2-.8-2.7-3-3 2.2-.3 2.7-.8 3-3Z" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {paths[name]}
    </svg>
  )
}

const menuItems = [
  { label: "New in", accent: true },
  { label: "Colección Aura" },
  { label: "Denim" },
  { label: "Remeras & tops" },
  { label: "Abrigos" },
  { label: "Calzado" },
  { label: "Accesorios" },
  { label: "Edición limitada" },
  { label: "Sale", accent: true },
]

const promos = [
  "6 cuotas sin interés",
  "Envío gratis desde $85.000",
  "20% off transferencia",
  "Cambios gratis",
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bagCount, setBagCount] = useState(0)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const shopNow = () => {
    setBagCount((count) => count + 1)
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#1d2b29] text-white">
      <div className="promo-bar" aria-label="Beneficios de compra">
        <div className="promo-track">
          {[...promos, ...promos].map((promo, index) => (
            <span key={`${promo}-${index}`}>{promo}</span>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />

        <header className="site-header">
          <button
            className="icon-button menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={27} />
          </button>

          <a className="brand" href="#" aria-label="Nébula, inicio">
            NÉBULA
            <span>Buenos Aires</span>
          </a>

          <nav className="header-actions" aria-label="Acciones">
            <button
              className="icon-button"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
            >
              <Icon name="search" size={25} />
            </button>
            <button className="icon-button hide-mobile" aria-label="Locales">
              <Icon name="pin" size={25} />
            </button>
            <button className="icon-button hide-mobile" aria-label="Mi cuenta">
              <Icon name="user" size={25} />
            </button>
            <button
              className="icon-button bag-button"
              aria-label={`Bolsa de compras, ${bagCount} productos`}
            >
              <Icon name="bag" size={24} />
              <span>{bagCount}</span>
            </button>
          </nav>
        </header>

        <aside
          className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}
          aria-label="Menú principal"
        >
          <div className="sidebar-inner">
            <p className="sidebar-kicker">Explorá la temporada</p>
            <nav>
              {menuItems.map((item, index) => (
                <a
                  href={`#${item.label.toLowerCase().replaceAll(" ", "-")}`}
                  key={item.label}
                >
                  <span className={item.accent ? "accent" : ""}>
                    {item.label}
                  </span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </a>
              ))}
            </nav>
            <div className="sidebar-footer">
              <a href="#ayuda">Ayuda</a>
              <a href="#seguimiento">Seguimiento</a>
              <span>AR / ES</span>
            </div>
          </div>
        </aside>

        <div className={`hero-content ${menuOpen ? "menu-offset" : ""}`}>
          <div className="collection-label">
            <Icon name="sparkle" size={17} />
            <span>Colección Invierno 2025</span>
          </div>
          <h1>
            Vestí tu
            <br />
            <em>propia órbita</em>
          </h1>
          <p>
            Capas suaves, texturas intensas y siluetas creadas para moverte a tu
            manera.
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={shopNow}>
              Comprar el look
              <Icon name="arrow" size={18} />
            </button>
            <button className="text-cta" onClick={() => setMenuOpen(true)}>
              Explorar categorías
            </button>
          </div>
        </div>

        <div className="edition-mark" aria-hidden="true">
          <span>01</span>
          <i />
          <span>04</span>
        </div>

        <div className="scroll-note">
          <span>Deslizá para descubrir</span>
          <i />
        </div>
      </section>

      {searchOpen && (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar productos"
        >
          <button
            className="search-close"
            onClick={() => setSearchOpen(false)}
            aria-label="Cerrar búsqueda"
          >
            <Icon name="close" size={30} />
          </button>
          <div>
            <p>¿Qué estás buscando?</p>
            <label>
              <span className="sr-only">Buscar productos</span>
              <input
                autoFocus
                type="search"
                placeholder="Escribí para buscar..."
              />
              <Icon name="search" size={28} />
            </label>
            <div className="search-suggestions">
              <span>Popular:</span>
              <button>Camperas</button>
              <button>Denim</button>
              <button>Botas</button>
            </div>
          </div>
        </div>
      )}

      <div className="toast" data-visible={bagCount > 0}>
        Look agregado a tu bolsa
      </div>
    </main>
  )
}
