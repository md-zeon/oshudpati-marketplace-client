import FullCart from "@/app/(public)/cart/_components/FullCart";
import { CartService } from "@/services/cart.service";
import { userService } from "@/services/user.service";

const CartPage = async () => {
  const cartPromise = await CartService.getCartItems();
  const sessionPromise = await userService.getSession();

  const [cart, session] = await Promise.all([cartPromise, sessionPromise]);

  const items = cart.success ? cart?.data : null;

  const isLoggedIn = Boolean(session?.data?.user || session?.success);

  return <FullCart initialCart={items} isLoggedIn={isLoggedIn} />;
};

export default CartPage;
