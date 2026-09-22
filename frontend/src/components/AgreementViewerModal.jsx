import React from "react";
import { X, Download, FileText, CheckCircle2, Shield } from "lucide-react";
import agreementParagraphs from "../data/builderAgreementText.json";
import "./AgreementViewerModal.css";

export default function AgreementViewerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/documents/Builder_Listing_Commission_Agreementfinal.docx";
    link.download = "Builder_Listing_Commission_Agreementfinal.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="agreement-modal-overlay" onClick={onClose}>
      <div
        className="agreement-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="agreement-modal-header">
          <div className="agreement-modal-title-group">
            <div className="agreement-icon-badge">
              <FileText size={20} color="#1d4ed8" />
            </div>
            <div>
              <h3>Builder Listing & Commission Agreement</h3>
              <p>Official Website Listing Terms & Conditions for Builders & Developers</p>
            </div>
          </div>

          <div className="agreement-modal-header-actions">
            <button
              type="button"
              className="agreement-download-btn-header"
              onClick={handleDownload}
              title="Download official .DOCX agreement"
            >
              <Download size={15} />
              Download .DOCX
            </button>
            <button
              type="button"
              className="agreement-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="agreement-modal-body">
          <div className="agreement-legal-notice">
            <Shield size={16} />
            <span>
              This is a legally binding agreement. Please review all terms and conditions, warranties, commission covenants, and indemnities prior to digital signing and submission.
            </span>
          </div>

          <div className="agreement-document-paper">
            {agreementParagraphs.map((para, idx) => {
              const isTitle = idx === 0;
              const isSubtitle = idx === 1;
              const isSectionHeader = /^[0-9]+\.\s+[A-Z\s—'’]+$/.test(para.trim());
              const isSubsection = /^[0-9]+\.[0-9]+\s+/.test(para.trim());
              const isPartyDef = para.startsWith("XEVOTECH") || para.startsWith("[BUILDER NAME]") || para.startsWith("This Builder Listing");

              if (isTitle) {
                return (
                  <h1 key={idx} className="doc-main-title">
                    {para}
                  </h1>
                );
              }
              if (isSubtitle) {
                return (
                  <p key={idx} className="doc-sub-title">
                    {para}
                  </p>
                );
              }
              if (isSectionHeader) {
                return (
                  <h2 key={idx} className="doc-section-heading">
                    {para}
                  </h2>
                );
              }
              if (isSubsection) {
                return (
                  <p key={idx} className="doc-subsection">
                    {para}
                  </p>
                );
              }
              return (
                <p key={idx} className={isPartyDef ? "doc-parties-text" : "doc-paragraph"}>
                  {para}
                </p>
              );
            })}

            <div className="agreement-sign-block">
              <div className="sign-col">
                <strong>For XEVOTECH PRIVATE LIMITED:</strong>
                <div className="sign-line" />
                <span>Authorised Signatory</span>
              </div>
              <div className="sign-col">
                <strong>For BUILDER / DEVELOPER:</strong>
                <div className="sign-line" />
                <span>Authorised Representative & Stamp</span>
              </div>
            </div>
          </div>
        </div>

        <div className="agreement-modal-footer">
          <div className="agreement-footer-status">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>Download and apply your digital signature before uploading.</span>
          </div>

          <div className="agreement-footer-buttons">
            <button
              type="button"
              className="agreement-download-btn-footer"
              onClick={handleDownload}
            >
              <Download size={15} />
              Download Agreement (.DOCX)
            </button>
            <button
              type="button"
              className="agreement-close-btn-footer"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
