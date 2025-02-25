import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const TermsCon = ({ onClose }) => {
  return (
    <div className="fixed  flex items-center justify-center bg-opacity-50 z-50">
      <div className="font-sans sm:w-full max-w-[60.40rem] h-[27rem] bg-slate-50 rounded-lg shadow-lg mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center h-6 w-6">
            <img
              src={require("@/assets/images/blackLogo.png")}
              alt="Dripstr"
              className="object-contain  "
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Terms and Conditions
          </h2>
          <button
            onClick={onClose}
            className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm custom-scrollbar text-gray-700">
          <h3 className="text-lg font-bold mb-4">
            CUSTOMER’S TERMS AND AGREEMENT OF USE
          </h3>

          {/* Section 1: Definitions */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">1. DEFINITIONS</h4>
            <p className="mb-2">
              1.1 “Customer/s” refers to any individual who buys products via
              the DRIPSTR platform.
            </p>
            <p className="mb-2">
              1.2 “Platform” refers to DRIPSTR, the integrated e-commerce and
              design software system for 3D apparel creation and virtual
              shopping experiences.
            </p>
            <p className="mb-2">
              1.3 “Products” refers to any 3D apparel designs, clothing items,
              or related digital content uploaded by Merchants onto the DRIPSTR
              platform.
            </p>
            <p className="mb-2">
              1.4 “Agreement” refers to these Terms and Conditions, which govern
              the Merchant’s use of the DRIPSTR platform.
            </p>
            <p className="mb-2">
              1.5 “Customer” refers to any individual or business purchasing
              Products through the DRIPSTR platform.
            </p>
            <p className="mb-2">
              1.6 “Non Cancellable” refers to something, such as a contract or
              policy, that can be canceled—that is, that can be made no longer
              valid or effective.
            </p>
          </section>

          {/* Section 2: Agreement */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">2. AGREEMENT</h4>
            <p className="mb-2">
              2.1 These Terms and Conditions ("Agreement") apply to all services
              and functionality DRIPSTR provides to the Customer, including
              uploading personal information and Merchant interactions.
            </p>
            <p className="mb-2">
              2.2 By using the DRIPSTR platform, Customer agrees to comply with
              all terms laid out herein, as well as any additional guidelines
              issued by DRIPSTR from time to time.
            </p>
            <p className="mb-2">
              2.3 DRIPSTR reserves the right to modify these Terms at any time.
              Changes will take effect immediately upon posting to the platform.
              Customers are responsible for reviewing the Terms regularly.
            </p>
          </section>

          {/* Section 3: Customer Registration and Verification */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">
              3. CUSTOMER REGISTRATION AND VERIFICATION
            </h4>
            <p className="mb-2">
              3.1 Customers must provide valid and accurate Contact Information
              upon registration if they want to place an order.
            </p>
            <p className="mb-2">
              3.2 The provided information will be used to verify the customer's
              identity and ensure compliance with operational standards.
            </p>
          </section>

          {/* Section 4: Customer Responsibilities */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">4. CUSTOMER RESPONSIBILITIES</h4>
            <p className="mb-2">
              4.1 Customers are responsible for providing accurate and truthful
              information when registering and placing orders on the platform.
            </p>
            <p className="mb-2">
              4.2 Customers must use the platform in good faith, including
              engaging respectfully with sellers and adhering to DRIPSTR’s terms
              of service.
            </p>
            <p className="mb-2">
              4.3 Customers must not engage in fraudulent activities, misuse the
              platform, or violate any applicable laws while using DRIPSTR.
            </p>
          </section>

          {/* Section 5: Payments and Transactions */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">5. PAYMENTS AND TRANSACTIONS</h4>
            <p className="mb-2">
              5.1 Customers agree to pay the full price of their orders,
              shipping fees, or additional service charges as stated at
              checkout.
            </p>
            <p className="mb-2">
              5.2 Payments can be made using either GCash or Cash on Delivery
              (COD). COD orders are processed immediately upon placement,
              whereas GCash orders will be confirmed only after payment
              verification.
            </p>
            <p className="mb-2">
              5.3 Customers may choose from available payment methods, and
              DRIPSTR reserves the right to update payment options at any time.
            </p>
            <p className="mb-2">
              5.4 In terms of the Artist Commission-based ordering, once the
              payment is done, cancellation or refund will not be issued.
            </p>
          </section>

          {/* Section 6: Order Fulfillment and Delivery */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">
              6. ORDER FULFILLMENT AND DELIVERY
            </h4>
            <p className="mb-2">
              6.1 Orders can be canceled only if they have not yet been shipped.
              Once an order is marked as shipped, cancellation is no longer
              permitted.
            </p>
            <p className="mb-2">
              6.2 For refund requests, customers must submit photographic
              evidence and provide a detailed reason for the refund. Refunds
              will be processed only upon DRIPSTR’s approval, and funds will be
              returned only after the merchant has received the returned
              products.
            </p>
            <p className="mb-2">
              6.3 Customers are responsible for providing accurate delivery
              information. DRIPSTR and sellers will not be held liable for lost
              or delayed orders resulting from incorrect shipping details
              provided by the customer.
            </p>
          </section>

          {/* Section 7: Liability and Warranties */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">7. LIABILITY AND WARRANTIES</h4>
            <p className="mb-2">
              7.1 DRIPSTR makes no warranties regarding the performance,
              accuracy, or reliability of the platform, including the product
              representations and services offered.
            </p>
            <p className="mb-2">
              7.2 DRIPSTR will not be liable for any indirect, incidental, or
              consequential damages resulting from the use of the platform,
              including but not limited to, loss of data, unauthorized
              transactions, or order discrepancies.
            </p>
            <p className="mb-2">
              7.3 Customers acknowledge that any disputes regarding product
              quality, delivery, or refunds must be resolved directly with the
              seller, except in cases where DRIPSTR explicitly offers buyer
              protection services.
            </p>
          </section>

          {/* Section 8: Account Termination and Restrictions */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">
              8. ACCOUNT TERMINATION AND RESTRICTIONS
            </h4>
            <p className="mb-2">
              8.1 DRIPSTR reserves the right to suspend or terminate a
              customer’s access to the platform if they engage in fraudulent
              activities, violate these Terms, or cause harm to DRIPSTR or its
              users.
            </p>
          </section>

          {/* Section 9: Intellectual Property */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">9. INTELLECTUAL PROPERTY</h4>
            <p className="mb-2">
              9.1 All intellectual property rights related to the DRIPSTR
              platform, including software, interface, and design elements,
              remain the exclusive property of DRIPSTR.
            </p>
            <p className="mb-2">
              9.2 Customers may not copy, reproduce, or use any content from
              DRIPSTR without explicit permission, except for personal,
              non-commercial use.
            </p>
          </section>

          {/* Section 10: Governing Law */}
          <section className="mb-6">
            <h4 className="font-semibold mb-2">10. GOVERNING LAW</h4>
            <p className="mb-2">
              10.1 These Terms and Conditions are governed by and construed per
              the laws of the jurisdiction in which DRIPSTR operates.
            </p>
            <p className="mb-2">
              10.2 Any disputes arising from these Terms will be resolved per
              the legal procedures of this jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsCon;
