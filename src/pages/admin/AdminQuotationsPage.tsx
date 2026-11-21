import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quotationApi } from '../../api/quotationApi';
import { enquiryApi } from '../../api/enquiryApi';
import type { Quotation, QuotationItem, QuotationStatus, EnquiryListItem } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Plus,
  Send,
  Download,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Calendar,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';

export const AdminQuotationsPage: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryEnquiryId = searchParams.get('createForEnquiry');

  // Enquiries list for dropdown
  const [enquiriesList, setEnquiriesList] = useState<EnquiryListItem[]>([]);

  // Create form state
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<number>(queryEnquiryId ? Number(queryEnquiryId) : 0);
  const [serviceDescription, setServiceDescription] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [devCost, setDevCost] = useState<number>(35000);
  const [addCost, setAddCost] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [advanceAmount, setAdvanceAmount] = useState<number>(15000);
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [validityDays, setValidityDays] = useState<number>(15);
  const [terms, setTerms] = useState<string>(
    '1. 40% advance payment required to commence development.\n2. Balance payable upon milestone demonstration and final handover.\n3. Standard warranty & bug fixing support included for 30 days post-delivery.'
  );

  // Line items builder
  const [items, setItems] = useState<QuotationItem[]>([
    { title: 'Core Architecture & Implementation', description: 'Clean architecture design and database modeling', quantity: 1, unitPrice: 35000, totalPrice: 35000 }
  ]);

  const [saving, setSaving] = useState(false);

  const loadQuotations = () => {
    setLoading(true);
    const sFilter = statusFilter === 'All' ? undefined : (statusFilter as QuotationStatus);
    quotationApi.getAdminQuotations({
      page,
      pageSize: 10,
      status: sFilter,
      search: search.trim() || undefined,
    })
      .then((res) => {
        setQuotations(res.items);
        setTotalCount(res.totalCount);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuotations();
  }, [page, statusFilter]);

  useEffect(() => {
    enquiryApi.getAdminEnquiries({ pageSize: 50 }).then((res) => {
      setEnquiriesList(res.items);
      if (queryEnquiryId) {
        setSelectedEnquiryId(Number(queryEnquiryId));
        setCreateModalOpen(true);
        const match = res.items.find((x) => x.id === Number(queryEnquiryId));
        if (match) {
          setServiceDescription(match.projectTitle);
          setDeliverables(`Complete design, execution and delivery for: ${match.projectTitle}`);
        }
      }
    });
  }, [queryEnquiryId]);

  const handleEnquirySelect = (eId: number) => {
    setSelectedEnquiryId(eId);
    const match = enquiriesList.find((x) => x.id === eId);
    if (match) {
      setServiceDescription(match.projectTitle);
      setDeliverables(`Complete architectural design and execution for ${match.projectTitle}`);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { title: '', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      item.totalPrice = (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0);
    }
    updated[index] = item;
    setItems(updated);

    // Auto update dev cost from items total
    const totalItems = updated.reduce((sum, it) => sum + (it.totalPrice || 0), 0);
    if (totalItems > 0) {
      setDevCost(totalItems);
    }
  };

  const calculatedSubtotal = devCost + addCost;
  const calculatedTax = Math.round(calculatedSubtotal * (taxRate / 100));
  const calculatedTotal = calculatedSubtotal + calculatedTax;

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    if (searchParams.get('createForEnquiry')) {
      setSearchParams({}, { replace: true });
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryId) {
      alert('Please select an enquiry.');
      return;
    }
    setSaving(true);
    try {
      await quotationApi.createQuotation({
        enquiryId: selectedEnquiryId,
        serviceDescription,
        deliverables,
        developmentCost: devCost,
        additionalCost: addCost,
        taxRate,
        advancePaymentAmount: advanceAmount,
        expectedDeliveryDate: new Date(deliveryDate).toISOString(),
        validityDays,
        termsAndConditions: terms,
        items,
      });
      setCreateModalOpen(false);
      setSearchParams({}, { replace: true });
      loadQuotations();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating quotation');
    } finally {
      setSaving(false);
    }
  };

  const handleSendQuotation = async (id: number) => {
    if (!window.confirm('Generate official PDF and email quotation proposal to customer?')) return;
    try {
      await quotationApi.sendQuotationEmail(id);
      alert('Quotation dispatched via email successfully!');
      loadQuotations();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error sending quotation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quotation Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build itemized quotations, calculate advance payments, and dispatch PDF proposals.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Quotation
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadQuotations()}
            placeholder="Search by quote number, customer, or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Viewed">Viewed</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading quotations from database..." className="py-20" />
        ) : quotations.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No quotations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Quote #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Total (₹)</th>
                  <th className="py-3.5 px-4">Advance (₹)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Delivery</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-600">
                      {q.quotationNumber}
                      <div className="text-[11px] text-slate-400 font-sans">Enq: {q.enquiryReferenceNumber}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{q.customerName}</div>
                      <div className="text-xs text-slate-500">{q.customerEmail}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {q.serviceDescription}
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900">
                      ₹{q.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      ₹{q.advancePaymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4">
                      <Badge status={q.status} />
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {new Date(q.expectedDeliveryDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Send via Email */}
                      <button
                        onClick={() => handleSendQuotation(q.id)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send PDF via Email"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {/* Download PDF */}
                      <button
                        type="button"
                        onClick={() => quotationApi.downloadAdminPdfBlob(q.id, q.quotationNumber)}
                        className="p-1.5 inline-flex items-center text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Download PDF Quotation"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Customer Public Link */}
                      <a
                        href={`/quote/${q.secureToken}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 inline-block text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Customer Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={handleCloseCreateModal}
        title="Create Official Quotation Proposal"
        maxWidth="4xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-6">
          {/* Enquiry Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Related Enquiry *
            </label>
            <select
              value={selectedEnquiryId}
              onChange={(e) => handleEnquirySelect(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
            >
              <option value="">-- Choose an Enquiry --</option>
              {enquiriesList.map((enq) => (
                <option key={enq.id} value={enq.id}>
                  #{enq.referenceNumber} - {enq.customerName} ({enq.projectTitle})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Service Description *
              </label>
              <input
                type="text"
                required
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="e.g. ASP.NET Core & React E-Commerce Portal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Expected Delivery Date *
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detailed Scope &amp; Deliverables *
            </label>
            <textarea
              required
              rows={3}
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="List core deliverables, sprints, and handover criteria..."
            />
          </div>

          {/* Line items builder */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Itemized Breakdown</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="overflow-x-auto pb-1 -mx-1 px-1 sm:mx-0 sm:px-0">
              <div className="min-w-[480px] space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Item Title"
                        required
                        value={item.title}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs sm:text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Notes / Desc"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs sm:text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        placeholder="Qty"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs sm:text-xs border border-slate-300 rounded-lg text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs sm:text-xs border border-slate-300 rounded-lg text-right"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <label className="block text-slate-500 font-bold uppercase mb-1">Dev Cost (₹)</label>
              <input
                type="number"
                value={devCost}
                onChange={(e) => setDevCost(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold uppercase mb-1">Additional Cost (₹)</label>
              <input
                type="number"
                value={addCost}
                onChange={(e) => setAddCost(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold uppercase mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold uppercase mb-1">Advance Req. (₹)</label>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* Computed Summary */}
          <div className="p-3 sm:p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-xs sm:text-sm">
            <div>
              <span className="text-slate-500">Subtotal: ₹{calculatedSubtotal.toLocaleString()}</span>
              <span className="text-slate-500 ml-4">Tax: ₹{calculatedTax.toLocaleString()}</span>
            </div>
            <div className="font-extrabold text-blue-700 text-base sm:text-lg">
              Total Amount: ₹{calculatedTotal.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseCreateModal}
              className="h-11 px-5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold shadow-md disabled:opacity-50 inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Quotation Draft</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
