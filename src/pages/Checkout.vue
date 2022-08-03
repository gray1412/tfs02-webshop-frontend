<template>
  <b-container>
    <b-breadcrumb class="my-2 py-3">
      <b-breadcrumb-item>
        <router-link to="/">Home</router-link>
      </b-breadcrumb-item>
      <b-breadcrumb-item>
        <router-link to="/cart">Shopping Cart</router-link>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Checkout</b-breadcrumb-item>
    </b-breadcrumb>

    <form class="main-wrapper d-flex">
      <div class="col-50 py-3 px-5">
        <h3>Billing Details</h3>
        <label for="fname"
          ><i class="fa fa-user"></i> Full Name
          <span class="required">*</span></label
        >
        <input
          type="text"
          id="fname"
          name="firstname"
          placeholder="John M. Doe"
          required
          v-model="infoCustomer.name"
          @change="checkName"
        /><ErrorMessage
          v-if="error.statusName"
          :message="this.error.messageName"
        />
        <label for="email"
          ><i class="fa fa-envelope"></i> Email
          <span class="required">*</span></label
        >
        <input
          type="email"
          id="email"
          name="email"
          placeholder="john@example.com"
          required
          v-model="infoCustomer.email"
          @change="checkEmail"
        /><ErrorMessage
          v-if="error.statusEmail"
          :message="this.error.messageEmail"
        />
        <label for="adr"
          ><i class="fa fa-address-card-o"></i> Address
          <span class="required">*</span></label
        >
        <input
          type="text"
          id="adr"
          name="address"
          placeholder="542 W. 15th Street"
          required
          v-model="infoCustomer.address"
          @change="checkAddress"
        /><ErrorMessage
          v-if="error.statusAddress"
          :message="this.error.messageAddress"
        />
        <label for="phone"
          ><i class="fa fa-phone-square" aria-hidden="true"></i> Phone
          <span class="required">*</span></label
        >
        <input
          type="text"
          id="phone"
          name="phone"
          placeholder="New York"
          required
          v-model="infoCustomer.phone"
          @change="checkPhone"
        /><ErrorMessage
          v-if="error.statusPhone"
          :message="this.error.messagePhone"
        />
        <label for="note"
          ><i class="fa fa-sticky-note-o" aria-hidden="true"></i> Note</label
        >
        <input
          type="text"
          id="note"
          name="note"
          placeholder=""
          v-model="infoCustomer.note"
          @change="checkNote"
        /><ErrorMessage
          v-if="error.statusNote"
          :message="this.error.messageNote"
        />

        <div class="payment">
          <label>Payment Method:<span class="required">*</span></label>
          <div class="d-flex align-items-center mx-2">
            <input
              type="radio"
              id="cod"
              name="payment-method"
              value="cod"
              v-model="infoCustomer.payment"
            />
            <label for="cod">COD</label>
          </div>

          <div class="d-flex align-items-center mx-2">
            <input
              type="radio"
              id="stripe"
              name="payment-method"
              value="stripe"
              v-model="infoCustomer.payment"
            />
            <label for="stripe">Stripe</label><br />
          </div>
        </div>
        <div v-if="infoCustomer.payment == 'stripe'" class="stripe-wrapper">
          <Stripe ref="gateway" />
        </div>
      </div>

      <!-- End billing details  -->

      <div class="">
        <div class="container order-detail p-3">
          <h3>Your Order</h3>
          <div class="d-flex justify-content-between header-wrapper">
            <h6>Product</h6>
            <h6>Subtotal</h6>
          </div>

          <div
            class="cart"
            v-for="item in this.cart"
            :key="item.variant.id"
            :item="item"
          >
            <div class="item">
              {{ item.name }}
              <p style="color: red">
                ({{ item.variant.name }}) x {{ item.quantity }}
              </p>
            </div>
            <div class="total">${{ item.quantity * item.variant.price }}</div>
          </div>

          <div class="d-flex flex-column pt-2 total-wrapper">
            <div
              v-if="this.state.discount > 0"
              class="d-flex justify-content-between"
            >
              <h6>Discount</h6>
              <h6 class="px-2">- ${{ this.state.discount }}</h6>
            </div>
            <div class="d-flex justify-content-between pt-3">
              <h4>Total</h4>
              <h4>${{ this.state.total }}</h4>
            </div>
          </div>
          <p></p>
          <input
            type="button"
            value="PLACE ORDER"
            class="btn"
            @click="checkout"
          />
        </div>
      </div>
    </form>
  </b-container>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import ErrorMessage from "../components/ErrorMessage.vue";
