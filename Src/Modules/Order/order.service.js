class OrderService {
  constructor(orderRepository, cartRepository) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
  }

  async generateOrderNumber() {
    const latest = await this.orderRepository.getLatestOrderNumber();
    const date = new Date();
    const prefix = `ORD${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    let sequence = 1;
    if (latest && latest.orderNumber.startsWith(prefix)) {
      sequence = parseInt(latest.orderNumber.substring(prefix.length)) + 1;
    }
    
    return `${prefix}${String(sequence).padStart(4, "0")}`;
  }

  async placeOrder(userId, payload) {
    const { addressId, paymentMethod = "COD" } = payload;

    // 1. Get User's Cart
    const cartItems = await this.cartRepository.getByUser(userId);
    if (!cartItems || cartItems.length === 0) {
      const err = new Error("Cart is empty.");
      err.statusCode = 400;
      throw err;
    }

    // 2. Prepare Order Items and Total
    let totalAmount = 0;
    const orderItemsData = cartItems.map((item) => {
      const price = item.variant.discountedPrice || item.variant.price || 0;
      totalAmount += price * item.quantity;
      
      return {
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: price,
      };
    });

    // 3. Generate Order Number
    const orderNumber = await this.generateOrderNumber();

    // 4. Create Order
    const order = await this.orderRepository.createOrder(
      {
        orderNumber,
        userId,
        totalAmount,
        addressId,
        paymentMethod,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      orderItemsData
    );

    // 5. Clear Cart
    await this.cartRepository.clearUserCart(userId);

    return order;
  }

  async getUserOrders(userId) {
    const orders = await this.orderRepository.findByUserId(userId);
    return orders.map(this._formatOrder);
  }

  async getOrderDetail(userId, orderId) {
    const order = await this.orderRepository.findById(orderId, userId);
    if (!order) {
      const err = new Error("Order not found.");
      err.statusCode = 404;
      throw err;
    }
    return this._formatOrder(order);
  }

  _formatOrder(order) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.variant.product.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.variant.images?.[0]?.imageUrl || null,
      })),
      address: order.address || null,
    };
  }
}

export default OrderService;
