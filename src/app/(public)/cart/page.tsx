import FullCart from "@/app/(public)/cart/_components/FullCart";
import { CartService } from "@/services/cart.service";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

const CartPage = async () => {
  const [cart, session] = await Promise.all([
    CartService.getCartItems().catch(() => ({ success: false, data: [] })),
    userService.getSession().catch(() => ({ success: false, data: null })),
  ]);

  const items = cart?.success && Array.isArray(cart?.data) ? cart.data : [];

  const isLoggedIn = Boolean(session?.data?.user || session?.success);

  return <FullCart initialCart={items} isLoggedIn={isLoggedIn} />;
};

export default CartPage;
