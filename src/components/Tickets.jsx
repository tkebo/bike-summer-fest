import { memo } from "react";
import { motion } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import AdminFrame from "./AdminFrame";

const Tickets = () => {
  const { t, lang, setFormData, cmsData } = useCMS();
  const configuredPackages = cmsData.config.ticketPackages
    ?.filter((ticket) => ticket.active !== false && ticket.status !== "hidden")
    .sort((left, right) => left.order - right.order);
  const tickets = configuredPackages?.length
    ? configuredPackages.map((ticket) => ({
      ...ticket,
      ...ticket[lang],
      fromConfig: true,
    }))
    : t.ticketCards.map((ticket, index) => ({
      ...ticket,
      id: `legacy-${index}`,
      status: "available",
      ctaText: t.ticketButton,
      ctaLink: "#contact",
      highlighted: index === 1,
      fromConfig: false,
    }));
  return (
<>
        {/* TICKETS SECTION */}
        <section id="tickets" className="px-6 md:px-12 py-28 bg-[#050814]">
          <div className="max-w-7xl mx-auto">
            <Editable path="ticketsLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
            <Editable path="ticketsTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase mb-12" />

            <div className="grid lg:grid-cols-3 gap-6">
              {tickets.map((card, index) => (
                <AdminFrame key={index} frameKey={`ticketCard${index}`} label={`Ticket Card ${index + 1}`}>
                <motion.div key={index} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={`relative border transition duration-300 hover:-translate-y-2 global-box ${card.highlighted ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/10"}`}>
                  {card.highlighted && <div className="absolute -top-4 left-8 rounded-full bg-cyan-300 px-5 py-2 text-xs font-black uppercase tracking-widest text-black">Popular</div>}
                  {card.status === "coming_soon" && <div className="absolute -top-4 right-8 rounded-full bg-orange-500 px-5 py-2 text-xs font-black uppercase tracking-widest text-black">Coming Soon</div>}

                  <div className="flex items-start justify-between gap-4">
                    {card.fromConfig ? <h3 className="text-3xl font-black uppercase">{card.name}</h3> : <Editable path={`ticketCards.${index}.name`} langContext={lang} as="h3" className="text-3xl font-black uppercase" />}
                    <span className="rounded-2xl bg-orange-500/15 border border-orange-400/30 px-4 py-2 text-orange-300 font-black inline-block">{card.price}{card.currency ? ` ${card.currency}` : ""}</span>
                  </div>

                  {card.fromConfig ? <p className="text-white/62 mt-5 leading-relaxed inline-block">{card.desc}</p> : <Editable path={`ticketCards.${index}.desc`} langContext={lang} multiline as="p" className="text-white/62 mt-5 leading-relaxed inline-block" />}

                  <ul className="mt-7 space-y-3">
                    {card.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 text-white/75">
                        <span className="text-cyan-300">✓</span>
                        {card.fromConfig ? <span>{feature}</span> : <Editable path={`ticketCards.${index}.features.${fIndex}`} langContext={lang} as="span" />}
                      </li>
                    ))}
                  </ul>

                  {card.status === "sold_out" ? (
                    <button disabled className="mt-8 inline-flex w-full justify-center rounded-2xl bg-white/10 px-8 py-4 font-black text-white/45">Sold Out</button>
                  ) : card.status === "available" ? (
                    <a href={card.ctaLink} onClick={() => setFormData(c => ({ ...c, type: "ticket", message: card.name }))} className={`mt-8 inline-flex w-full justify-center rounded-2xl px-8 py-4 font-black transition ${card.highlighted ? "bg-cyan-300 text-black hover:scale-105 shadow-[0_0_40px_rgba(0,217,255,.35)]" : "bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_35px_rgba(255,122,24,.28)]"}`}>
                      {card.ctaText}
                    </a>
                  ) : (
                    <div className="mt-8 inline-flex w-full justify-center rounded-2xl bg-white/10 px-8 py-4 font-black text-white/45">Coming Soon</div>
                  )}
                </motion.div>
                </AdminFrame>
              ))}
            </div>
          </div>
        </section>
</>
  );
};

export default memo(Tickets);
