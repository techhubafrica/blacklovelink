import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    icon: Star,
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and exploring the community.",
    features: [
      "Access to basic community features",
      "Limited event listings",
      "Standard support",
    ],
    cta: "Basic Plan",
    highlighted: false,
    color: "from-zinc-400 to-zinc-500",
  },
  {
    name: "Paid",
    icon: Zap,
    price: "$149.99",
    period: "per year",
    subtitle: "Or $49.99 quarterly",
    description: "Unlock premium features to enhance your matching experience.",
    features: [
      "Access to exclusive events",
      "Priority support",
      "Profile boosting for increased visibility",
      "Access to community forums",
    ],
    cta: "Upgrade to Paid",
    highlighted: true,
    color: "from-primary to-secondary",
  },
  {
    name: "Premium",
    icon: Crown,
    price: "$500",
    period: "per year",
    description: "The ultimate VIP experience for intentional daters.",
    features: [
      "All Paid benefits included",
      "VIP access to annual events",
      "Invitations to private parties",
      "Personalized support",
      "Featured profile placement",
    ],
    cta: "Go Premium",
    highlighted: false,
    color: "from-amber-400 to-amber-600",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="relative bg-background px-6 py-28 lg:py-36 overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <motion.h2
            className="text-4xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Invest In <span className="text-gradient-brand">Real Connection</span>
          </motion.h2>
          <motion.p
            className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the membership that aligns with your dating intentions. Start free and upgrade when you're ready for exclusive benefits.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative flex flex-col rounded-[2.5rem] p-8 sm:p-10 transition-all duration-300 ${
                  plan.highlighted 
                    ? "bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/20 scale-100 lg:scale-105 z-10" 
                    : "bg-transparent border border-border hover:border-primary/30"
                }`}
              >
                {/* Active glow inside highlighted card */}
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-[2.5rem] opacity-50" />
                )}

                <div className="relative z-10 flex-1 flex flex-col">
                  {plan.highlighted && (
                    <div className="absolute -top-14 left-0 right-0 flex justify-center">
                      <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} text-white shadow-lg mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground font-medium text-sm">/{plan.period}</span>
                  </div>
                  
                  {plan.subtitle && (
                    <p className="mt-1 text-sm font-semibold text-primary">{plan.subtitle}</p>
                  )}

                  <p className="mt-6 text-muted-foreground text-sm leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="my-8 h-px bg-border w-full" />

                  <ul className="flex flex-col gap-4 mb-10 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-foreground/80 leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/auth"
                    className={`mt-auto w-full py-4 px-6 rounded-2xl text-center font-bold text-sm tracking-wide transition-all ${
                      plan.highlighted
                        ? "gradient-brand text-white shadow-button hover:opacity-90 hover:scale-[1.02]"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