import Stripe from "../components/Stripe.vue";
export default {
  components: {
    ErrorMessage,
    Stripe,
  },
  data() {
    return {
      gateway: "stripe",
      infoCustomer: {
        name: "",
        email: "",
        address: "",
        phone: "",
        note: "",
        payment: "",
      },
      state: {},
      cart: [],
      error: {
        statusName: false,
        statusEmail: false,
        statusAddress: false,
        statusPhone: false,
        statusNote: false,
        // statusPayment: false,
        messagePayment: "Please choose a payment method",
        messageName: "invalid name",
        messageEmail: "invalid email",
        messageAddress: "Address must not exceed 255 characters",
        messagePhone: "invalid phone",
        messageNote: "Notes must not exceed 255 characters",
      },
    };
  },
  methods: {
    ...mapActions(["REMOVE_CART", "REMOVE_ITEM"]),
    async checkout() {
      if (this.infoCustomer.payment == "") {
        // this.error.statusPayment = true;
        alert("enter payment method");
        return;
      }
      if (!this.checkStatusInput) {
        alert("Please enter full information");
      }
      const token = localStorage.getItem("token");
      if (token == null) {
        this.SET_LOGIN(false);
        alert("Please login to purchase...");
        return;
      }
      let requestData = {
        name: this.infoCustomer.name,
        email: this.infoCustomer.email,
        address: this.infoCustomer.address,
        phone: this.infoCustomer.phone,
        note: this.infoCustomer.note,
        payment_method: this.infoCustomer.payment,
        total: this.state.subtotal,
        discount_amount: this.state.discount,
        total_bill: this.state.total,
        total_weight: this.state.total_weight,
        voucher_code: this.state.vouchercode,
        cart: this.cart,
      };

      try {
        let res = {};
        if (this.infoCustomer.payment == "cod") {
          res = await axios({
            method: "POST",
            url: "http://localhost:8081/api/orders",
            data: requestData,
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: "Bearer " + token,
            },
          });
        } else {
          let paymentId = "";
          let r = await this.$refs.gateway.createPaymentMethod();
          if (!r.paymentMethod) return;
          paymentId = r.paymentMethod.id;

          requestData = {
            payment_id: paymentId,
            order: requestData,
          };
          console.log(requestData);
          res = await axios({
            method: "POST",
            url: "http://localhost:8081/api/orders/stripe",
            data: requestData,
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: "Bearer " + token,
            },
          });
        }

        if (res.data.success == 1) {
          localStorage.removeItem("cart");
          this.REMOVE_CART();
          alert("Order Success");
          this.$router.push("/");
        }
      } catch (err) {
        if (err.response.status == 401) {
          this.SET_LOGIN(false);
          alert("Login session expired, please login again");
          return;
        }
        const data = err.response.data;
        switch (data.message) {
          case "voucher_not_exists":
            alert("voucher not exists");
            break;
          case "voucher_expired":
            alert("voucher_expired");
            break;
          case "error_product_changed":
            //xóa sản phẩm khỏi giỏ hàng
            this.remove(data.data);
            alert("Shopping cart has been changed");
            break;
          case "invalid_calculate_total":
            alert("Invalid Calculate Total");
            break;
          case "server_error":
            alert("server_error");
            break;
          default:
            alert("Bad request");
            break;
        }
      }
    },
    remove(i) {
      const index = this.cart.indexOf(i);
      const payload = {
        index: index,
      };
      this.REMOVE_ITEM(payload);
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    checkStatusInput() {
      if (
        this.error.statusName == false &&
        this.error.statusEmail == false &&
        this.error.statusPayment == false &&
        this.error.statusAddress == false &&
        this.error.statusPhone == false &&
        this.error.statusNote == false &&
        this.infoCustomer.name !== "" &&
        this.infoCustomer.email !== "" &&
        this.infoCustomer.address !== "" &&
        this.infoCustomer.phone !== "" &&
        this.infoCustomer.payment !== ""
      ) {
        return true;
      }
      return false;
    },
    checkName() {
      const regex = "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$";
      if (
        this.infoCustomer.name.match(regex) == null ||
        this.infoCustomer.name.length > 50
      ) {
        this.error.statusName = true;
        return;
      }
      this.error.statusName = false;
    },
    checkPayment(i) {
      this.infoCustomer.payment = i;
    },
    checkEmail() {
      const regex =
        "^[a-zA-Z][a-zA-Z0-9_\\.]{4,32}@[a-zA-Z0-9]{2,}(\\.[a-zA-Z0-9]{2,4}){1,2}$";
      if (this.infoCustomer.email.match(regex) == null) {
        this.error.statusEmail = true;
        return;
      }
      this.error.statusEmail = false;
    },
    checkAddress() {
      if (this.infoCustomer.address.length > 255) {
        this.error.statusAddress = true;
        return;
      }
      this.error.statusAddress = false;
    },
    checkPhone() {
      const regex = "(84|0[3|5|7|8|9])+([0-9]{8})\\b";
      if (this.infoCustomer.phone.match(regex) == null) {
        this.error.statusPhone = true;
        return;
      }
      this.error.statusPhone = false;
    },
    checkNote() {
      if (this.infoCustomer.note.length > 255) {
        this.error.statusNote = true;
        return;
      }
      this.error.statusNote = false;
    },
  },
  created: function () {
    //check login

    const token = localStorage.getItem("token");
    if (token == null) {
      alert("Please login to purchase...");
      this.$router.push("/cart");
      return;
    }
    // check cart'
    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      if (cart == null) {
        alert("Cart is empty, please add product to cart...");
        this.$router.push("/cart");
        return;
      }
      this.cart = cart;
    } catch (error) {
      localStorage.removeItem("cart");
      this.REMOVE_CART();
      alert("Cart Shopping cart has been changed");
      this.$router.push("/cart");
      return;
    }

    // check param
    const param = this.$route.query.state;
    if (param == null) {
      alert("Shopping cart has been changed");
      this.$router.push("/cart");
      return;
    }
    let state = decodeURI(param);
    state = atob(param);
    try {
      this.state = JSON.parse(state);
    } catch (error) {
      alert("Shopping cart has been changed");
      this.$router.push("/cart");
      return;
    }
  },
};
</script>
<style lang="scss" scoped>
.order-detail {
  border: 2px solid var(--mainColor);
}

