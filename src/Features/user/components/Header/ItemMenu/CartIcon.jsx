
import { Link } from "react-router-dom";

function CartIcon(){
    <li>
      <Link to="/cart">
        <div className="cart-icon">
          <i className="fa fa-shopping-bag" aria-hidden="true" />
        </div>
        <div className="cart-title">
          <span className="cart-count cartCount count_item_pr">
          </span>
        </div>
      </Link>
    </li>
}
export default CartIcon;