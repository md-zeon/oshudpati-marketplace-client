import { NavbarSearch } from "./NavbarSearch";

const NavbarContent = () => {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur bg-white/75 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* 1. Logo */}
        <div className="flex items-center gap-1 cursor-pointer shrink-0">
          <span className="text-4xl font-black tracking-tight">Oshudpati</span>
        </div>

        {/* 2. Search Area  */}
        <div className="flex-1 max-w-xl mx-2 md:mx-8">
          <NavbarSearch />
        </div>

        {/* 3. Navigation */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Track Your Order */}

          {/* Account */}

          {/* Cart */}
        </div>
      </div>
    </nav>
  );
};

export default NavbarContent;
