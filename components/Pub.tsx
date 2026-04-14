const Pub = () => {
  return (
    <div className="group relative my-8 lg:my-12 flex h-48 lg:h-80 w-full max-w-6xl mx-auto items-center justify-center overflow-hidden rounded-2xl bg-primary shadow-xl transition-all duration-500 hover:shadow-primary/20">
      {/* Decorative background elements */}
      <div className="absolute -top-12 lg:-top-24 -right-12 lg:-right-24 h-32 lg:h-64 w-32 lg:w-64 rounded-full bg-white/10 blur-2xl lg:blur-3xl transition-all duration-700 group-hover:scale-150" />
      <div className="absolute -bottom-12 lg:-bottom-24 -left-12 lg:-left-24 h-32 lg:h-64 w-32 lg:w-64 rounded-full bg-black/10 blur-2xl lg:blur-3xl transition-all duration-700 group-hover:scale-150" />

      <div className="relative z-10 flex flex-col items-center gap-2 lg:gap-4 text-center text-white p-4">
        <span className="font-poppins text-4xl lg:text-6xl font-bold tracking-tighter transition-transform duration-500 group-hover:scale-110">
          Lokko
        </span>
        <div className="h-0.5 lg:h-1 w-8 lg:w-12 rounded-full bg-white/50" />
        <p className="text-xs lg:text-xl font-light tracking-widest uppercase opacity-80">
          Espace Publicitaire
        </p>
      </div>

      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
};

export default Pub;
