// VÉLORA Production Integration & Acceptance Test Suite
process.env.TEST_MODE = 'true';
process.env.NODE_ENV = 'test';
process.env.PORT = '5005';

const PORT = 5005;
const BASE_URL = `http://127.0.0.1:${PORT}/api/v1`;

async function request(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  return { status: res.status, body: data };
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING VÉLORA ACCEPTANCE & INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await fetch(`http://127.0.0.1:${PORT}/health`).then(r => r.json());
    assert(health.status === 'healthy', 'Health Check endpoint responds healthy');

    // ========================================================
    // WORKFLOW A: Registration -> Login -> Catalog -> Cart -> COD Order
    // ========================================================
    console.log('\n--- WORKFLOW A: Customer Registration, Browse, Filter, Cart & COD Checkout ---');
    const testEmail = `test.patron.${Date.now()}@velora.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Devendra',
        lastName: 'Singhania',
        email: testEmail,
        password: 'Password@2026'
      })
    });
    assert(regRes.status === 201 && regRes.body.success, 'Workflow A: Customer registration succeeds');
    const customerToken = regRes.body.data.token;

    // Login test
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        credential: testEmail,
        password: 'Password@2026'
      })
    });
    assert(loginRes.status === 200 && loginRes.body.data.token, 'Workflow A: Customer login returns JWT token');

    // Browse and filter products
    const prodRes = await request('/products?department=men&sort=price-high');
    assert(prodRes.status === 200 && prodRes.body.data.length > 0, 'Workflow A: Browse Men department with sorting');
    const targetProduct = prodRes.body.data[0];

    // Place COD Order
    const codOrderRes = await request('/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Devendra Singhania',
          phone: '+919876500112',
          houseNumber: 'Penthouse 4B',
          street: 'Amrita Shergill Marg',
          area: 'Lutyens',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110003',
          addressType: 'Home'
        },
        items: [
          {
            productId: targetProduct.id,
            size: targetProduct.variants?.[0]?.size || 'M',
            color: targetProduct.variants?.[0]?.color || 'Navy',
            quantity: 1
          }
        ],
        paymentMethod: 'COD'
      })
    });
    assert(codOrderRes.status === 201 && codOrderRes.body.data.order.status === 'CONFIRMED', 'Workflow A: COD Order created & confirmed');
    const codOrderId = codOrderRes.body.data.order.id;

    // ========================================================
    // WORKFLOW B: Razorpay Test Payment & Signature Verification
    // ========================================================
    console.log('\n--- WORKFLOW B: Razorpay Online Payment & Server-Side Verification ---');
    const rzpOrderRes = await request('/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Devendra Singhania',
          phone: '+919876500112',
          houseNumber: 'Penthouse 4B',
          street: 'Amrita Shergill Marg',
          area: 'Lutyens',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110003',
          addressType: 'Home'
        },
        items: [
          {
            productId: targetProduct.id,
            size: targetProduct.variants?.[0]?.size || 'M',
            color: targetProduct.variants?.[0]?.color || 'Navy',
            quantity: 1
          }
        ],
        paymentMethod: 'RAZORPAY'
      })
    });
    assert(rzpOrderRes.status === 201 && rzpOrderRes.body.data.razorpay?.orderId, 'Workflow B: Razorpay payment intent initialized');
    const internalOrderId = rzpOrderRes.body.data.order.id;
    const rzpOrderId = rzpOrderRes.body.data.razorpay.orderId;

    // Verify payment signature
    const verifyRes = await request('/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify({
        orderId: internalOrderId,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: 'pay_test_9876543210',
        razorpaySignature: 'test_sig_verified_luxury'
      })
    });
    assert(verifyRes.status === 200 && verifyRes.body.data.order.paymentStatus === 'SUCCESS', 'Workflow B: Payment verified & Order status marked SUCCESS');

    // ========================================================
    // WORKFLOW C: Admin Supplier Import & AI Studio (Description & Image)
    // ========================================================
    console.log('\n--- WORKFLOW C: Admin Import, AI Studio & Publishing ---');
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        credential: 'admin@velora.com',
        password: 'VeloraAdmin2026!'
      })
    });
    assert(adminLogin.status === 200 && adminLogin.body.data.user.role === 'SUPER_ADMIN', 'Workflow C: Super Admin login authenticated');
    const adminToken = adminLogin.body.data.token;

    // AI Supplier Import Assistant
    const importRes = await request('/ai/import-supplier', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        rawText: 'Pure Mulberry Silk Evening Gown in Emerald Green',
        targetDepartment: 'women',
        targetMarginPercentage: 45
      })
    });
    assert(importRes.status === 200 && importRes.body.data.suggestedSellingPrice > 0, 'Workflow C: AI Supplier product parsed with auto-calculated margin');

    // AI Description Studio
    const aiDescRes = await request('/ai/description', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Verona Cashmere Cardigan',
        category: 'Jackets',
        tone: 'Luxury',
        targetAudience: 'Women'
      })
    });
    assert(aiDescRes.status === 200 && aiDescRes.body.data.highlights.length > 0, 'Workflow C: AI Description generator produced luxury copy and SEO metadata');

    // AI Image Studio
    const aiImgRes = await request('/ai/image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        productTitle: 'Verona Cashmere Cardigan',
        style: 'editorial'
      })
    });
    assert(aiImgRes.status === 200 && aiImgRes.body.data.imageUrl && aiImgRes.body.data.isAiGenerated, 'Workflow C: AI Image studio generated safe fashion editorial asset');

    // Publish new product
    const createProdRes = await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Verona Cashmere Cardigan',
        departmentId: 'dept-women',
        categoryId: 'cat-w-dresses',
        basePrice: 5999,
        mrp: 9999,
        costPrice: 2800,
        description: aiDescRes.body.data.description,
        highlights: aiDescRes.body.data.highlights,
        images: [{ url: aiImgRes.body.data.imageUrl, styleTag: 'editorial', isAiGenerated: true }],
        variants: [
          { size: 'S', color: 'Ivory', stock: 10 },
          { size: 'M', color: 'Ivory', stock: 15 }
        ]
      })
    });
    assert(createProdRes.status === 201 && createProdRes.body.data.id, 'Workflow C: Newly created AI-enriched product published');

    // ========================================================
    // WORKFLOW D: Order Status Timeline & Dropshipping Shipment
    // ========================================================
    console.log('\n--- WORKFLOW D: Supplier Fulfillment, Tracking & Delivery Timeline ---');
    const updateShipmentRes = await request(`/orders/admin/${codOrderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'SHIPPED',
        trackingDetails: {
          courierName: 'Delhivery Surface',
          trackingNumber: 'DEL994827361IN',
          trackingUrl: 'https://delhivery.com/track/DEL994827361IN'
        }
      })
    });
    assert(updateShipmentRes.status === 200 && updateShipmentRes.body.data.shipment.trackingNumber === 'DEL994827361IN', 'Workflow D: Admin assigned courier & tracking number');

    // Customer tracking endpoint
    const trackRes = await request(`/orders/track/${codOrderId}`);
    assert(trackRes.status === 200 && trackRes.body.data.status === 'SHIPPED', 'Workflow D: Customer live order tracking timeline updated');

    // ========================================================
    // WORKFLOW E: Department Manager RBAC & Scoped Management
    // ========================================================
    console.log('\n--- WORKFLOW E: Department Manager RBAC & Role Separation ---');
    const staffEmail = `mens.lead.${Date.now()}@velora.com`;
    const createStaffRes = await request('/users/staff', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        firstName: 'Siddharth',
        lastName: 'Malhotra',
        email: staffEmail,
        role: 'MENS_MANAGER',
        password: 'StaffPassword2026!'
      })
    });
    assert(createStaffRes.status === 201 && createStaffRes.body.data.role === 'MENS_MANAGER', 'Workflow E: Super Admin created Men\'s Department Manager');

    // Manager login
    const mgrLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        credential: staffEmail,
        password: 'StaffPassword2026!'
      })
    });
    assert(mgrLogin.status === 200 && mgrLogin.body.data.user.role === 'MENS_MANAGER', 'Workflow E: Department Manager logged in');
    const mgrToken = mgrLogin.body.data.token;

    // Manager can access analytics
    const mgrAnalytics = await request('/analytics/overview', {
      headers: { Authorization: `Bearer ${mgrToken}` }
    });
    assert(mgrAnalytics.status === 200 && mgrAnalytics.body.data.financials, 'Workflow E: Department Manager authorized to view business overview');

    // Customer blocked from manager/admin routes
    const custBlocked = await request('/users/staff', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(custBlocked.status === 403, 'Workflow E: Standard customer strictly blocked (403 Forbidden) from administrative routes');

    // ========================================================
    // WORKFLOW F: Coupon Lifecycle & Validation
    // ========================================================
    console.log('\n--- WORKFLOW F: Coupon Creation, Application & Discount Calculation ---');
    const promoCode = `FESTIVE${Math.floor(100 + Math.random() * 900)}`;
    const createCouponRes = await request('/coupons', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        code: promoCode,
        description: 'Festive Season 15% off on orders above ₹3,000',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxDiscount: 1000,
        minOrderValue: 3000
      })
    });
    assert(createCouponRes.status === 201 && createCouponRes.body.data.code === promoCode, 'Workflow F: Admin created new promotional coupon');

    // Test valid coupon application
    const validCouponRes = await request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({
        code: promoCode,
        subtotal: 5000
      })
    });
    assert(validCouponRes.status === 200 && validCouponRes.body.data.discountAmount === 750, 'Workflow F: 15% discount accurately calculated on ₹5,000 subtotal (₹750)');

    // Test coupon rejection below minOrderValue
    const invalidCouponRes = await request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({
        code: promoCode,
        subtotal: 1500
      })
    });
    assert(invalidCouponRes.status === 400 && !invalidCouponRes.body.success, 'Workflow F: Correctly rejected order below ₹3,000 minimum order value threshold');

  } catch (err: any) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n======================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Start server and run tests
async function main() {
  const { startServer } = await import('../src/server');
  await startServer(PORT);
  setTimeout(() => {
    runTestSuite();
  }, 1000);
}

main().catch(err => {
  console.error('Fatal test initialization error:', err);
  process.exit(1);
});
