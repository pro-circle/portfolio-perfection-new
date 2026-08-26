import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Github, Linkedin, Phone, Send, MessageCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import StreamText from "./StreamText";

import { toast as sonnerToast } from "sonner";

const COMMENT_MSG = "The website is clean, easy to navigate, and visually appealing. Information is well organized, making it simple to find what I need. Overall, it provides a smooth and user-friendly experience.";
const CALL_MSG = "I'm reaching out to discuss a potential project collaboration and explore opportunities to work together. Looking forward to connect and work more.";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [helperOpen, setHelperOpen] = useState(true);
  const helperRef = useRef<HTMLDivElement>(null);
  const helperInView = useInView(helperRef, { once: true, amount: 0.01 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive", className: "bg-red-600 text-white border-red-700" });
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, reply_to: form.email, message: form.message },
        EMAILJS_PUBLIC_KEY
      );
      sonnerToast.success("Mail sent", {
        className: "!bg-green-600 !text-white !border-green-700",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({ title: "Failed to send message", description: "Please try again later.", variant: "destructive", className: "bg-red-600 text-white border-red-700" });
    } finally {
      setSending(false);
    }
  };

  const whatsappNumber = "911234567890";
  const whatsappMessage = encodeURIComponent("Hello Man! I'm reaching you regarding your portfolio. I'd like to discuss a potential opportunity.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const { ref, phase } = useSectionGenerating<HTMLElement>({ sectionId: "contact" });
  return (
    <section id="contact" ref={ref} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <SectionLabel label="Contact" phase={phase} />
          </div>
          <div className="stream-reveal" data-ready={phase === "ready"}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6"><span data-ai-anchor="contact-title">Let's work together</span></h2>
            <StreamText
              as="p"
              start={phase === "ready"}
              startDelayMs={150}
              className="text-muted-foreground leading-relaxed mb-8 max-w-lg block"
              text="I'm always interested in hearing about new projects and opportunities."
            />

            <div className="relative mb-6">
              <div className="flex items-center gap-4">
                <a href="mailto:vikram14markiv@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={16} className="text-accent" /> mymail@mail.com
                </a>
                <a href="tel:+911234567890" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone size={16} className="text-accent" /> +91 12345 67890
                </a>
              </div>

              <motion.div
                ref={helperRef}
                onViewportEnter={() => {}}
                viewport={{ once: true, amount: 0.05 }}
                className="absolute right-0 -top-2 -translate-y-1/2"
              >
                <TooltipProvider delayDuration={150}>
                  <AnimatePresence>
                    {helperOpen && (
                      <motion.div
                        key="card"
                        initial={{ x: "120%", opacity: 0 }}
                        animate={helperInView ? { x: 0, opacity: 1 } : undefined}
                        exit={{ x: "120%", opacity: 0, transition: { type: "spring", stiffness: 120, damping: 18 } }}
                        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 2 }}
                        className="relative w-[min(92vw,348px)] sm:w-[328px] md:w-[348px] rounded-md border border-white/60 bg-[hsl(210_70%_72%)] dark:bg-[hsl(210_55%_55%)] text-foreground p-3 shadow-md"
                      >
                        <button
                          type="button"
                          onClick={() => setHelperOpen(false)}
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/25 text-white/60 flex items-center justify-center hover:bg-white/45 hover:text-white hover:scale-110 transition-all duration-200"
                          aria-label="Close helper"
                        >
                          <X size={12} />
                        </button>
                        <p className="text-sm font-medium text-white mb-2">May I help you?😊 What's in your message?</p>
                        <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2 w-full">
                          {[
                            { label: "Comment", msg: COMMENT_MSG, tip: "Populates a basic comment in the message bar", focus: false },
                            { label: "Work/Call", msg: CALL_MSG, tip: "Populates a basic call-for intent in the message bar", focus: false },
                            { label: "Other", msg: "", tip: "Type your own message", focus: true },
                          ].map((b) => (
                            <Tooltip key={b.label}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setForm((f) => ({ ...f, message: b.msg }));
                                    if (b.focus) {
                                      const el = document.getElementById("message") as HTMLTextAreaElement | null;
                                      el?.focus();
                                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                    }
                                  }}
                                  className="flex-1 min-w-0 text-xs sm:text-sm whitespace-nowrap px-3 py-1.5 rounded-[6px] bg-white/90 hover:bg-accent hover:border hover:border-white hover:text-black hover:shadow-md hover:scale-[1.02] text-[hsl(210_55%_30%)] font-medium transition-all duration-300 text-center"
                                >
                                  {b.label}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">{b.tip}</TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TooltipProvider>
              </motion.div>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="name" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} className="bg-secondary/50 border-border" />
                <Input id="email" type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} className="bg-secondary/50 border-border" />
              </div>
              <Textarea id="message" placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} rows={5} className="bg-secondary/50 border-border resize-none" />
              <Button variant="hero" size="lg" type="submit" disabled={sending}>
                <Send size={16} />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <TooltipProvider delayDuration={200}>
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { icon: Github, label: "GitHub", href: "https://github.com/vik77-git", tooltip: "You'll be redirected to Vikram's Github" },
                  { icon: Linkedin, label: "LinkedIn", href: "http://linkedin.com/in/vikram-udhayakumar23", tooltip: "You'll be redirected to Vikram's LinkedIn" },
                  { icon: MessageCircle, label: "WhatsApp", href: whatsappLink, tooltip: "You'll be redirected to Vikram's WhatsApp chat" },
                ].map(({ icon: Icon, label, href, tooltip }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Icon size={16} /> {label}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">{tooltip}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
