import FullCart from "@/components/shared/cart/FullCart";
import { CartService } from "@/services/cart.service";
import { userService } from "@/services/user.service";

const CartPage = async () => {
  // Fetch cart on the server to render initial state
  const cartPromise = await CartService.getCartItems();
  const sessionPromise = await userService.getSession();

  const [cart, session] = await Promise.all([cartPromise, sessionPromise]);

  // Normalize response shape — many backends return { success, data }
  const items = cart?.data || cart || [];

  // Determine login heuristically: if backend returned success === true, assume logged in
  const isLoggedIn = Boolean(session?.data?.user || session?.success);

  return <FullCart initialCart={items} isLoggedIn={isLoggedIn} />;
};

export default CartPage;