.header-wrapper {
  border-bottom: 1px solid rgb(212, 212, 212);
}

.total-wrapper {
  border-top: 1px solid rgb(212, 212, 212);
}

.item {
  width: 80%;
  padding: 10px 0;
  p {
    margin: 0;
  }
}

.container .cart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .total {
    padding: 10px;
  }
}
.required {
  color: red;
  text-decoration: none;
}
.payment {
  display: flex;
  label {
    margin: 0;
  }
}
.row {
  display: -ms-flexbox; /* IE10 */
  display: flex;
  -ms-flex-wrap: wrap; /* IE10 */
  flex-wrap: wrap;
  margin: 5%;
}

.col-25 {
  -ms-flex: 25%; /* IE10 */
  flex: 25%;
}

.col-50 {
  -ms-flex: 50%; /* IE10 */
  flex: 50%;
}

.col-75 {
  -ms-flex: 75%; /* IE10 */
  flex: 75%;
}

input[type="text"],
input[type="email"] {
  width: 100%;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

label {
  margin-bottom: 10px;
  display: block;
}

.icon-container {
  margin-bottom: 20px;
  padding: 7px 0;
  font-size: 24px;
}

.btn {
  background-color: red;
  color: white;
  padding: 12px;
  margin: 10px 0;
  border: none;
  width: 100%;
  border-radius: 3px;
  cursor: pointer;
  font-size: 17px;
}

.btn:hover {
  background-color: rgb(194, 0, 0);
}

a {
  color: #2196f3;
}

.stripe-wrapper {
  border: solid 1px var(--mainColor);
  padding: 10px;
  margin: 10px auto;
  border-radius: 10px;
}

/* Responsive layout - when the screen is less than 800px wide, make the two columns stack on top of each other instead of next to each other (also change the direction - make the "cart" column go on top) */
@media (max-width: 992px) {
  .main-wrapper {
    flex-direction: column;
    .order-detail {
      margin-top: 20px;
    }
  }
}
</style>
