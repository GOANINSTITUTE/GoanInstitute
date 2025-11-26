import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function DonationList() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, "donations"));
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      // Sort newest first
      data.sort((a, b) => {
        const tA = a.created?._seconds || a.created || 0;
        const tB = b.created?._seconds || b.created || 0;
        return tB - tA;
      });
      setDonations(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  function formatTimestamp(ts) {
    if (!ts) return '-';
    if (typeof ts === "object" && "seconds" in ts) ts = ts.seconds * 1000;
    if (typeof ts === "object" && "_seconds" in ts) ts = ts._seconds * 1000;
    return new Date(ts).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: "2-digit", minute: "2-digit"
    });
  }

  function YesNo(val) {
    return val === true
      ? <span className="badge bg-success">Yes</span>
      : val === false
        ? <span className="badge bg-danger">No</span>
        : <span className="text-muted">—</span>;
  }

  return (
    <div className="card shadow-sm mb-5">
      <div className="card-header">
        <h4 className="mb-0">Donations Received</h4>
      </div>
      <div className="card-body px-2 py-3">
        {loading ? (
          <div className="text-center my-5">
            <span className="spinner-border text-info" /> Loading donation records...
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center text-muted py-4">No donations received yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered" style={{fontSize: "0.99rem"}}>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Date/Time</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Amount<br/>₹</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Pincode</th>
                  <th>Declaration</th>
                  <th>Tax Exempt</th>
                  <th>PAN</th>
                  <th>RZP Order</th>
                  <th>RZP Payment ID</th>
                  <th>RZP Signature</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((don, idx) => (
                  <tr key={don.id}>
                    <td>{idx + 1}</td>
                    <td>{formatTimestamp(don.created || don.date)}</td>
                    <td>{don.name || <span className="text-secondary fst-italic">Anonymous</span>}</td>
                    <td>{don.email || <span className="text-muted">—</span>}</td>
                    <td>{don.phone || <span className="text-muted">—</span>}</td>
                    <td className="fw-bold text-success">{don.amount || "---"}</td>
                    <td style={{ minWidth: 120 }}>{don.address || <span className="text-muted">—</span>}</td>
                    <td>{don.city || <span className="text-muted">—</span>}</td>
                    <td>{don.pincode || <span className="text-muted">—</span>}</td>
                    <td>{YesNo(don.declaration)}</td>
                    <td>{YesNo(don.taxExempt)}</td>
                    <td>{don.pan || <span className="text-muted">—</span>}</td>
                    <td style={{maxWidth: 120, fontSize:"0.93em", wordBreak:"break-all"}}>{don.razorpay_order_id || <span className="text-muted">—</span>}</td>
                    <td style={{maxWidth: 120, fontSize:"0.93em", wordBreak:"break-all"}}>{don.razorpay_payment_id || <span className="text-muted">—</span>}</td>
                    <td style={{maxWidth: 120, fontSize:"0.93em", wordBreak:"break-all"}}>{don.razorpay_signature || <span className="text-muted">—</span>}</td>
                    <td>{don.message ? <span className="fst-italic">"{don.message}"</span> : <span className="text-muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DonationList;
