import React from 'react';
import { Modal } from '../common/Modal';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  category = 'apparel',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sartorial Sizing Guide" maxWidth="2xl">
      <div className="space-y-6 text-xs text-neutral-700 font-light">
        <p className="leading-relaxed">
          All VÉLORA tailored apparel is cut according to classical international proportions. If you are between measurements, we recommend choosing the larger size for structured tailoring, or your usual size for fluid pieces.
        </p>

        {/* Apparel Size Table */}
        <div>
          <h4 className="font-semibold uppercase tracking-widest text-[11px] text-velora-black mb-3">
            Apparel Measurements (Inches)
          </h4>
          <div className="overflow-x-auto border border-velora-border">
            <table className="w-full text-left divide-y divide-velora-border">
              <thead className="bg-velora-beige text-velora-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest / Bust</th>
                  <th className="py-2.5 px-3">Waist</th>
                  <th className="py-2.5 px-3">Hip</th>
                  <th className="py-2.5 px-3">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-velora-border bg-white font-mono text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-semibold text-velora-black">XS (36)</td>
                  <td className="py-2 px-3">34 – 36"</td>
                  <td className="py-2 px-3">28 – 30"</td>
                  <td className="py-2 px-3">35 – 37"</td>
                  <td className="py-2 px-3">28"</td>
                </tr>
                <tr className="bg-velora-ivory/50">
                  <td className="py-2 px-3 font-semibold text-velora-black">S (38)</td>
                  <td className="py-2 px-3">37 – 39"</td>
                  <td className="py-2 px-3">31 – 33"</td>
                  <td className="py-2 px-3">38 – 40"</td>
                  <td className="py-2 px-3">29"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-velora-black">M (40)</td>
                  <td className="py-2 px-3">40 – 42"</td>
                  <td className="py-2 px-3">34 – 36"</td>
                  <td className="py-2 px-3">41 – 43"</td>
                  <td className="py-2 px-3">30"</td>
                </tr>
                <tr className="bg-velora-ivory/50">
                  <td className="py-2 px-3 font-semibold text-velora-black">L (42)</td>
                  <td className="py-2 px-3">43 – 45"</td>
                  <td className="py-2 px-3">37 – 39"</td>
                  <td className="py-2 px-3">44 – 46"</td>
                  <td className="py-2 px-3">31"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-velora-black">XL (44)</td>
                  <td className="py-2 px-3">46 – 48"</td>
                  <td className="py-2 px-3">40 – 42"</td>
                  <td className="py-2 px-3">47 – 49"</td>
                  <td className="py-2 px-3">31.5"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footwear Conversion */}
        <div>
          <h4 className="font-semibold uppercase tracking-widest text-[11px] text-velora-black mb-3">
            Footwear Size Conversion
          </h4>
          <div className="overflow-x-auto border border-velora-border">
            <table className="w-full text-left divide-y divide-velora-border">
              <thead className="bg-velora-beige text-velora-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">UK / India</th>
                  <th className="py-2.5 px-3">Euro (EU)</th>
                  <th className="py-2.5 px-3">US</th>
                  <th className="py-2.5 px-3">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-velora-border bg-white font-mono text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-semibold text-velora-black">UK 7</td>
                  <td className="py-2 px-3">41</td>
                  <td className="py-2 px-3">8</td>
                  <td className="py-2 px-3">25.5 cm</td>
                </tr>
                <tr className="bg-velora-ivory/50">
                  <td className="py-2 px-3 font-semibold text-velora-black">UK 8</td>
                  <td className="py-2 px-3">42</td>
                  <td className="py-2 px-3">9</td>
                  <td className="py-2 px-3">26.5 cm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-velora-black">UK 9</td>
                  <td className="py-2 px-3">43</td>
                  <td className="py-2 px-3">10</td>
                  <td className="py-2 px-3">27.5 cm</td>
                </tr>
                <tr className="bg-velora-ivory/50">
                  <td className="py-2 px-3 font-semibold text-velora-black">UK 10</td>
                  <td className="py-2 px-3">44</td>
                  <td className="py-2 px-3">11</td>
                  <td className="py-2 px-3">28.5 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 bg-velora-beige border border-velora-border text-[11px]">
          <strong>Complimentary Exchanges:</strong> If your garment or shoes do not fit with supreme comfort, our concierge offers instant size exchange with doorstep pickup at zero additional charge.
        </div>
      </div>
    </Modal>
  );
};
