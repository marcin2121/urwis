"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = React.useState<string | null>(null);
  
  return (
    <div className={`fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 ${className}`}>
      <div className="relative rounded-full border border-black/.1 dark:border-white/[0.2] bg-white dark:bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-8 py-6">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative w-8 h-8"
            >
              <Image 
                src="/logo.png" 
                alt="Sklep Urwis" 
                fill 
                className="object-contain"
              />
            </motion.div>
            <span className="font-bold text-sm group-hover:text-red-600 transition-colors">
              Sklep Urwis
            </span>
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-4">
            <MenuItem setActive={setActive} active={active} item="Strona główna" href="/">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/">Powrót do strony głównej</HoveredLink>
                <HoveredLink href="#poznaj-urwisa">Poznaj Urwisa</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Oferta" href="#oferta">
              <div className="text-sm grid grid-cols-2 gap-10 p-4">
                <ProductItem
                  title="Gry Planszowe"
                  href="#oferta"
                  src="/categories/games.jpg"
                  description="200+ tytułów dla całej rodziny"
                />
                <ProductItem
                  title="Zabawki"
                  href="#oferta"
                  src="/categories/toys.jpg"
                  description="Dla każdego wieku"
                />
                <ProductItem
                  title="Artykuły Szkolne"
                  href="#oferta"
                  src="/categories/school.jpg"
                  description="Wszystko do szkoły"
                />
                <ProductItem
                  title="Balony"
                  href="#oferta"
                  src="/categories/balloons.jpg"
                  description="Na każdą okazję"
                />
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="O nas" href="#o-nas">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="#o-nas">Historia sklepu</HoveredLink>
                <HoveredLink href="#poznaj-urwisa">Poznaj Urwisa</HoveredLink>
                <HoveredLink href="#opinie">Opinie klientów</HoveredLink>
              </div>
            </MenuItem>

            <MenuItem setActive={setActive} active={active} item="Kontakt" href="#kontakt">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="#kontakt">Formularz kontaktowy</HoveredLink>
                <HoveredLink href="tel:+48123456789">📞 Zadzwoń do nas</HoveredLink>
                <HoveredLink href="#kontakt">📍 Jak dojechać</HoveredLink>
              </div>
            </MenuItem>
          </div>

          {/* CTA Button */}
          <motion.a
            href="tel:+48123456789"
            className="hidden md:block px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Zadzwoń 📞
          </motion.a>

          {/* Mobile Menu Button */}
          <MobileMenu />
        </nav>
      </div>
    </div>
  );
};

const MenuItem = ({
  setActive,
  active,
  item,
  children,
  href,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <Link
        href={href || "#"}
        className="cursor-pointer text-black hover:text-red-600 dark:text-white text-sm font-medium transition-colors"
      >
        {item}
      </Link>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const HoveredLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return (
    <Link
      href={href}
      className="text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-500 transition-colors"
    >
      {children}
    </Link>
  );
};

const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2 group">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl group-hover:scale-105 transition-transform"
      />
      <div>
        <h4 className="text-base font-bold mb-1 text-black dark:text-white group-hover:text-red-600 transition-colors">
          {title}
        </h4>
        <p className="text-neutral-700 text-xs dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative w-6 h-6 flex flex-col justify-center items-center"
        aria-label="Menu"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="w-5 h-0.5 bg-black dark:bg-white rounded-full"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="w-5 h-0.5 bg-black dark:bg-white rounded-full mt-1"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="w-5 h-0.5 bg-black dark:bg-white rounded-full mt-1"
        />
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black rounded-2xl border border-black/[0.2] dark:border-white/[0.2] shadow-xl p-4 md:hidden"
        >
          <div className="flex flex-col space-y-3">
            <Link href="/" className="text-sm font-medium hover:text-red-600 transition-colors">
              Strona główna
            </Link>
            <Link href="#oferta" className="text-sm font-medium hover:text-red-600 transition-colors">
              Oferta
            </Link>
            <Link href="#o-nas" className="text-sm font-medium hover:text-red-600 transition-colors">
              O nas
            </Link>
            <Link href="#kontakt" className="text-sm font-medium hover:text-red-600 transition-colors">
              Kontakt
            </Link>
            <a
              href="tel:+48123456789"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold text-center"
            >
              Zadzwoń 📞
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
