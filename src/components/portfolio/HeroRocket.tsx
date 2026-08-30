import RocketIcon from "./RocketIcon";

/**
 * Rocket sitting at the end of the hero name, with a one-shot startup
 * fire-blast + smoke puff on mount, then a gentle idle hover.
 */
export const HeroRocket = ({ size = 34 }: { size?: number }) => {
  return (
    <span aria-hidden className="hero-rocket" style={{ width: size, height: size }}>
      <span className="hero-rocket__smoke" />
      <span className="hero-rocket__blast" />
      <span className="hero-rocket__ship">
        <RocketIcon size={size} idPrefix="hero-rc" />
      </span>
    </span>
  );
};

export default HeroRocket;
